'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { NotificationPreferences } from './use-get-notification-preferences';

export const usePutNotificationPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (json: NotificationPreferences) => {
      const res = await client.api.admin.notifications.preferences.$put({
        json,
      });
      if (!res.ok) throw new Error('Failed to update preferences');
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-notifications', 'preferences'],
      });
    },
  });
};
