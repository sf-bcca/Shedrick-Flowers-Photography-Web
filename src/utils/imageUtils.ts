/**
 * Utility functions for image URL optimization.
 */

/**
 * Generates an optimized URL for Supabase Storage images by appending transformation parameters.
 * This significantly reduces network payload by fetching a resized version of the image
 * instead of the full-resolution original.
 *
 * @param url - The original image URL.
 * @param width - The desired width in pixels.
 * @returns The optimized URL with query parameters, or the original URL if not optimizeable.
 */
export const getOptimizedImageUrl = (url: string, width: number): string => {
    if (!url || typeof url !== 'string') return url;

    // Only optimize Supabase Storage URLs
    // We check for 'supabase.co' which is the standard domain.
    // Self-hosted instances might differ, but based on current codebase 'supabase.co' is used.
    if (!url.includes('supabase.co')) {
        return url;
    }

    const separator = url.includes('?') ? '&' : '?';

    // We only specify width. Supabase (imgproxy) maintains aspect ratio by default.
    // 'resize=contain' or 'cover' is implied by the aspect ratio of the container in CSS,
    // but here we just want a smaller file that is big enough.
    return `${url}${separator}width=${width}`;
};
