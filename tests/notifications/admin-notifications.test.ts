// tests/notifications/admin-notifications.test.ts
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import {
  notifyAdmins,
  notifyNewCollaborator,
  notifyNewInnovator,
  notifySystemError,
  notifySecurityAlert,
  notifyFailedLoginAttempts,
} from '@/lib/notifications/admin-notifications';
import { db } from '@/lib/db';
import { NotificationPriority } from '../../src/generated/prisma/client';

// Mock the database
jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findMany: jest.fn(),
    },
    adminNotification: {
      create: jest.fn(),
    },
  },
}));

// Mock the email service
jest.mock('@/lib/email/service', () => ({
  default: jest.fn().mockImplementation(() => ({
    sendEmail: (jest.fn() as any).mockResolvedValue({
      success: true,
      messageId: 'test-message-id',
    } as any),
  })),
}));

describe('Admin Notifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('notifyAdmins', () => {
    it('should send notifications to eligible admins', async () => {
      // Mock admin users
      const mockAdmins = [
        {
          id: 'admin-1',
          name: 'Admin One',
          email: 'admin1@test.com',
          isActive: true,
          notificationPreferences: null,
          role: {
            permissions: [
              {
                permission: {
                  resource: 'dashboard',
                  action: 'manage',
                },
              },
            ],
          },
        },
        {
          id: 'admin-2',
          name: 'Admin Two',
          email: 'admin2@test.com',
          isActive: true,
          notificationPreferences: null,
          role: {
            permissions: [
              {
                permission: {
                  resource: 'dashboard',
                  action: 'read',
                },
              },
            ],
          },
        },
      ];

      (db.user.findMany as any).mockResolvedValue(mockAdmins);
      (db.adminNotification.create as any).mockResolvedValue({
        id: 'notification-1',
      });

      const result = await notifyAdmins({
        type: 'NEW_REGISTRATION',
        title: 'New Registration',
        message: 'A new user has registered',
        priority: NotificationPriority.HIGH,
      });

      expect(result.sent).toBe(2);
      expect(result.failed).toBe(0);
      expect(db.user.findMany).toHaveBeenCalled();
      expect(db.adminNotification.create).toHaveBeenCalledTimes(2);
    });

    it('should respect admin notification preferences', async () => {
      const mockAdmin = [
        {
          id: 'admin-1',
          name: 'Admin One',
          email: 'admin1@test.com',
          isActive: true,
          notificationPreferences: {
            emailNewSubmissions: false, // Disabled
          },
          role: {
            permissions: [
              {
                permission: {
                  resource: 'dashboard',
                  action: 'manage',
                },
              },
            ],
          },
        },
      ];

      (db.user.findMany as any).mockResolvedValue(mockAdmin);

      const result = await notifyAdmins({
        type: 'NEW_COLLABORATOR',
        title: 'New Collaborator',
        message: 'A new collaborator registered',
      });

      // Should skip because preference is disabled
      expect(result.sent).toBe(0);
      expect(db.adminNotification.create).not.toHaveBeenCalled();
    });

    it('should handle permission-based filtering', async () => {
      const mockAdmins = [
        {
          id: 'admin-1',
          name: 'Admin One',
          email: 'admin1@test.com',
          isActive: true,
          notificationPreferences: null,
          role: {
            permissions: [
              {
                permission: {
                  resource: 'collaborators',
                  action: 'manage',
                },
              },
            ],
          },
        },
      ];

      (db.user.findMany as any).mockResolvedValue(mockAdmins);
      (db.adminNotification.create as any).mockResolvedValue({
        id: 'notification-1',
      });

      const result = await notifyAdmins({
        type: 'NEW_COLLABORATOR',
        title: 'New Collaborator',
        message: 'Test message',
        requiredPermission: 'collaborators:manage',
      });

      expect(result.sent).toBe(1);
      expect(db.user.findMany).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      (db.user.findMany as any).mockRejectedValue(
        new Error('Database error'),
      );

      const result = await notifyAdmins({
        type: 'SYSTEM_ERROR',
        title: 'Error',
        message: 'Test error',
      });

      expect(result.sent).toBe(0);
      expect(result.failed).toBeGreaterThan(0);
    });

    it('should return early if no admins found', async () => {
      (db.user.findMany as any).mockResolvedValue([]);

      const result = await notifyAdmins({
        type: 'NEW_REGISTRATION',
        title: 'Test',
        message: 'Test message',
      });

      expect(result.sent).toBe(0);
      expect(result.failed).toBe(0);
      expect(db.adminNotification.create).not.toHaveBeenCalled();
    });
  });

  describe('notifyNewCollaborator', () => {
    it('should create notification with correct data', async () => {
      const mockAdmin = [
        {
          id: 'admin-1',
          name: 'Admin',
          email: 'admin@test.com',
          isActive: true,
          notificationPreferences: null,
          role: {
            permissions: [
              {
                permission: {
                  resource: 'collaborators',
                  action: 'manage',
                },
              },
            ],
          },
        },
      ];

      (db.user.findMany as any).mockResolvedValue(mockAdmin);
      (db.adminNotification.create as any).mockResolvedValue({
        id: 'notification-1',
      });

      const collaboratorData = {
        id: 'collab-1',
        companyName: 'Test Company',
        email: 'company@test.com',
        sector: 'Technology',
      };

      const result = await notifyNewCollaborator(collaboratorData);

      expect(result.sent).toBe(1);
      expect(db.adminNotification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'admin-1',
          type: 'NEW_COLLABORATOR',
          title: 'New Collaborator Registration',
          message: expect.stringContaining('Test Company'),
          priority: NotificationPriority.HIGH,
          actionUrl: '/admin/collaborators?id=collab-1',
        }),
      });
    });
  });

  describe('notifyNewInnovator', () => {
    it('should create notification with correct data', async () => {
      const mockAdmin = [
        {
          id: 'admin-1',
          name: 'Admin',
          email: 'admin@test.com',
          isActive: true,
          notificationPreferences: null,
          role: {
            permissions: [
              {
                permission: {
                  resource: 'innovators',
                  action: 'manage',
                },
              },
            ],
          },
        },
      ];

      (db.user.findMany as any).mockResolvedValue(mockAdmin);
      (db.adminNotification.create as any).mockResolvedValue({
        id: 'notification-1',
      });

      const innovatorData = {
        id: 'innov-1',
        name: 'John Doe',
        projectTitle: 'Amazing Innovation',
        email: 'john@test.com',
      };

      const result = await notifyNewInnovator(innovatorData);

      expect(result.sent).toBe(1);
      expect(db.adminNotification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: 'NEW_INNOVATOR',
          title: 'New Innovator Project Submission',
          message: expect.stringContaining('John Doe'),
          priority: NotificationPriority.HIGH,
        }),
      });
    });
  });

  describe('notifySystemError', () => {
    it('should create urgent notification for system errors', async () => {
      const mockAdmin = [
        {
          id: 'admin-1',
          name: 'Admin',
          email: 'admin@test.com',
          isActive: true,
          notificationPreferences: null,
          role: {
            permissions: [
              {
                permission: {
                  resource: 'dashboard',
                  action: 'manage',
                },
              },
            ],
          },
        },
      ];

      (db.user.findMany as any).mockResolvedValue(mockAdmin);
      (db.adminNotification.create as any).mockResolvedValue({
        id: 'notification-1',
      });

      const errorData = {
        error: 'Database connection failed',
        context: 'user-service',
        stackTrace: 'Error at line 123...',
      };

      const result = await notifySystemError(errorData);

      expect(result.sent).toBe(1);
      expect(db.adminNotification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: 'SYSTEM_ERROR',
          priority: NotificationPriority.URGENT,
          message: expect.stringContaining('Database connection failed'),
        }),
      });
    });
  });

  describe('notifySecurityAlert', () => {
    it('should create urgent notification for security alerts', async () => {
      const mockAdmin = [
        {
          id: 'admin-1',
          name: 'Admin',
          email: 'admin@test.com',
          isActive: true,
          notificationPreferences: null,
          role: {
            permissions: [
              {
                permission: {
                  resource: 'dashboard',
                  action: 'manage',
                },
              },
            ],
          },
        },
      ];

      (db.user.findMany as any).mockResolvedValue(mockAdmin);
      (db.adminNotification.create as any).mockResolvedValue({
        id: 'notification-1',
      });

      const alertData = {
        alert: 'Suspicious activity detected',
        userId: 'user-123',
        ipAddress: '192.168.1.1',
      };

      const result = await notifySecurityAlert(alertData);

      expect(result.sent).toBe(1);
      expect(db.adminNotification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: 'SECURITY_ALERT',
          title: '🔒 Security Alert',
          priority: NotificationPriority.URGENT,
        }),
      });
    });
  });

  describe('notifyFailedLoginAttempts', () => {
    it('should create high priority notification for failed logins', async () => {
      const mockAdmin = [
        {
          id: 'admin-1',
          name: 'Admin',
          email: 'admin@test.com',
          isActive: true,
          notificationPreferences: null,
          role: {
            permissions: [
              {
                permission: {
                  resource: 'dashboard',
                  action: 'manage',
                },
              },
            ],
          },
        },
      ];

      (db.user.findMany as any).mockResolvedValue(mockAdmin);
      (db.adminNotification.create as any).mockResolvedValue({
        id: 'notification-1',
      });

      const loginData = {
        email: 'user@test.com',
        attempts: 5,
        ipAddress: '192.168.1.100',
      };

      const result = await notifyFailedLoginAttempts(loginData);

      expect(result.sent).toBe(1);
      expect(db.adminNotification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: 'FAILED_LOGIN_ATTEMPTS',
          title: '🚨 Multiple Failed Login Attempts',
          priority: NotificationPriority.HIGH,
          message: expect.stringContaining('5 failed login attempts'),
        }),
      });
    });
  });

  describe('Notification Preferences', () => {
    it('should skip notifications when emailSystemErrors is false', async () => {
      const mockAdmin = [
        {
          id: 'admin-1',
          name: 'Admin',
          email: 'admin@test.com',
          isActive: true,
          notificationPreferences: {
            emailSystemErrors: false,
          },
          role: {
            permissions: [
              {
                permission: {
                  resource: 'dashboard',
                  action: 'manage',
                },
              },
            ],
          },
        },
      ];

      (db.user.findMany as any).mockResolvedValue(mockAdmin);

      const result = await notifySystemError({
        error: 'Test error',
      });

      expect(result.sent).toBe(0);
      expect(db.adminNotification.create).not.toHaveBeenCalled();
    });

    it('should send notifications when emailSecurityAlerts is true', async () => {
      const mockAdmin = [
        {
          id: 'admin-1',
          name: 'Admin',
          email: 'admin@test.com',
          isActive: true,
          notificationPreferences: {
            emailSecurityAlerts: true,
          },
          role: {
            permissions: [
              {
                permission: {
                  resource: 'dashboard',
                  action: 'manage',
                },
              },
            ],
          },
        },
      ];

      (db.user.findMany as any).mockResolvedValue(mockAdmin);
      (db.adminNotification.create as any).mockResolvedValue({
        id: 'notification-1',
      });

      const result = await notifySecurityAlert({
        alert: 'Test alert',
      });

      expect(result.sent).toBe(1);
      expect(db.adminNotification.create).toHaveBeenCalled();
    });

    it('should send all notifications when preferences are not set', async () => {
      const mockAdmin = [
        {
          id: 'admin-1',
          name: 'Admin',
          email: 'admin@test.com',
          isActive: true,
          notificationPreferences: null,
          role: {
            permissions: [
              {
                permission: {
                  resource: 'dashboard',
                  action: 'manage',
                },
              },
            ],
          },
        },
      ];

      (db.user.findMany as any).mockResolvedValue(mockAdmin);
      (db.adminNotification.create as any).mockResolvedValue({
        id: 'notification-1',
      });

      // Test multiple notification types
      await notifySystemError({ error: 'Test' });
      await notifySecurityAlert({ alert: 'Test' });
      await notifyNewCollaborator({
        id: '1',
        companyName: 'Test',
        email: 'test@test.com',
        sector: 'Tech',
      });

      expect(db.adminNotification.create).toHaveBeenCalledTimes(3);
    });
  });

  describe('Priority Levels', () => {
    it('should set URGENT priority for system errors', async () => {
      const mockAdmin = [
        {
          id: 'admin-1',
          name: 'Admin',
          email: 'admin@test.com',
          isActive: true,
          notificationPreferences: null,
          role: {
            permissions: [
              {
                permission: {
                  resource: 'dashboard',
                  action: 'manage',
                },
              },
            ],
          },
        },
      ];

      (db.user.findMany as any).mockResolvedValue(mockAdmin);
      (db.adminNotification.create as any).mockResolvedValue({
        id: 'notification-1',
      });

      await notifySystemError({ error: 'Critical error' });

      expect(db.adminNotification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          priority: NotificationPriority.URGENT,
        }),
      });
    });

    it('should set HIGH priority for new submissions', async () => {
      const mockAdmin = [
        {
          id: 'admin-1',
          name: 'Admin',
          email: 'admin@test.com',
          isActive: true,
          notificationPreferences: null,
          role: {
            permissions: [
              {
                permission: {
                  resource: 'collaborators',
                  action: 'manage',
                },
              },
            ],
          },
        },
      ];

      (db.user.findMany as any).mockResolvedValue(mockAdmin);
      (db.adminNotification.create as any).mockResolvedValue({
        id: 'notification-1',
      });

      await notifyNewCollaborator({
        id: '1',
        companyName: 'Test',
        email: 'test@test.com',
        sector: 'Tech',
      });

      expect(db.adminNotification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          priority: NotificationPriority.HIGH,
        }),
      });
    });
  });
});
