import { LegalContentType, LegalContentLocale } from '@prisma/client';

export const LEGAL_CONTENT_TYPES = [
    'privacy',
    'terms',
] as const satisfies readonly LegalContentType[];

export const LEGAL_CONTENT_LOCALES = [
    'en',
    'ar',
] as const satisfies readonly LegalContentLocale[];

export type LegalContentKey = `${LegalContentType}:${LegalContentLocale}`;

export const LEGAL_CONTENT_DEFAULTS: Record<
    LegalContentKey,
    { title: string; content: string }
> = {
    'privacy:en': {
        title: 'Privacy Policy',
        content: '<p>Privacy policy content has not been configured yet.</p>',
    },
    'privacy:ar': {
        title: 'سياسة الخصوصية',
        content: '<p>لم يتم تكوين محتوى سياسة الخصوصية بعد.</p>',
    },
    'terms:en': {
        title: 'Terms of Use',
        content: '<p>Terms of use content has not been configured yet.</p>',
    },
    'terms:ar': {
        title: 'شروط الاستخدام',
        content: '<p>لم يتم تكوين محتوى شروط الاستخدام بعد.</p>',
    },
};
