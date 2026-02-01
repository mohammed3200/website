// src/lib/notifications/admin-notifications.ts
import { db } from '@/lib/db';
import { NotificationPriority } from '../../generated/prisma/client';

export type NotificationType =
  | 'NEW_REGISTRATION'
  | 'NEW_COLLABORATOR'
  | 'NEW_INNOVATOR'
  | 'SUBMISSION_APPROVED'
  | 'SUBMISSION_REJECTED'
  | 'SYSTEM_ERROR'
  | 'SECURITY_ALERT'
  | 'USER_ACCOUNT_CREATED'
  | 'ROLE_CHANGED'
  | 'DATABASE_BACKUP_COMPLETE'
  | 'FAILED_LOGIN_ATTEMPTS';

export interface NotificationData {
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  priority?: NotificationPriority;
  data?: Record<string, unknown>;
  requiredPermission?: string; // e.g., "collaborators:manage"
}

export interface AdminNotificationPreferences {
  emailNewSubmissions?: boolean;
  emailStatusChanges?: boolean;
  emailSystemErrors?: boolean;
  emailSecurityAlerts?: boolean;
  emailUserActivity?: boolean;
  emailBackups?: boolean;
  digestMode?: 'immediate' | 'daily' | 'weekly';
}

/**
 * Get all eligible admin users based on permissions
 */
async function getEligibleAdmins(requiredPermission?: string): Promise<
  Array<{
    id: string;
    email: string;
    name: string | null;
    preferences: AdminNotificationPreferences;
  }>
