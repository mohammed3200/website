import { z } from "zod";

export const getLatestNewsSchema = z.object({
    limit: z.coerce.number().int().positive().default(10),
});

export const getNewsByIdSchema = z.object({
    id: z.string().cuid(),
});

export const baseNewsSchema = z.object({
    title: z.string().min(1, "Arabic title is required"),
    titleEn: z.string().optional().nullable(),
    slug: z.string().min(1, "Slug is required"),
    content: z.string().min(1, "Arabic content is required"),
    contentEn: z.string().optional().nullable(),
    excerpt: z.string().optional().nullable(),
    excerptEn: z.string().optional().nullable(),
    tags: z.string().optional().nullable(), // Comma separated tags
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    publishedAt: z.date().optional().nullable(),
    imageId: z.string().optional().nullable(),
    galleryIds: z.string().optional().nullable(),
});

export const createNewsSchema = baseNewsSchema.extend({
    // Add any specific fields for creation if needed
});

export const updateNewsSchema = baseNewsSchema.partial().extend({
    id: z.string().cuid(),
});

export const newsSchema = baseNewsSchema.extend({
    id: z.string().cuid(),
    image: z.object({
        id: z.string(),
        url: z.string().nullable(),
        alt: z.string().nullable().optional(),
    }).nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    createdBy: z.object({
        name: z.string().nullable(),
        image: z.string().nullable(),
    }).nullable().optional(),
});

export type News = z.infer<typeof newsSchema>;
