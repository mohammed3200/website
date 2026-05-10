import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api['academic-experts']['$post'], 201>;
type RequestType = InferRequestType<typeof client.api['academic-experts']['$post']>['json'];

export const useCreateExpert = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['academic-experts'].$post({ json });
      if (!response.ok) {
        throw new Error('Failed to create academic expert');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Academic expert created successfully');
      queryClient.invalidateQueries({ queryKey: ['academic-experts'] });
      queryClient.invalidateQueries({ queryKey: ['public-academic-experts'] });
    },
    onError: () => {
      toast.error('Failed to create academic expert');
    },
  });
};
