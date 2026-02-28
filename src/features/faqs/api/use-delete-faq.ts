import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';
import { InferResponseType } from 'hono';

type ResponseType = InferResponseType<
  (typeof client.api.faqs)[':id']['$delete']
>;

export const useDeleteFaq = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, string>({
    mutationFn: async (id) => {
      const response = await client.api.faqs[':id'].$delete({
        param: { id },
      });

      if (!response.ok) {
        const error = (await response.json()) as any;
        throw new Error(error.message || 'Failed to delete FAQ');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('FAQ deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete FAQ');
    },
  });
};
