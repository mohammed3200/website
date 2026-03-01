import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<
  (typeof client.api.pageContent)[':id']['$delete'],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.pageContent)[':id']['$delete']
>;

export const useDeletePageContent = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.pageContent[':id'].$delete({
        param,
      });

      if (!response.ok) {
        throw new Error('Failed to delete page content');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Content block deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
      queryClient.invalidateQueries({ queryKey: ['page-content-stats'] });
    },
    onError: () => {
      toast.error('Failed to delete content block');
    },
  });

  return mutation;
};
