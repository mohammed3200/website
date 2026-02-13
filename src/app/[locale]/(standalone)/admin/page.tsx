import { auth } from '@/auth';
import { db } from '@/lib/db';
import {
  Users,
  ClipboardList,
  Target,
  Newspaper,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  // Fetch dashboard statistics
  const [
    totalInnovators,
    totalCollaborators,
    pendingInnovators,
    pendingCollaborators,
    totalStrategicPlans,
    totalNews,
    approvedInnovators,
    approvedCollaborators,
  ] = await Promise.all([
    db.innovator.count(),
    db.collaborator.count(),
    db.innovator.count({ where: { status: 'PENDING' } }),
    db.collaborator.count({ where: { status: 'PENDING' } }),
    db.strategicPlan.count({ where: { isActive: true } }),
    db.news.count({ where: { isActive: true } }),
    db.innovator.count({ where: { status: 'APPROVED' } }),
    db.collaborator.count({ where: { status: 'APPROVED' } }),
  ]);

  const isArabic = locale === 'ar';

  const stats = [
    {
      name: isArabic ? 'المبتكرون' : 'Total Innovators',
      value: totalInnovators,
      icon: Users,
      change: `+${approvedInnovators}`,
      changeType: 'positive' as const,
    },
    {
      name: isArabic ? 'الشركاء' : 'Total Collaborators',
      value: totalCollaborators,
      icon: Users,
      change: `+${approvedCollaborators}`,
      changeType: 'positive' as const,
    },
    {
      name: isArabic ? 'طلبات قيد المراجعة' : 'Pending Reviews',
      value: pendingInnovators + pendingCollaborators,
      icon: Clock,
      change: isArabic ? 'يتطلب اهتمام' : 'Needs attention',
      changeType: 'warning' as const,
    },
    {
      name: isArabic ? 'الخطط الاستراتيجية' : 'Strategic Plans',
      value: totalStrategicPlans,
      icon: Target,
      change: isArabic ? 'نشطة' : 'Active',
      changeType: 'neutral' as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isArabic ? 'لوحة التحكم' : 'Dashboard Overview'}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {isArabic
            ? `مرحباً، ${session?.user?.name || 'المشرف'}`
            : `Welcome back, ${session?.user?.name || 'Admin'}`}
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
          {isArabic ? 'إجراءات سريعة' : 'Quick Actions'}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href={`/${locale}/admin/submissions`}
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <ClipboardList className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold text-gray-900">
                {isArabic ? 'مراجعة الطلبات' : 'Review Submissions'}
              </p>
              <p className="text-sm text-gray-600">
                {pendingInnovators + pendingCollaborators}{' '}
                {isArabic ? 'في الانتظار' : 'pending'}
              </p>
            </div>
          </a>

          <a
            href={`/${locale}/admin/content`}
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <Newspaper className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold text-gray-900">
                {isArabic ? 'إدارة المحتوى' : 'Manage Content'}
              </p>
              <p className="text-sm text-gray-600">
                {isArabic ? 'تحرير الصفحات' : 'Edit pages'}
              </p>
            </div>
          </a>

          <a
            href={`/${locale}/admin/reports`}
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <TrendingUp className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold text-gray-900">
                {isArabic ? 'إنشاء تقرير' : 'Generate Report'}
              </p>
              <p className="text-sm text-gray-600">
                {isArabic ? 'تقارير مخصصة' : 'Custom reports'}
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {isArabic ? 'النشاط الأخير' : 'Recent Activity'}
        </h2>
        <p className="text-sm text-gray-500">
          {isArabic
            ? 'سيتم عرض النشاط الأخير هنا قريباً'
            : 'Recent activity will be displayed here soon.'}
        </p>
      </div>
    </div>
  );
}
