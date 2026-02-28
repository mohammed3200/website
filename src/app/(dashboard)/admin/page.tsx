'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useGetDashboardStats } from '@/features/admin/api/stats/use-get-dashboard-stats';
import { useAdminAuth } from '@/features/admin/hooks/use-admin-auth';

import {
  Users,
  ClipboardList,
  Target,
  Newspaper,
  TrendingUp,
  Clock,
  Download,
} from 'lucide-react';

import { SubmissionTrendsChart } from '@/features/admin/components/dashboard/submission-trends-chart';
import { StatusBreakdownChart } from '@/features/admin/components/dashboard/status-breakdown-chart';
import { RecentActivityFeed } from '@/features/admin/components/dashboard/recent-activity-feed';
import { DashboardDateFilter } from '@/features/admin/components/dashboard/dashboard-date-filter';
import { DashboardStatsGridSkeleton } from '@/components/skeletons';
import { Button } from '@/components/ui/button';

const AdminDashboardPage = () => {
  const { session } = useAdminAuth();
  const { data: statsData, isLoading } = useGetDashboardStats();

  const [dateRange, setDateRange] = useState('LAST_30_DAYS');

  const stats = useMemo(
    () => [
      {
        name: 'Total Innovators',
        value: statsData?.totalInnovators || 0,
        icon: Users,
        change: `+${statsData?.approvedInnovators || 0}`,
        changeType: 'positive' as const,
      },
      {
        name: 'Total Collaborators',
        value: statsData?.totalCollaborators || 0,
        icon: Users,
        change: `+${statsData?.approvedCollaborators || 0}`,
        changeType: 'positive' as const,
      },
      {
        name: 'Pending Reviews',
        value:
          (statsData?.pendingInnovators || 0) +
          (statsData?.pendingCollaborators || 0),
        icon: Clock,
        change: 'Needs Attention',
        changeType: 'warning' as const,
      },
      {
        name: 'Strategic Plans',
        value: statsData?.totalStrategicPlans || 0,
        icon: Target,
        change: 'Active',
        changeType: 'neutral' as const,
      },
    ],
    [statsData],
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-9 w-64 bg-muted animate-pulse rounded mb-2" />
            <div className="h-5 w-48 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <DashboardStatsGridSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="ltr">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back, {session?.user?.name || 'Admin'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DashboardDateFilter value={dateRange} onChange={setDateRange} />
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center gap-2"
            disabled
            title="Coming Soon"
          >
            <Download className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
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
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div
                        className={`ml-2 flex items-baseline text-sm font-semibold ${
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

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SubmissionTrendsChart
          year={(() => {
            const currentYear = new Date().getFullYear();
            // Handle edge case where LAST_MONTH in January means previous year
            if (dateRange === 'LAST_MONTH' && new Date().getMonth() === 0) {
              return currentYear - 1;
            }
            return currentYear;
          })()}
        />
        <StatusBreakdownChart />
      </div>

      {/* Row 2: Quick Actions & Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <Link
              href="/admin/submissions"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <ClipboardList className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold text-gray-900">
                  Review Submissions
                </p>
                <p className="text-sm text-gray-600">
                  {(statsData?.pendingInnovators || 0) +
                    (statsData?.pendingCollaborators || 0)}{' '}
                  pending reviews
                </p>
              </div>
            </Link>

            <Link
              href="/admin/content"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <Newspaper className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold text-gray-900">Manage Content</p>
                <p className="text-sm text-gray-600">
                  Edit platform pages and news
                </p>
              </div>
            </Link>

            <Link
              href="/admin/reports"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <TrendingUp className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold text-gray-900">Generate Report</p>
                <p className="text-sm text-gray-600">Export custom analytics</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Activity Feed */}
        <RecentActivityFeed />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
