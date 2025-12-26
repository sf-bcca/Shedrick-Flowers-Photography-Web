import DOMPurify from 'dompurify';

/**
 * Configure DOMPurify with global security hooks.
 * This runs once when the module is imported.
 */
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    // Prevent Reverse Tabnabbing:
    // Ensure all links opening in a new tab have rel="noopener noreferrer"
    if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
        node.setAttribute('rel', 'noopener noreferrer');
    }
});

/**
 * Sanitizes HTML content using DOMPurify with configured security hooks.
 * Used for rendering rich text content (e.g., blog posts).
 * @param content - The raw HTML string to sanitize.
 * @returns The sanitized HTML string.
 */
export const sanitizeHtml = (content: string): string => {
    return DOMPurify.sanitize(content);
};

/**
 * Sanitizes text input by stripping all HTML tags and attributes.
 * Used for cleaning form inputs (e.g., contact forms, comments) before storage/sending.
 * @param content - The raw string to sanitize.
 * @returns The sanitized plain text string.
 */
export const sanitizePlainText = (content: string): string => {
    return DOMPurify.sanitize(content, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};
