import React, { useState, useMemo } from 'react';

/**
 * Props for the BlurImage component.
 * Extends standard HTMLImageElement attributes.
 */
interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    /** Additional classes for the container div */
    containerClassName?: string;
}

/**
 * BlurImage Component
 *
 * A progressive image loading component that displays a blurry low-resolution placeholder
 * before the full-resolution image loads. Optimized for Supabase Storage images.
 *
 * Performance Optimizations:
 * - Uses `React.memo` to prevent unnecessary re-renders.
 * - Generates low-res placeholder URL via `useMemo`.
 * - Handles synchronous state updates to prevent stale content flashes.
 */
export const BlurImage: React.FC<BlurImageProps> = React.memo(({
    src,
    className,
    containerClassName = "",
    alt,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    // Synchronously reset isLoaded when src changes to avoid flash of stale image
    if (src !== currentSrc) {
        setCurrentSrc(src);
        setIsLoaded(false);
    }

    const lowResSrc = useMemo(() => {
        if (!src) return null;
        if (src.includes('supabase.co')) {
            const separator = src.includes('?') ? '&' : '?';
            return `${src}${separator}width=20&quality=10&resize=contain`;
        }
        // Google Photos / User Content Optimization (lh3.googleusercontent.com, etc)
        // These URLs support dynamic resizing via parameters (e.g. =w20)
        if (src.includes('googleusercontent.com') && !src.includes('?')) {
            // Handle existing parameters (e.g. =s1000) by splitting and replacing/appending
            if (src.includes('=')) {
                // If it already has sizing params, we try to replace them or be conservative.
                // Simple strategy: Split at '=' and take the base URL, then append our low-res param.
                // This assumes the part after '=' is just sizing/cropping instructions.
                const baseUrl = src.split('=')[0];
                return `${baseUrl}=w20`;
            }
            return `${src}=w20`;
        }
        return null;
    }, [src]);

    return (
        <div className={`relative overflow-hidden ${containerClassName}`}>
            {/* Placeholder / Low Res */}
            {lowResSrc ? (
                <img
                    src={lowResSrc}
                    alt=""
                    className={`absolute inset-0 w-full h-full object-cover blur-[10px] scale-110 transition-opacity duration-700 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
                    aria-hidden="true"
                />
            ) : (
                <div className={`absolute inset-0 w-full h-full bg-gray-900 transition-opacity duration-700 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
            )}

            {/* High Res Wrapper for Opacity Transition */}
            {/* We wrap the image to apply the opacity transition independently of the image's own transitions (like hover scales) */}
            <div className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <img
                    key={src} // Force re-mount of image when src changes
                    src={src}
                    alt={alt}
                    className={className}
                    onLoad={() => setIsLoaded(true)}
                    {...props}
                />
            </div>
        </div>
    );
});
