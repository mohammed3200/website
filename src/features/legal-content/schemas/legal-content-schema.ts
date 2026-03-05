import { z } from 'zod';
import { LegalContentType, LegalContentLocale } from '@prisma/client';

export const getLegalContentQuerySchema = z.object({
    type: z.nativeEnum(LegalContentType),
    locale: z.nativeEnum(LegalContentLocale).default(LegalContentLocale.en),
});

export const patchLegalContentSchema = z.object({
    type: z.nativeEnum(LegalContentType),
    locale: z.nativeEnum(LegalContentLocale),
    title: z.string().trim().min(1, 'Title is required'),
    content: z.string().trim().min(1, 'Content is required'),
});

export type GetLegalContentQuery = z.infer<typeof getLegalContentQuerySchema>;
export type PatchLegalContentInput = z.infer<typeof patchLegalContentSchema>;
