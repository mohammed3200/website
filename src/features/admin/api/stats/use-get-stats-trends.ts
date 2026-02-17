'use client';

import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export const useGetStatsTrends = (year?: number) => {
  return useQuery({
    queryKey: ['admin-stats-trends', year],
    queryFn: async () => {
      const res = await client.api.admin.stats.trends.$get({
        query: {
          year: year?.toString(),
        },
      });
      if (!res.ok) throw new Error('Failed to fetch stats trends');
      return (await res.json()) as {
        trends: {
          month: string;
          innovators: number;
          collaborators: number;
        }[];
      };
    },
  });
};
