import { z } from 'zod';

export const notificationIdParamSchema = z.object({
  id: z.string(),
});

export const updateNotificationPreferencesSchema = z.object({
  emailNewSubmissions: z.boolean().optional(),
  emailStatusChanges: z.boolean().optional(),
  emailSystemErrors: z.boolean().optional(),
  emailSecurityAlerts: z.boolean().optional(),
  emailUserActivity: z.boolean().optional(),
  emailBackups: z.boolean().optional(),
  digestMode: z.enum(['immediate', 'daily', 'weekly']).optional(),
});
