import React, { useState, useEffect } from 'react';

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    containerClassName?: string;
}

export const BlurImage: React.FC<BlurImageProps> = ({
    src,
    className,
    containerClassName = "",
    alt,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [lowResSrc, setLowResSrc] = useState<string | null>(null);

    useEffect(() => {
        setIsLoaded(false);

        if (!src) return;

        // Check if Supabase URL
        if (src.includes('supabase.co')) {
            // Append transformation params
            // Check if it already has params
            const separator = src.includes('?') ? '&' : '?';
            setLowResSrc(`${src}${separator}width=20&quality=10&resize=contain`);
        } else {
            setLowResSrc(null);
        }
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
                    src={src}
                    alt={alt}
                    className={className}
                    onLoad={() => setIsLoaded(true)}
                    {...props}
                />
            </div>
        </div>
    );
};
