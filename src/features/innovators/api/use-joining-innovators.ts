import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<
  (typeof client.api.innovators)['$post'],
  201
>;
type RequestType = InferRequestType<(typeof client.api.innovators)['$post']>;

export const useJoiningInnovators = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('CreatorsAndInnovators');
  const tForm = useTranslations('Form');

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.innovators['$post']({
        form,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'UNKNOWN_ERROR');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: t('form.RequestSuccess'),
        success: true,
      });
      queryClient.invalidateQueries({ queryKey: ['innovators'] });
    },
    onError: (error) => {
      switch (error.message) {
        case 'EMAIL_EXISTS':
          toast({
            title: tForm('EmailExists'),
            error: true,
          });
          break;
        case 'PHONE_EXISTS':
          toast({
            title: tForm('PhoneExists'),
            error: true,
          });
          break;
        default:
          toast({
            title: t('form.RequestFailed'),
            error: true,
          });
      }
    },
  });

  return mutation;
};
