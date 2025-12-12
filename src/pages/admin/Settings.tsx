import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Save, Globe, Mail, Image as ImageIcon, Share2 } from 'lucide-react';

const Settings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [siteTitle, setSiteTitle] = useState('Lens & Light');
    const [siteDesc, setSiteDesc] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [contactEmail, setContactEmail] = useState('');

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
            setContactEmail(data.contact_email || '');
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
            contact_email: contactEmail,
            social_links: socialLinks,
            updated_at: new Date(),
        };

        const { error } = await supabase.from('settings').upsert({ id: 1, ...updates });

        if (error) {
            alert('Error saving settings');
            console.error(error);
        }
        setSaving(false);
    };

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

                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex-1 w-full">
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Logo URL</label>
                                <input
                                    value={logoUrl}
                                    onChange={e => setLogoUrl(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm dark:text-white"
                                />
                            </div>

                            {logoUrl && (
                                <div className="p-4 bg-slate-100 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5 flex flex-col items-center gap-2">
                                    <span className="text-xs font-bold uppercase text-slate-400">Preview</span>
                                    <img src={logoUrl} alt="Logo Preview" className="h-16 object-contain" />
                                </div>
                            )}
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
