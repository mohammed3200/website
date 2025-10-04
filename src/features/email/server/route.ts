import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '@/lib/db';
import { emailService } from '@/lib/email/service';
import { emailQueueHelpers } from '@/lib/email/queue';
import { EmailStatus, QueueStatus, RecordStatus } from '@prisma/client';

// Validation schemas
const testEmailSchema = z.object({
  testEmail: z.string().email('Invalid email address'),
});

const statusUpdateSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
  status: z.enum(['approved', 'rejected']),
  reason: z.string().optional(),
  type: z.enum(['collaborator', 'innovator']),
});

const monitorQuerySchema = z.object({
  days: z.string().regex(/^\d+$/).transform(Number).optional().default('7'),
});

const monitorActionSchema = z.object({
  action: z.enum(['retry-failed', 'clear-errors', 'pause-queue', 'resume-queue']),
  emailId: z.string().uuid().optional(),
});

// Helper functions
async function getHourlyStats(startDate: Date) {
  const stats = await db.$queryRaw`
    SELECT 
      DATE_FORMAT(createdAt, '%Y-%m-%d %H:00:00') as hour,
      COUNT(*) as total,
      SUM(CASE WHEN status = ${EmailStatus.SENT} THEN 1 ELSE 0 END) as sent,
      SUM(CASE WHEN status = ${EmailStatus.FAILED} THEN 1 ELSE 0 END) as failed
    FROM EmailLog
    WHERE createdAt >= ${startDate}
    GROUP BY hour
    ORDER BY hour DESC
    LIMIT 24
  ` as Array<{
    hour: string;
    total: bigint;
    sent: bigint;
    failed: bigint;
  }>;

  return stats.map(stat => ({
    hour: stat.hour,
    total: Number(stat.total),
    sent: Number(stat.sent),
    failed: Number(stat.failed)
  }));
}

async function getAverageProcessingTime(startDate: Date): Promise<number> {
  const processedEmails = await db.emailQueue.findMany({
    where: {
      status: QueueStatus.COMPLETED,
      processedAt: { not: null },
      createdAt: { gte: startDate }
    },
    select: {
      createdAt: true,
      processedAt: true
    }
  });

  if (processedEmails.length === 0) return 0;

  const totalTime = processedEmails.reduce((sum, email) => {
    if (email.processedAt) {
      return sum + (email.processedAt.getTime() - email.createdAt.getTime());
    }
    return sum;
  }, 0);

  return Math.round(totalTime / processedEmails.length);
}

