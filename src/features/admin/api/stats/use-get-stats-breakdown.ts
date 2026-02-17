'use client';

import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export const useGetStatsBreakdown = () => {
  return useQuery({
    queryKey: ['admin-stats-breakdown'],
    queryFn: async () => {
      const res = await client.api.admin.stats.breakdown.$get();
      if (!res.ok) throw new Error('Failed to fetch stats breakdown');
      return (await res.json()) as {
        innovators: {
          pending: number;
          approved: number;
          rejected: number;
        };
        collaborators: {
          pending: number;
          approved: number;
          rejected: number;
        };
      };
    },
  });
};
