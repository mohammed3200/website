import { z } from 'zod';

export const getLegalContentQuerySchema = z.object({
    type: z.enum(['privacy', 'terms']),
    locale: z.enum(['en', 'ar']).default('en'),
});

export const patchLegalContentSchema = z.object({
    type: z.enum(['privacy', 'terms']),
    locale: z.enum(['en', 'ar']),
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
});

export type GetLegalContentQuery = z.infer<typeof getLegalContentQuerySchema>;
export type PatchLegalContentInput = z.infer<typeof patchLegalContentSchema>;
