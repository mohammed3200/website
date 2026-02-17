'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

export const usePatchNotificationsMarkAllRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res =
        await client.api.admin.notifications['mark-all-read'].$patch();
      if (!res.ok) {
        const error = (await res.json()) as any;
        throw new Error(error.error || 'Failed to mark all as read');
      }
      return await res.json();
    },
    onSuccess: () => {
      toast.success('All notifications marked as read');
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
