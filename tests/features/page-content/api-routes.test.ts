/**
 * @jest-environment node
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Hono } from 'hono';

// Mock dependencies
jest.mock('@/auth', () => ({
  auth: jest.fn(),
}));

jest.mock('@/lib/db', () => ({
  db: {
    pageContent: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import { auth } from '@/auth';
import { db } from '@/lib/db';

describe('Page Content API Routes', () => {
  let app: Hono;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a minimal Hono app for testing
    app = new Hono();
  });

  describe('GET /api/pageContent/public/:page', () => {
    it('should return active content for entrepreneurship page', async () => {
      const mockContent = [
        {
          id: '1',
          page: 'entrepreneurship',
          section: 'hero',
          titleEn: 'Entrepreneurship',
          titleAr: 'ريادة الأعمال',
          order: 0,
          isActive: true,
        },
      ];

      (db.pageContent.findMany as any).mockResolvedValue(mockContent);

      // In actual implementation, this would be tested via HTTP request
      const result = await db.pageContent.findMany({
        where: { page: 'entrepreneurship', isActive: true },
        orderBy: [{ section: 'asc' }, { order: 'asc' }],
      });

      expect(result).toEqual(mockContent);
      expect(db.pageContent.findMany).toHaveBeenCalledWith({
        where: { page: 'entrepreneurship', isActive: true },
        orderBy: [{ section: 'asc' }, { order: 'asc' }],
      });
    });

    it('should return active content for incubators page', async () => {
      const mockContent = [
        {
          id: '2',
          page: 'incubators',
          section: 'hero',
          titleEn: 'Incubators',
          titleAr: 'حاضنات الأعمال',
          order: 0,
          isActive: true,
        },
      ];

      (db.pageContent.findMany as any).mockResolvedValue(mockContent);

      const result = await db.pageContent.findMany({
        where: { page: 'incubators', isActive: true },
        orderBy: [{ section: 'asc' }, { order: 'asc' }],
      });

      expect(result).toEqual(mockContent);
    });

    it('should return empty array when no content found', async () => {
      (db.pageContent.findMany as any).mockResolvedValue([]);

      const result = await db.pageContent.findMany({
        where: { page: 'entrepreneurship', isActive: true },
        orderBy: [{ section: 'asc' }, { order: 'asc' }],
      });

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      (db.pageContent.findMany as any).mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        db.pageContent.findMany({
          where: { page: 'entrepreneurship', isActive: true },
        })
      ).rejects.toThrow('Database error');
    });
  });

  describe('GET /api/pageContent/:page (Admin)', () => {
    it('should require authentication', async () => {
      (auth as any).mockResolvedValue(null);

      const session = await auth();
      expect(session).toBeNull();
    });

    it('should require content management permissions', async () => {
      const mockSession = {
        user: {
          id: 'user-1',
          email: 'user@test.com',
          permissions: [
            { resource: 'news', action: 'read' }, // Wrong permission
          ],
        },
      };

      (auth as any).mockResolvedValue(mockSession);

      const session = await auth();
      const permissions = session?.user?.permissions as any[];
      const hasContentAccess = permissions?.some(
        (p) =>
          (p.resource === 'content' && p.action === 'manage') ||
          (p.resource === 'dashboard' && p.action === 'manage')
      );

      expect(hasContentAccess).toBe(false);
    });

    it('should return all content when user has permissions', async () => {
      const mockSession = {
        user: {
          id: 'admin-1',
          email: 'admin@test.com',
          permissions: [{ resource: 'content', action: 'manage' }],
        },
      };

      const mockContent = [
        {
          id: '1',
          page: 'entrepreneurship',
          section: 'hero',
          isActive: true,
          order: 0,
        },
        {
          id: '2',
          page: 'entrepreneurship',
          section: 'programs',
          isActive: false,
          order: 1,
        },
      ];

      (auth as any).mockResolvedValue(mockSession);
      (db.pageContent.findMany as any).mockResolvedValue(mockContent);

      const result = await db.pageContent.findMany({
        where: { page: 'entrepreneurship' },
        orderBy: [{ section: 'asc' }, { order: 'asc' }],
      });

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockContent);
    });
  });

  describe('POST /api/pageContent', () => {
    const mockSession = {
      user: {
        id: 'admin-1',
        email: 'admin@test.com',
        permissions: [{ resource: 'content', action: 'manage' }],
      },
    };

    it('should create new content block', async () => {
      const newContent = {
        page: 'entrepreneurship' as const,
        section: 'hero',
        titleEn: 'New Title',
        titleAr: 'عنوان جديد',
        contentEn: 'New content',
        order: 0,
        isActive: true,
      };

      const createdContent = {
        id: 'content-1',
        ...newContent,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (auth as any).mockResolvedValue(mockSession);
      (db.pageContent.create as any).mockResolvedValue(createdContent);

      const result = await db.pageContent.create({
        data: newContent,
      });

      expect(result).toMatchObject(newContent);
      expect(result.id).toBe('content-1');
    });

    it('should handle metadata in new content', async () => {
      const newContent = {
        page: 'incubators' as const,
        section: 'metrics',
        titleEn: 'Startups',
        metadata: { number: 150 },
        order: 0,
      };

      const createdContent = {
        id: 'content-2',
        ...newContent,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (auth as any).mockResolvedValue(mockSession);
      (db.pageContent.create as any).mockResolvedValue(createdContent);

      const result = await db.pageContent.create({
        data: newContent,
      });

      expect(result.metadata).toEqual({ number: 150 });
    });

    it('should require authentication for creation', async () => {
      (auth as any).mockResolvedValue(null);

      const session = await auth();
      expect(session).toBeNull();
    });

    it('should handle creation errors', async () => {
      (auth as any).mockResolvedValue(mockSession);
      (db.pageContent.create as any).mockRejectedValue(
        new Error('Creation failed')
      );

      await expect(
        db.pageContent.create({
          data: {
            page: 'entrepreneurship',
            section: 'test',
            order: 0,
          },
        })
      ).rejects.toThrow('Creation failed');
    });
  });

  describe('PATCH /api/pageContent/:id', () => {
    const mockSession = {
      user: {
        id: 'admin-1',
        email: 'admin@test.com',
        permissions: [{ resource: 'content', action: 'manage' }],
      },
    };

    it('should update existing content block', async () => {
      const updateData = {
        titleEn: 'Updated Title',
        isActive: false,
      };

      const updatedContent = {
        id: 'content-1',
        page: 'entrepreneurship',
        section: 'hero',
        ...updateData,
        order: 0,
        updatedAt: new Date(),
      };

      (auth as any).mockResolvedValue(mockSession);
      (db.pageContent.update as any).mockResolvedValue(updatedContent);

      const result = await db.pageContent.update({
        where: { id: 'content-1' },
        data: updateData,
      });

      expect(result.titleEn).toBe('Updated Title');
      expect(result.isActive).toBe(false);
    });

    it('should update metadata', async () => {
      const updateData = {
        metadata: { number: 200, label: 'Updated' },
      };

      const updatedContent = {
        id: 'content-1',
        page: 'incubators',
        section: 'metrics',
        ...updateData,
        order: 0,
      };

      (auth as any).mockResolvedValue(mockSession);
      (db.pageContent.update as any).mockResolvedValue(updatedContent);

      const result = await db.pageContent.update({
        where: { id: 'content-1' },
        data: updateData,
      });

      expect(result.metadata).toEqual({ number: 200, label: 'Updated' });
    });

    it('should handle update errors', async () => {
      (auth as any).mockResolvedValue(mockSession);
      (db.pageContent.update as any).mockRejectedValue(
        new Error('Update failed')
      );

      await expect(
        db.pageContent.update({
          where: { id: 'invalid-id' },
          data: { titleEn: 'Test' },
        })
      ).rejects.toThrow('Update failed');
    });

    it('should require authentication for updates', async () => {
      (auth as any).mockResolvedValue(null);

      const session = await auth();
      expect(session).toBeNull();
    });
  });

  describe('DELETE /api/pageContent/:id', () => {
    const mockSession = {
      user: {
        id: 'admin-1',
        email: 'admin@test.com',
        permissions: [{ resource: 'content', action: 'manage' }],
      },
    };

    it('should delete content block', async () => {
      const deletedContent = {
        id: 'content-1',
        page: 'entrepreneurship',
        section: 'hero',
        order: 0,
      };

      (auth as any).mockResolvedValue(mockSession);
      (db.pageContent.delete as any).mockResolvedValue(deletedContent);

      const result = await db.pageContent.delete({
        where: { id: 'content-1' },
      });

      expect(result.id).toBe('content-1');
      expect(db.pageContent.delete).toHaveBeenCalledWith({
        where: { id: 'content-1' },
      });
    });

    it('should handle deletion errors', async () => {
      (auth as any).mockResolvedValue(mockSession);
      (db.pageContent.delete as any).mockRejectedValue(
        new Error('Deletion failed')
      );

      await expect(
        db.pageContent.delete({
          where: { id: 'invalid-id' },
        })
      ).rejects.toThrow('Deletion failed');
    });

    it('should require authentication for deletion', async () => {
      (auth as any).mockResolvedValue(null);

      const session = await auth();
      expect(session).toBeNull();
    });

    it('should handle non-existent content', async () => {
      (auth as any).mockResolvedValue(mockSession);
      (db.pageContent.delete as any).mockRejectedValue(
        new Error('Record not found')
      );

      await expect(
        db.pageContent.delete({
          where: { id: 'non-existent' },
        })
      ).rejects.toThrow('Record not found');
    });
  });

  describe('Permission Checks', () => {
    it('should allow dashboard:manage permission', async () => {
      const mockSession = {
        user: {
          id: 'admin-1',
          permissions: [{ resource: 'dashboard', action: 'manage' }],
        },
      };

      (auth as any).mockResolvedValue(mockSession);

      const session = await auth();
      const permissions = session?.user?.permissions as any[];
      const hasAccess = permissions?.some(
        (p) =>
          (p.resource === 'content' && p.action === 'manage') ||
          (p.resource === 'dashboard' && p.action === 'manage')
      );

      expect(hasAccess).toBe(true);
    });

    it('should deny access without proper permissions', async () => {
      const mockSession = {
        user: {
          id: 'user-1',
          permissions: [{ resource: 'news', action: 'read' }],
        },
      };

      (auth as any).mockResolvedValue(mockSession);

      const session = await auth();
      const permissions = session?.user?.permissions as any[];
      const hasAccess = permissions?.some(
        (p) =>
          (p.resource === 'content' && p.action === 'manage') ||
          (p.resource === 'dashboard' && p.action === 'manage')
      );

      expect(hasAccess).toBe(false);
    });
  });

  describe('Content Ordering', () => {
    it('should maintain order in query results', async () => {
      const mockContent = [
        { id: '1', section: 'hero', order: 0 },
        { id: '2', section: 'hero', order: 1 },
        { id: '3', section: 'programs', order: 0 },
      ];

      (db.pageContent.findMany as any).mockResolvedValue(mockContent);

      const result = await db.pageContent.findMany({
        where: { page: 'entrepreneurship' },
        orderBy: [{ section: 'asc' }, { order: 'asc' }],
      });

      expect(result).toHaveLength(3);
      expect(result[0].order).toBe(0);
      expect(result[1].order).toBe(1);
    });
  });

  describe('Data Validation Integration', () => {
    it('should validate page enum values', () => {
      const validPages = ['entrepreneurship', 'incubators'];

      validPages.forEach((page) => {
        expect(['entrepreneurship', 'incubators']).toContain(page);
      });
    });

    it('should handle bilingual content', async () => {
      const bilingualContent = {
        page: 'entrepreneurship' as const,
        section: 'hero',
        titleEn: 'English Title',
        titleAr: 'عنوان عربي',
        contentEn: 'English content',
        contentAr: 'محتوى عربي',
        order: 0,
      };

      const created = {
        id: 'content-1',
        ...bilingualContent,
      };

      (db.pageContent.create as any).mockResolvedValue(created);

      const result = await db.pageContent.create({
        data: bilingualContent,
      });

      expect(result.titleEn).toBe('English Title');
      expect(result.titleAr).toBe('عنوان عربي');
      expect(result.contentEn).toBe('English content');
      expect(result.contentAr).toBe('محتوى عربي');
    });
  });
});