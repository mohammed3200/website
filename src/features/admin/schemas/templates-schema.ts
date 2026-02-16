import { z } from 'zod';

export const templateIdParamSchema = z.object({
  id: z.string(),
});

export const createTemplateSchema = z.object({
  slug: z.string(),
  channel: z.enum(['EMAIL', 'WHATSAPP', 'BOTH']),
  nameAr: z.string(),
  nameEn: z.string(),
  subjectAr: z.string().optional(),
  subjectEn: z.string().optional(),
  bodyAr: z.string(),
  bodyEn: z.string(),
  variables: z.string(), // JSON string
  isActive: z.boolean().optional(),
});

export const updateTemplateSchema = z.object({
  slug: z.string().optional(),
  channel: z.enum(['EMAIL', 'WHATSAPP', 'BOTH']).optional(),
  nameAr: z.string().optional(),
  nameEn: z.string().optional(),
  subjectAr: z.string().optional(),
  subjectEn: z.string().optional(),
  bodyAr: z.string().optional(),
  bodyEn: z.string().optional(),
  variables: z.string().optional(), // JSON string
  isActive: z.boolean().optional(),
});
