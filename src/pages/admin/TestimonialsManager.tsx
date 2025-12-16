import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Plus, Trash2, Edit2, Save, X, Upload } from 'lucide-react';

/**
 * TestimonialsManager Component
 *
 * Manages client testimonials.
 * Supports creating, editing, and deleting testimonials.
 * Allows reordering (via display_order field) and image uploading.
 */
interface Testimonial {
    id: string;
    client_name: string;
    subtitle: string;
    quote: string;
    rating: number;
    image_url: string;
    display_order: number;
    created_at?: string;
}

const TestimonialsManager = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial>>({
        rating: 5,
        display_order: 0
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    /**
     * Fetches all testimonials from Supabase.
     */
    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setTestimonials(data || []);
        } catch (error: any) {
            console.error('Error fetching testimonials:', error);
            if (error.code === 'PGRST205' || error.code === '42P01') {
                alert('Testimonials table not found. Please run the "create_testimonials_table.sql" migration or update "supabase_schema.sql" in your Supabase SQL Editor.');
            } else {
                alert('Error fetching testimonials');
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Saves (inserts or updates) a testimonial.
     * Validates required fields before saving.
     */
    const handleSave = async () => {
        try {
            if (!currentTestimonial.client_name || !currentTestimonial.quote) {
                alert('Please fill in the required fields (Client Name, Quote)');
                return;
            }

            const testimonialData = {
                client_name: currentTestimonial.client_name,
                subtitle: currentTestimonial.subtitle,
                quote: currentTestimonial.quote,
                rating: currentTestimonial.rating,
                image_url: currentTestimonial.image_url,
                display_order: currentTestimonial.display_order
            };

            let error;
            if (currentTestimonial.id) {
                // Update
                const { error: updateError } = await supabase
                    .from('testimonials')
                    .update(testimonialData)
                    .eq('id', currentTestimonial.id);
                error = updateError;
            } else {
                // Create
                const { error: insertError } = await supabase
                    .from('testimonials')
                    .insert([testimonialData]);
                error = insertError;
            }

            if (error) throw error;

            setIsEditing(false);
            setCurrentTestimonial({ rating: 5, display_order: 0 });
            fetchTestimonials();
        } catch (error) {
            console.error('Error saving testimonial:', error);
            alert('Error saving testimonial');
        }
    };

    /**
     * Deletes a testimonial by ID.
     */
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            const { error } = await supabase
                .from('testimonials')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchTestimonials();
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            alert('Error deleting testimonial');
        }
    };

    /**
     * Uploads a client image to Supabase Storage.
     * Generates a random filename to avoid collisions.
     */
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files || event.target.files.length === 0) {
                return;
            }
            setUploading(true);
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `testimonials/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            setCurrentTestimonial({ ...currentTestimonial, image_url: data.publicUrl });
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Testimonials</h1>
                <button
                    onClick={() => {
                        setCurrentTestimonial({ rating: 5, display_order: 0 });
                        setIsEditing(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus size={20} />
                    Add Testimonial
                </button>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1a2232] rounded-xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold dark:text-white">
                                {currentTestimonial.id ? 'Edit Testimonial' : 'New Testimonial'}
                            </h2>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full"
                            >
                                <X size={20} className="dark:text-white" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Client Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={currentTestimonial.client_name || ''}
                                        onChange={e => setCurrentTestimonial({ ...currentTestimonial, client_name: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Subtitle (Role/Service)
                                    </label>
                                    <input
                                        type="text"
                                        value={currentTestimonial.subtitle || ''}
                                        onChange={e => setCurrentTestimonial({ ...currentTestimonial, subtitle: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Wedding Photography"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Quote *
                                </label>
                                <textarea
                                    value={currentTestimonial.quote || ''}
                                    onChange={e => setCurrentTestimonial({ ...currentTestimonial, quote: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-primary h-32 resize-none"
                                    placeholder="Enter testimonial text..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Rating (1-5)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={currentTestimonial.rating || 5}
                                        onChange={e => setCurrentTestimonial({ ...currentTestimonial, rating: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        value={currentTestimonial.display_order || 0}
                                        onChange={e => setCurrentTestimonial({ ...currentTestimonial, display_order: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Client Photo
                                </label>
                                <div className="flex items-center gap-4">
                                    {currentTestimonial.image_url && (
                                        <img
                                            src={currentTestimonial.image_url}
                                            alt="Preview"
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    )}
                                    <label className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <Upload size={20} className="text-slate-500" />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {uploading ? 'Uploading...' : 'Upload Image'}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    <Save size={20} />
                                    Save Testimonial
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                    <div
                        key={testimonial.id}
                        className="bg-white dark:bg-[#1a2232] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-white/5 flex flex-col gap-4"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                                    {testimonial.image_url ? (
                                        <img
                                            src={testimonial.image_url}
                                            alt={testimonial.client_name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <span className="material-symbols-outlined">person</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">
                                        {testimonial.client_name}
                                    </h3>
                                    {testimonial.subtitle && (
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                                            {testimonial.subtitle}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => {
                                        setCurrentTestimonial(testimonial);
                                        setIsEditing(true);
                                    }}
                                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(testimonial.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex text-yellow-500 gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                    key={i}
                                    className={`material-symbols-outlined text-[20px] ${
                                        i < testimonial.rating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'
                                    }`}
                                >
                                    star
                                </span>
                            ))}
                        </div>

                        <p className="text-slate-600 dark:text-slate-400 italic text-sm line-clamp-4 flex-grow">
                            "{testimonial.quote}"
                        </p>

                        <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between text-xs text-slate-500">
                            <span>Order: {testimonial.display_order}</span>
                            <span>{new Date(testimonial.created_at || '').toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}

                {testimonials.length === 0 && (
                    <div className="col-span-full py-20 text-center text-slate-500">
                        <p className="text-lg">No testimonials found. Add your first one!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestimonialsManager;
