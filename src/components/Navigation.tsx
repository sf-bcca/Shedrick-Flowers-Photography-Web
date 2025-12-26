import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavItem } from '../types';

const NAV_ITEMS: NavItem[] = [
    { label: 'Portfolio', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'About', path: '/about' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
];

export const NavLinks: React.FC<{ mobile?: boolean }> = ({ mobile = false }) => {
    const location = useLocation();

    const baseClasses = mobile
        ? "flex flex-col gap-6 text-xl text-center"
        : "hidden md:flex items-center gap-8 text-sm font-medium";

    return (
        <nav className={baseClasses}>
            {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`transition-colors duration-200 ${
                            isActive
                            ? 'text-primary font-bold'
                            : 'text-slate-300 hover:text-white'
                        } ${mobile ? 'text-white' : ''}`}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
};

export const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] bg-background-dark/95 backdrop-blur-xl p-8 flex flex-col items-center justify-center animate-fade-in-up">
            <button onClick={onClose} className="absolute top-6 right-6 p-2 text-white hover:text-primary transition-colors" aria-label="Close menu">
                <span className="material-symbols-outlined text-4xl" aria-hidden="true">close</span>
            </button>
            <div onClick={onClose}>
                <NavLinks mobile={true} />
            </div>
            <div className="mt-12 flex gap-4">
                 <Link to="/contact" onClick={onClose} className="px-6 py-3 bg-primary text-white rounded-lg font-bold">
                    Book Now
                 </Link>
            </div>
        </div>
    );
};
