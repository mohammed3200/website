import { describe, it, expect } from '@jest/globals';
import {
  createPageContentSchema,
  updatePageContentSchema,
} from '@/features/page-content/schemas/page-content-schema';

describe('Page Content Schemas', () => {
  describe('createPageContentSchema', () => {
    it('should validate valid entrepreneurship page content', () => {
      const validData = {
        page: 'entrepreneurship' as const,
        section: 'hero',
        titleEn: 'Entrepreneurship Development',
        titleAr: 'تطوير ريادة الأعمال',
        contentEn: 'We empower entrepreneurs',
        contentAr: 'نحن نمكن رواد الأعمال',
        order: 0,
        isActive: true,
      };

      const result = createPageContentSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe('entrepreneurship');
        expect(result.data.section).toBe('hero');
      }
    });

    it('should validate valid incubators page content', () => {
      const validData = {
        page: 'incubators' as const,
        section: 'phases',
        titleEn: 'Pre-Incubation',
        titleAr: 'ما قبل الحضانة',
        icon: 'Lightbulb',
        order: 0,
      };

      const result = createPageContentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid page value', () => {
      const invalidData = {
        page: 'invalid-page',
        section: 'hero',
        order: 0,
      };

      const result = createPageContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should require section field', () => {
      const invalidData = {
        page: 'entrepreneurship',
        order: 0,
      };

      const result = createPageContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should validate content with metadata', () => {
      const validData = {
        page: 'incubators' as const,
        section: 'metrics',
        titleEn: 'Startups Supported',
        titleAr: 'شركات مدعومة',
        order: 0,
        metadata: { number: 150 },
      };

      const result = createPageContentSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.metadata).toEqual({ number: 150 });
      }
    });

    it('should apply default values correctly', () => {
      const minimalData = {
        page: 'entrepreneurship' as const,
        section: 'programs',
      };

      const result = createPageContentSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.order).toBe(0);
        expect(result.data.isActive).toBe(true);
      }
    });

    it('should accept null values for optional string fields', () => {
      const validData = {
        page: 'entrepreneurship' as const,
        section: 'hero',
        titleEn: null,
        titleAr: null,
        contentEn: null,
        contentAr: null,
        icon: null,
        color: null,
      };

      const result = createPageContentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject negative order values', () => {
      const invalidData = {
        page: 'entrepreneurship' as const,
        section: 'hero',
        order: -1,
      };

      const result = createPageContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should validate color field when provided', () => {
      const validData = {
        page: 'entrepreneurship' as const,
        section: 'programs',
        color: 'bg-gradient-to-r from-orange-500 to-red-500',
        order: 0,
      };

      const result = createPageContentSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.color).toBe(
          'bg-gradient-to-r from-orange-500 to-red-500'
        );
      }
    });

    it('should validate icon field when provided', () => {
      const validData = {
        page: 'incubators' as const,
        section: 'resources',
        icon: 'Users',
        order: 0,
      };

      const result = createPageContentSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.icon).toBe('Users');
      }
    });

    it('should reject empty section string', () => {
      const invalidData = {
        page: 'entrepreneurship' as const,
        section: '',
        order: 0,
      };

      const result = createPageContentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should validate complex metadata structures', () => {
      const validData = {
        page: 'entrepreneurship' as const,
        section: 'custom',
        metadata: {
          number: 100,
          label: 'Success Rate',
          icon: 'TrendingUp',
          items: ['item1', 'item2'],
        },
        order: 0,
      };

      const result = createPageContentSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.metadata).toHaveProperty('number', 100);
        expect(result.data.metadata).toHaveProperty('items');
      }
    });
  });

  describe('updatePageContentSchema', () => {
    it('should validate partial updates', () => {
      const validUpdate = {
        titleEn: 'Updated Title',
      };

      const result = updatePageContentSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should allow updating only titleAr', () => {
      const validUpdate = {
        titleAr: 'عنوان محدث',
      };

      const result = updatePageContentSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should allow updating content fields', () => {
      const validUpdate = {
        contentEn: 'Updated content in English',
        contentAr: 'محتوى محدث بالعربية',
      };

      const result = updatePageContentSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should allow updating isActive status', () => {
      const validUpdate = {
        isActive: false,
      };

      const result = updatePageContentSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(false);
      }
    });

    it('should allow updating order', () => {
      const validUpdate = {
        order: 5,
      };

      const result = updatePageContentSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.order).toBe(5);
      }
    });

    it('should reject negative order in updates', () => {
      const invalidUpdate = {
        order: -3,
      };

      const result = updatePageContentSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });

    it('should allow updating metadata', () => {
      const validUpdate = {
        metadata: { newKey: 'newValue', count: 200 },
      };

      const result = updatePageContentSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.metadata).toHaveProperty('newKey', 'newValue');
      }
    });

    it('should allow setting nullable fields to null', () => {
      const validUpdate = {
        titleEn: null,
        contentEn: null,
        icon: null,
      };

      const result = updatePageContentSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should allow updating page type', () => {
      const validUpdate = {
        page: 'incubators' as const,
      };

      const result = updatePageContentSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should reject invalid page type in updates', () => {
      const invalidUpdate = {
        page: 'invalid-page',
      };

      const result = updatePageContentSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });

    it('should allow updating section', () => {
      const validUpdate = {
        section: 'new-section',
      };

      const result = updatePageContentSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should reject empty section in updates', () => {
      const invalidUpdate = {
        section: '',
      };

      const result = updatePageContentSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });

    it('should validate multiple field updates simultaneously', () => {
      const validUpdate = {
        titleEn: 'New Title',
        titleAr: 'عنوان جديد',
        contentEn: 'New content',
        order: 3,
        isActive: false,
        icon: 'Award',
      };

      const result = updatePageContentSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.titleEn).toBe('New Title');
        expect(result.data.order).toBe(3);
        expect(result.data.isActive).toBe(false);
      }
    });

    it('should accept empty update object', () => {
      const emptyUpdate = {};

      const result = updatePageContentSchema.safeParse(emptyUpdate);
      expect(result.success).toBe(true);
    });
  });

  describe('Schema Integration', () => {
    it('should enforce stricter validation for creation than update', () => {
      // Missing required fields should fail creation
      const incompleteData = {
        titleEn: 'Title only',
      };

      const createResult = createPageContentSchema.safeParse(incompleteData);
      expect(createResult.success).toBe(false);

      // But should pass update
      const updateResult = updatePageContentSchema.safeParse(incompleteData);
      expect(updateResult.success).toBe(true);
    });

    it('should maintain type consistency between schemas', () => {
      const data = {
        page: 'entrepreneurship' as const,
        section: 'hero',
        titleEn: 'Title',
        order: 1,
        isActive: true,
      };

      const createResult = createPageContentSchema.safeParse(data);
      expect(createResult.success).toBe(true);

      const updateData = {
        titleEn: 'Updated Title',
        order: 2,
      };

      const updateResult = updatePageContentSchema.safeParse(updateData);
      expect(updateResult.success).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long strings', () => {
      const longString = 'A'.repeat(10000);
      const validData = {
        page: 'entrepreneurship' as const,
        section: 'hero',
        contentEn: longString,
        order: 0,
      };

      const result = createPageContentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should handle special characters in content', () => {
      const validData = {
        page: 'incubators' as const,
        section: 'hero',
        contentEn: 'Special chars: !@#$%^&*()_+{}[]|\\:";\'<>?,./~`',
        contentAr: 'أحرف خاصة: ٠١٢٣٤٥٦٧٨٩',
        order: 0,
      };

      const result = createPageContentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should handle Unicode characters', () => {
      const validData = {
        page: 'entrepreneurship' as const,
        section: 'hero',
        titleEn: '🚀 Innovation & Growth 📈',
        titleAr: '🌟 الابتكار والنمو 🎯',
        order: 0,
      };

      const result = createPageContentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should handle maximum safe integer for order', () => {
      const validData = {
        page: 'entrepreneurship' as const,
        section: 'hero',
        order: Number.MAX_SAFE_INTEGER,
      };

      const result = createPageContentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});