import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes an HTML string to prevent XSS attacks while preserving safe tags.
 * Uses isomorphic-dompurify for consistent behavior on both client and server.
 * 
 * @param html The raw HTML string to sanitize
 * @returns The sanitized HTML string
 */
export const sanitizeHtml = (html: string): string => {
    if (!html) return '';

    return DOMPurify.sanitize(html, {
        // We can add global configuration here if needed in the future
        // For example: ALLOWED_TAGS: ['p', 'b', 'strong', 'i', 'em', 'ul', 'li', 'h1', 'h2', 'h3', 'br']
    });
};
