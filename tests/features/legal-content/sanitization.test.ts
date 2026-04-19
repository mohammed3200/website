import { describe, it, expect } from 'bun:test';
import { sanitizeHtml } from '@/lib/sanitizer';

describe('Legal Content Sanitization (Semantic Assertions)', () => {
    it('should strip script tags while preserving safe content', () => {
        const dirty = '<p>Hello</p><script>alert("xss")</script>';
        const clean = sanitizeHtml(dirty);

        // Negative assertions: ensure dangerous stuff is GONE
        expect(clean).not.toContain('<script');
        expect(clean).not.toContain('alert');

        // Positive assertions: ensure safe stuff remains
        expect(clean).toContain('<p>Hello</p>');
    });

    it('should strip event handlers', () => {
        const dirty = '<img src="x" onerror="alert(1)"> <button onclick="doBad()">Click me</button>';
        const clean = sanitizeHtml(dirty);

        expect(clean).not.toContain('onerror=');
        expect(clean).not.toContain('onclick=');
        expect(clean).not.toContain('alert');
        expect(clean).not.toContain('doBad');

        expect(clean).toContain('<img src="x" />');
        expect(clean).toContain('Click me');
    });

    it('should strip style tags', () => {
        const dirty = '<style>body { background: red; }</style><p>Content</p>';
        const clean = sanitizeHtml(dirty);

        expect(clean).not.toContain('<style');
        expect(clean).not.toContain('background: red');

        expect(clean).toContain('<p>Content</p>');
    });

    it('should allow common rich text tags', () => {
        const tags = ['<h1>Title</h1>', '<p>Paragraph</p>', '<b>Bold</b>', '<i>Italic</i>', '<ul><li>Item</li></ul>'];
        const dirty = tags.join('');
        const clean = sanitizeHtml(dirty);

        tags.forEach(tag => {
            expect(clean).toContain(tag);
        });
    });

    it('should block javascript: hrefs but allow safe links', () => {
        const dirty = '<a href="javascript:alert(1)">XSS</a> <a href="https://google.com">Safe</a>';
        const clean = sanitizeHtml(dirty);

        expect(clean).not.toContain('javascript:');
        expect(clean).not.toContain('alert');

        expect(clean).toContain('<a href="https://google.com">Safe</a>');
        expect(clean).toContain('<a>XSS</a>'); // href stripped but tag remains
    });

    it('should handle nested dangerous elements', () => {
        const dirty = '<div><p>Safe<iframe src="javascript:alert(1)"></iframe></p></div>';
        const clean = sanitizeHtml(dirty);

        expect(clean).not.toContain('<iframe');
        expect(clean).not.toContain('javascript:');

        expect(clean).toContain('<div>');
        expect(clean).toContain('<p>Safe</p>');
        expect(clean).toContain('</div>');
    });
});
