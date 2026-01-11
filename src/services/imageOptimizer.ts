/**
 * Image Optimization Utility
 * Handles client-side image resizing, compression, and format conversion using the Canvas API.
 * This is crucial for:
 * 1. Performance: Reducing upload sizes and bandwidth usage.
 * 2. Security: Re-rendering images to canvas sanitizes them by stripping potential malicious metadata/payloads.
 */

export interface OptimizeOptions {
    /** Max width in pixels. Aspect ratio is preserved. Default: 800 */
    maxWidth?: number;
    /** Max height in pixels. Aspect ratio is preserved. Default: 400 */
    maxHeight?: number;
    /** Compression quality from 0 to 1. Default: 0.85 */
    quality?: number;
    /** Output format. Default: 'webp' */
    format?: 'webp' | 'jpeg' | 'png';
}

/**
 * Optimizes an image file by resizing and compressing it via an HTML5 Canvas.
 *
 * @security This function effectively sanitizes images by decoding them and re-encoding them
 * onto a clean canvas, removing any non-image data (EXIF, scripts, etc.).
 *
 * @example
 * ```ts
 * const file = event.target.files[0];
 * const optimized = await optimizeImage(file, {
 *   maxWidth: 1200,
 *   quality: 0.8,
 *   format: 'webp'
 * });
 * // Upload 'optimized' to Supabase
 * ```
 *
 * @param file - The original File object from a file input.
 * @param options - Configuration for optimization (dimensions, quality, format).
 * @returns Promise that resolves to a new File object ready for upload.
 */
export async function optimizeImage(
    file: File,
    options: OptimizeOptions = {}
): Promise<File> {
    const {
        maxWidth = 800,
        maxHeight = 400,
        quality = 0.85,
        format = 'webp'
    } = options;

    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
        }

        img.onload = () => {
            try {
                // Calculate new dimensions while maintaining aspect ratio
                let { width, height } = img;
                
                if (width > maxWidth || height > maxHeight) {
                    const aspectRatio = width / height;
                    
                    if (width > height) {
                        width = maxWidth;
                        height = width / aspectRatio;
                    } else {
                        height = maxHeight;
                        width = height * aspectRatio;
                    }
                }

                // Set canvas dimensions
                canvas.width = width;
                canvas.height = height;

                // Draw image on canvas
                // This step strips metadata and potential payloads
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to blob
                const mimeType = format === 'webp' ? 'image/webp' : 
                                format === 'jpeg' ? 'image/jpeg' : 'image/png';
                
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Failed to create blob'));
                            return;
                        }

                        // Create new file from blob
                        const ext = format === 'webp' ? 'webp' : 
                                   format === 'jpeg' ? 'jpg' : 'png';
                        const optimizedFile = new File(
                            [blob],
                            `${file.name.split('.')[0]}.${ext}`,
                            { type: mimeType }
                        );

                        resolve(optimizedFile);
                    },
                    mimeType,
                    quality
                );
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };

        // Load image
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        reader.readAsDataURL(file);
    });
}

/**
 * Validates if a file is a supported image type.
 * Explicitly allows: JPEG, JPG, PNG, WEBP, GIF.
 *
 * @param file - The file object to validate.
 * @returns {boolean} True if the file type is in the allowed list.
 */
export function isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    return validTypes.includes(file.type);
}

/**
 * Gets the natural dimensions (width/height) of an image file asynchronously.
 * Useful for validating image size before processing.
 *
 * @param file - The image file to inspect.
 * @returns {Promise<{ width: number; height: number }>} Object containing width and height in pixels.
 */
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };

        img.onload = () => {
            resolve({ width: img.width, height: img.height });
        };

        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Formats a byte count into a human-readable string (e.g., "1.5 MB").
 *
 * @param bytes - File size in bytes.
 * @returns Formatted string with appropriate unit.
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
