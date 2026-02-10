import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { v4 as uuidv4 } from 'uuid';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import {
  createStrategicPlanSchemaServer,
  updateStrategicPlanSchemaServer,
} from '@/features/strategic-plan/schemas/strategic-plan-schema';

const app = new Hono()
  // Public endpoint - get all active strategic plans
  .get('/public', async (c) => {
    try {
      const strategicPlans = await db.strategicPlan.findMany({
        where: {
          isActive: true,
          status: 'PUBLISHED',
        },
        include: {
          image: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Transform the data to match frontend expectations
      const transformedPlans = strategicPlans.map((plan: any) => {
        return {
          id: plan.id,
          slug: plan.slug,
          title: plan.title,
          titleAr: plan.titleAr,
          content: plan.content,
          contentAr: plan.contentAr,
          excerpt: plan.excerpt,
          excerptAr: plan.excerptAr,
          category: plan.category,
          categoryAr: plan.categoryAr,
          priority: plan.priority,
          status: plan.status,
          isActive: plan.isActive,
          progress: plan.progress,
          phase: plan.phase,
          phaseAr: plan.phaseAr,
          publishedAt: plan.publishedAt,
          image: plan.image
            ? {
              id: plan.image.id,
              url: plan.image.url,
              alt: plan.image.alt,
            }
            : null,
        };
      });

      return c.json({ data: transformedPlans }, 200);
    } catch (error) {
      console.error('Error fetching strategic plans:', error);
      return c.json(
        {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch strategic plans',
        },
        500,
      );
    }
  })
  // Public endpoint - get single strategic plan by slug or id
  .get('/public/:id', async (c) => {
    try {
      const { id } = c.req.param();

      // Try to find by slug first, then by id
      const strategicPlan = await db.strategicPlan.findFirst({
        where: {
          OR: [
            { slug: id },
            { id: id },
          ],
        },
        include: {
          image: true,
        },
      });

      if (!strategicPlan) {
        return c.json({ error: 'Strategic plan not found', message: 'Strategic plan not found' }, 404);
      }

      return c.json(
        {
          data: {
            id: strategicPlan.id,
            slug: strategicPlan.slug,
            title: strategicPlan.title,
            titleAr: strategicPlan.titleAr,
            content: strategicPlan.content,
            contentAr: strategicPlan.contentAr,
            excerpt: strategicPlan.excerpt,
            excerptAr: strategicPlan.excerptAr,
            category: strategicPlan.category,
            categoryAr: strategicPlan.categoryAr,
            priority: strategicPlan.priority,
            status: strategicPlan.status,
            isActive: strategicPlan.isActive,
            progress: strategicPlan.progress,
            phase: strategicPlan.phase,
            phaseAr: strategicPlan.phaseAr,
            publishedAt: strategicPlan.publishedAt,
            startDate: strategicPlan.startDate,
            endDate: strategicPlan.endDate,
            image: strategicPlan.image
              ? {
                id: strategicPlan.image.id,
                url: strategicPlan.image.url,
                alt: strategicPlan.image.alt,
              }
              : null,
          },
        },
        200,
      );
    } catch (error) {
      console.error('Error fetching strategic plan:', error);
      return c.json(
        {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch strategic plan',
        },
        500,
      );
    }
  })
  // Protected endpoint - get all strategic plans (admin)
  .get('/', async (c) => {
    try {
      const session = await auth();

      if (!session?.user) {
        return c.json({ error: 'Unauthorized', message: 'Unauthorized' }, 401);
      }

      // Check permissions
      const userPermissions = (session.user.permissions || []) as Array<{
        resource: string;
        action: string;
      }>;
      const hasPermission = userPermissions.some(
        (p) =>
          p.resource === 'strategic-plans' &&
          (p.action === 'read' || p.action === 'manage'),
      );

      if (!hasPermission) {
        return c.json({ error: 'Insufficient permissions', message: 'Insufficient permissions' }, 403);
      }

      const strategicPlans = await db.strategicPlan.findMany({
        include: {
          image: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const transformedPlans = strategicPlans.map((plan: any) => {
        return {
          id: plan.id,
          slug: plan.slug,
          title: plan.title,
          titleAr: plan.titleAr,
          content: plan.content,
          contentAr: plan.contentAr,
          excerpt: plan.excerpt,
          excerptAr: plan.excerptAr,
          category: plan.category,
          categoryAr: plan.categoryAr,
          priority: plan.priority,
          status: plan.status,
          isActive: plan.isActive,
          progress: plan.progress,
          phase: plan.phase,
          phaseAr: plan.phaseAr,
          publishedAt: plan.publishedAt,
          startDate: plan.startDate,
          endDate: plan.endDate,
          imageId: plan.imageId,
          image: plan.image
            ? {
              id: plan.image.id,
              url: plan.image.url,
              alt: plan.image.alt,
            }
            : null,
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt,
        };
      });

      return c.json({ data: transformedPlans }, 200);
    } catch (error) {
      console.error('Error fetching strategic plans:', error);
      return c.json(
        {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch strategic plans',
        },
        500,
      );
    }
  })
  // Protected endpoint - create strategic plan
  .post(
    '/',
    zValidator('json', createStrategicPlanSchemaServer),
    async (c) => {
      try {
        const session = await auth();

        if (!session?.user) {
          return c.json({ error: 'Unauthorized', message: 'Unauthorized' }, 401);
        }

        // Check permissions
        const userPermissions = (session.user.permissions || []) as Array<{
          resource: string;
          action: string;
        }>;
        const hasPermission = userPermissions.some(
          (p) =>
            p.resource === 'strategic-plans' &&
            (p.action === 'create' || p.action === 'manage'),
        );

        if (!hasPermission) {
          return c.json({ error: 'Insufficient permissions', message: 'Insufficient permissions' }, 403);
        }

        const validatedData = c.req.valid('json');

        // Check if slug already exists
        const existingSlug = await db.strategicPlan.findUnique({
          where: { slug: validatedData.slug },
        });

        if (existingSlug) {
          return c.json({ error: 'A strategic plan with this slug already exists', message: 'A strategic plan with this slug already exists' }, 400);
        }

        const strategicPlan = await db.strategicPlan.create({
          data: {
            id: uuidv4(),
            title: validatedData.title,
            titleAr: validatedData.titleAr || null,
            slug: validatedData.slug,
            content: validatedData.content,
            contentAr: validatedData.contentAr || null,
            excerpt: validatedData.excerpt || null,
            excerptAr: validatedData.excerptAr || null,
            category: validatedData.category || null,
            categoryAr: validatedData.categoryAr || null,
            priority: validatedData.priority,
            status: validatedData.status,
            isActive: validatedData.isActive,
            progress: validatedData.progress,
            phase: validatedData.phase || null,
            phaseAr: validatedData.phaseAr || null,
            publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : null,
            startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
            endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
            imageId: validatedData.imageId || null,
            metaTitle: validatedData.metaTitle || null,
            metaDescription: validatedData.metaDescription || null,
            createdById: session.user.id,
            updatedById: session.user.id,
          },
        });

        return c.json({ data: strategicPlan, message: 'Strategic plan created successfully' }, 201);
      } catch (error) {
        console.error('Error creating strategic plan:', error);
        return c.json(
          {
            code: 'SERVER_ERROR',
            message: 'Failed to create strategic plan',
          },
          500,
        );
      }
    },
  )
  // Protected endpoint - update strategic plan
  .patch(
    '/:id',
    zValidator('json', updateStrategicPlanSchemaServer),
    async (c) => {
      try {
        const session = await auth();

        if (!session?.user) {
          return c.json({ error: 'Unauthorized' }, 401);
        }

        // Check permissions
        const userPermissions = (session.user.permissions || []) as Array<{
          resource: string;
          action: string;
        }>;
        const hasPermission = userPermissions.some(
          (p) =>
            p.resource === 'strategic-plans' &&
            (p.action === 'update' || p.action === 'manage'),
        );

        if (!hasPermission) {
          return c.json({ error: 'Insufficient permissions' }, 403);
        }

        const { id } = c.req.param();
        const validatedData = c.req.valid('json');

        // Check if strategic plan exists
        const existingPlan = await db.strategicPlan.findUnique({
          where: { id },
        });

        if (!existingPlan) {
          return c.json({ error: 'Strategic plan not found', message: 'Strategic plan not found' }, 404);
        }

        // Check if slug is being updated and if it already exists
        if (validatedData.slug && validatedData.slug !== existingPlan.slug) {
          const existingSlug = await db.strategicPlan.findUnique({
            where: { slug: validatedData.slug },
          });

          if (existingSlug) {
            return c.json({ error: 'A strategic plan with this slug already exists', message: 'A strategic plan with this slug already exists' }, 400);
          }
        }

        // Build update data object
        const updateData: any = {
          updatedById: session.user.id,
        };

        if (validatedData.title !== undefined) {
          updateData.title = validatedData.title;
        }
        if (validatedData.titleAr !== undefined) {
          updateData.titleAr = validatedData.titleAr;
        }
        if (validatedData.slug !== undefined) {
          updateData.slug = validatedData.slug;
        }
        if (validatedData.content !== undefined) {
          updateData.content = validatedData.content;
        }
        if (validatedData.contentAr !== undefined) {
          updateData.contentAr = validatedData.contentAr;
        }
        if (validatedData.excerpt !== undefined) {
          updateData.excerpt = validatedData.excerpt;
        }
        if (validatedData.excerptAr !== undefined) {
          updateData.excerptAr = validatedData.excerptAr;
        }
        if (validatedData.category !== undefined) {
          updateData.category = validatedData.category;
        }
        if (validatedData.categoryAr !== undefined) {
          updateData.categoryAr = validatedData.categoryAr;
        }
        if (validatedData.priority !== undefined) {
          updateData.priority = validatedData.priority;
        }
        if (validatedData.status !== undefined) {
          updateData.status = validatedData.status;
        }
        if (validatedData.isActive !== undefined) {
          updateData.isActive = validatedData.isActive;
        }
        if (validatedData.progress !== undefined) {
          updateData.progress = validatedData.progress;
        }
        if (validatedData.phase !== undefined) {
          updateData.phase = validatedData.phase;
        }
        if (validatedData.phaseAr !== undefined) {
          updateData.phaseAr = validatedData.phaseAr;
        }
        if (validatedData.publishedAt !== undefined) {
          updateData.publishedAt = validatedData.publishedAt ? new Date(validatedData.publishedAt) : null;
        }
        if (validatedData.startDate !== undefined) {
          updateData.startDate = validatedData.startDate ? new Date(validatedData.startDate) : null;
        }
        if (validatedData.endDate !== undefined) {
          updateData.endDate = validatedData.endDate ? new Date(validatedData.endDate) : null;
        }
        if (validatedData.imageId !== undefined) {
          updateData.imageId = validatedData.imageId;
        }
        if (validatedData.metaTitle !== undefined) {
          updateData.metaTitle = validatedData.metaTitle;
        }
        if (validatedData.metaDescription !== undefined) {
          updateData.metaDescription = validatedData.metaDescription;
        }

        const updatedPlan = await db.strategicPlan.update({
          where: { id },
          data: updateData,
        });

        return c.json({ data: updatedPlan, message: 'Strategic plan updated successfully' }, 200);
      } catch (error) {
        console.error('Error updating strategic plan:', error);
        return c.json(
          {
            code: 'SERVER_ERROR',
            message: 'Failed to update strategic plan',
          },
          500,
        );
      }
    },
  )
  // Protected endpoint - delete strategic plan
  .delete('/:id', async (c) => {
    try {
      const session = await auth();

      if (!session?.user) {
        return c.json({ error: 'Unauthorized', message: 'Unauthorized' }, 401);
      }

      // Check permissions
      const userPermissions = (session.user.permissions || []) as Array<{
        resource: string;
        action: string;
      }>;
      const hasPermission = userPermissions.some(
        (p) =>
          p.resource === 'strategic-plans' &&
          (p.action === 'delete' || p.action === 'manage'),
      );

      if (!hasPermission) {
        return c.json({ error: 'Insufficient permissions' }, 403);
      }

      const { id } = c.req.param();

      // Check if strategic plan exists
      const existingPlan = await db.strategicPlan.findUnique({
        where: { id },
      });

      if (!existingPlan) {
        return c.json({ error: 'Strategic plan not found', message: 'Strategic plan not found' }, 404);
      }

      await db.strategicPlan.delete({
        where: { id },
      });

      return c.json({ message: 'Strategic plan deleted successfully' }, 200);
    } catch (error) {
      console.error('Error deleting strategic plan:', error);
      return c.json(
        {
          code: 'SERVER_ERROR',
          message: 'Failed to delete strategic plan',
        },
        500,
      );
    }
  });

export default app;
