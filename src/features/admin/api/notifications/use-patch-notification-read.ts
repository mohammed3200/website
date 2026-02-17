'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export const usePatchNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await client.api.admin.notifications[':id'].read.$patch({
        param: { id },
      });
      if (!res.ok) {
        const error = (await res.json()) as any;
        throw new Error(error.error || 'Failed to mark as read');
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
    },
  });
};
