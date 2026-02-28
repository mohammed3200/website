'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck, Trash2, Filter, X, RefreshCw } from 'lucide-react';

import { useGetNotifications } from '@/features/admin/api/notifications/use-get-notifications';
import { usePatchNotificationRead } from '@/features/admin/api/notifications/use-patch-notification-read';
import { usePatchNotificationsMarkAllRead } from '@/features/admin/api/notifications/use-patch-notifications-mark-all-read';
import { useDeleteNotification } from '@/features/admin/api/notifications/use-delete-notification';
import { type Notification } from '@/features/admin/api/notifications/use-get-notifications';
import { cn } from '@/lib/utils';
import { useConfirm } from '@/hooks/use-confirm';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

import {
  formatTimeAgo,
  getPriorityColor,
  getTypeLabel,
} from '@/features/admin/utils';

export const NOTIFICATION_TYPES = {
  NEW_COLLABORATOR: 'New Collaborator',
  NEW_INNOVATOR: 'New Innovator',
  SUBMISSION_APPROVED: 'Submission Approved',
  SUBMISSION_REJECTED: 'Submission Rejected',
  SYSTEM_ERROR: 'System Error',
  SECURITY_ALERT: 'Security Alert',
} as const;

const isSafeUrl = (url: string) => {
  return (
    url.startsWith('/admin/') ||
    url.startsWith('/en/admin/') ||
    url.startsWith('/ar/admin/')
  );
};

// Polyfill for getTypeLabel without translations
const labelMapper = (t: string) => {
  const key = (t.split('.').pop() || t) as keyof typeof NOTIFICATION_TYPES;
  return (
    NOTIFICATION_TYPES[key] ||
    key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

export default function NotificationsPage() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    [],
  );
  const [filters, setFilters] = useState<{
    type?: string;
    isRead?: boolean;
    priority?: string;
  }>({});

  const { data, isLoading, error, refetch, isFetching } = useGetNotifications({
    page,
    limit: 20,
    ...filters,
  });

  const markRead = usePatchNotificationRead();
  const markAllRead = usePatchNotificationsMarkAllRead();
  const deleteNotification = useDeleteNotification();

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markRead.mutateAsync(notification.id);
    }
    if (notification.actionUrl && isSafeUrl(notification.actionUrl)) {
      router.push(notification.actionUrl);
    }
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === data?.notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(data?.notifications.map((n) => n.id) || []);
    }
  };

  const handleSelectNotification = (id: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id],
    );
  };

  const handleMarkSelectedRead = async () => {
    for (const id of selectedNotifications) {
      await markRead.mutateAsync(id);
    }
    setSelectedNotifications([]);
  };

  const [DeleteDialog, confirmDelete] = useConfirm(
    'Delete Notification',
    'Are you sure you want to delete this notification?',
    'destructive',
    {
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    },
  );

  const handleDeleteClick = async (id: string) => {
    const ok = await confirmDelete();
    if (ok) {
      try {
        await deleteNotification.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete notification:', error);
      }
    }
  };

  const handleMarkAllRead = async () => {
    await markAllRead.mutateAsync();
  };

  const handleRefresh = () => {
    refetch();
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 font-din-regular" dir="ltr">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              Manage your platform notifications and alerts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isFetching}
            >
              <RefreshCw
                className={cn('h-4 w-4 mr-2', isFetching && 'animate-spin')}
              />
              Refresh
            </Button>
            {data?.pagination.total && data.pagination.total > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllRead}
                disabled={markAllRead.isPending}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
            </div>

            <Select
              value={filters.type || 'all'}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  type: value === 'all' ? undefined : value,
                }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Notification Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(NOTIFICATION_TYPES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={
                filters.isRead !== undefined ? filters.isRead.toString() : 'all'
              }
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  isRead: value === 'all' ? undefined : value === 'true',
                }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="false">Unread</SelectItem>
                <SelectItem value="true">Read</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.priority || 'all'}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  priority: value === 'all' ? undefined : value,
                }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Priority Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({})}
                className="text-gray-600"
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <span className="text-sm text-blue-900">
              {selectedNotifications.length} selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkSelectedRead}
                disabled={markRead.isPending}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark selected as read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedNotifications([])}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-12">
              <Bell className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-600">Failed to load notifications</p>
            </div>
          ) : data?.notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12">
              <Bell className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-600">No notifications found</p>
            </div>
          ) : (
            <>
              <div className="border-b p-4 flex items-center gap-2">
                <Checkbox
                  checked={
                    selectedNotifications.length ===
                      data?.notifications.length &&
                    data.notifications.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-gray-600">Select All</span>
              </div>
              <div className="divide-y">
                {data?.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-4 hover:bg-gray-50 transition-colors',
                      !notification.isRead && 'bg-blue-50',
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedNotifications.includes(
                          notification.id,
                        )}
                        onCheckedChange={() =>
                          handleSelectNotification(notification.id)
                        }
                        className="mt-1"
                      />
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                className={cn(
                                  'text-xs',
                                  getPriorityColor(notification.priority),
                                )}
                              >
                                {notification.priority}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {getTypeLabel(
                                  notification.type,
                                  labelMapper as any,
                                )}
                              </Badge>
                              {!notification.isRead && (
                                <Badge
                                  variant="default"
                                  className="text-xs bg-blue-600"
                                >
                                  New
                                </Badge>
                              )}
                            </div>
                            <h3
                              className={cn(
                                'text-sm font-medium mb-1',
                                !notification.isRead && 'font-semibold',
                              )}
                            >
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatTimeAgo(
                                new Date(notification.createdAt),
                                'en',
                              )}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(notification.id);
                            }}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data?.pagination.totalPages &&
                data.pagination.totalPages > 1 && (
                  <div className="border-t p-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Page {data.pagination.page} of{' '}
                      {data.pagination.totalPages} ({data.pagination.total}{' '}
                      total)
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPage((p) =>
                            Math.min(data.pagination.totalPages, p + 1),
                          )
                        }
                        disabled={page === data.pagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
            </>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <DeleteDialog />
      </div>
    </div>
  );
}
