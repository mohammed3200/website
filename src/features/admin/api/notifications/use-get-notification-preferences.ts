'use client';

import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export interface NotificationPreferences {
  emailNewSubmissions?: boolean;
  emailStatusChanges?: boolean;
  emailSystemErrors?: boolean;
  emailSecurityAlerts?: boolean;
  emailUserActivity?: boolean;
  emailBackups?: boolean;
  digestMode?: 'immediate' | 'daily' | 'weekly';
}

export const useGetNotificationPreferences = () => {
  return useQuery({
    queryKey: ['admin-notifications', 'preferences'],
    queryFn: async () => {
      const res = await client.api.admin.notifications.preferences.$get();
      if (!res.ok) throw new Error('Failed to fetch preferences');
      const data = await res.json();
      return (data as { preferences: NotificationPreferences }).preferences;
    },
  });
};
