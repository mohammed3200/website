import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { NotificationPriority } from '@prisma/client';
import type { Session } from 'next-auth';

// Define the variables explicitly
type Variables = {
  user: Session['user'] & {
    id: string; // Ensure id is treated as string (not optional) for our usage
  };
};

const app = new Hono<{ Variables: Variables }>()
  // Middleware to check authentication
  .use('/*', async (c, next) => {
    const session = await auth();

    if (!session?.user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user has dashboard access
    const permissions = session.user.permissions as
      | Array<{ resource: string; action: string }>
      | undefined;
    const hasDashboardAccess = permissions?.some(
      (p) =>
        p.resource === 'dashboard' &&
        (p.action === 'read' || p.action === 'manage'),
    );

    if (!hasDashboardAccess) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    // Attach user to context
    // We cast to ensure TypeScript knows we have the id
    c.set('user', session.user as Variables['user']);
    await next();
  })

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
    zValidator(
      'param',
      z.object({
        id: z.string(),
      }),
    ),
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
    zValidator(
      'json',
      z.object({
        emailNewSubmissions: z.boolean().optional(),
        emailStatusChanges: z.boolean().optional(),
        emailSystemErrors: z.boolean().optional(),
        emailSecurityAlerts: z.boolean().optional(),
        emailUserActivity: z.boolean().optional(),
        emailBackups: z.boolean().optional(),
        digestMode: z.enum(['immediate', 'daily', 'weekly']).optional(),
      }),
    ),
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
  .post(
    '/reports',
    zValidator(
      'json',
      z.object({
        name: z.string(),
        type: z.enum(['SUBMISSIONS_SUMMARY', 'USER_ACTIVITY', 'STRATEGIC_PLANS', 'FULL_PLATFORM']),
        format: z.enum(['PDF', 'CSV']),
        parameters: z.record(z.string(), z.any()).optional(),
      }),
    ),
    async (c) => {
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

        // Simulate async generation
        (async () => {
          try {
            await db.report.update({
              where: { id: report.id },
              data: { status: 'GENERATING' },
            });

            // Simulate work delay
            await new Promise((resolve) => setTimeout(resolve, 3000));

            // Mark as completed - in a real app, this would involve S3 upload
            await db.report.update({
              where: { id: report.id },
              data: {
                status: 'COMPLETED',
                generatedAt: new Date(),
                fileUrl: `/api/admin/reports/download/${report.id}`, // Placeholder
              },
            });
          } catch (error) {
            console.error('Async report generation failed:', error);
            await db.report.update({
              where: { id: report.id },
              data: { status: 'FAILED' },
            });
          }
        })();

        return c.json({ report });
      } catch (error) {
        console.error('Error creating report:', error);
        return c.json({ error: 'Failed to create report' }, 500);
      }
    },
  )

  // DELETE /api/admin/reports/:id - Delete a report
  .delete(
    '/reports/:id',
    zValidator(
      'param',
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      try {
        const user = c.get('user');
        const { id } = c.req.valid('param');

        const report = await db.report.findFirst({
          where: { id, createdById: user.id }
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
    }
  );

export default app;