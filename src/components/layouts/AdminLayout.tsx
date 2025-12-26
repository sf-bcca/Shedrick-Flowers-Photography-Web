import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';
import {
    LayoutDashboard,
    Image as ImageIcon,
    FileText,
    Briefcase,
    Settings,
    LogOut,
    Menu,
    X,
    Layers,
    MessageSquare,
    Star
} from 'lucide-react';

export const AdminLayout = () => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();
    // Initialize sidebar state based on screen width
    // Desktop (>= 768px): Open by default
    // Mobile (< 768px): Closed by default
    const [isSidebarOpen, setSidebarOpen] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth >= 768 : false
    );
    const location = useLocation();

    // Branding State
    const [logoUrl, setLogoUrl] = useState(() => localStorage.getItem('site_logo_url') || '');
    const [siteTitle, setSiteTitle] = useState(() => localStorage.getItem('site_title') || 'Shedrick Flowers Photography');

    useEffect(() => {
        const fetchSettings = async () => {
            const { data } = await supabase
                .from('settings')
                .select('logo_url, site_title')
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
            }
        };
        fetchSettings();
    }, []);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: ImageIcon, label: 'Media Library', path: '/admin/media' },
        { icon: Briefcase, label: 'Portfolio', path: '/admin/portfolio' },
        { icon: FileText, label: 'Blog Posts', path: '/admin/blog' },
        { icon: Layers, label: 'Services', path: '/admin/services' },
        { icon: MessageSquare, label: 'Comments', path: '/admin/comments' },
        { icon: Star, label: 'Testimonials', path: '/admin/testimonials' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex">
            {/* Mobile Navigation Overlay - Matching Public Site Style */}
            <div
                className={`
                    fixed inset-0 z-[60] bg-background-dark/95 backdrop-blur-xl
                    transition-opacity duration-300 ease-in-out
                    flex flex-col
                    md:hidden
                    ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
            >
                {/* Close Button */}
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-6 right-6 p-2 text-white hover:text-primary transition-colors z-10"
                    aria-label="Close menu"
                >
                    <span className="material-symbols-outlined text-4xl">close</span>
                </button>

                {/* Scrollable Content Container */}
                <div className="flex-1 overflow-y-auto py-20 px-8 flex flex-col items-center animate-fade-in-up">
                    <div className="flex flex-col items-center gap-2 mb-10 text-primary">
                        <span className="material-symbols-outlined text-5xl">admin_panel_settings</span>
                        <span className="font-bold text-2xl text-white">CMS Admin</span>
                    </div>

                    <nav className="flex flex-col gap-6 text-center w-full max-w-sm">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === '/admin'}
                                    onClick={() => setSidebarOpen(false)}
                                    className={({ isActive }) => `
                                        flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all text-xl
                                        ${isActive
                                            ? 'text-primary font-bold'
                                            : 'text-slate-300 hover:text-white'
                                        }
                                    `}
                                >
                                    <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                    <span>{item.label}</span>
                                </NavLink>
                            );
                        })}
                    </nav>

                    <div className="mt-12 pt-8 border-t border-white/10 w-full max-w-sm flex flex-col items-center gap-6">
                        <div className="text-center">
                            <p className="text-base font-bold text-white">Logged in as</p>
                            <p className="text-sm text-slate-400">{user?.email}</p>
                        </div>
                        <button
                            onClick={() => {
                                setSidebarOpen(false);
                                handleSignOut();
                            }}
                            className="flex items-center gap-2 px-8 py-3 text-red-400 hover:text-red-300 bg-red-900/10 hover:bg-red-900/20 rounded-lg transition-colors text-lg"
                        >
                            <LogOut size={22} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop Sidebar */}
            <aside
                className={`
                    hidden md:flex flex-col
                    sticky top-0 left-0 z-50 h-screen
                    bg-surface-light dark:bg-[#1a2232] border-r border-slate-200 dark:border-white/5
                    transition-all duration-300 ease-in-out
                    ${isSidebarOpen ? 'w-64' : 'w-20'}
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-white/5">
                        {isSidebarOpen ? (
                            <div className="flex items-center gap-2 font-bold text-lg text-primary">
                                <span className="material-symbols-outlined">admin_panel_settings</span>
                                <span>CMS Admin</span>
                            </div>
                        ) : (
                            <span className="material-symbols-outlined text-primary mx-auto">admin_panel_settings</span>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === '/admin'}
                                    className={({ isActive }) => `
                                        flex items-center gap-3 px-3 py-3 rounded-lg transition-all
                                        ${isActive
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20 font-bold'
                                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                        }
                                    `}
                                >
                                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                    {isSidebarOpen && <span>{item.label}</span>}
                                </NavLink>
                            );
                        })}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-slate-200 dark:border-white/5">
                        <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
                            {isSidebarOpen ? (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate text-slate-900 dark:text-white">Admin</p>
                                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                </div>
                            ) : null}
                            <button
                                onClick={handleSignOut}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Sign Out"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-x-hidden flex flex-col h-screen">
                {/* Mobile Header */}
                <header className="md:hidden h-16 bg-surface-light dark:bg-[#1a2232] border-b border-slate-200 dark:border-white/5 flex items-center px-4 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 mr-4 -ml-2 text-slate-500 dark:text-slate-400"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-2">
                         {logoUrl ? (
                             <img
                                src={logoUrl}
                                alt={siteTitle}
                                className="h-8 w-auto object-contain"
                            />
                        ) : (
                            <span className="font-bold text-lg text-slate-900 dark:text-white">{siteTitle}</span>
                        )}
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8 relative scrollbar-hide">
                     <Outlet />
                </div>
            </main>
        </div>
    );
};
