'use client';

import { useQuery } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<
  (typeof client.api.strategicPlan)['$get'],
  200
>;

export const useGetAllStrategicPlans = () => {
  return useQuery<ResponseType, Error>({
    queryKey: ['strategic-plans', 'admin'],
    queryFn: async () => {
      const response = await client.api.strategicPlan.$get();
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch strategic plans');
      }
      return await response.json();
    },
  });
};
