'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useToast } from '@/hooks/use-toast';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<
  (typeof client.api.strategicPlan)[':id']['$patch'],
  200
>;
type RequestType = InferRequestType<(typeof client.api.strategicPlan)[':id']['$patch']>;

export const usePatchStrategicPlan = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType & { param: { id: string } }>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.strategicPlan[':id'].$patch({
        param,
        json,
      });
      if (!response.ok) {
        const errorData = await response.json() as { message?: string; error?: string };
        throw new Error(errorData.message || errorData.error || 'Failed to update strategic plan');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Strategic plan updated successfully',
        success: true,
      });
      queryClient.invalidateQueries({ queryKey: ['strategic-plans'] });
    },
    onError: (error) => {
      toast({
        title: error.message || 'Failed to update strategic plan',
        error: true,
      });
    },
  });
};
