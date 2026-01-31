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
    width,
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
        return null;
    }, [src]);

    // Optimize main image if it's from Supabase and a width is provided
    const optimizedSrc = useMemo(() => {
        if (!src) return src;

        // Parse width to ensure it's a number (handles string "800" vs "100%")
        const numericWidth = typeof width === 'number'
            ? width
            : (typeof width === 'string' && !isNaN(parseInt(width, 10)) && !width.includes('%') ? parseInt(width, 10) : null);

        if (src.includes('supabase.co') && numericWidth) {
            const separator = src.includes('?') ? '&' : '?';
            return `${src}${separator}width=${numericWidth}`;
        }
        return src;
    }, [src, width]);

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
                    src={optimizedSrc}
                    alt={alt}
                    className={className}
                    width={width}
                    onLoad={() => setIsLoaded(true)}
                    {...props}
                />
            </div>
        </div>
    );
});
