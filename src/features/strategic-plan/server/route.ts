import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

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
      const page = Math.max(1, Number(c.req.query('page')) || 1);
      const limit = Math.max(1, Math.min(100, Number(c.req.query('limit')) || 10));
      const skip = (page - 1) * limit;

      const where = {
        isActive: true,
        status: 'PUBLISHED' as const,
      };

      const [strategicPlans, total] = await db.$transaction([
        db.strategicPlan.findMany({
          where,
          include: {
            image: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
        }),
        db.strategicPlan.count({ where }),
      ]);

      const transformedPlans = strategicPlans.map((plan) => ({
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
        status: plan.status,
        isActive: plan.isActive,
        phase: plan.phase,
        phaseAr: plan.phaseAr,
        publishedAt: plan.publishedAt,
        image: plan.image
          ? { id: plan.image.id, url: plan.image.url, alt: plan.image.alt }
          : null,
      }));

      return c.json({
        data: transformedPlans,
        pagination: { total, page, limit },
      }, 200);
    } catch (error) {
      console.error('Error fetching strategic plans:', error);
      return c.json({ code: 'SERVER_ERROR', message: 'Failed to fetch strategic plans' }, 500);
    }
  })

  // Public endpoint - get single strategic plan by slug or id
  .get('/public/:id', async (c) => {
    try {
      const { id } = c.req.param();

      const strategicPlan = await db.strategicPlan.findFirst({
        where: {
          OR: [{ slug: id }, { id: id }],
          isActive: true,
          status: 'PUBLISHED',
        },
        include: {
          image: true,
        },
      });

      if (!strategicPlan) {
        return c.json({ error: 'Strategic plan not found', message: 'Strategic plan not found' }, 404);
      }

      return c.json({
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
          status: strategicPlan.status,
          isActive: strategicPlan.isActive,
          phase: strategicPlan.phase,
          phaseAr: strategicPlan.phaseAr,
          publishedAt: strategicPlan.publishedAt,
          startDate: strategicPlan.startDate,
          endDate: strategicPlan.endDate,
          image: strategicPlan.image
            ? { id: strategicPlan.image.id, url: strategicPlan.image.url, alt: strategicPlan.image.alt }
            : null,
        },
      }, 200);
    } catch (error) {
      console.error('Error fetching strategic plan:', error);
      return c.json({ code: 'SERVER_ERROR', message: 'Failed to fetch strategic plan' }, 500);
    }
  })

  // Protected endpoint - get all strategic plans (admin)
  .get('/', async (c) => {
    try {
      const session = await auth();

      if (!session?.user) {
        return c.json({ error: 'Unauthorized', message: 'Unauthorized' }, 401);
      }

      const userPermissions = (session.user.permissions || []) as Array<{ resource: string; action: string }>;
      const hasPermission = userPermissions.some(
        (p) => p.resource === 'strategic-plans' && (p.action === 'read' || p.action === 'manage'),
      );

      if (!hasPermission) {
        return c.json({ error: 'Insufficient permissions', message: 'Insufficient permissions' }, 403);
      }

      const page = Math.max(1, Number(c.req.query('page')) || 1);
      const limit = Math.max(1, Math.min(100, Number(c.req.query('limit')) || 10));
      const skip = (page - 1) * limit;

      const [strategicPlans, total] = await db.$transaction([
        db.strategicPlan.findMany({
          include: { image: true },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        db.strategicPlan.count(),
      ]);

      const transformedPlans = strategicPlans.map((plan) => ({
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
        status: plan.status,
        isActive: plan.isActive,
        phase: plan.phase,
        phaseAr: plan.phaseAr,
        publishedAt: plan.publishedAt,
        startDate: plan.startDate,
        endDate: plan.endDate,
        imageId: plan.imageId,
        image: plan.image
          ? { id: plan.image.id, url: plan.image.url, alt: plan.image.alt }
          : null,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
      }));

      return c.json({
        data: transformedPlans,
        pagination: { total, page, limit },
      }, 200);
    } catch (error) {
      console.error('Error fetching strategic plans:', error);
      return c.json({ code: 'SERVER_ERROR', message: 'Failed to fetch strategic plans' }, 500);
    }
  })

  // Protected endpoint - create strategic plan
  .post('/', zValidator('json', createStrategicPlanSchemaServer), async (c) => {
    try {
      const session = await auth();

      if (!session?.user) {
        return c.json({ error: 'Unauthorized', message: 'Unauthorized' }, 401);
      }

      const userPermissions = (session.user.permissions || []) as Array<{ resource: string; action: string }>;
      const hasPermission = userPermissions.some(
        (p) => p.resource === 'strategic-plans' && (p.action === 'create' || p.action === 'manage'),
      );

      if (!hasPermission) {
        return c.json({ error: 'Insufficient permissions', message: 'Insufficient permissions' }, 403);
      }

      const validatedData = c.req.valid('json');

      const existingSlug = await db.strategicPlan.findUnique({ where: { slug: validatedData.slug } });
      if (existingSlug) {
        return c.json({ error: 'A strategic plan with this slug already exists', message: 'A strategic plan with this slug already exists' }, 400);
      }

      const strategicPlan = await db.strategicPlan.create({
        data: {
          title: validatedData.title,
          titleAr: validatedData.titleAr || null,
          slug: validatedData.slug,
          content: validatedData.content,
          contentAr: validatedData.contentAr || null,
          excerpt: validatedData.excerpt || null,
          excerptAr: validatedData.excerptAr || null,
          category: validatedData.category || null,
          categoryAr: validatedData.categoryAr || null,
          status: validatedData.status,
          isActive: validatedData.isActive,
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

      return c.json({
        data: {
          id: strategicPlan.id,
          slug: strategicPlan.slug,
          title: strategicPlan.title,
          status: strategicPlan.status,
          isActive: strategicPlan.isActive,
          createdAt: strategicPlan.createdAt,
        },
        message: 'Strategic plan created successfully',
      }, 201);
    } catch (error) {
      console.error('Error creating strategic plan:', error);
      return c.json({ code: 'SERVER_ERROR', message: 'Failed to create strategic plan' }, 500);
    }
  })

  // Protected endpoint - update strategic plan
  .patch('/:id', zValidator('json', updateStrategicPlanSchemaServer), async (c) => {
    try {
      const session = await auth();

      if (!session?.user) {
        return c.json({ error: 'Unauthorized', message: 'Unauthorized' }, 401);
      }

      const userPermissions = (session.user.permissions || []) as Array<{ resource: string; action: string }>;
      const hasPermission = userPermissions.some(
        (p) => p.resource === 'strategic-plans' && (p.action === 'update' || p.action === 'manage'),
      );

      if (!hasPermission) {
        return c.json({ error: 'Insufficient permissions', message: 'Insufficient permissions' }, 403);
      }

      const { id } = c.req.param();
      const validatedData = c.req.valid('json');

      const existingPlan = await db.strategicPlan.findUnique({ where: { id } });
      if (!existingPlan) {
        return c.json({ error: 'Strategic plan not found', message: 'Strategic plan not found' }, 404);
      }

      if (validatedData.slug && validatedData.slug !== existingPlan.slug) {
        const existingSlug = await db.strategicPlan.findUnique({ where: { slug: validatedData.slug } });
        if (existingSlug) {
          return c.json({ error: 'A strategic plan with this slug already exists', message: 'A strategic plan with this slug already exists' }, 400);
        }
      }

      const updateData: Record<string, unknown> = { updatedById: session.user.id };

      const allowedFields = [
        'title', 'titleAr', 'slug', 'content', 'contentAr', 'excerpt', 'excerptAr',
        'category', 'categoryAr', 'status', 'isActive', 'phase', 'phaseAr',
        'imageId', 'metaTitle', 'metaDescription',
      ] as const;

      for (const field of allowedFields) {
        if (validatedData[field] !== undefined) {
          updateData[field] = validatedData[field];
        }
      }

      const dateFields = ['publishedAt', 'startDate', 'endDate'] as const;
      for (const field of dateFields) {
        if (validatedData[field] !== undefined) {
          updateData[field] = validatedData[field] ? new Date(validatedData[field]!) : null;
        }
      }

      const updatedPlan = await db.strategicPlan.update({ where: { id }, data: updateData });

      return c.json({ data: updatedPlan, message: 'Strategic plan updated successfully' }, 200);
    } catch (error) {
      console.error('Error updating strategic plan:', error);
      return c.json({ code: 'SERVER_ERROR', message: 'Failed to update strategic plan' }, 500);
    }
  })

  // Protected endpoint - delete strategic plan
  .delete('/:id', async (c) => {
    try {
      const session = await auth();

      if (!session?.user) {
        return c.json({ error: 'Unauthorized', message: 'Unauthorized' }, 401);
      }

      const userPermissions = (session.user.permissions || []) as Array<{ resource: string; action: string }>;
      const hasPermission = userPermissions.some(
        (p) => p.resource === 'strategic-plans' && (p.action === 'delete' || p.action === 'manage'),
      );

      if (!hasPermission) {
        return c.json({ error: 'Insufficient permissions', message: 'Insufficient permissions' }, 403);
      }

      const { id } = c.req.param();

      const existingPlan = await db.strategicPlan.findUnique({ where: { id } });
      if (!existingPlan) {
        return c.json({ error: 'Strategic plan not found', message: 'Strategic plan not found' }, 404);
      }

      await db.strategicPlan.delete({ where: { id } });

      return c.json({ message: 'Strategic plan deleted successfully' }, 200);
    } catch (error) {
      console.error('Error deleting strategic plan:', error);
      return c.json({ code: 'SERVER_ERROR', message: 'Failed to delete strategic plan' }, 500);
    }
  });

export default app;
