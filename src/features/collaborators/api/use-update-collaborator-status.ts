import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<
  (typeof client.api.collaborator)[':collaboratorId']['$patch'],
  200
>;

type RequestType = InferRequestType<
  (typeof client.api.collaborator)[':collaboratorId']['$patch']
>;

export const useUpdateCollaboratorStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('Collaborators');

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.collaborator[':collaboratorId'][
        '$patch'
      ]({
        param,
        json,
      });

      if (!response.ok) {
        throw new Error('Failed to update collaborator status');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: t('RequestSuccess'),
        success: true,
      });
      queryClient.invalidateQueries({ queryKey: ['collaborator'] });
      queryClient.invalidateQueries({ queryKey: ['collaborators:public'] });
      queryClient.invalidateQueries({ queryKey: ['admin:submissions'] });
    },
    onError: () => {
      toast({
        title: t('RequestFailed'),
        error: true,
      });
    },
  });

  return mutation;
};
