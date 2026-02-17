'use client';

import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export const useGetUnreadCount = () => {
  return useQuery({
    queryKey: ['admin-notifications', 'unread-count'],
    queryFn: async () => {
      const res = await client.api.admin.notifications['unread-count'].$get();
      if (!res.ok) throw new Error('Failed to fetch unread count');
      const data = await res.json();
      return (data as { count: number }).count;
    },
    refetchInterval: 30000,
  });
};
