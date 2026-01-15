import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Plus, Edit, Trash2, Search, X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { optimizeImage, isValidImageFile, formatFileSize } from '../../services/imageOptimizer';

/**
 * ServiceManager Component
 *
 * Manages service offerings (packages, pricing, descriptions).
 * Supports CRUD operations and image uploading via Supabase Storage.
 * Features a drag-and-drop interface for service images.
 */
const ServiceManager = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<any | null>(null);
    const [search, setSearch] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    /**
     * Fetches all services from Supabase.
     */
    const fetchItems = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setItems(data || []);
        setLoading(false);
    };

    /**
     * Deletes a service item by ID.
     */
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        await supabase.from('services').delete().eq('id', id);
        fetchItems();
    };

    /**
     * Saves (inserts or updates) a service item.
     * Handles form submission and validation.
     */
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const values = Object.fromEntries(formData.entries());

        // Use imagePreview for the image URL or fallback to existing
        // @ts-ignore
        values.image = imagePreview || editItem?.image || '';

        // Validate that an image exists
        if (!values.image) {
            alert('Please upload an image before saving.');
            return;
        }

        try {
            let error;
            if (editItem?.id) {
                const { error: updateError } = await supabase.from('services').update(values).eq('id', editItem.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase.from('services').insert([values]);
                error = insertError;
            }

            if (error) {
                console.error('Error saving service item:', error);
                alert(`Error saving service: ${error.message}`);
                return;
            }

            setIsModalOpen(false);
            setEditItem(null);
            setImagePreview('');
            fetchItems();
        } catch (error) {
            console.error('Unexpected error saving service item:', error);
            alert('An unexpected error occurred while saving.');
        }
    };

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    /**
     * Handles image file selection, optimization, and upload to Supabase Storage.
     * Generates a unique filename and updates the preview.
     */
    const handleImageUpload = async (files: File[]) => {
        if (files.length === 0) return;

        const file = files[0];

        // Validate file type
        if (!isValidImageFile(file)) {
            alert('Please upload a valid image file (JPG, PNG, WebP, or GIF)');
            return;
        }

        setUploadingImage(true);

        try {
            // Optimize the image
            const optimizedFile = await optimizeImage(file, {
                maxWidth: 1200,
                maxHeight: 1500,
                quality: 0.9,
                format: 'webp'
            });

            console.log(`Original size: ${formatFileSize(file.size)}, Optimized size: ${formatFileSize(optimizedFile.size)}`);

            // Generate unique filename
            const fileExt = 'webp';
            const fileName = `service-${Date.now()}.${fileExt}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(fileName, optimizedFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(fileName);

            // Update image preview
            setImagePreview(publicUrl);

        } catch (error) {
            console.error('Error uploading service image:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview('');
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleImageUpload,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        },
        multiple: false
    } as unknown as DropzoneOptions);

    const openModal = (item: any | null = null) => {
        setEditItem(item);
        setImagePreview(item?.image || '');
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Services</h1>
                <button
                    onClick={() => openModal(null)}
                    className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={20} /> Add Service
                </button>
            </div>

            <div className="bg-white dark:bg-[#1a2232] border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-white/5">
                     <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search services..."
                            aria-label="Search services"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {loading ? (
                        <p className="text-slate-500">Loading...</p>
                    ) : filteredItems.length === 0 ? (
                        <p className="text-slate-500">No services found.</p>
                    ) : (
                        filteredItems.map((item) => (
                            <div key={item.id} className="group bg-slate-50 dark:bg-[#111722] rounded-xl overflow-hidden border border-slate-200 dark:border-white/5 relative">
                                <div className="aspect-video bg-slate-200 relative">
                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                        <button onClick={() => openModal(item)} className="p-2 bg-white text-slate-900 rounded-full hover:text-primary shadow-sm" aria-label={`Edit ${item.title}`}><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-white text-slate-900 rounded-full hover:text-red-500 shadow-sm" aria-label={`Delete ${item.title}`}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg dark:text-white">{item.title}</h3>
                                    <p className="text-primary font-bold text-sm mb-2">{item.price}</p>
                                    <p className="text-slate-500 text-sm line-clamp-2">{item.description}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1e283a] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold dark:text-white">{editItem ? 'Edit Service' : 'New Service'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white" aria-label="Close modal"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label htmlFor="service-title" className="block text-xs font-bold uppercase text-slate-500 mb-1">Service Title</label>
                                <input id="service-title" name="title" defaultValue={editItem?.title} required className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm dark:text-white" />
                            </div>

                            <div>
                                <label htmlFor="service-price" className="block text-xs font-bold uppercase text-slate-500 mb-1">Price</label>
                                <input id="service-price" name="price" defaultValue={editItem?.price} required className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm dark:text-white" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Service Image</label>
                                {imagePreview ? (
                                    <div className="space-y-4">
                                        {/* Current Image Preview */}
                                        <div className="p-4 bg-slate-100 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-bold uppercase text-slate-500">Current Image</span>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Remove image"
                                                    aria-label="Remove image"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                            <div className="flex justify-center p-4 bg-white dark:bg-[#111722] rounded-lg">
                                                <img src={imagePreview} alt="Preview" className="max-h-48 object-contain rounded-lg" />
                                            </div>
                                        </div>

                                        {/* Upload New Image Button */}
                                        <div
                                            {...getRootProps()}
                                            className={`
                                                border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all
                                                ${isDragActive
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-slate-300 dark:border-white/10 hover:border-primary hover:text-primary text-slate-500'
                                                }
                                                ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}
                                            `}
                                        >
                                            <input {...getInputProps()} />
                                            {uploadingImage ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Loader2 className="animate-spin" size={24} />
                                                    <p className="text-sm font-semibold">Optimizing and uploading...</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Upload size={24} />
                                                    <p className="text-sm font-semibold">Upload New Image</p>
                                                    <p className="text-xs opacity-70">Drag & drop or click to browse</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    /* No Image - Upload Dropzone */
                                    <div
                                        {...getRootProps()}
                                        className={`
                                            border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                                            ${isDragActive
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-slate-300 dark:border-white/10 hover:border-primary hover:text-primary text-slate-500'
                                            }
                                            ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <input {...getInputProps()} />
                                        {uploadingImage ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 className="animate-spin" size={32} />
                                                <p className="font-semibold">Optimizing and uploading...</p>
                                                <p className="text-sm opacity-70">This may take a moment</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3">
                                                <ImageIcon size={32} />
                                                <div>
                                                    <p className="font-semibold text-lg">Upload Service Image</p>
                                                    <p className="text-sm opacity-70 mt-1">Drag & drop your image here, or click to browse</p>
                                                </div>
                                                <p className="text-xs opacity-60">Supports JPG, PNG, WebP • Max 1200x1500px</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="service-description" className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
                                <textarea id="service-description" name="description" defaultValue={editItem?.description} required rows={4} className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm dark:text-white resize-none" />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2 rounded-lg bg-primary hover:bg-blue-600 text-white font-bold shadow-lg shadow-primary/20">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceManager;