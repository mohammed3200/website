'use client';

import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await client.api.admin.stats.$get();
      if (!res.ok) throw new Error('Failed to fetch dashboard statistics');
      return await res.json();
    },
  });
};
