/**
 * Security Validation Utilities
 * Centralized validation logic to prevent common vulnerabilities.
 */

/**
 * Validates that a string is a safe URL (http/https)
 * Prevents javascript: URI injection (XSS)
 * @param url - The URL to validate
 * @returns boolean
 */
export const isValidUrl = (url: string): boolean => {
    if (!url) return true; // Allow empty (optional fields)
    try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
};

/**
 * Validates email format
 * @param email - The email to validate
 * @returns boolean
 */
export const isValidEmail = (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
