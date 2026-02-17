import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<
  (typeof client.api.innovators)[':innovatorId']['$delete'],
  200
>;

type RequestType = InferRequestType<
  (typeof client.api.innovators)[':innovatorId']['$delete']
>;

export const useDeleteInnovator = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('InnovatorForm');

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.innovators[':innovatorId']['$delete']({
        param,
      });

      if (!response.ok) {
        throw new Error('Failed to Delete innovator');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: t('form.RequestSuccess'),
        success: true,
      });
      queryClient.invalidateQueries({ queryKey: ['innovators'] });
      queryClient.invalidateQueries({ queryKey: ['innovators:public'] });
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
