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

const MediaPicker: React.FC<MediaPickerProps> = ({ onSelect, onClose }) => {
    const [files, setFiles] = useState<FileObject[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [copyId, setCopyId] = useState<string | null>(null);

    useEffect(() => {
        fetchFiles();
    }, []);

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

    const handleCopyUrl = (e: React.MouseEvent, path: string) => {
        e.stopPropagation();
        const url = getPublicUrl(path);
        navigator.clipboard.writeText(url);
        setCopyId(path);
        setTimeout(() => setCopyId(null), 2000);
    };

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
                        className="p-2 text-slate-500 hover:text-primary transition-colors"
                        title="Refresh"
                    >
                        <span className="material-symbols-outlined">refresh</span>
                    </button>
                    {onClose && (
                         <button
                            onClick={onClose}
                            className="p-2 text-slate-500 hover:text-red-500 transition-colors"
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
                             return (
                                <div
                                    key={file.id}
                                    onClick={() => handleImageClick(file.name)}
                                    className={`
                                        group relative aspect-square bg-slate-100 dark:bg-black/20 rounded-xl overflow-hidden border border-slate-200 dark:border-white/5
                                        ${onSelect ? 'cursor-pointer hover:ring-2 hover:ring-primary' : ''}
                                    `}
                                >
                                    <img
                                        src={url}
                                        alt={file.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />

                                    {/* Overlay Actions - Only show in manage mode (no onSelect) OR if we want to allow delete even during select?
                                        Let's keep delete/copy available but use stopPropagation
                                    */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={(e) => handleCopyUrl(e, file.name)}
                                            className="p-2 bg-white text-slate-900 rounded-full hover:bg-primary hover:text-white transition-colors"
                                            title="Copy URL"
                                        >
                                            {copyId === file.name ? <Check size={18} /> : <Copy size={18} />}
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(e, file.name)}
                                            className="p-2 bg-white text-slate-900 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
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
