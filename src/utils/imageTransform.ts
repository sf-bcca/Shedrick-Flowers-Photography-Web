/**
 * Utility functions for optimizing Supabase Storage image URLs.
 */

/**
 * Generates an optimized URL for a Supabase Storage image using on-the-fly transformations.
 *
 * @param url - The original public URL of the image.
 * @param width - The desired width in pixels.
 * @param height - The desired height in pixels.
 * @param resize - The resize mode ('cover' | 'contain' | 'fill'). Defaults to 'cover'.
 * @param quality - The image quality (0-100). Defaults to 60.
 * @returns The optimized URL with transformation parameters, or the original URL if not a Supabase URL.
 */
export const getOptimizedImageUrl = (
    url: string,
    width: number,
    height: number,
    resize: 'cover' | 'contain' | 'fill' = 'cover',
    quality = 60
): string => {
    if (!url) return url;

    // Only optimize Supabase Storage URLs
    // We check for 'supabase.co' to match the pattern used in other parts of the app (like BlurImage)
    if (!url.includes('supabase.co')) return url;

    // Determine the correct query parameter separator
    const separator = url.includes('?') ? '&' : '?';

    return `${url}${separator}width=${width}&height=${height}&resize=${resize}&quality=${quality}`;
};
