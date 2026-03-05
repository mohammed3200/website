import type { LegalContent } from '@prisma/client';

export type { LegalContent };

export type LegalContentType = 'privacy' | 'terms';
export type LegalContentLocale = 'en' | 'ar';

export interface LegalContentResponse {
    data: LegalContent;
}
