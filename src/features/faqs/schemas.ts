import { z } from 'zod';

export const faqSchema = (t?: (key: string) => string) => {
    return z.object({
        question: z.string().min(1, { message: t ? t('RequiredField') : 'Required' }),
        answer: z.string().min(1, { message: t ? t('RequiredField') : 'Required' }),
        questionAr: z.string().optional(),
        answerAr: z.string().optional(),
        category: z.string().optional(),
        order: z.number().int().default(0),
        isActive: z.boolean().default(true),
        isSticky: z.boolean().default(false),
    });
};

export type FaqSchemaType = z.infer<ReturnType<typeof faqSchema>>;