async function getProviderInfo() {
  const provider = process.env.EMAIL_PROVIDER || 'gmail';
  const limits = {
    gmail: { daily: 500, hourly: 50 },
    outlook: { daily: 300, hourly: 30 },
    yahoo: { daily: 100, hourly: 10 },
    smtp: { daily: 1000, hourly: 100 },
    resend: { daily: 100, hourly: 10 },
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const sentToday = await db.emailLog.count({
    where: {
      status: EmailStatus.SENT,
      createdAt: { gte: today }
    }
  });

  const lastHour = new Date();
  lastHour.setHours(lastHour.getHours() - 1);
  
  const sentLastHour = await db.emailLog.count({
    where: {
      status: EmailStatus.SENT,
      createdAt: { gte: lastHour }
    }
  });

  const providerLimits = limits[provider as keyof typeof limits] || limits.smtp;

  return {
    provider,
    limits: providerLimits,
    usage: {
      daily: {
        used: sentToday,
        limit: providerLimits.daily,
        percentage: ((sentToday / providerLimits.daily) * 100).toFixed(2)
      },
      hourly: {
        used: sentLastHour,
        limit: providerLimits.hourly,
        percentage: ((sentLastHour / providerLimits.hourly) * 100).toFixed(2)
      }
    },
    status: sentToday >= providerLimits.daily * 0.9 ? 'warning' : 'healthy'
  };
}

async function checkSystemHealth() {
  const checks = {
    database: false,
    emailProvider: false,
    queue: false,
    redis: false
  };

  try {
    await db.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  try {
    const testResult = await emailService.testConnection();
    checks.emailProvider = testResult.success;
  } catch (error) {
    console.error('Email provider health check failed:', error);
  }

  try {
    const queueStats = await emailQueueHelpers.getQueueStats();
    checks.queue = !queueStats.isPaused;
  } catch (error) {
    console.error('Queue health check failed:', error);
  }

  checks.redis = !!process.env.REDIS_HOST;

  const allHealthy = Object.values(checks).every(check => check === true);
  
  return {
    status: allHealthy ? 'healthy' : 'degraded',
    checks,
    lastChecked: new Date().toISOString()
  };
}

// Create Hono app
const app = new Hono()
  // Test email endpoint
  .post('/test', 
    zValidator('json', testEmailSchema),
    async (c) => {
      const { testEmail } = c.req.valid('json');

      try {
        const testResult = await emailService.testConnection();
        
        if (!testResult.success) {
          return c.json({
            success: false,
            message: 'Email connection test failed',
            error: testResult.error,
            provider: testResult.provider
          }, 500);
        }

        // Send test email
        const result = await emailService.sendEmail('custom', {
          to: testEmail,
          subject: 'Email System Test - CIT.EDU.LY',
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #10b981;">Email System Test Successful!</h1>
              <p>This test email confirms that your email system is working correctly.</p>
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3>Configuration Details:</h3>
                <ul>
                  <li><strong>Provider:</strong> ${process.env.EMAIL_PROVIDER}</li>
                  <li><strong>SMTP Host:</strong> ${process.env.SMTP_HOST}</li>
                  <li><strong>From:</strong> ${process.env.EMAIL_FROM}</li>
                  <li><strong>Test Time:</strong> ${new Date().toLocaleString()}</li>
                </ul>
              </div>
              <p style="color: #6b7280; font-size: 14px;">
                Sent from: Misurata Entrepreneurship Center Platform
              </p>
            </div>
          `,
          locale: 'en'
        });

        return c.json({
          success: result.success,
          message: result.success ? 'Test email sent successfully!' : 'Failed to send test email',
          messageId: result.messageId,
          error: result.error
        }, result.success ? 200 : 500);
      } catch (error) {
        console.error('Test email error:', error);
        return c.json({
          success: false,
          message: 'Failed to send test email',
          error: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
      }
    }
  )
  // Email monitoring endpoint
  .get('/monitor',
    zValidator('query', monitorQuerySchema),
    async (c) => {
      try {
        const { days } = c.req.valid('query');
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Fetch all statistics in parallel
        const [
          totalEmails,
          sentEmails,
          failedEmails,
          pendingEmails,
          emailsByTemplate,
          recentErrors,
          queueStats,
          hourlyStats,
          providerInfo
        ] = await Promise.all([
          db.emailLog.count({ where: { createdAt: { gte: startDate } } }),
          db.emailLog.count({ where: { status: EmailStatus.SENT, createdAt: { gte: startDate } } }),
          db.emailLog.count({ where: { status: EmailStatus.FAILED, createdAt: { gte: startDate } } }),
          db.emailLog.count({ where: { status: EmailStatus.PENDING, createdAt: { gte: startDate } } }),
          db.emailLog.groupBy({
            by: ['template'],
            where: { createdAt: { gte: startDate } },
            _count: { template: true }
          }),
          db.emailLog.findMany({
            where: { status: EmailStatus.FAILED, createdAt: { gte: startDate } },
            select: {
              id: true,
              to: true,
              subject: true,
              errorMessage: true,
              createdAt: true,
              template: true
            },
            orderBy: { createdAt: 'desc' },
            take: 10
          }),
          emailQueueHelpers.getQueueStats(),
          getHourlyStats(startDate),
          getProviderInfo()
        ]);

        const successRate = totalEmails > 0 
          ? ((sentEmails / totalEmails) * 100).toFixed(2)
          : 0;

        const avgProcessingTime = await getAverageProcessingTime(startDate);
        const systemHealth = await checkSystemHealth();

        return c.json({
          overview: {
            totalEmails,
            sentEmails,
            failedEmails,
            pendingEmails,
            successRate: `${successRate}%`,
            avgProcessingTime: `${avgProcessingTime}ms`,
            period: `Last ${days} days`
          },
          emailsByTemplate: emailsByTemplate.map(item => ({
            template: item.template,
            count: item._count.template
          })),
          queueStats,
          recentErrors: recentErrors.map(error => ({
            ...error,
            errorMessage: error.errorMessage ? error.errorMessage.substring(0, 100) + '...' : null
          })),
          hourlyStats,
          providerInfo,
          systemHealth,
          timestamp: new Date().toISOString()
        }, 200);
      } catch (error) {
        console.error('Email monitoring error:', error);
        return c.json({
          error: 'Failed to fetch email statistics',
          message: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
      }
    }
  )
  // Email monitoring actions
  .post('/monitor/action',
    zValidator('json', monitorActionSchema),
    async (c) => {
      const { action, emailId } = c.req.valid('json');

      try {
        switch (action) {
          case 'retry-failed':
            const failedEmails = await db.emailLog.findMany({
              where: {
                status: EmailStatus.FAILED,
                createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
              },
              take: 10
            });

            let retriedCount = 0;
            for (const email of failedEmails) {
              try {
                await emailQueueHelpers.addEmail(
                  email.template as any,
                  email.metadata as any,
                  { priority: 5, attempts: 2 }
                );
                retriedCount++;
              } catch (error) {
                console.error(`Failed to retry email ${email.id}:`, error);
              }
            }

            return c.json({ 
              success: true, 
              message: `Retried ${retriedCount} failed emails` 
            }, 200);

          case 'clear-errors':
            const deleted = await db.emailLog.deleteMany({
              where: {
                status: EmailStatus.FAILED,
                createdAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
              }
            });

            return c.json({ 
              success: true, 
              message: `Cleared ${deleted.count} old error logs` 
            }, 200);

          case 'pause-queue':
            await emailQueueHelpers.pauseQueue();
            return c.json({ 
              success: true, 
              message: 'Email queue paused' 
            }, 200);

          case 'resume-queue':
            await emailQueueHelpers.resumeQueue();
            return c.json({ 
              success: true, 
              message: 'Email queue resumed' 
            }, 200);

          default:
            return c.json({ error: 'Invalid action' }, 400);
        }
      } catch (error) {
        console.error('Email monitoring action error:', error);
        return c.json({
          error: 'Failed to perform action',
          message: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
      }
    }
  )
  // Update collaborator/innovator status with email notification
  .patch('/status',
    zValidator('json', statusUpdateSchema),
    async (c) => {
      const { id, status, reason, type } = c.req.valid('json');

      try {
        // Determine the model based on type
        const model = type === 'collaborator' ? db.collaborator : db.innovator;
        
        // Get the current record
        const record = await model.findUnique({
          where: { id }
        });

        if (!record) {
          return c.json({
            error: 'Record not found',
            code: 'NOT_FOUND'
          }, 404);
        }

        // Update status
        const updatedStatus = status === 'approved' ? RecordStatus.APPROVED : RecordStatus.REJECTED;
        const updateData = {
          status: updatedStatus,
          ...(status === 'approved' && { isVisible: true })
        };

        const updated = await model.update({
          where: { id },
          data: updateData
        });

        // Send status update email
        const recipientName = type === 'collaborator' 
          ? (record as any).companyName 
          : (record as any).name;

        await emailService.sendStatusUpdate(
          type,
          {
            id: record.id,
            name: type === 'innovator' ? (record as any).name : undefined,
            companyName: type === 'collaborator' ? (record as any).companyName : undefined,
            email: record.email
          },
          status,
          {
            reason,
            nextSteps: status === 'approved' 
              ? ['Your submission is now visible on our platform', 'You will be contacted for further steps']
              : ['You can submit a new application with improved details', 'Contact support for assistance'],
            locale: 'en'
          }
        );

        return c.json({
          success: true,
          message: `${type} status updated to ${status}`,
          data: updated
        }, 200);
      } catch (error) {
        console.error('Status update error:', error);
        return c.json({
          error: 'Failed to update status',
          message: error instanceof Error ? error.message : 'Unknown error'
        }, 500);
      }
    }
  );

export default app;
