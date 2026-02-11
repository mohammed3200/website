import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import {
    createPageContentSchema,
    updatePageContentSchema,
} from '../schemas/page-content-schema';
import type { Session } from 'next-auth';

type Variables = {
    user: Session['user'] & {
        id: string;
    };
};

const app = new Hono<{ Variables: Variables }>();

// Public route - Get active content for a specific page
app.get(
    '/public/:page',
    zValidator(
        'param',
        z.object({
            page: z.enum(['entrepreneurship', 'incubators']),
        })
    ),
    async (c) => {
        try {
            const { page } = c.req.valid('param');

            const content = await db.pageContent.findMany({
                where: {
                    page,
                    isActive: true,
                },
                orderBy: [{ section: 'asc' }, { order: 'asc' }],
            });

            return c.json({ data: content });
        } catch (error) {
            console.error('Error fetching page content:', error);
            return c.json({ error: 'Failed to fetch page content' }, 500);
        }
    }
);

// Admin middleware
app.use('/*', async (c, next) => {
    const session = await auth();

    if (!session?.user) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const permissions = session.user.permissions as
        | Array<{ resource: string; action: string }>
        | undefined;

    const hasContentAccess = permissions?.some(
        (p) =>
            (p.resource === 'content' && p.action === 'manage') ||
            (p.resource === 'dashboard' && p.action === 'manage')
    );

    if (!hasContentAccess) {
        return c.json({ error: 'Forbidden' }, 403);
    }

    c.set('user', session.user as Variables['user']);
    await next();
});

// GET /api/pageContent/:page - Get all content for a page (admin)
app.get(
    '/:page',
    zValidator(
        'param',
        z.object({
            page: z.enum(['entrepreneurship', 'incubators']),
        })
    ),
    async (c) => {
        try {
            const { page } = c.req.valid('param');

            const content = await db.pageContent.findMany({
                where: { page },
                orderBy: [{ section: 'asc' }, { order: 'asc' }],
            });

            return c.json({ data: content });
        } catch (error) {
            console.error('Error fetching page content:', error);
            return c.json({ error: 'Failed to fetch page content' }, 500);
        }
    }
);

// POST /api/pageContent - Create new content block
app.post('/', zValidator('json', createPageContentSchema), async (c) => {
    try {
        const data = c.req.valid('json');

        // Transform for Prisma - undefined is okay, but explicit handling
        const content = await db.pageContent.create({
            data: {
                ...data,
                metadata: data.metadata ?? undefined,
            },
        });

        return c.json({ data: content }, 201);
    } catch (error) {
        console.error('Error creating page content:', error);
        return c.json({ error: 'Failed to create page content' }, 500);
    }
});

// PATCH /api/pageContent/:id - Update content block
app.patch(
    '/:id',
    zValidator('param', z.object({ id: z.string() })),
    zValidator('json', updatePageContentSchema),
    async (c) => {
        try {
            const { id } = c.req.valid('param');
            const data = c.req.valid('json');

            // Transform for Prisma
            const content = await db.pageContent.update({
                where: { id },
                data: {
                    ...data,
                    metadata: data.metadata ?? undefined,
                },
            });

            return c.json({ data: content });
        } catch (error) {
            console.error('Error updating page content:', error);
            return c.json({ error: 'Failed to update page content' }, 500);
        }
    }
);

// DELETE /api/pageContent/:id - Delete content block
app.delete('/:id', zValidator('param', z.object({ id: z.string() })), async (c) => {
    try {
        const { id } = c.req.valid('param');

        await db.pageContent.delete({
            where: { id },
        });

        return c.json({ success: true });
    } catch (error) {
        console.error('Error deleting page content:', error);
        return c.json({ error: 'Failed to delete page content' }, 500);
    }
});

export default app;