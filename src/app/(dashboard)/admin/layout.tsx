'use client';

import { useAdminAuth } from '@/features/admin/hooks/use-admin-auth';
import { NotificationBell } from '@/features/admin/components/notification-bell';
import { Skeleton } from '@/components/skeletons';
import Sidebar from '@/features/admin/components/sidebar';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { session, status } = useAdminAuth();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Skeleton className="h-16 w-full mb-8" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-gray-50" dir="ltr">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notification Bell */}
              <NotificationBell />

              {/* User Info */}
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
              <div className="flex items-center gap-x-3">
                <span className="text-sm font-semibold text-gray-900">
                  {session.user.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
