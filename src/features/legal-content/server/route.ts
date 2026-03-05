import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import DOMPurify from 'isomorphic-dompurify';
import { db } from '@/lib/db';
import {
    verifyAuth,
    requirePermission,
} from '@/features/admin/server/middleware';
import { RESOURCES, ACTIONS } from '@/lib/rbac-base';
import {
    getLegalContentQuerySchema,
    patchLegalContentSchema,
} from '../schemas/legal-content-schema';
import { LEGAL_CONTENT_DEFAULTS, type LegalContentKey } from '../constants/legal-content-constants';

// Helper for Server Components (direct DB access, no HTTP round-trip)
export const getLegalContent = async (
    type: 'privacy' | 'terms',
    locale: 'en' | 'ar',
) => {
    const record = await db.legalContent.findUnique({
        where: { type_locale: { type, locale } },
    });

    if (record) return record;

    // Return fallback defaults if nothing is in the DB yet
    const key = `${type}:${locale}` as LegalContentKey;
    const defaults = LEGAL_CONTENT_DEFAULTS[key];

    return {
        id: null,
        type,
        locale,
        title: defaults?.title ?? type,
        content: defaults?.content ?? '',
        updatedAt: null,
    };
};

const app = new Hono()
    // GET /api/legal-content?type=privacy&locale=en  (public)
    .get(
        '/',
        zValidator('query', getLegalContentQuerySchema),
        async (c) => {
            try {
                const { type, locale } = c.req.valid('query');
                const data = await getLegalContent(type, locale);
                return c.json({ data });
            } catch (error) {
                console.error('Error fetching legal content:', error);
                return c.json({ error: 'Failed to fetch legal content' }, 500);
            }
        },
    )

    // PATCH /api/legal-content  (admin only – upsert)
    .patch(
        '/',
        verifyAuth,
        requirePermission(RESOURCES.CONTENT, ACTIONS.MANAGE),
        zValidator('json', patchLegalContentSchema),
        async (c) => {
            try {
                const { type, locale, title, content } = c.req.valid('json');

                // Server-side sanitization before saving to DB
                const sanitizedContent = DOMPurify.sanitize(content);

                const record = await db.legalContent.upsert({
                    where: { type_locale: { type, locale } },
                    update: { title, content: sanitizedContent },
                    create: { type, locale, title, content: sanitizedContent },
                });

                return c.json({ data: record });
            } catch (error) {
                console.error('Error updating legal content:', error);
                return c.json({ error: 'Failed to update legal content' }, 500);
            }
        },
    );

export default app;
