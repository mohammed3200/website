
import { createFormStore } from '@/lib/forms/create-form-store';
import { Collaborator } from '@/features/collaborators/types/types';

export const useCollaboratorFormStore = createFormStore<Collaborator>({
  storageKey: 'collaborator-registration-storage',
  version: 1,
});
