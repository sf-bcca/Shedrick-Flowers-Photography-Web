import React from 'react';
import { PortfolioItem } from '../types';
import { BlurImage } from './BlurImage';
import { getOptimizedImageUrl } from '../utils/imageUtils';

interface PortfolioCardProps {
    item: PortfolioItem;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = React.memo(({ item }) => {
    // Optimize image size: 800px width covers Retina on mobile (full width) and Desktop grid
    const optimizedImage = getOptimizedImageUrl(item.image, 800);

    return (
        <div className={`group relative overflow-hidden rounded-xl aspect-[4/5] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ${item.marginTop ? 'lg:mt-16' : ''} ${item.marginTopInverse ? 'lg:-mt-16' : ''}`}>
            <BlurImage
                src={optimizedImage}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                containerClassName="absolute inset-0 w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0">
                <span className="text-primary text-xs font-bold uppercase tracking-wider mb-2">{item.category}</span>
                <h3 className="text-white text-2xl font-bold">{item.title}</h3>
            </div>
        </div>
    );
});
