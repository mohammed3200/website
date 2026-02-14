'use client';

import Sidebar from '@/features/admin/components/sidebar';
import { NotificationBell } from '@/features/admin/components/notification-bell';
import { useAdminAuth } from '@/features/admin/hooks/use-admin-auth';
import useLanguage from '@/hooks/use-language';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, status } = useAdminAuth();
  const { lang: locale } = useLanguage();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-orange-600" />
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div
      className="min-h-screen bg-gray-50"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Sidebar */}
      <Sidebar locale={locale} />

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
}
