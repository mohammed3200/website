import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.pageContent.$post, 201>;
type RequestType = InferRequestType<typeof client.api.pageContent.$post>;

export const useCreatePageContent = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.pageContent.$post({ json });

      if (!response.ok) {
        throw new Error('Failed to create page content');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Content block created successfully');
      queryClient.invalidateQueries({ queryKey: ['page-content'] });
      queryClient.invalidateQueries({ queryKey: ['page-content-stats'] });
    },
    onError: () => {
      toast.error('Failed to create content block');
    },
  });

  return mutation;
};