> {
  // Get all active users with dashboard access
  const users = await db.user.findMany({
    where: {
      isActive: true,
      email: { not: null },
      role: {
        permissions: {
          some: {
            permission: {
              OR: [
                { resource: 'dashboard', action: 'manage' },
                { resource: 'dashboard', action: 'read' },
                ...(requiredPermission
                  ? [
                      {
                        resource: requiredPermission.split(':')[0],
                        action: requiredPermission.split(':')[1] || 'manage',
                      },
                    ]
                  : []),
              ],
            },
          },
        },
      },
    },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  return users.map((user) => ({
    id: user.id,
    email: user.email!,
    name: user.name,
    preferences:
      (user.notificationPreferences as AdminNotificationPreferences) || {},
  }));
}

/**
 * Check if admin should receive notification based on preferences
 */
function shouldNotifyAdmin(
  type: NotificationType,
  preferences: AdminNotificationPreferences,
): boolean {
  // If preferences are not set, default to true (send notifications)
  if (!preferences || Object.keys(preferences).length === 0) {
    return true;
  }

  // Check digest mode (for future implementation of batching)
  if (preferences.digestMode && preferences.digestMode !== 'immediate') {
    // For now, still send immediate notifications
    // TODO: Implement digest batching in future
  }

  // Map notification types to preference settings
  switch (type) {
    case 'NEW_REGISTRATION':
    case 'NEW_COLLABORATOR':
    case 'NEW_INNOVATOR':
      return preferences.emailNewSubmissions !== false;

    case 'SUBMISSION_APPROVED':
    case 'SUBMISSION_REJECTED':
      return preferences.emailStatusChanges !== false;

    case 'SYSTEM_ERROR':
      return preferences.emailSystemErrors !== false;

    case 'SECURITY_ALERT':
    case 'FAILED_LOGIN_ATTEMPTS':
      return preferences.emailSecurityAlerts !== false;

    case 'USER_ACCOUNT_CREATED':
    case 'ROLE_CHANGED':
      return preferences.emailUserActivity !== false;

    case 'DATABASE_BACKUP_COMPLETE':
      return preferences.emailBackups !== false;

    default:
      return true; // Default: send notification
  }
}

/**
 * Create notification in database for a specific admin
 */
async function createNotification(
  userId: string,
  notificationData: NotificationData,
): Promise<void> {
  try {
    await db.adminNotification.create({
      data: {
        userId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        actionUrl: notificationData.actionUrl,
        priority: notificationData.priority || NotificationPriority.NORMAL,
        data: (notificationData.data || {}) as Record<string, string | number | boolean | null | object>,
      },
    });
  } catch (error) {
    console.error(`Error creating notification for user ${userId}:`, error);
  }
}

/**
 * Send email notification to admin
 * TODO: Implement actual email sending once email templates are ready
 */
async function sendEmailNotification(
  admin: { email: string; name: string | null },
  notificationData: NotificationData,
): Promise<void> {
  try {
    // Import email service dynamically to avoid circular dependencies
    // Import email service dynamically to avoid circular dependencies
    const { EmailService } = await import('@/lib/email/service');
    const emailService = new EmailService();

    // TODO: Create admin notification email template
    // For now, send a simple notification
    const emailContent = `
      <h2>${notificationData.title}</h2>
      <p>${notificationData.message}</p>
      ${notificationData.actionUrl ? `<p><a href="${notificationData.actionUrl}">Take Action</a></p>` : ''}
    `;

    await emailService.sendEmail({
      to: admin.email,
      subject: `[EBIC Admin] ${notificationData.title}`,
      html: emailContent,
    });

    console.log(`✅ Email notification sent to ${admin.email}`);
  } catch (error) {
    console.error(`Error sending email notification to ${admin.email}:`, error);
  }
}

/**
 * Main function: Notify all eligible admins
 */
export async function notifyAdmins(
  notificationData: NotificationData,
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  try {
    // Get eligible admins based on permissions
    const admins = await getEligibleAdmins(notificationData.requiredPermission);

    if (admins.length === 0) {
      console.warn('No eligible admins found for notification');
      return { sent, failed };
    }

    console.log(
      `Notifying ${admins.length} admin(s) about: ${notificationData.type}`,
    );

    // Process each admin
    for (const admin of admins) {
      try {
        // Check if admin should receive this type of notification
        if (!shouldNotifyAdmin(notificationData.type, admin.preferences)) {
          console.log(
            `Skipping notification for ${admin.email} (preference disabled)`,
          );
          continue;
        }

        // Create notification in database
        await createNotification(admin.id, notificationData);

        // Send email notification
        await sendEmailNotification(admin, notificationData);

        sent++;
      } catch (error) {
        console.error(`Failed to notify admin ${admin.email}:`, error);
        failed++;
      }
    }

    console.log(
      `✅ Admin notification complete: ${sent} sent, ${failed} failed`,
    );
  } catch (error) {
    console.error('Error in notifyAdmins:', error);
    failed++;
  }

  return { sent, failed };
}

/**
 * Helper functions for specific notification types
 */

export async function notifyNewCollaborator(data: {
  id: string;
  companyName: string;
  email: string;
  sector: string;
}) {
  return notifyAdmins({
    type: 'NEW_COLLABORATOR',
    title: 'New Collaborator Registration',
    message: `A new collaborator "${data.companyName}" from ${data.sector} sector has registered.`,
    actionUrl: `/admin/collaborators?id=${data.id}`,
    priority: NotificationPriority.HIGH,
    data,
    requiredPermission: 'collaborators:manage',
  });
}

export async function notifyNewInnovator(data: {
  id: string;
  name: string;
  projectTitle: string;
  email: string;
}) {
  return notifyAdmins({
    type: 'NEW_INNOVATOR',
    title: 'New Innovator Project Submission',
    message: `${data.name} has submitted a new project: "${data.projectTitle}".`,
    actionUrl: `/admin/innovators?id=${data.id}`,
    priority: NotificationPriority.HIGH,
    data,
    requiredPermission: 'innovators:manage',
  });
}

export async function notifySystemError(data: {
  error: string;
  context?: string;
  stackTrace?: string;
}) {
  return notifyAdmins({
    type: 'SYSTEM_ERROR',
    title: '⚠️ System Error Detected',
    message: `An error occurred: ${data.error}`,
    actionUrl: '/admin/system/logs',
    priority: NotificationPriority.URGENT,
    data,
  });
}

export async function notifySecurityAlert(data: {
  alert: string;
  userId?: string;
  ipAddress?: string;
}) {
  return notifyAdmins({
    type: 'SECURITY_ALERT',
    title: '🔒 Security Alert',
    message: data.alert,
    actionUrl: '/admin/security/alerts',
    priority: NotificationPriority.URGENT,
    data,
  });
}

export async function notifyFailedLoginAttempts(data: {
  email: string;
  attempts: number;
  ipAddress?: string;
}) {
  return notifyAdmins({
    type: 'FAILED_LOGIN_ATTEMPTS',
    title: '🚨 Multiple Failed Login Attempts',
    message: `${data.attempts} failed login attempts detected for ${data.email}`,
    actionUrl: '/admin/security/logins',
    priority: NotificationPriority.HIGH,
    data,
  });
}
