import React from 'react';
import { Link } from 'react-router-dom';
import { BlurImage } from './BlurImage';
import { ServiceTier } from '../types';

interface ServiceCardProps {
    item: ServiceTier;
}

export const ServiceCard: React.FC<ServiceCardProps> = React.memo(({ item }) => {
    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl bg-surface-dark shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border border-white/5 hover:border-primary/50 relative">
            <div className="relative w-full aspect-[4/3] overflow-hidden">
                <BlurImage
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    containerClassName="absolute inset-0 w-full h-full"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div className="flex flex-col flex-1 p-8 gap-4">
                <h3 className="text-white text-2xl font-bold">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
                <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 uppercase font-bold">Starting at</span>
                        <span className="text-white font-bold text-xl">{item.price === "Custom" ? "Custom Quote" : `$${item.price}`}</span>
                    </div>
                    <Link
                        to="/contact"
                        aria-label={`Book ${item.title}`}
                        className="h-10 px-6 rounded-lg bg-white/5 hover:bg-primary text-white text-sm font-bold transition-all hover:scale-105 border border-white/10 hover:border-transparent flex items-center justify-center"
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </div>
    );
});
