import { Hono } from 'hono';
import { db } from '@/lib/db';
import type { Session } from 'next-auth';
import { zValidator } from '@hono/zod-validator';
import { NotificationPriority } from '@prisma/client';

import { RESOURCES, ACTIONS, checkPermission } from '@/lib/rbac';
import {
  verifyAuth,
  requirePermission,
} from '@/features/admin/server/middleware';

import {
  notificationIdParamSchema,
  updateNotificationPreferencesSchema,
} from '@/features/admin/schemas/notifications-schema';
import {
  createReportSchema,
  reportIdParamSchema,
} from '@/features/admin/schemas/reports-schema';
import {
  createTemplateSchema,
  templateIdParamSchema,
  updateTemplateSchema,
} from '@/features/admin/schemas/templates-schema';
import { statsTrendsQuerySchema } from '@/features/admin/schemas/stats-schema';
import { activityQuerySchema } from '@/features/admin/schemas/activity-schema';

// Define the variables explicitly
type Variables = {
  user: Session['user'] & {
    id: string; // Ensure id is treated as string (not optional) for our usage
  };
};

const app = new Hono<{ Variables: Variables }>()
  // Middleware to check authentication and dashboard access
  .use('/*', verifyAuth)
  .use('/*', requirePermission(RESOURCES.DASHBOARD, ACTIONS.READ))

  // GET /api/admin/notifications - Get notifications for current user
  .get('/notifications', async (c) => {
    try {
      const user = c.get('user');
      const {
        page = '1',
        limit = '20',
        type,
        isRead,
        priority,
      } = c.req.query();

      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      const where: {
        userId: string;
        type?: string;
        isRead?: boolean;
        priority?: NotificationPriority;
      } = {
        userId: user.id,
      };

      if (type) where.type = type;
      if (isRead !== undefined) where.isRead = isRead === 'true';
      if (priority) where.priority = priority as NotificationPriority;

      const [notifications, total, unreadCount] = await Promise.all([
        db.adminNotification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitNum,
        }),
        db.adminNotification.count({ where }),
        db.adminNotification.count({
          where: {
            userId: user.id,
            isRead: false,
          },
        }),
      ]);

      return c.json({
        notifications,
        unreadCount,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return c.json({ error: 'Failed to fetch notifications' }, 500);
    }
  })

  // GET /api/admin/notifications/unread-count - Get unread notification count
  .get('/notifications/unread-count', async (c) => {
    try {
      const user = c.get('user');

      const count = await db.adminNotification.count({
        where: {
          userId: user.id,
          isRead: false,
        },
      });

      return c.json({ count });
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return c.json({ error: 'Failed to fetch unread count' }, 500);
    }
  })

  // PATCH /api/admin/notifications/:id/read - Mark notification as read
  .patch(
    '/notifications/:id/read',
    zValidator('param', notificationIdParamSchema),
    async (c) => {
      try {
        const user = c.get('user');
        const { id } = c.req.valid('param');

        const notification = await db.adminNotification.findFirst({
          where: {
            id,
            userId: user.id,
          },
        });

        if (!notification) {
          return c.json({ error: 'Notification not found' }, 404);
        }

        const updated = await db.adminNotification.update({
          where: { id },
          data: {
            isRead: true,
            readAt: new Date(),
          },
        });

        return c.json({ notification: updated });
      } catch (error) {
        console.error('Error marking notification as read:', error);
        return c.json({ error: 'Failed to mark notification as read' }, 500);
      }
    },
  )

  // PATCH /api/admin/notifications/mark-all-read - Mark all notifications as read
  .patch('/notifications/mark-all-read', async (c) => {
    try {
      const user = c.get('user');

      const result = await db.adminNotification.updateMany({
        where: {
          userId: user.id,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      return c.json({ updated: result.count });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return c.json({ error: 'Failed to mark all notifications as read' }, 500);
    }
  })

  // DELETE /api/admin/notifications/:id - Delete notification
  .delete('/notifications/:id', async (c) => {
    try {
      const user = c.get('user');
      const id = c.req.param('id');

      const notification = await db.adminNotification.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

      if (!notification) {
        return c.json({ error: 'Notification not found' }, 404);
      }

      await db.adminNotification.delete({
        where: { id },
      });

      return c.json({ success: true });
    } catch (error) {
      console.error('Error deleting notification:', error);
      return c.json({ error: 'Failed to delete notification' }, 500);
    }
  })

  // GET /api/admin/notifications/preferences - Get notification preferences
  .get('/notifications/preferences', async (c) => {
    try {
      const user = c.get('user');

      const dbUser = await db.user.findUnique({
        where: { id: user.id },
        select: { notificationPreferences: true },
      });

      return c.json({
        preferences: dbUser?.notificationPreferences || {},
      });
    } catch (error) {
      console.error('Error fetching preferences:', error);
      return c.json({ error: 'Failed to fetch preferences' }, 500);
    }
  })

  // PUT /api/admin/notifications/preferences - Update notification preferences
  .put(
    '/notifications/preferences',
    zValidator('json', updateNotificationPreferencesSchema),
    async (c) => {
      try {
        const user = c.get('user');
        const preferences = c.req.valid('json');

        // Get existing preferences
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: { notificationPreferences: true },
        });

        const existingPreferences =
          (dbUser?.notificationPreferences as Record<string, unknown>) || {};

        // Merge with new preferences
        const updatedPreferences = {
          ...existingPreferences,
          ...preferences,
        };

        await db.user.update({
          where: { id: user.id },
          data: {
            notificationPreferences: updatedPreferences,
          },
        });

        return c.json({ preferences: updatedPreferences });
      } catch (error) {
        console.error('Error updating preferences:', error);
        return c.json({ error: 'Failed to update preferences' }, 500);
      }
    },
  )

  // --- Submissions Section ---

  // GET /api/admin/submissions - Get pending innovators and collaborators
  .get('/submissions', async (c) => {
    try {
      const [innovators, collaborators] = await Promise.all([
        db.innovator.findMany({
          where: { status: 'PENDING' },
          include: {
            image: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        }),
        db.collaborator.findMany({
          where: { status: 'PENDING' },
          include: {
            image: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        }),
      ]);

      return c.json({
        innovators,
        collaborators,
      });
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return c.json({ error: 'Failed to fetch submissions' }, 500);
    }
  })

  // GET /api/admin/stats - Get dashboard statistics
  .get('/stats', async (c) => {
    try {
      const [
        totalInnovators,
        totalCollaborators,
        pendingInnovators,
        pendingCollaborators,
        totalStrategicPlans,
        totalNews,
        approvedInnovators,
        approvedCollaborators,
      ] = await Promise.all([
        db.innovator.count(),
        db.collaborator.count(),
        db.innovator.count({ where: { status: 'PENDING' } }),
        db.collaborator.count({ where: { status: 'PENDING' } }),
        db.strategicPlan.count({ where: { isActive: true } }),
        db.news.count({ where: { isActive: true } }),
        db.innovator.count({ where: { status: 'APPROVED' } }),
        db.collaborator.count({ where: { status: 'APPROVED' } }),
      ]);

      return c.json({
        totalInnovators,
        totalCollaborators,
        pendingInnovators,
        pendingCollaborators,
        totalStrategicPlans,
        totalNews,
        approvedInnovators,
        approvedCollaborators,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return c.json({ error: 'Failed to fetch statistics' }, 500);
    }
  })

  // GET /api/admin/stats/trends - Get monthly submission trends
  .get(
    '/stats/trends',
    zValidator('query', statsTrendsQuerySchema),
    async (c) => {
      try {
        const { year } = c.req.valid('query');

        // Get counts for each month
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        const trends = await Promise.all(
          months.map(async (month) => {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59, 999);

            const [innovators, collaborators] = await Promise.all([
              db.innovator.count({
                where: {
                  createdAt: {
                    gte: startDate,
                    lte: endDate,
                  },
                },
              }),
              db.collaborator.count({
                where: {
                  createdAt: {
                    gte: startDate,
                    lte: endDate,
                  },
                },
              }),
            ]);

            return {
              month: month.toString(),
              innovators,
              collaborators,
            };
          }),
        );

        return c.json({ trends });
      } catch (error) {
        console.error('Error fetching trends:', error);
        return c.json({ error: 'Failed to fetch trends' }, 500);
      }
    },
  )

  // GET /api/admin/stats/breakdown - Get status breakdown
  .get('/stats/breakdown', async (c) => {
    try {
      const [
        innovatorPending,
        innovatorApproved,
        innovatorRejected,
        collaboratorPending,
        collaboratorApproved,
        collaboratorRejected,
      ] = await Promise.all([
        db.innovator.count({ where: { status: 'PENDING' } }),
        db.innovator.count({ where: { status: 'APPROVED' } }),
        db.innovator.count({ where: { status: 'REJECTED' } }),
        db.collaborator.count({ where: { status: 'PENDING' } }),
        db.collaborator.count({ where: { status: 'APPROVED' } }),
        db.collaborator.count({ where: { status: 'REJECTED' } }),
      ]);

      return c.json({
        innovators: {
          pending: innovatorPending,
          approved: innovatorApproved,
          rejected: innovatorRejected,
        },
        collaborators: {
          pending: collaboratorPending,
          approved: collaboratorApproved,
          rejected: collaboratorRejected,
        },
      });
    } catch (error) {
      console.error('Error fetching breakdown:', error);
      return c.json({ error: 'Failed to fetch breakdown' }, 500);
    }
  })

  // GET /api/admin/activity - Get recent admin activity
  .get('/activity', zValidator('query', activityQuerySchema), async (c) => {
    try {
      const user = c.get('user');
      const { limit } = c.req.valid('query');

      const activities = await db.adminNotification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      return c.json({ activities });
    } catch (error) {
      console.error('Error fetching activity:', error);
      return c.json({ error: 'Failed to fetch activity' }, 500);
    }
  })

  // --- Reports Section ---

  // GET /api/admin/reports - List generated reports
  .get('/reports', async (c) => {
    try {
      const user = c.get('user');
      const reports = await db.report.findMany({
        where: { createdById: user.id },
        orderBy: { createdAt: 'desc' },
      });

      return c.json({ reports });
    } catch (error) {
      console.error('Error fetching reports:', error);
      return c.json({ error: 'Failed to fetch reports' }, 500);
    }
  })

  // POST /api/admin/reports - Trigger a new report generation
  .post('/reports', zValidator('json', createReportSchema), async (c) => {
    try {
      const user = c.get('user');
      const { name, type, format, parameters } = c.req.valid('json');

      const report = await db.report.create({
        data: {
          name,
          type,
          format,
          status: 'PENDING',
          parameters: (parameters as any) || {},
          createdById: user.id,
        },
      });

      // Add to background job queue
      const { reportQueue } = await import('@/lib/queue/report-queue');
      await reportQueue.add('generate-report', {
        reportId: report.id,
        name,
        type,
        format,
        parameters: parameters || {},
        createdById: user.id,
      });

      return c.json({ report });
    } catch (error) {
      console.error('Error creating report:', error);
      return c.json({ error: 'Failed to create report' }, 500);
    }
  })

  // DELETE /api/admin/reports/:id - Delete a report
  .delete(
    '/reports/:id',
    zValidator('param', reportIdParamSchema),
    async (c) => {
      try {
        const user = c.get('user');
        const { id } = c.req.valid('param');

        const report = await db.report.findFirst({
          where: { id, createdById: user.id },
        });

        if (!report) {
          return c.json({ error: 'Report not found' }, 404);
        }

        await db.report.delete({ where: { id } });

        return c.json({ success: true });
      } catch (error) {
        console.error('Error deleting report:', error);
        return c.json({ error: 'Failed to delete report' }, 500);
      }
    },
  )

  // --- Message Templates ---

  // GET /api/admin/templates - List message templates
  .get('/templates', verifyAuth, async (c) => {
    try {
      const user = c.get('user');
      if (
        !checkPermission(
          user.permissions as any,
          RESOURCES.TEMPLATES,
          ACTIONS.READ,
        )
      ) {
        return c.json({ error: 'Forbidden' }, 403);
      }

      const templates = await db.messageTemplate.findMany({
        orderBy: { nameEn: 'asc' },
      });

      return c.json({ templates });
    } catch (error) {
      console.error('Error fetching templates:', error);
      return c.json({ error: 'Failed to fetch templates' }, 500);
    }
  })

  // GET /api/admin/templates/:id - Get a specific message template
  .get(
    '/templates/:id',
    verifyAuth,
    zValidator('param', templateIdParamSchema),
    async (c) => {
      try {
        const user = c.get('user');
        if (
          !checkPermission(
            user.permissions as any,
            RESOURCES.TEMPLATES,
            ACTIONS.READ,
          )
        ) {
          return c.json({ error: 'Forbidden' }, 403);
        }
        const { id } = c.req.valid('param');

        const template = await db.messageTemplate.findUnique({
          where: { id },
        });

        if (!template) {
          return c.json({ error: 'Template not found' }, 404);
        }

        return c.json({ template });
      } catch (error) {
        console.error('Error fetching template:', error);
        return c.json({ error: 'Failed to fetch template' }, 500);
      }
    },
  )

  // POST /api/admin/templates - Create a new message template
  .post(
    '/templates',
    verifyAuth,
    zValidator('json', createTemplateSchema),
    async (c) => {
      try {
        const user = c.get('user');
        if (
          !checkPermission(
            user.permissions as any,
            RESOURCES.TEMPLATES,
            ACTIONS.MANAGE,
          )
        ) {
          return c.json({ error: 'Forbidden' }, 403);
        }
        const data = c.req.valid('json');

        const existing = await db.messageTemplate.findUnique({
          where: { slug: data.slug },
        });

        if (existing) {
          return c.json(
            { error: 'Template with this slug already exists' },
            400,
          );
        }

        const template = await db.messageTemplate.create({
          data: {
            ...data,
            isSystem: false,
          },
        });

        return c.json({ template });
      } catch (error) {
        console.error('Error creating template:', error);
        return c.json({ error: 'Failed to create template' }, 500);
      }
    },
  )

  // PATCH /api/admin/templates/:id - Update a message template
  .patch(
    '/templates/:id',
    verifyAuth,
    zValidator('param', templateIdParamSchema),
    zValidator('json', updateTemplateSchema),
    async (c) => {
      try {
        const user = c.get('user');
        if (
          !checkPermission(
            user.permissions as any,
            RESOURCES.TEMPLATES,
            ACTIONS.MANAGE,
          )
        ) {
          return c.json({ error: 'Forbidden' }, 403);
        }
        const { id } = c.req.valid('param');
        const data = c.req.valid('json');

        const existing = await db.messageTemplate.findUnique({ where: { id } });
        if (!existing) {
          return c.json({ error: 'Template not found' }, 404);
        }

        // If slug is changed, check uniqueness
        if (data.slug && data.slug !== existing.slug) {
          const conflict = await db.messageTemplate.findUnique({
            where: { slug: data.slug },
          });
          if (conflict) {
            return c.json({ error: 'Slug already in use' }, 400);
          }
        }

        const template = await db.messageTemplate.update({
          where: { id },
          data,
        });

        return c.json({ template });
      } catch (error) {
        console.error('Error updating template:', error);
        return c.json({ error: 'Failed to update template' }, 500);
      }
    },
  )

  // DELETE /api/admin/templates/:id - Delete a message template
  .delete(
    '/templates/:id',
    verifyAuth,
    zValidator('param', templateIdParamSchema),
    async (c) => {
      try {
        const user = c.get('user');
        if (
          !checkPermission(
            user.permissions as any,
            RESOURCES.TEMPLATES,
            ACTIONS.MANAGE,
          )
        ) {
          return c.json({ error: 'Forbidden' }, 403);
        }
        const { id } = c.req.valid('param');

        const template = await db.messageTemplate.findUnique({ where: { id } });
        if (!template) {
          return c.json({ error: 'Template not found' }, 404);
        }

        if (template.isSystem) {
          return c.json({ error: 'Cannot delete system templates' }, 403);
        }

        await db.messageTemplate.delete({ where: { id } });

        return c.json({ success: true });
      } catch (error) {
        console.error('Error deleting template:', error);
        return c.json({ error: 'Failed to delete template' }, 500);
      }
    },
  );

export default app;
