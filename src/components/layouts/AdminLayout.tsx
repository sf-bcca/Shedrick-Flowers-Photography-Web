import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
    MessageSquare
} from 'lucide-react';

export const AdminLayout = () => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

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
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex">
            {/* Mobile Overlay */}
            {!isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(true)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed md:sticky top-0 left-0 z-50 h-screen
                    bg-surface-light dark:bg-[#1a2232] border-r border-slate-200 dark:border-white/5
                    transition-all duration-300 ease-in-out
                    ${isSidebarOpen ? 'w-64' : 'w-20'}
                    ${!isSidebarOpen ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
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
                            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 hidden md:block"
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
                                    end={item.path === '/admin'} // Exact match for root admin
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
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-2 mr-4 -ml-2 text-slate-500"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-lg">Lens & Light</span>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8 relative scrollbar-hide">
                     <Outlet />
                </div>
            </main>
        </div>
    );
};
