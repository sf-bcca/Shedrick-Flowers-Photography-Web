import React, { useState, useMemo } from 'react';

/**
 * Props for the BlurImage component.
 * Extends standard HTMLImageElement attributes.
 */
interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    /** Additional classes for the container div */
    containerClassName?: string;
    /** Target width for image optimization (e.g. Google User Content) */
    width?: number;
}

/**
 * BlurImage Component
 *
 * A progressive image loading component that displays a blurry low-resolution placeholder
 * before the full-resolution image loads. Optimized for Supabase Storage and Google User Content images.
 *
 * Performance Optimizations:
 * - Uses `React.memo` to prevent unnecessary re-renders.
 * - Generates low-res placeholder URL via `useMemo`.
 * - Handles synchronous state updates to prevent stale content flashes.
 * - Dynamically resizes Google User Content images based on `width` prop.
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
        if (src.includes('googleusercontent.com')) {
            // Google User Content images support dynamic resizing via params
            // If src already has params (e.g. =w...), we append/replace, but simplistic approach:
            // Assuming clean URL or strictly formatted. Google params usually start with =
            // If it already has params, appending =w20 might override or conflict.
            // But usually standard LH3 links don't have params by default in this app.
            return `${src}=w20`;
        }
        return null;
    }, [src]);

    // Optimize main image source
    const optimizedSrc = useMemo(() => {
        if (!src || !width) return src;

        if (src.includes('googleusercontent.com')) {
             return `${src}=w${width}`;
        }
        // Supabase optimization is already handled if the URL allows it,
        // but typically requires /render/image/ endpoint.
        // We preserve existing behavior for Supabase to avoid breakage.

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
                    onLoad={() => setIsLoaded(true)}
                    {...props}
                />
            </div>
        </div>
    );
});
