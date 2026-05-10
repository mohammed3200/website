import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api['academic-experts'][':id']['$patch'], 200>;
type RequestType = InferRequestType<typeof client.api['academic-experts'][':id']['$patch']>['json'];

export const useUpdateExpert = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api['academic-experts'][':id'].$patch({
        param: { id },
        json,
      });
      if (!response.ok) {
        throw new Error('Failed to update academic expert');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Academic expert updated successfully');
      queryClient.invalidateQueries({ queryKey: ['academic-experts'] });
      queryClient.invalidateQueries({ queryKey: ['public-academic-experts'] });
    },
    onError: () => {
      toast.error('Failed to update academic expert');
    },
  });
};
