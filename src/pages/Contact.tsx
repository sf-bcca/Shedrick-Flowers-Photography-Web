import React, { useState, useEffect } from 'react';
import { PageLayout } from '../components/Layout';
import { StudioAssistant } from '../components/StudioAssistant';
import { supabase } from '../services/supabaseClient';

interface FormData {
    name: string;
    email: string;
    datePreference: string;
    shootType: string;
    message: string;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const ContactPage = () => {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    // Form state
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        datePreference: '',
        shootType: 'Portrait Session',
        message: ''
    });
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .eq('id', 1)
                .single();

            if (data) {
                setSettings(data);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.name.trim() || !formData.email.trim()) {
            setErrorMessage('Please fill in your name and email.');
            setSubmitStatus('error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setErrorMessage('Please enter a valid email address.');
            setSubmitStatus('error');
            return;
        }

        setSubmitStatus('submitting');
        setErrorMessage('');

        try {
            // 1. Save to Supabase (Backup)
            const { error: supabaseError } = await supabase
                .from('contact_submissions')
                .insert({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    date_preference: formData.datePreference || null,
                    shoot_type: formData.shootType,
                    message: formData.message.trim() || null
                });

            if (supabaseError) {
                console.error('Supabase error:', supabaseError);
                // We continue to email even if DB fails, or throw? 
                // Let's decide to Log but try email anyway, as email is the priority for the user.
            }

            // 2. Send Email via Web3Forms
            const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

            if (!accessKey) {
                console.error('CRITICAL: Missing VITE_WEB3FORMS_ACCESS_KEY in environment variables.');
                throw new Error('Configuration error. Please contact the administrator.');
            }

            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    access_key: accessKey,
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    subject: `New Inquiry: ${formData.shootType} - ${formData.name}`,
                    from_name: "Shedrick Flowers Photography Website",
                    // Custom fields for the email body
                    "Shoot Type": formData.shootType,
                    "Date Preference": formData.datePreference || "No date specificed"
                }),
            });

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || 'Failed to send email');
            }

            setSubmitStatus('success');
            // Reset form
            setFormData({
                name: '',
                email: '',
                datePreference: '',
                shootType: 'Portrait Session',
                message: ''
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrorMessage('Something went wrong. Please try again later.');
            setSubmitStatus('error');
        }
    };

    // Fallback values
    const email = settings?.contact_email || 'hello@linaphoto.com';
    const phone = settings?.contact_phone || '+1 (555) 012-3456';
    const addressStreet = settings?.contact_address_street || '123 Lens Avenue';
    const addressCity = settings?.contact_address_city || 'Creative District';
    const addressState = settings?.contact_address_state || 'NY';
    const addressZip = settings?.contact_address_zip || '10012';

    return (
        <PageLayout>
            <StudioAssistant />
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
                <div className="mb-12 text-center lg:mb-20 lg:text-left">
                    <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white md:text-5xl lg:text-7xl animate-fade-in-up">
                        Let's Create <span className="text-primary">Together</span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-xl font-normal text-slate-500 dark:text-[#93a5c8] lg:mx-0 animate-fade-in-up delay-100">
                        Interested in a session? I'd love to hear your story. Fill out the form below or reach out directly to discuss your vision.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
                    {/* Form */}
                    <div className="lg:col-span-7 animate-fade-in-up delay-200">
                        {submitStatus === 'success' ? (
                            <div className="rounded-3xl bg-white dark:bg-[#1a2232] p-8 shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/5 sm:p-12 text-center" role="status" aria-live="polite">
                                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30">
                                    <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400" aria-hidden="true">check_circle</span>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Message Sent!</h2>
                                <p className="text-lg text-slate-600 dark:text-[#93a5c8] mb-8">
                                    Thank you for reaching out! I'll get back to you as soon as possible to discuss your vision.
                                </p>
                                <button
                                    onClick={() => setSubmitStatus('idle')}
                                    className="inline-flex items-center gap-2 text-primary hover:text-blue-600 font-semibold transition-colors"
                                >
                                    <span className="material-symbols-outlined text-xl" aria-hidden="true">arrow_back</span>
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form className="space-y-8 rounded-3xl bg-white dark:bg-[#1a2232] p-8 shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/5 sm:p-12" onSubmit={handleSubmit}>
                                {submitStatus === 'error' && errorMessage && (
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" role="alert">
                                        <span className="material-symbols-outlined text-red-600 dark:text-red-400" aria-hidden="true">error</span>
                                        <p className="text-red-700 dark:text-red-300 font-medium">{errorMessage}</p>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                    <label className="block group">
                                        <span className="mb-3 block text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Your Name</span>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"><span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors" aria-hidden="true">person</span></div>
                                            <input 
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="block w-full rounded-xl border-slate-200 bg-slate-50 pl-11 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/50 dark:border-[#344465] dark:bg-[#111722] dark:text-white dark:placeholder:text-[#93a5c8] h-14 transition-all" 
                                                placeholder="Jane Doe" 
                                                type="text"
                                                maxLength={100}
                                                required
                                            />
                                        </div>
                                    </label>
                                    <label className="block group">
                                        <span className="mb-3 block text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Email Address</span>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"><span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors" aria-hidden="true">mail</span></div>
                                            <input 
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="block w-full rounded-xl border-slate-200 bg-slate-50 pl-11 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/50 dark:border-[#344465] dark:bg-[#111722] dark:text-white dark:placeholder:text-[#93a5c8] h-14 transition-all" 
                                                placeholder="jane@example.com" 
                                                type="email"
                                                maxLength={100}
                                                required
                                            />
                                        </div>
                                    </label>
                                </div>
                                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                    <label className="block group">
                                        <span className="mb-3 block text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Date Preference</span>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"><span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors" aria-hidden="true">calendar_month</span></div>
                                            <input 
                                                name="datePreference"
                                                value={formData.datePreference}
                                                onChange={handleInputChange}
                                                className="block w-full rounded-xl border-slate-200 bg-slate-50 pl-11 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/50 dark:border-[#344465] dark:bg-[#111722] dark:text-white dark:[color-scheme:dark] h-14 transition-all" 
                                                type="date"
                                            />
                                        </div>
                                    </label>
                                    <label className="block group">
                                        <span className="mb-3 block text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Type of Shoot</span>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"><span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors" aria-hidden="true">photo_camera</span></div>
                                            <select 
                                                name="shootType"
                                                value={formData.shootType}
                                                onChange={handleInputChange}
                                                className="block w-full rounded-xl border-slate-200 bg-slate-50 pl-11 text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/50 dark:border-[#344465] dark:bg-[#111722] dark:text-white h-14 transition-all appearance-none"
                                            >
                                                <option>Portrait Session</option>
                                                <option>Wedding / Engagement</option>
                                                <option>Event Coverage</option>
                                                <option>Commercial / Product</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4"><span className="material-symbols-outlined text-slate-400" aria-hidden="true">expand_more</span></div>
                                        </div>
                                    </label>
                                </div>
                                <label className="block group">
                                    <span className="mb-3 block text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Your Vision</span>
                                    <textarea 
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-xl border-slate-200 bg-slate-50 p-6 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/50 dark:border-[#344465] dark:bg-[#111722] dark:text-white dark:placeholder:text-[#93a5c8] resize-none transition-all" 
                                        placeholder="Tell me a bit about what you are looking for..." 
                                        rows={5}
                                        maxLength={2000}
                                    ></textarea>
                                </label>
                                <div className="pt-4">
                                    <button 
                                        className="group flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-8 py-5 text-lg font-bold text-white transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-primary/30 sm:w-auto transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none" 
                                        type="submit"
                                        disabled={submitStatus === 'submitting'}
                                    >
                                        {submitStatus === 'submitting' ? (
                                            <>
                                                <span className="material-symbols-outlined animate-spin text-xl" role="status" aria-label="Loading">progress_activity</span>
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Send Message</span>
                                                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 text-xl" aria-hidden="true">send</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                    {/* Info & Sidebar */}
                    <div className="lg:col-span-5 flex flex-col h-full animate-fade-in-up delay-300">
                        <div className="flex flex-col gap-8 sticky top-24">
                            <div className="relative hidden h-80 w-full overflow-hidden rounded-3xl sm:block lg:h-96 group shadow-2xl">
                                <img
                                    alt="Photographer holding a camera"
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPKNL63uKUTPIARy2j1jcjGCeVA-LiZt3b4eqYu3-XxAmXdLaNAmVjADGzs6TyZQiLwYiIPU8XVrND09Q_GG5c6IMiOoSXrlAkXrK-NNrTZSWUCP-_dY-mVe44uFRGQC6RJijoDDy4v9CrXFD4bFl-FwQ9rClXT_RfDKWWKMW7zclRInwFQRh8uGpVQXXqNhByispoVF0az9WLhBJ6NwpkJWUx3G_7EQAjwwjOuzoujFfogBJElD0T_GuIn3ueCNxkbEm6WbX_rT9Y"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111621] via-transparent to-transparent opacity-80"></div>
                                <div className="absolute bottom-8 left-8 text-white">
                                    <p className="font-bold text-2xl mb-1">Studio Sessions</p>
                                    <p className="text-sm text-slate-300 uppercase tracking-widest font-semibold flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        Available Mon - Fri
                                    </p>
                                </div>
                            </div>
                            {/* Contact Info Card */}
                            <div className="rounded-3xl bg-slate-100 dark:bg-[#1a2232] p-8 lg:p-10 border border-transparent dark:border-white/5 shadow-xl">
                                <h3 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">Contact Info</h3>
                                <div className="space-y-8">
                                    <a className="flex items-start gap-6 transition-all hover:translate-x-2 group" href={`mailto:${email}`}>
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-[#243047] text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-2xl">alternate_email</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-500 dark:text-[#93a5c8] uppercase tracking-wide mb-1">Email</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{email}</p>
                                        </div>
                                    </a>
                                    <div className="flex items-start gap-6">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-[#243047] text-primary shadow-sm">
                                            <span className="material-symbols-outlined text-2xl">location_on</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-500 dark:text-[#93a5c8] uppercase tracking-wide mb-1">Studio</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                                                {addressStreet}<br/>{addressCity}, {addressState} {addressZip}
                                            </p>
                                        </div>
                                    </div>
                                    <a className="flex items-start gap-6 transition-all hover:translate-x-2 group" href={`tel:${phone.replace(/\s/g, '')}`}>
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-[#243047] text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-2xl">call</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-500 dark:text-[#93a5c8] uppercase tracking-wide mb-1">Phone</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug">{phone}</p>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default ContactPage;
