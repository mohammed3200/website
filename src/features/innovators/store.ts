
import { createFormStore } from '@/lib/forms/create-form-store';
import { CompleteFormData } from './schemas/step-schemas';

export const useInnovatorFormStore = createFormStore<CompleteFormData>({
  storageKey: 'innovator-registration-storage',
  // Breaking Change: Version bumped to 2 to intentionally drop stale/invalid prior session storage schemas preventing corruption.
  version: 2,
});
