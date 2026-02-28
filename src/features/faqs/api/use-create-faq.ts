import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';
import { InferRequestType } from 'hono';

type RequestType = InferRequestType<typeof client.api.faqs.$post>['json'];

export const useCreateFaq = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.faqs.$post({ json });

      if (!response.ok) {
        const error = (await response.json()) as any;
        throw new Error(error.message || 'Failed to create FAQ');
      }

      const { data } = await response.json();
      return data;
    },
    onSuccess: () => {
      toast.success('FAQ created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create FAQ');
    },
  });
};
