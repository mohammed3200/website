'use client';

import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export interface QueueHealth {
  queue: 'email' | 'whatsapp';
  mock: boolean;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  last24h: { sent: number; failed: number };
}

export const useGetQueueHealth = () => {
  return useQuery({
    queryKey: ['admin-queue-health'],
    queryFn: async () => {
      // Use the typed RPC client when the route is registered there;
      // fall back to fetch so the widget works during this transition.
      const res = await fetch('/api/admin/queues');
      if (!res.ok) throw new Error('Failed to fetch queue health');
      return (await res.json()) as { email: QueueHealth; whatsapp: QueueHealth };
    },
    refetchInterval: 60_000, // match server-side cache TTL
  });
};
