import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';
import { InferRequestType } from 'hono';

type RequestType = {
  id: string;
  data: InferRequestType<(typeof client.api.faqs)[':id']['$patch']>['json'];
};

export const useUpdateFaq = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, RequestType>({
    mutationFn: async ({ id, data }) => {
      const response = await client.api.faqs[':id'].$patch({
        param: { id },
        json: data,
      });

      if (!response.ok) {
        const error = (await response.json()) as any;
        throw new Error(error.message || 'Failed to update FAQ');
      }

      const { data: updatedData } = await response.json();
      return updatedData;
    },
    onSuccess: () => {
      toast.success('FAQ updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update FAQ');
    },
  });
};
