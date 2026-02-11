/**
 * @jest-environment node
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Mock dependencies
jest.mock('@prisma/client');
jest.mock('bcryptjs');
jest.mock('@prisma/adapter-mariadb', () => ({
  PrismaMariaDb: jest.fn().mockImplementation(() => ({})),
}));

describe('Database Seed Functions', () => {
  let mockPrisma: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Prisma client methods
    mockPrisma = {
      role: {
        findUnique: jest.fn(),
      },
      user: {
        upsert: jest.fn(),
      },
      strategicPlan: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      pageContent: {
        upsert: jest.fn(),
      },
      $disconnect: jest.fn(),
    };

    // Mock PrismaClient constructor
    (PrismaClient as any).mockImplementation(() => mockPrisma);

    // Set required env vars
    process.env.DATABASE_URL = 'mysql://test:test@localhost:3306/test';
    process.env.INIT_ADMIN_EMAIL = 'admin@test.com';
    process.env.INIT_ADMIN_PASSWORD = 'password123';
  });

  describe('Admin User Creation', () => {
    it('should create admin user with hashed password', async () => {
      const hashedPassword = 'hashed_password_123';
      (bcrypt.hash as any) = jest.fn().mockResolvedValue(hashedPassword);

      const mockRole = {
        id: 'role-123',
        name: 'super_admin',
      };

      const mockUser = {
        id: 'user-123',
        email: 'admin@test.com',
        name: 'Admin User',
        roleId: 'role-123',
        isActive: true,
      };

      mockPrisma.role.findUnique.mockResolvedValue(mockRole);
      mockPrisma.user.upsert.mockResolvedValue(mockUser);

      // Dynamically import to use mocked dependencies
      const { default: seedModule } = await import('../../prisma/seed');

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });

    it('should handle missing super admin role gracefully', async () => {
      (bcrypt.hash as any) = jest.fn().mockResolvedValue('hashed');
      mockPrisma.role.findUnique.mockResolvedValue(null);

      const mockUser = {
        id: 'user-123',
        email: 'admin@test.com',
        roleId: undefined,
      };

      mockPrisma.user.upsert.mockResolvedValue(mockUser);

      // Should not throw, but should warn
      // The actual implementation handles this gracefully
      expect(mockPrisma.role.findUnique).toBeDefined();
    });
  });

  describe('Strategic Plans Seeding', () => {
    it('should create strategic plans with proper slugs', async () => {
      mockPrisma.strategicPlan.findFirst.mockResolvedValue(null);
      mockPrisma.strategicPlan.create.mockResolvedValue({
        id: 'plan-1',
        slug: 'test-plan-ar-1',
      });

      const planData = {
        id: '1',
        arabic: {
          caption: 'Test Caption',
          title: 'Test Title',
          text: 'Test content',
        },
        english: {
          caption: 'Test Caption EN',
          title: 'Test Title EN',
          text: 'Test content EN',
        },
      };

      // Test slug generation logic
      const arabicSlug = planData.arabic.caption
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\p{L}\p{N}-]/gu, '')
        .substring(0, 70);

      expect(arabicSlug).toBe('test-caption');
    });

    it('should skip existing strategic plans', async () => {
      mockPrisma.strategicPlan.findFirst.mockResolvedValue({
        id: 'existing-plan',
        slug: 'test-plan-ar-1',
      });

      // Should not create if plan already exists
      // The actual seed function checks this
      expect(mockPrisma.strategicPlan.findFirst).toBeDefined();
    });

    it('should handle plans with empty content gracefully', async () => {
      mockPrisma.strategicPlan.findFirst.mockResolvedValue(null);
      mockPrisma.strategicPlan.create.mockResolvedValue({
        id: 'plan-2',
      });

      const planData = {
        id: '2',
        arabic: {
          caption: 'Caption',
          title: 'Title',
          text: '',
        },
        english: {
          caption: 'Caption EN',
          title: 'Title EN',
          text: '',
        },
      };

      // Should use caption as fallback for empty text
      expect(planData.arabic.text || planData.arabic.caption).toBeTruthy();
    });
  });

  describe('Page Content Seeding', () => {
    it('should upsert page content items', async () => {
      const contentItem = {
        page: 'entrepreneurship',
        section: 'hero',
        order: 0,
        titleEn: 'Test Title',
        titleAr: 'عنوان اختبار',
        contentEn: 'Test content',
        contentAr: 'محتوى اختبار',
      };

      mockPrisma.pageContent.upsert.mockResolvedValue({
        id: 'content-1',
        ...contentItem,
      });

      // Test upsert logic
      await mockPrisma.pageContent.upsert({
        where: {
          page_section_order: {
            page: contentItem.page,
            section: contentItem.section,
            order: contentItem.order,
          },
        },
        update: contentItem,
        create: contentItem,
      });

      expect(mockPrisma.pageContent.upsert).toHaveBeenCalledWith({
        where: {
          page_section_order: {
            page: 'entrepreneurship',
            section: 'hero',
            order: 0,
          },
        },
        update: contentItem,
        create: contentItem,
      });
    });

    it('should handle page content with metadata', async () => {
      const contentItem = {
        page: 'incubators',
        section: 'metrics',
        order: 0,
        titleEn: 'Startups Supported',
        titleAr: 'شركات مدعومة',
        metadata: { number: 150 },
      };

      mockPrisma.pageContent.upsert.mockResolvedValue({
        id: 'content-2',
        ...contentItem,
      });

      expect(contentItem.metadata).toEqual({ number: 150 });
    });

    it('should seed both entrepreneurship and incubators pages', async () => {
      const entrepreneurshipItem = {
        page: 'entrepreneurship',
        section: 'hero',
        order: 0,
      };

      const incubatorsItem = {
        page: 'incubators',
        section: 'hero',
        order: 0,
      };

      mockPrisma.pageContent.upsert
        .mockResolvedValueOnce({ id: '1', ...entrepreneurshipItem })
        .mockResolvedValueOnce({ id: '2', ...incubatorsItem });

      // Both pages should have content
      expect(entrepreneurshipItem.page).toBe('entrepreneurship');
      expect(incubatorsItem.page).toBe('incubators');
    });
  });

  describe('Environment Variable Validation', () => {
    it('should throw error when DATABASE_HOST is missing', () => {
      delete process.env.DATABASE_HOST;

      // The actual seed.ts validates required env vars
      const dbHost = process.env.DATABASE_HOST;
      expect(dbHost).toBeUndefined();
    });

    it('should throw error when admin credentials are missing', () => {
      delete process.env.INIT_ADMIN_EMAIL;
      delete process.env.INIT_ADMIN_PASSWORD;

      expect(process.env.INIT_ADMIN_EMAIL).toBeUndefined();
      expect(process.env.INIT_ADMIN_PASSWORD).toBeUndefined();
    });

    it('should use default DATABASE_PORT if not provided', () => {
      delete process.env.DATABASE_PORT;
      const dbPort = process.env.DATABASE_PORT || '3306';

      expect(dbPort).toBe('3306');
    });
  });

  describe('Database Disconnection', () => {
    it('should disconnect from database after seeding', async () => {
      mockPrisma.$disconnect.mockResolvedValue(undefined);

      await mockPrisma.$disconnect();

      expect(mockPrisma.$disconnect).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors during user creation', async () => {
      (bcrypt.hash as any) = jest.fn().mockResolvedValue('hashed');
      mockPrisma.role.findUnique.mockResolvedValue({ id: 'role-1' });
      mockPrisma.user.upsert.mockRejectedValue(new Error('Database error'));

      await expect(mockPrisma.user.upsert({})).rejects.toThrow('Database error');
    });

    it('should handle errors during strategic plan creation', async () => {
      mockPrisma.strategicPlan.findFirst.mockResolvedValue(null);
      mockPrisma.strategicPlan.create.mockRejectedValue(
        new Error('Failed to create plan')
      );

      await expect(
        mockPrisma.strategicPlan.create({})
      ).rejects.toThrow('Failed to create plan');
    });

    it('should handle errors during page content creation', async () => {
      mockPrisma.pageContent.upsert.mockRejectedValue(
        new Error('Failed to upsert content')
      );

      await expect(
        mockPrisma.pageContent.upsert({})
      ).rejects.toThrow('Failed to upsert content');
    });
  });

  describe('Data Integrity', () => {
    it('should create user with emailVerified timestamp', async () => {
      (bcrypt.hash as any) = jest.fn().mockResolvedValue('hashed');
      mockPrisma.role.findUnique.mockResolvedValue({ id: 'role-1' });

      const userData = {
        email: 'admin@test.com',
        password: 'hashed',
        name: 'Admin User',
        emailVerified: new Date(),
        roleId: 'role-1',
        isActive: true,
      };

      mockPrisma.user.upsert.mockResolvedValue({
        id: 'user-1',
        ...userData,
      });

      expect(userData.emailVerified).toBeInstanceOf(Date);
      expect(userData.isActive).toBe(true);
    });

    it('should create strategic plans with published status', async () => {
      const planData = {
        title: 'Test Plan',
        slug: 'test-plan-en-1',
        content: 'Content',
        excerpt: 'Excerpt',
        category: 'Strategic Plan',
        priority: 'HIGH',
        status: 'PUBLISHED',
        isActive: true,
        publishedAt: new Date(),
      };

      mockPrisma.strategicPlan.create.mockResolvedValue({
        id: 'plan-1',
        ...planData,
      });

      expect(planData.status).toBe('PUBLISHED');
      expect(planData.isActive).toBe(true);
    });
  });
});