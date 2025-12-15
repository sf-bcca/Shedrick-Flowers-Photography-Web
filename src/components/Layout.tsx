import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavLinks, MobileMenu } from './Navigation';
import { supabase } from '../services/supabaseClient';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    transparentHeader?: boolean;
}

export const Header: React.FC<{ transparent?: boolean }> = ({ transparent = false }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [logoUrl, setLogoUrl] = useState(localStorage.getItem('site_logo_url') || '');
    const [siteTitle, setSiteTitle] = useState(localStorage.getItem('site_title') || 'Lens & Light');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase
                .from('settings')
                .select('logo_url, site_title, favicon_url')
                .eq('id', 1)
                .single();
            
            if (data) {
                if (data.logo_url) {
                    setLogoUrl(data.logo_url);
                    localStorage.setItem('site_logo_url', data.logo_url);
                }
                if (data.site_title) {
                    setSiteTitle(data.site_title);
                    localStorage.setItem('site_title', data.site_title);
                }
                if (data.favicon_url) {
                    // Update favicon in DOM
                    const faviconLink = document.getElementById('favicon') as HTMLLinkElement;
                    if (faviconLink) {
                        faviconLink.href = data.favicon_url;
                    }
                    // Update localStorage cache
                    localStorage.setItem('site_favicon_url', data.favicon_url);
                }
            }
        };
        fetchSettings();
    }, []);

    return (
        <>
            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
            <header className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10 transition-colors duration-300 ${transparent ? 'bg-transparent backdrop-blur-sm' : 'bg-background-dark/90 backdrop-blur-md'}`}>
                <div className="px-4 md:px-10 py-4 flex items-center justify-between w-full max-w-[1440px] mx-auto">
                    <Link to="/" className="flex items-center gap-3 text-white group">
                        {logoUrl ? (
                            <img 
                                src={logoUrl} 
                                alt={siteTitle}
                                className="h-8 w-auto object-contain group-hover:scale-110 transition-transform"
                            />
                        ) : (
                            <>
                                <div className="size-8 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl">camera</span>
                                </div>
                                <h2 className="text-white text-lg font-bold leading-tight tracking-tight">{siteTitle}</h2>
                            </>
                        )}
                    </Link>
                    <div className="hidden md:flex flex-1 justify-end gap-8 items-center text-slate-300">
                        <NavLinks />
                        <button onClick={() => navigate('/contact')} className="flex cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold tracking-wide shadow-lg shadow-primary/20">
                            Book a Session
                        </button>
                    </div>
                    <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-white p-2" aria-label="Open main menu">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </header>
        </>
    );
};

const XIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export const Footer: React.FC = () => {
    const [logoUrl, setLogoUrl] = useState(localStorage.getItem('site_logo_url') || '');
    const [siteTitle, setSiteTitle] = useState(localStorage.getItem('site_title') || 'Lens & Light');
    const [socialLinks, setSocialLinks] = useState({
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase
                .from('settings')
                .select('logo_url, site_title, social_links')
                .eq('id', 1)
                .single();
            
            if (data) {
                if (data.logo_url) {
                    setLogoUrl(data.logo_url);
                    localStorage.setItem('site_logo_url', data.logo_url);
                }
                if (data.site_title) {
                    setSiteTitle(data.site_title);
                    localStorage.setItem('site_title', data.site_title);
                }
                if (data.social_links) {
                    setSocialLinks({
                        facebook: data.social_links.facebook || '',
                        twitter: data.social_links.twitter || '',
                        instagram: data.social_links.instagram || '',
                        linkedin: data.social_links.linkedin || ''
                    });
                }
            }
        };
        fetchSettings();
    }, []);

    return (
        <footer className="bg-surface-dark border-t border-white/10 pt-16 pb-8 px-4 md:px-10 mt-auto w-full">
            <div className="max-w-[1200px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                     <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-white font-bold text-xl">
                            {logoUrl ? (
                                <img 
                                    src={logoUrl} 
                                    alt={siteTitle}
                                    className="h-8 w-auto object-contain"
                                />
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-primary">camera</span>
                                    {siteTitle}
                                </>
                            )}
                        </div>
                        <p className="text-slate-400 text-sm max-w-xs">Capturing the soul of the moment with professional photography services worldwide.</p>
                     </div>
                     <div className="flex gap-4">
                        <a href={socialLinks.instagram || '#'} target={socialLinks.instagram ? "_blank" : "_self"} rel="noreferrer" className="w-10 h-10 rounded-full bg-background-dark flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white transition-all" aria-label="Visit Instagram">
                             <Instagram size={20} />
                        </a>
                        <a href={socialLinks.facebook || '#'} target={socialLinks.facebook ? "_blank" : "_self"} rel="noreferrer" className="w-10 h-10 rounded-full bg-background-dark flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white transition-all" aria-label="Visit Facebook">
                             <Facebook size={20} />
                        </a>
                        <a href={socialLinks.twitter || '#'} target={socialLinks.twitter ? "_blank" : "_self"} rel="noreferrer" className="w-10 h-10 rounded-full bg-background-dark flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white transition-all" aria-label="Visit Twitter">
                             <XIcon size={18} />
                        </a>
                        <a href={socialLinks.linkedin || '#'} target={socialLinks.linkedin ? "_blank" : "_self"} rel="noreferrer" className="w-10 h-10 rounded-full bg-background-dark flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white transition-all" aria-label="Visit LinkedIn">
                             <Linkedin size={20} />
                        </a>
                     </div>
                </div>
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} {siteTitle}. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="/about" className="hover:text-white transition-colors">About</Link>
                        <Link to="/services" className="hover:text-white transition-colors">Services</Link>
                        <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export const PageLayout: React.FC<LayoutProps> = ({ children, transparentHeader = false }) => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-x-hidden min-h-screen flex flex-col">
            <Header transparent={transparentHeader} />
            <main className="flex-1 flex flex-col w-full min-h-screen pt-16">
                {children}
            </main>
            <Footer />
        </div>
    );
};
