import React, { useEffect, useState, useCallback } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { supabase } from '../../services/supabaseClient';
import { Trash2, Copy, Upload, Check, Loader2, X } from 'lucide-react';

const BUCKET_NAME = 'images';

interface FileObject {
    name: string;
    id: string;
    updated_at: string;
    created_at: string;
    last_accessed_at: string;
    metadata: Record<string, any>;
}

interface MediaPickerProps {
    onSelect?: (url: string) => void;
    onClose?: () => void; // For modal usage
}

/**
 * MediaPicker Component
 *
 * A reusable component for browsing and uploading images to Supabase Storage.
 *
 * @param onSelect - Optional callback when an image is selected.
 * @param onClose - Optional callback to close the picker (e.g. in a modal).
 */
const MediaPicker: React.FC<MediaPickerProps> = ({ onSelect, onClose }) => {
    const [files, setFiles] = useState<FileObject[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [copyId, setCopyId] = useState<string | null>(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    /**
     * Fetches the list of files from the 'images' bucket.
     */
    const fetchFiles = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.storage.from(BUCKET_NAME).list('', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' },
            });

            if (error) {
                console.error('Error fetching files:', error);
            } else {
                setFiles(data || []);
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles file drops, uploads to Storage, and refreshes the list.
     */
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setUploading(true);
        try {
            for (const file of acceptedFiles) {
                // Sanitize file name
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { error } = await supabase.storage
                    .from(BUCKET_NAME)
                    .upload(fileName, file);

                if (error) {
                    console.error('Error uploading:', error);
                    alert(`Failed to upload ${file.name}`);
                }
            }
            await fetchFiles();
        } finally {
            setUploading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        }
    } as unknown as DropzoneOptions);

    const getPublicUrl = (path: string) => {
        const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
        return data.publicUrl;
    };

    const getThumbnailUrl = (url: string) => {
        if (!url) return '';
        if (url.includes('supabase.co')) {
            const optimizedUrl = url.replace('/object/public/', '/render/image/public/');
            const separator = optimizedUrl.includes('?') ? '&' : '?';
            return `${optimizedUrl}${separator}width=400&height=400&resize=cover&quality=60`;
        }
        return url;
    };

    /**
     * Copies the image URL to clipboard.
     */
    const handleCopyUrl = (e: React.MouseEvent, path: string) => {
        e.stopPropagation();
        const url = getPublicUrl(path);
        navigator.clipboard.writeText(url);
        setCopyId(path);
        setTimeout(() => setCopyId(null), 2000);
    };

    /**
     * Deletes a file from Storage.
     */
    const handleDelete = async (e: React.MouseEvent, path: string) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this image?')) return;

        const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
        if (error) {
            alert('Error deleting file');
        } else {
            fetchFiles();
        }
    };

    const handleImageClick = (path: string) => {
        if (onSelect) {
            onSelect(getPublicUrl(path));
        }
    };

    return (
        <div className="bg-white dark:bg-[#1a2232] rounded-xl flex flex-col h-full max-h-[80vh]">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-white/5">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Media Library</h2>
                <div className="flex gap-2">
                    <button
                        onClick={fetchFiles}
                        className="p-2 text-slate-500 hover:text-primary transition-colors rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                        title="Refresh"
                        aria-label="Refresh files"
                    >
                        <span className="material-symbols-outlined" aria-hidden="true">refresh</span>
                    </button>
                    {onClose && (
                         <button
                            onClick={onClose}
                            className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                            aria-label="Close media picker"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                {/* Upload Area */}
                <div
                    {...getRootProps()}
                    className={`
                        border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6
                        ${isDragActive
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-slate-300 dark:border-white/10 hover:border-primary hover:text-primary text-slate-500'
                        }
                    `}
                >
                    <input {...getInputProps()} />
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="animate-spin" size={32} />
                            <p className="font-bold">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <Upload size={32} />
                            <p className="font-bold text-lg">Drop images here, or click to select</p>
                            <p className="text-sm opacity-70">Supports JPG, PNG, WEBP</p>
                        </div>
                    )}
                </div>

                {/* Gallery */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-primary" size={40} />
                    </div>
                ) : files.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        <p>No images found. Upload some!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {files.map((file) => {
                             if (file.name === '.emptyFolderPlaceholder') return null;

                             const url = getPublicUrl(file.name);
                             const thumbnailUrl = getThumbnailUrl(url);

                             return (
                                <div
                                    key={file.id}
                                    className={`
                                        group relative aspect-square bg-slate-100 dark:bg-black/20 rounded-xl overflow-hidden border border-slate-200 dark:border-white/5 text-left
                                        ${onSelect ? 'hover:ring-2 hover:ring-primary' : ''}
                                    `}
                                >
                                    {/* Select Action Layer */}
                                    {onSelect ? (
                                        <button
                                            onClick={() => handleImageClick(file.name)}
                                            className="absolute inset-0 w-full h-full opacity-0 z-10 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-black/10 cursor-pointer"
                                            aria-label={`Select ${file.name}`}
                                        />
                                    ) : null}

                                    <img
                                        src={thumbnailUrl}
                                        alt=""
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />

                                    {/* Overlay Actions - Z-index higher than selection layer */}
                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center gap-2 z-20">
                                        <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-center gap-2 bg-black/40 p-2 rounded-xl pointer-events-auto">
                                            <button
                                                onClick={(e) => handleCopyUrl(e, file.name)}
                                                className="p-2 bg-white text-slate-900 rounded-full hover:bg-primary hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:outline-none"
                                                title="Copy URL"
                                                aria-label={`Copy URL for ${file.name}`}
                                            >
                                                {copyId === file.name ? <Check size={18} /> : <Copy size={18} />}
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, file.name)}
                                                className="p-2 bg-white text-slate-900 rounded-full hover:bg-red-500 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 focus-visible:outline-none"
                                                title="Delete"
                                                aria-label={`Delete ${file.name}`}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MediaPicker;
