/**
 * Image Optimization Utility
 * Handles image resizing, compression, and format conversion
 */

export interface OptimizeOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0-1
    format?: 'webp' | 'jpeg' | 'png';
}

/**
 * Optimize an image file by resizing and compressing
 *
 * @security This function effectively sanitizes the image by redrawing it onto a canvas,
 * stripping potential malicious payloads or metadata (EXIF) before the file is uploaded.
 *
 * @param file - Original image file
 * @param options - Optimization options
 * @returns Promise with optimized file
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
 * Validate if file is a supported image type (JPEG, PNG, WebP, GIF)
 * @param file - The file object to validate
 * @returns {boolean} True if the file type is supported, false otherwise
 */
export function isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    return validTypes.includes(file.type);
}

/**
 * Get natural dimensions (width/height) from an image file asynchronously
 * @param file - The image file to inspect
 * @returns {Promise<{ width: number; height: number }>} Object containing width and height in pixels
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
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted string
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
