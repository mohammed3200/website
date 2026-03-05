// API hooks
export { useGetLegalContent } from './api/use-get-legal-content';
export { usePatchLegalContent } from './api/use-patch-legal-content';

// Components
export { LegalContentViewer } from './components/legal-content-viewer';
export { LegalContentEditor } from './components/legal-content-editor';

// Types
export type {
    LegalContent,
    LegalContentType,
    LegalContentLocale,
    LegalContentResponse,
} from './types/legal-content-type';

// Schemas
export {
    getLegalContentQuerySchema,
    patchLegalContentSchema,
    type GetLegalContentQuery,
    type PatchLegalContentInput,
} from './schemas/legal-content-schema';

// Constants
export {
    LEGAL_CONTENT_TYPES,
    LEGAL_CONTENT_LOCALES,
    LEGAL_CONTENT_DEFAULTS,
} from './constants/legal-content-constants';
