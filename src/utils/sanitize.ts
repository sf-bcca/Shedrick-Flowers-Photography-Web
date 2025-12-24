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
 * @param content - The raw HTML string to sanitize.
 * @returns The sanitized HTML string.
 */
export const sanitizeHtml = (content: string): string => {
    return DOMPurify.sanitize(content);
};
