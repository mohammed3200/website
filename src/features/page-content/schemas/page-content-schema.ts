import { z } from 'zod';

export const createPageContentSchema = z.object({
    page: z.enum(['entrepreneurship', 'incubators']),
    section: z.string().min(1, 'Section is required'),
    titleEn: z.string().optional().nullable(),
    titleAr: z.string().optional().nullable(),
    contentEn: z.string().optional().nullable(),
    contentAr: z.string().optional().nullable(),
    icon: z.string().optional().nullable(),
    color: z.string().optional().nullable(),
    order: z.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
    metadata: z.record(z.string(), z.any()).optional(),
});

export const updatePageContentSchema = z.object({
    page: z.enum(['entrepreneurship', 'incubators']).optional(),
    section: z.string().min(1).optional(),
    titleEn: z.string().optional().nullable(),
    titleAr: z.string().optional().nullable(),
    contentEn: z.string().optional().nullable(),
    contentAr: z.string().optional().nullable(),
    icon: z.string().optional().nullable(),
    color: z.string().optional().nullable(),
    order: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
    metadata: z.record(z.string(), z.any()).optional(),
});

export type CreatePageContentInput = z.infer<typeof createPageContentSchema>;
export type UpdatePageContentInput = z.infer<typeof updatePageContentSchema>;
