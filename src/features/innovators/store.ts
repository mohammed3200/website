
import { createFormStore } from '@/lib/forms/create-form-store';
import { CompleteFormData } from './schemas/step-schemas';

export const useInnovatorFormStore = createFormStore<CompleteFormData>({
  storageKey: 'innovator-registration-storage',
  version: 1,
});
