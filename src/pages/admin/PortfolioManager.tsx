import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Plus, Edit, Trash2, Search, X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { optimizeImage, isValidImageFile, formatFileSize } from '../../services/imageOptimizer';

const PortfolioManager = () => {
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

    const fetchItems = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('portfolio')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setItems(data || []);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This cannot be undone.')) return;
        await supabase.from('portfolio').delete().eq('id', id);
        fetchItems();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const values = Object.fromEntries(formData.entries());

        // Use imagePreview for the image URL
        // @ts-ignore
        values.image = imagePreview || editItem?.image || '';
        
        // Validate that an image exists
        if (!values.image) {
            alert('Please upload an image before saving.');
            return;
        }
        
        // @ts-ignore
        values.margin_top = formData.get('marginTop') === 'on';
        // @ts-ignore
        values.margin_top_inverse = formData.get('marginTopInverse') === 'on';

        console.log('Saving portfolio item with values:', values);

        try {
            if (editItem?.id) {
                const { data, error } = await supabase.from('portfolio').update(values).eq('id', editItem.id);
                if (error) {
                    console.error('Error updating portfolio item:', error);
                    alert(`Failed to update item: ${error.message}`);
                    return;
                }
                console.log('Updated portfolio item:', data);
            } else {
                const { data, error } = await supabase.from('portfolio').insert([values]);
                if (error) {
                    console.error('Error creating portfolio item:', error);
                    alert(`Failed to create item: ${error.message}`);
                    return;
                }
                console.log('Created portfolio item:', data);
            }

            setIsModalOpen(false);
            setEditItem(null);
            setImagePreview('');
            fetchItems();
        } catch (error) {
            console.error('Unexpected error saving portfolio item:', error);
            alert('An unexpected error occurred while saving.');
        }
    };

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
    );

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
            // Optimize the image for portfolio display
            const optimizedFile = await optimizeImage(file, {
                maxWidth: 1200,
                maxHeight: 1500,
                quality: 0.9,
                format: 'webp'
            });

            console.log(`Original size: ${formatFileSize(file.size)}, Optimized size: ${formatFileSize(optimizedFile.size)}`);

            // Generate unique filename
            const fileExt = 'webp';
            const fileName = `portfolio-${Date.now()}.${fileExt}`;

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
            console.error('Error uploading portfolio image:', error);
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
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Portfolio</h1>
                <button
                    onClick={() => { setEditItem(null); setImagePreview(''); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={20} /> Add New Item
                </button>
            </div>

            <div className="bg-white dark:bg-[#1a2232] border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-200 dark:border-white/5 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search portfolio..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-[#111722] text-slate-500 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                            {loading ? (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
                            ) : filteredItems.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No items found.</td></tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="w-16 h-12 rounded bg-slate-200 overflow-hidden">
                                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 font-bold text-slate-900 dark:text-white">{item.title}</td>
                                        <td className="px-6 py-3 text-slate-500">{item.category}</td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => { setEditItem(item); setImagePreview(item.image); setIsModalOpen(true); }}
                                                    className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1e283a] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold dark:text-white">{editItem ? 'Edit Item' : 'New Portfolio Item'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Title</label>
                                <input name="title" defaultValue={editItem?.title} required className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
                                <input name="category" defaultValue={editItem?.category} required className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-2.5 text-sm dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Portfolio Image</label>
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
                                                    <p className="font-semibold text-lg">Upload Portfolio Image</p>
                                                    <p className="text-sm opacity-70 mt-1">Drag & drop your image here, or click to browse</p>
                                                </div>
                                                <p className="text-xs opacity-60">Supports JPG, PNG, WebP • Max 1200x1500px</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-6 pt-2">
                                <label className="flex items-center gap-2 text-sm text-slate-300">
                                    <input type="checkbox" name="marginTop" defaultChecked={editItem?.marginTop} className="rounded bg-slate-700 border-white/10 text-primary focus:ring-primary" />
                                    Offset Top
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-300">
                                    <input type="checkbox" name="marginTopInverse" defaultChecked={editItem?.marginTopInverse} className="rounded bg-slate-700 border-white/10 text-primary focus:ring-primary" />
                                    Offset Negative
                                </label>
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

export default PortfolioManager;
