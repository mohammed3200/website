import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

export const useDeleteFaq = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, string>({
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
