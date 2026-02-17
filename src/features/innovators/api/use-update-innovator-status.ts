import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<
  (typeof client.api.innovators)[':innovatorId']['$patch'],
  200
>;

type RequestType = InferRequestType<
  (typeof client.api.innovators)[':innovatorId']['$patch']
>;

export const useUpdateInnovatorStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('InnovatorForm');

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.innovators[':innovatorId']['$patch']({
        param,
        json,
      });

      if (!response.ok) {
        throw new Error('Failed to update innovator status');
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
      queryClient.invalidateQueries({ queryKey: ['admin:submissions'] });
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
