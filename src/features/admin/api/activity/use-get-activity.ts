'use client';

import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { AdminNotification } from '@prisma/client';

export const useGetActivity = (limit: number = 20) => {
  return useQuery({
    queryKey: ['admin-activity', limit],
    queryFn: async () => {
      const res = await client.api.admin.activity.$get({
        query: {
          limit: limit.toString(),
        },
      });
      if (!res.ok) throw new Error('Failed to fetch activity feed');
      return (await res.json()) as {
        activities: (Omit<
          AdminNotification,
          'createdAt' | 'updatedAt' | 'readAt'
        > & {
          createdAt: string;
          updatedAt: string;
          readAt: string | null;
        })[];
      };
    },
  });
};
