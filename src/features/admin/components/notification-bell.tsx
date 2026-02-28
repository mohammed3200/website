'use client';

import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  useGetNotifications,
  type Notification,
} from '@/features/admin/api/notifications/use-get-notifications';
import {
  formatTimeAgo,
  getPriorityColor,
  getTypeLabel,
  isSafeAdminUrl,
} from '@/features/admin/utils';
import { usePatchNotificationRead } from '@/features/admin/api/notifications/use-patch-notification-read';
import { usePatchNotificationsMarkAllRead } from '@/features/admin/api/notifications/use-patch-notifications-mark-all-read';

export function NotificationBell() {
  const router = useRouter();
  const locale = useLocale();

  const { data } = useGetNotifications();
  const markReadMutation = usePatchNotificationRead();
  const markAllReadMutation = usePatchNotificationsMarkAllRead();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none">
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllReadMutation.mutate()}
              className="text-xs text-orange-600 hover:text-orange-700 font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-gray-500">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification: Notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  'flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-gray-50 border-b border-gray-50 last:border-0',
                  !notification.isRead && 'bg-orange-50/50',
                )}
                onClick={() => {
                  if (!notification.isRead)
                    markReadMutation.mutate(notification.id);

                  if (
                    notification.actionUrl &&
                    isSafeAdminUrl(notification.actionUrl)
                  ) {
                    try {
                      // Parse URL to check for potential bypasses
                      const url = new URL(
                        notification.actionUrl,
                        typeof window !== 'undefined'
                          ? window.location.origin
                          : 'http://localhost',
                      );

                      // Ensure absolute URLs are same-origin
                      if (
                        notification.actionUrl.startsWith('http') &&
                        url.origin !== window.location.origin
                      ) {
                        return;
                      }

                      // Navigate using path + search + hash only
                      router.push(`${url.pathname}${url.search}${url.hash}`);
                    } catch (e) {
                      // Fallback for relative paths if URL parsing fails
                      if (!notification.actionUrl.startsWith('http')) {
                        router.push(notification.actionUrl);
                      }
                    }
                  }
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={cn(
                      'text-xs font-semibold px-2 py-0.5 rounded-full capitalize',
                      notification.type === 'NEW_INNOVATOR'
                        ? 'bg-blue-100 text-blue-700'
                        : notification.type === 'NEW_COLLABORATOR'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700',
                    )}
                  >
                    {getTypeLabel(notification.type).toLowerCase()}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                  {notification.title}
                </p>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {notification.message}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </div>
        {notifications.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-100">
            <button
              onClick={() =>
                router.push(`/${locale || 'en'}/admin/notifications`)
              }
              className="w-full text-center text-xs text-gray-500 hover:text-gray-900 py-1"
            >
              View all notifications
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
