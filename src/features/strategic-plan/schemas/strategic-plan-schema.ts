import { z } from "zod";


// Schema for creating a strategic plan (bilingual: EN + AR in one row)
export const createStrategicPlanSchema = z.object({
  title: z.string().min(1, "Title is required"),
  titleAr: z.string().optional().nullable(),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  content: z.string().min(1, "Content is required"),
  contentAr: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  excerptAr: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  categoryAr: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  publishedAt: z.string().datetime().optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  imageId: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
});

// Schema for updating a strategic plan
export const updateStrategicPlanSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  titleAr: z.string().optional().nullable(),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens").optional(),
  content: z.string().min(1, "Content is required").optional(),
  contentAr: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  excerptAr: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  categoryAr: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  publishedAt: z.string().datetime().optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  imageId: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
});

// Schema for server-side validation
export const createStrategicPlanSchemaServer = createStrategicPlanSchema;
export const updateStrategicPlanSchemaServer = updateStrategicPlanSchema;

// Type exports
export type CreateStrategicPlanInput = z.infer<typeof createStrategicPlanSchema>;
export type UpdateStrategicPlanInput = z.infer<typeof updateStrategicPlanSchema>;
