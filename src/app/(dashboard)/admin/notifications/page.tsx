'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  type Notification,
} from '@/features/admin/api/use-notifications';
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
import { cn } from '@/lib/utils';
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  X,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'URGENT':
      return 'bg-red-500 text-white';
    case 'HIGH':
      return 'bg-orange-500 text-white';
    case 'NORMAL':
      return 'bg-blue-500 text-white';
    case 'LOW':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    NEW_REGISTRATION: 'New Registration',
    NEW_COLLABORATOR: 'New Collaborator',
    NEW_INNOVATOR: 'New Innovator',
    SUBMISSION_APPROVED: 'Submission Approved',
    SUBMISSION_REJECTED: 'Submission Rejected',
    SYSTEM_ERROR: 'System Error',
    SECURITY_ALERT: 'Security Alert',
    USER_ACCOUNT_CREATED: 'User Account Created',
    ROLE_CHANGED: 'Role Changed',
    DATABASE_BACKUP_COMPLETE: 'Backup Complete',
    FAILED_LOGIN_ATTEMPTS: 'Failed Login Attempts',
  };
  return labels[type] || type;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{
    type?: string;
    isRead?: boolean;
    priority?: string;
  }>({});
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);

  const { data, isLoading, error } = useNotifications({
    page,
    limit: 20,
    ...filters,
  });

  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markRead.mutateAsync(notification.id);
    }
    if (notification.actionUrl) {
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
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const handleMarkSelectedRead = async () => {
    for (const id of selectedNotifications) {
      await markRead.mutateAsync(id);
    }
    setSelectedNotifications([]);
  };

  const handleDeleteClick = (id: string) => {
    setNotificationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (notificationToDelete) {
      await deleteNotification.mutateAsync(notificationToDelete);
      setNotificationToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllRead.mutateAsync();
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            Manage and review system notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          {data?.pagination.total && data.pagination.total > 0 && (
            <Button
              variant="outline"
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
            <span className="text-sm font-medium text-gray-700">Filters:</span>
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
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="NEW_COLLABORATOR">New Collaborator</SelectItem>
              <SelectItem value="NEW_INNOVATOR">New Innovator</SelectItem>
              <SelectItem value="SUBMISSION_APPROVED">Approved</SelectItem>
              <SelectItem value="SUBMISSION_REJECTED">Rejected</SelectItem>
              <SelectItem value="SYSTEM_ERROR">System Error</SelectItem>
              <SelectItem value="SECURITY_ALERT">Security Alert</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.isRead !== undefined ? filters.isRead.toString() : 'all'}
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
              <SelectValue placeholder="Priority" />
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
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm text-blue-900">
            {selectedNotifications.length} notification(s) selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkSelectedRead}
              disabled={markRead.isPending}
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark as read
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
                  selectedNotifications.length === data?.notifications.length &&
                  data.notifications.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">
                Select all ({data?.notifications.length} notifications)
              </span>
            </div>
            <div className="divide-y">
              {data?.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'p-4 hover:bg-gray-50 transition-colors',
                    !notification.isRead && 'bg-blue-50'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedNotifications.includes(notification.id)}
                      onCheckedChange={() => handleSelectNotification(notification.id)}
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
                              className={cn('text-xs', getPriorityColor(notification.priority))}
                            >
                              {notification.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getTypeLabel(notification.type)}
                            </Badge>
                            {!notification.isRead && (
                              <Badge variant="default" className="text-xs bg-blue-600">
                                New
                              </Badge>
                            )}
                          </div>
                          <h3
                            className={cn(
                              'text-sm font-medium mb-1',
                              !notification.isRead && 'font-semibold'
                            )}
                          >
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatTimeAgo(new Date(notification.createdAt))}
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
            {data?.pagination.totalPages && data.pagination.totalPages > 1 && (
              <div className="border-t p-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Page {data.pagination.page} of {data.pagination.totalPages} (
                  {data.pagination.total} total)
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
                        Math.min(data.pagination.totalPages, p + 1)
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
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this notification? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
