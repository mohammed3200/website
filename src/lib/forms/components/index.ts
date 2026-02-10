/**
 * Barrel export for all form components
 * 
 * This file provides a central export point for all form-related components,
 * enabling cleaner imports throughout the application.
 * 
 * Usage:
 * 
 * Before:
 * import { TextInput } from '@/lib/forms/components/fields/text-input';
 * import { FileUpload } from '@/lib/forms/components/file-upload';
 * 
 * After:
 * import { TextInput, FileUpload } from '@/lib/forms/components';
 */

// === Field Components ===
export * from './fields';

// === Layout Components ===
export * from './layout/FormContentArea';
export * from './layout/RegistrationLayout';
export * from './layout/StepsSidebar';

// === Utility Components ===
export * from './file-upload';
export * from './progress-indicator';
export * from './step-navigation';

// === Shared Utilities ===
export * from './shared/StepLayout';
