import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Save, Globe, Mail, Image as ImageIcon, Share2, Upload, Loader2, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { optimizeImage, isValidImageFile, formatFileSize } from '../../services/imageOptimizer';

const Settings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingHero, setUploadingHero] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Form State
    const [siteTitle, setSiteTitle] = useState('Lens & Light');
    const [siteDesc, setSiteDesc] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [heroImageUrl, setHeroImageUrl] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactAddressStreet, setContactAddressStreet] = useState('');
    const [contactAddressCity, setContactAddressCity] = useState('');
    const [contactAddressState, setContactAddressState] = useState('');
    const [contactAddressZip, setContactAddressZip] = useState('');

    // Social Links
    const [socialLinks, setSocialLinks] = useState({
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        // We assume ID 1 is the main settings row
        const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();

        if (data) {
            setSiteTitle(data.site_title || '');
            setSiteDesc(data.site_description || '');
            setLogoUrl(data.logo_url || '');
            setHeroImageUrl(data.hero_image_url || '');
            setAvatarUrl(data.avatar_url || '');
            setContactEmail(data.contact_email || '');
            setContactPhone(data.contact_phone || '');
            setContactAddressStreet(data.contact_address_street || '');
            setContactAddressCity(data.contact_address_city || '');
            setContactAddressState(data.contact_address_state || '');
            setContactAddressZip(data.contact_address_zip || '');
            setSocialLinks({
                facebook: data.social_links?.facebook || '',
                twitter: data.social_links?.twitter || '',
                instagram: data.social_links?.instagram || '',
                linkedin: data.social_links?.linkedin || '',
            });
        }
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const updates = {
            site_title: siteTitle,
            site_description: siteDesc,
            logo_url: logoUrl,
            hero_image_url: heroImageUrl,
            avatar_url: avatarUrl,
            contact_email: contactEmail,
            contact_phone: contactPhone,
            contact_address_street: contactAddressStreet,
            contact_address_city: contactAddressCity,
            contact_address_state: contactAddressState,
            contact_address_zip: contactAddressZip,
            social_links: socialLinks,
        };

        const { error } = await supabase.from('settings').upsert({ id: 1, ...updates });

        if (error) {
            const errorMsg = `Error saving settings: ${error.message}\nDetails: ${error.details || 'N/A'}\nHint: ${error.hint || 'N/A'}`;
            alert(errorMsg);
            console.error('Full error:', error);
        } else {
            alert('Settings saved successfully!');
        }
        setSaving(false);
    };

    const handleLogoUpload = async (files: File[]) => {
        if (files.length === 0) return;

        const file = files[0];
        
        // Validate file type
        if (!isValidImageFile(file)) {
            alert('Please upload a valid image file (JPG, PNG, WebP, or GIF)');
            return;
        }

        setUploadingLogo(true);

        try {
            // Optimize the image
            const optimizedFile = await optimizeImage(file, {
                maxWidth: 800,
                maxHeight: 400,
                quality: 0.85,
                format: 'webp'
            });

            console.log(`Original size: ${formatFileSize(file.size)}, Optimized size: ${formatFileSize(optimizedFile.size)}`);

            // Generate unique filename
            const fileExt = 'webp';
            const fileName = `logo-${Date.now()}.${fileExt}`;

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

            // Update logo URL in state
            setLogoUrl(publicUrl);

            // Optionally delete old logo from storage
            // You can add that logic here if needed

        } catch (error) {
            console.error('Error uploading logo:', error);
            alert('Failed to upload logo. Please try again.');
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleHeroUpload = async (files: File[]) => {
        if (files.length === 0) return;

        const file = files[0];
        
        // Validate file type
        if (!isValidImageFile(file)) {
            alert('Please upload a valid image file (JPG, PNG, WebP, or GIF)');
            return;
        }

        setUploadingHero(true);

        try {
            // Optimize the image for hero display
            const optimizedFile = await optimizeImage(file, {
                maxWidth: 1920,
                maxHeight: 1080,
                quality: 0.9,
                format: 'webp'
            });

            console.log(`Original size: ${formatFileSize(file.size)}, Optimized size: ${formatFileSize(optimizedFile.size)}`);

            // Generate unique filename
            const fileExt = 'webp';
            const fileName = `hero-${Date.now()}.${fileExt}`;

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

            // Update hero image URL in state
            setHeroImageUrl(publicUrl);

        } catch (error) {
            console.error('Error uploading hero image:', error);
            alert('Failed to upload hero image. Please try again.');
        } finally {
            setUploadingHero(false);
        }
    };

    const handleAvatarUpload = async (files: File[]) => {
        if (files.length === 0) return;

        const file = files[0];
        
        // Validate file type
        if (!isValidImageFile(file)) {
            alert('Please upload a valid image file (JPG, PNG, WebP, or GIF)');
            return;
        }

        setUploadingAvatar(true);

        try {
            // Optimize the image for avatar display
            const optimizedFile = await optimizeImage(file, {
                maxWidth: 400,
                maxHeight: 400,
                quality: 0.9,
                format: 'webp'
            });

            console.log(`Original size: ${formatFileSize(file.size)}, Optimized size: ${formatFileSize(optimizedFile.size)}`);

            // Generate unique filename
            const fileExt = 'webp';
            const fileName = `avatar-${Date.now()}.${fileExt}`;

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

            // Update avatar URL in state
            setAvatarUrl(publicUrl);

        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Failed to upload avatar. Please try again.');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleRemoveLogo = () => {
        setLogoUrl('');
    };

    const handleRemoveHero = () => {
        setHeroImageUrl('');
    };

    const handleRemoveAvatar = () => {
        setAvatarUrl('');
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleLogoUpload,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        },
        multiple: false
    });

    const { getRootProps: getHeroRootProps, getInputProps: getHeroInputProps, isDragActive: isHeroDragActive } = useDropzone({
        onDrop: handleHeroUpload,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        },
        multiple: false
    });

    const { getRootProps: getAvatarRootProps, getInputProps: getAvatarInputProps, isDragActive: isAvatarDragActive } = useDropzone({
        onDrop: handleAvatarUpload,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        },
        multiple: false
    });

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Settings</h1>
                    <p className="text-slate-500 mt-1">Manage global site configurations.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-primary/20 disabled:opacity-50 transition-all"
                >
                    <Save size={20} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="bg-white dark:bg-[#1a2232] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 space-y-8">
                    {/* General Settings */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold border-b border-slate-100 dark:border-white/5 pb-2">
                            <Globe size={20} />
                            <h2>General Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Site Title</label>
                                <input
                                    value={siteTitle}
                                    onChange={e => setSiteTitle(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Contact Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="email"
                                        value={contactEmail}
                                        onChange={e => setContactEmail(e.target.value)}
                                        className="w-full pl-10 bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Site Description</label>
                            <textarea
                                value={siteDesc}
                                onChange={e => setSiteDesc(e.target.value)}
                                rows={3}
                                className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm dark:text-white resize-none"
                            />
                        </div>
                    </section>

                    {/* Branding */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold border-b border-slate-100 dark:border-white/5 pb-2">
                            <ImageIcon size={20} />
                            <h2>Branding</h2>
                        </div>

                        <div className="space-y-4">
                            {logoUrl ? (
                                <div className="space-y-4">
                                    {/* Current Logo Display */}
                                    <div className="p-6 bg-slate-100 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold uppercase text-slate-500">Current Logo</span>
                                            <button
                                                onClick={handleRemoveLogo}
                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Remove logo"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                        <div className="flex justify-center p-4 bg-white dark:bg-[#111722] rounded-lg">
                                            <img src={logoUrl} alt="Site Logo" className="h-20 object-contain" />
                                        </div>
                                    </div>

                                    {/* Upload New Logo Button */}
                                    <div
                                        {...getRootProps()}
                                        className={`
                                            border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                                            ${isDragActive
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-slate-300 dark:border-white/10 hover:border-primary hover:text-primary text-slate-500'
                                            }
                                            ${uploadingLogo ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <input {...getInputProps()} />
                                        {uploadingLogo ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <Loader2 className="animate-spin" size={24} />
                                                <p className="text-sm font-semibold">Optimizing and uploading...</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload size={24} />
                                                <p className="text-sm font-semibold">Upload New Logo</p>
                                                <p className="text-xs opacity-70">Drag & drop or click to browse</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* No Logo - Upload Dropzone */
                                <div
                                    {...getRootProps()}
                                    className={`
                                        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                                        ${isDragActive
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-slate-300 dark:border-white/10 hover:border-primary hover:text-primary text-slate-500'
                                        }
                                        ${uploadingLogo ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >
                                    <input {...getInputProps()} />
                                    {uploadingLogo ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="animate-spin" size={32} />
                                            <p className="font-semibold">Optimizing and uploading...</p>
                                            <p className="text-sm opacity-70">This may take a moment</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <ImageIcon size={32} />
                                            <div>
                                                <p className="font-semibold text-lg">Upload Site Logo</p>
                                                <p className="text-sm opacity-70 mt-1">Drag & drop your logo here, or click to browse</p>
                                            </div>
                                            <p className="text-xs opacity-60">Supports JPG, PNG, WebP • Max 800x400px</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Hero Image */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold border-b border-slate-100 dark:border-white/5 pb-2">
                            <ImageIcon size={20} />
                            <h2>Hero Image</h2>
                        </div>

                        <div className="space-y-4">
                            {heroImageUrl ? (
                                <div className="space-y-4">
                                    {/* Current Hero Image Display */}
                                    <div className="p-6 bg-slate-100 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold uppercase text-slate-500">Current Hero Image</span>
                                            <button
                                                onClick={handleRemoveHero}
                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Remove hero image"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                        <div className="flex justify-center p-4 bg-white dark:bg-[#111722] rounded-lg">
                                            <img src={heroImageUrl} alt="Hero Image" className="max-h-64 object-contain rounded-lg" />
                                        </div>
                                    </div>

                                    {/* Upload New Hero Image Button */}
                                    <div
                                        {...getHeroRootProps()}
                                        className={`
                                            border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                                            ${
                                                isHeroDragActive
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-slate-300 dark:border-white/10 hover:border-primary hover:text-primary text-slate-500'
                                            }
                                            ${uploadingHero ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <input {...getHeroInputProps()} />
                                        {uploadingHero ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <Loader2 className="animate-spin" size={24} />
                                                <p className="text-sm font-semibold">Optimizing and uploading...</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload size={24} />
                                                <p className="text-sm font-semibold">Upload New Hero Image</p>
                                                <p className="text-xs opacity-70">Drag & drop or click to browse</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* No Hero Image - Upload Dropzone */
                                <div
                                    {...getHeroRootProps()}
                                    className={`
                                        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                                        ${
                                            isHeroDragActive
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-slate-300 dark:border-white/10 hover:border-primary hover:text-primary text-slate-500'
                                        }
                                        ${uploadingHero ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >
                                    <input {...getHeroInputProps()} />
                                    {uploadingHero ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="animate-spin" size={32} />
                                            <p className="font-semibold">Optimizing and uploading...</p>
                                            <p className="text-sm opacity-70">This may take a moment</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <ImageIcon size={32} />
                                            <div>
                                                <p className="font-semibold text-lg">Upload Hero Image</p>
                                                <p className="text-sm opacity-70 mt-1">Drag & drop your hero image here, or click to browse</p>
                                            </div>
                                            <p className="text-xs opacity-60">Supports JPG, PNG, WebP • Max 1920x1080px</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Avatar Photo */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold border-b border-slate-100 dark:border-white/5 pb-2">
                            <ImageIcon size={20} />
                            <h2>Avatar Photo</h2>
                        </div>

                        <div className="space-y-4">
                            {avatarUrl ? (
                                <div className="space-y-4">
                                    {/* Current Avatar Display */}
                                    <div className="p-6 bg-slate-100 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold uppercase text-slate-500">Current Avatar</span>
                                            <button
                                                onClick={handleRemoveAvatar}
                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Remove avatar"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                        <div className="flex justify-center p-4 bg-white dark:bg-[#111722] rounded-lg">
                                            <img src={avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-background-dark ring-2 ring-primary" />
                                        </div>
                                    </div>

                                    {/* Upload New Avatar Button */}
                                    <div
                                        {...getAvatarRootProps()}
                                        className={`
                                            border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                                            ${
                                                isAvatarDragActive
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-slate-300 dark:border-white/10 hover:border-primary hover:text-primary text-slate-500'
                                            }
                                            ${uploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <input {...getAvatarInputProps()} />
                                        {uploadingAvatar ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <Loader2 className="animate-spin" size={24} />
                                                <p className="text-sm font-semibold">Optimizing and uploading...</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload size={24} />
                                                <p className="text-sm font-semibold">Upload New Avatar</p>
                                                <p className="text-xs opacity-70">Drag & drop or click to browse</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* No Avatar - Upload Dropzone */
                                <div
                                    {...getAvatarRootProps()}
                                    className={`
                                        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                                        ${
                                            isAvatarDragActive
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-slate-300 dark:border-white/10 hover:border-primary hover:text-primary text-slate-500'
                                        }
                                        ${uploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >
                                    <input {...getAvatarInputProps()} />
                                    {uploadingAvatar ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="animate-spin" size={32} />
                                            <p className="font-semibold">Optimizing and uploading...</p>
                                            <p className="text-sm opacity-70">This may take a moment</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <ImageIcon size={32} />
                                            <div>
                                                <p className="font-semibold text-lg">Upload Avatar Photo</p>
                                                <p className="text-sm opacity-70 mt-1">Drag & drop your avatar here, or click to browse</p>
                                            </div>
                                            <p className="text-xs opacity-60">Supports JPG, PNG, WebP • Max 400x400px</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Contact Information */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold border-b border-slate-100 dark:border-white/5 pb-2">
                            <Mail size={20} />
                            <h2>Contact Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={contactPhone}
                                    onChange={e => setContactPhone(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm dark:text-white"
                                    placeholder="+1 (555) 012-3456"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Street Address</label>
                                <input
                                    type="text"
                                    value={contactAddressStreet}
                                    onChange={e => setContactAddressStreet(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm dark:text-white"
                                    placeholder="123 Lens Avenue"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">City</label>
                                <input
                                    type="text"
                                    value={contactAddressCity}
                                    onChange={e => setContactAddressCity(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm dark:text-white"
                                    placeholder="Creative District"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">State</label>
                                <input
                                    type="text"
                                    value={contactAddressState}
                                    onChange={e => setContactAddressState(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm dark:text-white"
                                    placeholder="NY"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">ZIP Code</label>
                                <input
                                    type="text"
                                    value={contactAddressZip}
                                    onChange={e => setContactAddressZip(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm dark:text-white"
                                    placeholder="10012"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Social Media */}
                    <section className="space-y-4">
                         <div className="flex items-center gap-2 text-primary font-bold border-b border-slate-100 dark:border-white/5 pb-2">
                            <Share2 size={20} />
                            <h2>Social Media</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Instagram URL</label>
                                <input
                                    value={socialLinks.instagram}
                                    onChange={e => setSocialLinks({...socialLinks, instagram: e.target.value})}
                                    className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm dark:text-white"
                                    placeholder="https://instagram.com/username"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Facebook URL</label>
                                <input
                                    value={socialLinks.facebook}
                                    onChange={e => setSocialLinks({...socialLinks, facebook: e.target.value})}
                                    className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm dark:text-white"
                                    placeholder="https://facebook.com/username"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Twitter (X) URL</label>
                                <input
                                    value={socialLinks.twitter}
                                    onChange={e => setSocialLinks({...socialLinks, twitter: e.target.value})}
                                    className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm dark:text-white"
                                    placeholder="https://twitter.com/username"
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">LinkedIn URL</label>
                                <input
                                    value={socialLinks.linkedin}
                                    onChange={e => setSocialLinks({...socialLinks, linkedin: e.target.value})}
                                    className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm dark:text-white"
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Settings;
