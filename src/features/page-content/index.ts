// API hooks
export { useGetPageContent } from './api/use-get-page-content';
export { useCreatePageContent } from './api/use-create-page-content';
export { useUpdatePageContent } from './api/use-update-page-content';
export { useDeletePageContent } from './api/use-delete-page-content';

// Components
export { ContentFormDialog } from './components/content-form-dialog';
export { DeleteContentDialog } from './components/delete-content-dialog';

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
