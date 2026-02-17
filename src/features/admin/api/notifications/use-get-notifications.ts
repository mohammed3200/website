'use client';

import { useQuery } from '@tanstack/react-query';
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
  unreadCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const useGetNotifications = (params?: {
  page?: number;
  limit?: number;
  type?: string;
  isRead?: boolean;
  priority?: string;
}) => {
  return useQuery({
    queryKey: ['admin-notifications', params],
    queryFn: async () => {
      const searchParams: Record<string, string> = {};
      if (params?.page) searchParams.page = params.page.toString();
      if (params?.limit) searchParams.limit = params.limit.toString();
      if (params?.type) searchParams.type = params.type;
      if (params?.isRead !== undefined)
        searchParams.isRead = params.isRead.toString();
      if (params?.priority) searchParams.priority = params.priority;

      const res = await client.api.admin.notifications.$get({
        query: searchParams,
      });

      if (!res.ok) throw new Error('Failed to fetch notifications');
      const data = await res.json();

      return {
        ...data,
        notifications: data.notifications.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          updatedAt: new Date(n.updatedAt),
          readAt: n.readAt ? new Date(n.readAt) : null,
        })),
      } as NotificationsResponse;
    },
  });
};
