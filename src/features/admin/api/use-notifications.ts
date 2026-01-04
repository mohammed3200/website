'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  readAt: Date | null;
  actionUrl: string | null;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface NotificationPreferences {
  emailNewSubmissions?: boolean;
  emailStatusChanges?: boolean;
  emailSystemErrors?: boolean;
  emailSecurityAlerts?: boolean;
  emailUserActivity?: boolean;
  emailBackups?: boolean;
  digestMode?: 'immediate' | 'daily' | 'weekly';
}

// Get notifications with filters
export function useNotifications(params?: {
  page?: number;
  limit?: number;
  type?: string;
  isRead?: boolean;
  priority?: string;
}) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.type) searchParams.set('type', params.type);
      if (params?.isRead !== undefined) searchParams.set('isRead', params.isRead.toString());
      if (params?.priority) searchParams.set('priority', params.priority);

      const res = await client.api.admin.notifications.$get({
        query: Object.fromEntries(searchParams),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch notifications');
      }

      return (await res.json()) as NotificationsResponse;
    },
  });
}

// Get unread notification count
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const res = await client.api.admin.notifications['unread-count'].$get();

      if (!res.ok) {
        throw new Error('Failed to fetch unread count');
      }

      const data = (await res.json()) as { count: number };
      return data.count;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

// Mark notification as read
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error('Failed to mark notification as read');
      }

      return (await res.json()) as { notification: Notification };
    },
    onSuccess: () => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// Mark all notifications as read
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await client.api.admin.notifications['mark-all-read'].$patch();

      if (!res.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      return (await res.json()) as { updated: number };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// Delete notification
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/notifications/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete notification');
      }

      return (await res.json()) as { success: boolean };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// Get notification preferences
export function useNotificationPreferences() {
  return useQuery({
    queryKey: ['notifications', 'preferences'],
    queryFn: async () => {
      const res = await client.api.admin.notifications.preferences.$get();

      if (!res.ok) {
        throw new Error('Failed to fetch preferences');
      }

      return (await res.json()) as { preferences: NotificationPreferences };
    },
  });
}

// Update notification preferences
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: NotificationPreferences) => {
      const res = await client.api.admin.notifications.preferences.$put({
        json: preferences,
      });

      if (!res.ok) {
        throw new Error('Failed to update preferences');
      }

      return (await res.json()) as { preferences: NotificationPreferences };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'preferences'] });
    },
  });
}

