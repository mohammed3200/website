import { z } from "zod";

// PlanPriority enum values
export const PlanPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);

// PlanStatus enum values
export const PlanStatusEnum = z.enum(["DRAFT", "UNDER_REVIEW", "APPROVED", "PUBLISHED", "ARCHIVED"]);

// Schema for creating a strategic plan (single language record)
export const createStrategicPlanSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  priority: PlanPriorityEnum.default("MEDIUM"),
  status: PlanStatusEnum.default("DRAFT"),
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
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens").optional(),
  content: z.string().min(1, "Content is required").optional(),
  excerpt: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  priority: PlanPriorityEnum.optional(),
  status: PlanStatusEnum.optional(),
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
export type PlanPriority = z.infer<typeof PlanPriorityEnum>;
export type PlanStatus = z.infer<typeof PlanStatusEnum>;
