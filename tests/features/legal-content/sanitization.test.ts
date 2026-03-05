import { describe, it, expect } from '@jest/globals';
import DOMPurify from 'isomorphic-dompurify';

describe('Legal Content Sanitization', () => {
    it('should strip script tags', () => {
        const dirty = '<p>Hello</p><script>alert("xss")</script>';
        const clean = DOMPurify.sanitize(dirty);
        expect(clean).toBe('<p>Hello</p>');
    });

    it('should strip event handlers (onerror, onclick, etc.)', () => {
        const dirty = '<img src="x" onerror="alert(1)"> <button onclick="doBad()">Click me</button>';
        const clean = DOMPurify.sanitize(dirty);
        expect(clean).toBe('<img src="x"> <button>Click me</button>');
    });

    it('should strip style tags', () => {
        const dirty = '<style>body { background: red; }</style><p>Content</p>';
        const clean = DOMPurify.sanitize(dirty);
        expect(clean).toBe('<p>Content</p>');
    });

    it('should allow safe HTML tags (p, b, i, ul, li, h1, etc.)', () => {
        const dirty = '<h1>Title</h1><p>This is <b>bold</b> and <i>italic</i>.</p><ul><li>Item</li></ul>';
        const clean = DOMPurify.sanitize(dirty);
        expect(clean).toBe(dirty);
    });

    it('should handle nested dangerous elements', () => {
        const dirty = '<div><p>Safe<iframe src="javascript:alert(1)"></iframe></p></div>';
        const clean = DOMPurify.sanitize(dirty);
        expect(clean).toBe('<div><p>Safe</p></div>');
    });

    it('should handle malicious hrefs', () => {
        const dirty = '<a href="javascript:alert(1)">Click me</a> <a href="http://safe.com">Safe</a>';
        const clean = DOMPurify.sanitize(dirty);
        expect(clean).toBe('<a>Click me</a> <a href="http://safe.com">Safe</a>');
    });
});
