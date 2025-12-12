import React from 'react';
import { PageLayout } from '../components/Layout';
import { StudioAssistant } from '../components/StudioAssistant';

const ContactPage = () => {
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
                        <form className="space-y-8 rounded-3xl bg-white dark:bg-[#1a2232] p-8 shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/5 sm:p-12" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                <label className="block group">
                                    <span className="mb-3 block text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Your Name</span>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"><span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">person</span></div>
                                        <input className="block w-full rounded-xl border-slate-200 bg-slate-50 pl-11 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/50 dark:border-[#344465] dark:bg-[#111722] dark:text-white dark:placeholder:text-[#93a5c8] h-14 transition-all" placeholder="Jane Doe" type="text"/>
                                    </div>
                                </label>
                                <label className="block group">
                                    <span className="mb-3 block text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Email Address</span>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"><span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">mail</span></div>
                                        <input className="block w-full rounded-xl border-slate-200 bg-slate-50 pl-11 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/50 dark:border-[#344465] dark:bg-[#111722] dark:text-white dark:placeholder:text-[#93a5c8] h-14 transition-all" placeholder="jane@example.com" type="email"/>
                                    </div>
                                </label>
                            </div>
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                <label className="block group">
                                    <span className="mb-3 block text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Date Preference</span>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"><span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">calendar_month</span></div>
                                        <input className="block w-full rounded-xl border-slate-200 bg-slate-50 pl-11 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/50 dark:border-[#344465] dark:bg-[#111722] dark:text-white dark:[color-scheme:dark] h-14 transition-all" type="date"/>
                                    </div>
                                </label>
                                <label className="block group">
                                    <span className="mb-3 block text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Type of Shoot</span>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4"><span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">photo_camera</span></div>
                                        <select className="block w-full rounded-xl border-slate-200 bg-slate-50 pl-11 text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/50 dark:border-[#344465] dark:bg-[#111722] dark:text-white h-14 transition-all appearance-none">
                                            <option>Portrait Session</option>
                                            <option>Wedding / Engagement</option>
                                            <option>Event Coverage</option>
                                            <option>Commercial / Product</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4"><span className="material-symbols-outlined text-slate-400">expand_more</span></div>
                                    </div>
                                </label>
                            </div>
                            <label className="block group">
                                <span className="mb-3 block text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Your Vision</span>
                                <textarea className="block w-full rounded-xl border-slate-200 bg-slate-50 p-6 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/50 dark:border-[#344465] dark:bg-[#111722] dark:text-white dark:placeholder:text-[#93a5c8] resize-none transition-all" placeholder="Tell me a bit about what you are looking for..." rows={5}></textarea>
                            </label>
                            <div className="pt-4">
                                <button className="group flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-8 py-5 text-lg font-bold text-white transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-primary/30 sm:w-auto transform hover:-translate-y-0.5" type="button">
                                    <span>Send Message</span>
                                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 text-xl">send</span>
                                </button>
                            </div>
                        </form>
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
                                    <a className="flex items-start gap-6 transition-all hover:translate-x-2 group" href="#">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-[#243047] text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-2xl">alternate_email</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-500 dark:text-[#93a5c8] uppercase tracking-wide mb-1">Email</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">hello@linaphoto.com</p>
                                        </div>
                                    </a>
                                    <div className="flex items-start gap-6">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-[#243047] text-primary shadow-sm">
                                            <span className="material-symbols-outlined text-2xl">location_on</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-500 dark:text-[#93a5c8] uppercase tracking-wide mb-1">Studio</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white leading-snug">123 Lens Avenue<br/>Creative District, NY 10012</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-6">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-[#243047] text-primary shadow-sm">
                                            <span className="material-symbols-outlined text-2xl">call</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-500 dark:text-[#93a5c8] uppercase tracking-wide mb-1">Phone</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white leading-snug">+1 (555) 012-3456</p>
                                        </div>
                                    </div>
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
