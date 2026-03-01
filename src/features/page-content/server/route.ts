import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '@/lib/db';
import {
  verifyAuth,
  requirePermission,
} from '@/features/admin/server/middleware';
import { RESOURCES, ACTIONS } from '@/lib/rbac-base';
import {
  createPageContentSchema,
  updatePageContentSchema,
} from '../schemas/page-content-schema';

// Helper function for Server Components (Separation of Concerns)
export const getPageContent = async (
  page: 'entrepreneurship' | 'incubators',
) => {
  return db.pageContent.findMany({
    where: { page },
    orderBy: [{ section: 'asc' }, { order: 'asc' }],
  });
};

const app = new Hono()
  // Public route - Get active content for a specific page
  .get(
    '/public/:page',
    zValidator(
      'param',
      z.object({
        page: z.enum(['entrepreneurship', 'incubators']),
      }),
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
    },
  )

  // Public route - Get stats for all page content
  .get('/stats', async (c) => {
    try {
      const allContent = await db.pageContent.findMany({
        select: {
          page: true,
          isActive: true,
          section: true,
        },
      });

      const stats = {
        entrepreneurship: {
          total: 0,
          active: 0,
          inactive: 0,
          sections: new Set<string>(),
        },
        incubators: {
          total: 0,
          active: 0,
          inactive: 0,
          sections: new Set<string>(),
        },
      };

      allContent.forEach((item) => {
        const pageKey = item.page as 'entrepreneurship' | 'incubators';
        if (stats[pageKey]) {
          stats[pageKey].total += 1;
          if (item.isActive) stats[pageKey].active += 1;
          else stats[pageKey].inactive += 1;
          stats[pageKey].sections.add(item.section);
        }
      });

      return c.json({
        data: {
          entrepreneurship: {
            ...stats.entrepreneurship,
            sections: stats.entrepreneurship.sections.size,
          },
          incubators: {
            ...stats.incubators,
            sections: stats.incubators.sections.size,
          },
        },
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      return c.json({ error: 'Failed to fetch stats' }, 500);
    }
  })

  // GET /api/pageContent/:page - Get all content for a page (admin)
  .get(
    '/:page',
    verifyAuth,
    requirePermission(RESOURCES.CONTENT, ACTIONS.MANAGE),
    zValidator(
      'param',
      z.object({
        page: z.enum(['entrepreneurship', 'incubators']),
      }),
    ),
    async (c) => {
      try {
        const { page } = c.req.valid('param');

        const content = await getPageContent(page);

        return c.json({ data: content });
      } catch (error) {
        console.error('Error fetching page content:', error);
        return c.json({ error: 'Failed to fetch page content' }, 500);
      }
    },
  )

  // POST /api/pageContent - Create new content block
  .post(
    '/',
    verifyAuth,
    requirePermission(RESOURCES.CONTENT, ACTIONS.MANAGE),
    zValidator('json', createPageContentSchema),
    async (c) => {
      try {
        const data = c.req.valid('json');

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
    },
  )

  // PATCH /api/pageContent/:id - Update content block
  .patch(
    '/:id',
    verifyAuth,
    requirePermission(RESOURCES.CONTENT, ACTIONS.MANAGE),
    zValidator('param', z.object({ id: z.string() })),
    zValidator('json', updatePageContentSchema),
    async (c) => {
      try {
        const { id } = c.req.valid('param');
        const data = c.req.valid('json');

        const existing = await db.pageContent.findUnique({ where: { id } });
        if (!existing) {
          return c.json({ error: 'Page content not found' }, 404);
        }

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
    },
  )

  // DELETE /api/pageContent/:id - Delete content block
  .delete(
    '/:id',
    verifyAuth,
    requirePermission(RESOURCES.CONTENT, ACTIONS.MANAGE),
    zValidator('param', z.object({ id: z.string() })),
    async (c) => {
      try {
        const { id } = c.req.valid('param');

        const existing = await db.pageContent.findUnique({ where: { id } });
        if (!existing) {
          return c.json({ error: 'Page content not found' }, 404);
        }

        await db.pageContent.delete({
          where: { id },
        });

        return c.json({ success: true });
      } catch (error) {
        console.error('Error deleting page content:', error);
        return c.json({ error: 'Failed to delete page content' }, 500);
      }
    },
  );

export default app;
