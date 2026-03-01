import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<
  (typeof client.api.pageContent)[':id']['$patch'],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.pageContent)[':id']['$patch']
>;

export const useUpdatePageContent = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.pageContent[':id'].$patch({
        param,
        json,
      });

      if (!response.ok) {
        throw new Error('Failed to update page content');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Content block updated successfully');
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
      queryClient.invalidateQueries({ queryKey: ['page-content-stats'] });
    },
    onError: () => {
      toast.error('Failed to update content block');
    },
  });

  return mutation;
};
