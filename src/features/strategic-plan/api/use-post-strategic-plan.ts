'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useToast } from '@/hooks/use-toast';
import { client } from '@/lib/rpc';
import { useTranslations } from 'next-intl';

type ResponseType = InferResponseType<
  (typeof client.api.strategicPlan)['$post'],
  201
>;
type RequestType = InferRequestType<(typeof client.api.strategicPlan)['$post']>;

export const usePostStrategicPlan = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations('Common');

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.strategicPlan.$post({
        json,
      });
      if (!response.ok) {
        const errorData = await response.json() as { message?: string; error?: string };
        throw new Error(errorData.message || errorData.error || 'Failed to create strategic plan');
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Strategic plan created successfully',
        success: true,
      });
      queryClient.invalidateQueries({ queryKey: ['strategic-plans'] });
    },
    onError: (error) => {
      toast({
        title: error.message || 'Failed to create strategic plan',
        error: true,
      });
    },
  });
};
