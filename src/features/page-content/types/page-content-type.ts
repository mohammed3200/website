import type { PageContent } from '@prisma/client';

export type { PageContent };

export interface PageContentResponse {
  data: PageContent[];
}

export interface PageContentError {
  error: string;
}
