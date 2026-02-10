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

export const useUpdateStat8sCollaborator = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('collaboratingPartners');
  const tForm = useTranslations('Form'); // Add this for form error translations

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.collaborator[':collaboratorId'][
        '$patch'
      ]({
        json,
        param,
      });

      if (!response.ok) {
        throw new Error('Failed to Update collaborator');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: t('form.RequestSuccess'),
        success: true,
      });
      queryClient.invalidateQueries({ queryKey: ['collaborator'] });
    },
    onError: (error) => {
      // Handle specific error codes with translations
      switch (error.message) {
        case 'EMAIL_EXISTS':
          toast({
            title: tForm('EmailExists'), // New translation key
            error: true,
          });
          break;
        case 'PHONE_EXISTS':
          toast({
            title: tForm('PhoneExists'), // New translation key
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
