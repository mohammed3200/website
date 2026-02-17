'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Note: In some implementations this was a fetch() call, let's use client if possible
      const res = await client.api.admin.notifications[':id'].$delete({
        param: { id },
      });
      if (!res.ok) {
        const error = (await res.json()) as any;
        throw new Error(error.error || 'Failed to delete notification');
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
    },
  });
};
