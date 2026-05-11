import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api['academic-experts'][':id']['$delete'], 200>;

export const useDeleteExpert = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, string>({
    mutationFn: async (id) => {
      const response = await client.api['academic-experts'][':id'].$delete({
        param: { id },
      });
      if (!response.ok) {
        throw new Error('Failed to delete academic expert');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Academic expert deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['academic-experts'] });
      queryClient.invalidateQueries({ queryKey: ['public-academic-experts'] });
    },
    onError: () => {
      toast.error('Failed to delete academic expert');
    },
  });
};
