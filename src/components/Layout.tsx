import React from 'react';
import { Link } from 'react-router-dom';

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-x-hidden min-h-screen flex flex-col">
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 transition-colors duration-300 bg-transparent backdrop-blur-sm">
                <div className="px-4 md:px-10 py-4 flex items-center justify-between w-full max-w-[1440px] mx-auto">
                    <Link to="/" className="flex items-center gap-3 text-white group">
                        <div className="size-8 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-3xl">camera</span>
                        </div>
                        <h2 className="text-white text-lg font-bold leading-tight tracking-tight">Lens & Light</h2>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <Link to="/" className="transition-colors duration-200 text-primary font-bold">Portfolio</Link>
                        <Link to="/services" className="transition-colors duration-200 text-slate-300 hover:text-white">Services</Link>
                        <Link to="/about" className="transition-colors duration-200 text-slate-300 hover:text-white">About</Link>
                        <Link to="/blog" className="transition-colors duration-200 text-slate-300 hover:text-white">Blog</Link>
                        <Link to="/contact" className="transition-colors duration-200 text-slate-300 hover:text-white">Contact</Link>
                    </nav>
                    <div className="hidden md:flex justify-end gap-4 items-center">
                         <Link to="/login" className="text-sm text-slate-300 hover:text-white">Admin</Link>
                         <button className="flex cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold tracking-wide shadow-lg shadow-primary/20">Book a Session</button>
                    </div>
                </div>
            </header>
            <main className="flex-1 flex flex-col w-full min-h-screen pt-16">
                {children}
            </main>
        </div>
    );
};
