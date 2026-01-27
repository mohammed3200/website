'use client';

import { useQuery } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<
  (typeof client.api.strategicPlan)['public'][':id']['$get'],
  200
>;

export const useGetStrategicPlan = (id: string) => {
  return useQuery<ResponseType, Error>({
    queryKey: ['strategic-plan', 'public', id],
    queryFn: async () => {
      const response = await client.api.strategicPlan.public[':id'].$get({
        param: { id },
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Strategic plan not found');
        }
        const errorData = await response.json() as { message?: string; error?: string };
        throw new Error(errorData.message || errorData.error || 'Failed to fetch strategic plan');
      }
      return await response.json();
    },
    enabled: !!id,
  });
};
