import type { LegalContent, LegalContentType, LegalContentLocale } from '@prisma/client';

export type { LegalContent, LegalContentType, LegalContentLocale };

export interface LegalContentResponse {
    data: LegalContent;
}
