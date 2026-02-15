import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<
  (typeof client.api.collaborator)[':collaboratorId']['$delete'],
  200
>;

type RequestType = InferRequestType<
  (typeof client.api.collaborator)[':collaboratorId']['$delete']
>;

export const useDeleteCollaborator = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('collaboratingPartners');
  const tForm = useTranslations('Form');

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.collaborator[':collaboratorId'][
        '$delete'
      ]({
        param,
      });

      if (!response.ok) {
        throw new Error('Failed to Delete collaborator');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: t('form.RequestSuccess'),
        success: true,
      });
      queryClient.invalidateQueries({ queryKey: ['collaborator'] });
      // Invalidate public collaborators as well if needed, though 'collaborator' key might cover it widely
      // or we might need specific keys:
      queryClient.invalidateQueries({ queryKey: ['collaborators:public'] });
    },
    onError: () => {
      toast({
        title: t('form.RequestFailed'),
        error: true,
      });
    },
  });

  return mutation;
};
