'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { useToast } from '@/hooks/use-toast';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<
  (typeof client.api.strategicPlan)[':id']['$delete'],
  200
>;

export const useDeleteStrategicPlan = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      const response = await client.api.strategicPlan[':id'].$delete({
        param: { id },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete strategic plan');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Strategic plan deleted successfully',
        success: true,
      });
      queryClient.invalidateQueries({ queryKey: ['strategic-plans'] });
    },
    onError: (error) => {
      toast({
        title: error.message || 'Failed to delete strategic plan',
        error: true,
      });
    },
  });
};
