'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import useLanguage from '@/hooks/use-language';
import { useGetDashboardStats } from '@/features/admin/api/use-dashboard-stats';
import { useAdminAuth } from '@/features/admin/hooks/use-admin-auth';

import {
  Users,
  ClipboardList,
  Target,
  Newspaper,
  TrendingUp,
  Clock,
} from 'lucide-react';

const AdminDashboardPage = () => {
  const t = useTranslations('Admin.Dashboard');
  const { lang, isArabic } = useLanguage();
  const { session } = useAdminAuth();
  const { data: statsData, isLoading } = useGetDashboardStats();

  const stats = useMemo(
    () => [
      {
        name: t('stats.innovators'),
        value: statsData?.totalInnovators || 0,
        icon: Users,
        change: `+${statsData?.approvedInnovators || 0}`,
        changeType: 'positive' as const,
      },
      {
        name: t('stats.collaborators'),
        value: statsData?.totalCollaborators || 0,
        icon: Users,
        change: `+${statsData?.approvedCollaborators || 0}`,
        changeType: 'positive' as const,
      },
      {
        name: t('stats.pending'),
        value:
          (statsData?.pendingInnovators || 0) +
          (statsData?.pendingCollaborators || 0),
        icon: Clock,
        change: t('stats.needsAttention'),
        changeType: 'warning' as const,
      },
      {
        name: t('stats.strategicPlans'),
        value: statsData?.totalStrategicPlans || 0,
        icon: Target,
        change: t('stats.active'),
        changeType: 'neutral' as const,
      },
    ],
    [statsData, t],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {t('welcome', {
            name: session?.user?.name || (isArabic ? 'المشرف' : 'Admin'),
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon
                    className="h-8 w-8 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <div className={`${isArabic ? 'mr-5' : 'ml-5'} w-0 flex-1`}>
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div
                        className={`${isArabic ? 'mr-2' : 'ml-2'} flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'positive'
                            ? 'text-green-600'
                            : stat.changeType === 'warning'
                              ? 'text-yellow-600'
                              : 'text-gray-600'
                        }`}
                      >
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('quickActions.title')}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href={`/${lang}/admin/submissions`}
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <ClipboardList className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold text-gray-900">
                {t('quickActions.reviewSubmissions')}
              </p>
              <p className="text-sm text-gray-600">
                {t('quickActions.pendingCount', {
                  count:
                    (statsData?.pendingInnovators || 0) +
                    (statsData?.pendingCollaborators || 0),
                })}
              </p>
            </div>
          </Link>

          <Link
            href={`/${lang}/admin/content`}
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <Newspaper className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold text-gray-900">
                {t('quickActions.manageContent')}
              </p>
              <p className="text-sm text-gray-600">
                {t('quickActions.editPages')}
              </p>
            </div>
          </Link>

          <Link
            href={`/${lang}/admin/reports`}
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <TrendingUp className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold text-gray-900">
                {t('quickActions.generateReport')}
              </p>
              <p className="text-sm text-gray-600">
                {t('quickActions.customReports')}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('recentActivity.title')}
        </h2>
        <p className="text-sm text-gray-500">{t('recentActivity.empty')}</p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
