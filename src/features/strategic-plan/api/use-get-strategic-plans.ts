'use client';

import { useQuery } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<
  (typeof client.api.strategicPlan)['public']['$get'],
  200
>;

export const useGetStrategicPlans = () => {
  return useQuery<ResponseType, Error>({
    queryKey: ['strategic-plans', 'public'],
    queryFn: async () => {
      const response = await client.api.strategicPlan.public.$get();
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to fetch strategic plans');
      }
      return await response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
