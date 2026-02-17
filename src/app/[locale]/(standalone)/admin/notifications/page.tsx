'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import useLanguage from '@/hooks/use-language';
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  formatTimeAgo,
  getPriorityColor,
  getTypeLabel,
} from '@/features/admin/utils';

export default function NotificationsPage() {
  const router = useRouter();
  const t = useTranslations('Admin.Notifications');
  const { lang, isArabic } = useLanguage();

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
    if (notification.actionUrl) {
      router.push(`/${lang}${notification.actionUrl}`);
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
    t('dialogs.deleteTitle'),
    t('dialogs.deleteConfirm'),
    'destructive',
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
    <div className="flex-1 space-y-8 p-8 pt-6 font-din-regular">
      <DeleteDialog />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-600 mt-1">{t('subtitle')}</p>
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
              {t('actions.refresh')}
            </Button>
            {data?.pagination.total && data.pagination.total > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllRead}
                disabled={markAllRead.isPending}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                {t('actions.markAllRead')}
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {t('filters.label')}
              </span>
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
                <SelectValue placeholder={t('filters.type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('statusLabels.all')}</SelectItem>
                <SelectItem value="NEW_COLLABORATOR">
                  {t('types.NEW_COLLABORATOR')}
                </SelectItem>
                <SelectItem value="NEW_INNOVATOR">
                  {t('types.NEW_INNOVATOR')}
                </SelectItem>
                <SelectItem value="SUBMISSION_APPROVED">
                  {t('types.SUBMISSION_APPROVED')}
                </SelectItem>
                <SelectItem value="SUBMISSION_REJECTED">
                  {t('types.SUBMISSION_REJECTED')}
                </SelectItem>
                <SelectItem value="SYSTEM_ERROR">
                  {t('types.SYSTEM_ERROR')}
                </SelectItem>
                <SelectItem value="SECURITY_ALERT">
                  {t('types.SECURITY_ALERT')}
                </SelectItem>
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
                <SelectValue placeholder={t('filters.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('statusLabels.all')}</SelectItem>
                <SelectItem value="false">
                  {t('statusLabels.unread')}
                </SelectItem>
                <SelectItem value="true">{t('statusLabels.read')}</SelectItem>
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
                <SelectValue placeholder={t('filters.priority')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.priority')}</SelectItem>
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
                {t('filters.clear')}
              </Button>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <span className="text-sm text-blue-900">
              {t('selected', { count: selectedNotifications.length })}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkSelectedRead}
                disabled={markRead.isPending}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                {t('actions.markSelectedRead')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedNotifications([])}
              >
                {t('actions.cancel')}
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
              <p className="text-gray-600">{t('error')}</p>
            </div>
          ) : data?.notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12">
              <Bell className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-600">{t('empty')}</p>
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
                <span className="text-sm text-gray-600">
                  {t('actions.selectAll')}
                </span>
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
                                {getTypeLabel(notification.type, t)}
                              </Badge>
                              {!notification.isRead && (
                                <Badge
                                  variant="default"
                                  className="text-xs bg-blue-600"
                                >
                                  {t('statusLabels.new')}
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
                                lang,
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
