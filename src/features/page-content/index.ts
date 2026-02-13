// API hooks
export { useGetPageContent } from './api/use-get-page-content';

// Types
export type {
  PageContent,
  PageContentResponse,
} from './types/page-content-type';

// Schemas
export {
  createPageContentSchema,
  updatePageContentSchema,
  type CreatePageContentInput,
  type UpdatePageContentInput,
} from './schemas/page-content-schema';

// Server helper for RSC
export { getPageContent } from './server/route';
