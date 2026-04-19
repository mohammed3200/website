import sanitizeHtmlLib from 'sanitize-html';

/**
 * Sanitizes an HTML string to prevent XSS attacks while preserving safe tags.
 * Uses sanitize-html to avoid jsdom/turbopack build issues.
 * 
 * @param html The raw HTML string to sanitize
 * @returns The sanitized HTML string
 */
export const sanitizeHtml = (html: string): string => {
    if (!html) return '';

    return sanitizeHtmlLib(html, {
        allowedTags: sanitizeHtmlLib.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3']),
        allowedAttributes: {
            ...sanitizeHtmlLib.defaults.allowedAttributes,
            '*': ['class'],
        },
    });
};
