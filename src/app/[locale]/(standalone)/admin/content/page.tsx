import { auth } from '@/auth';
import { getPageContent } from '@/features/page-content/server/route';
import { redirect } from 'next/navigation';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default async function ContentManagementPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/auth/login`);
  }

  const permissions = session.user.permissions as
    | Array<{ resource: string; action: string }>
    | undefined;

  const hasContentAccess = permissions?.some(
    (p) => p.resource === 'content' && p.action === 'manage',
  );

  if (!hasContentAccess) {
    redirect(`/${locale}/admin`); // Or another appropriate access-denied route
  }

  const isArabic = locale === 'ar';

  // Fetch all page content
  const [entrepreneurshipContent, incubatorsContent] = await Promise.all([
    getPageContent('entrepreneurship'),
    getPageContent('incubators'),
  ]);

  const renderContentList = (
    content: typeof entrepreneurshipContent,
    pageName: string,
  ) => (
    <div className="space-y-4">
      {content.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">
            {isArabic ? 'لا يوجد محتوى' : 'No content found'}
          </p>
        </div>
      ) : (
        content.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {item.section}
                  </span>
                  <span className="text-sm text-gray-500">
                    {isArabic ? 'الترتيب' : 'Order'}: {item.order}
                  </span>
                  {!item.isActive && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {isArabic ? 'غير نشط' : 'Inactive'}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  {isArabic
                    ? item.titleAr || item.titleEn
                    : item.titleEn || item.titleAr}
                </h3>

                {(item.contentEn || item.contentAr) && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {isArabic
                      ? item.contentAr || item.contentEn
                      : item.contentEn || item.contentAr}
                  </p>
                )}

                {item.icon && (
                  <p className="text-sm text-gray-500 mt-2">
                    {isArabic ? 'الأيقونة' : 'Icon'}: {item.icon}
                  </p>
                )}
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  disabled
                  aria-disabled="true"
                  title={isArabic ? 'قريباً' : 'Coming Soon'}
                  className="inline-flex items-center justify-center p-2 text-sm font-semibold text-gray-400 bg-gray-50 border border-gray-200 rounded-md cursor-not-allowed"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  disabled
                  aria-disabled="true"
                  title={isArabic ? 'قريباً' : 'Coming Soon'}
                  className="inline-flex items-center justify-center p-2 text-sm font-semibold text-white bg-red-300 rounded-md cursor-not-allowed"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isArabic ? 'إدارة المحتوى' : 'Content Management'}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {isArabic
            ? 'إدارة محتوى صفحات ريادة الأعمال وحاضنات الأعمال'
            : 'Manage content for entrepreneurship and incubators pages'}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <a
            href="#entrepreneurship"
            className="border-primary text-primary whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
          >
            {isArabic ? 'ريادة الأعمال' : 'Entrepreneurship'}
          </a>
          <a
            href="#incubators"
            className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
          >
            {isArabic ? 'حاضنات الأعمال' : 'Incubators'}
          </a>
        </nav>
      </div>

      {/* Entrepreneurship Section */}
      <div id="entrepreneurship" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {isArabic ? 'محتوى ريادة الأعمال' : 'Entrepreneurship Content'}
          </h2>
          <button
            disabled
            aria-disabled="true"
            title={isArabic ? 'قريباً' : 'Coming Soon'}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary/50 rounded-md cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            {isArabic ? 'إضافة محتوى' : 'Add Content'}
          </button>
        </div>
        {renderContentList(entrepreneurshipContent, 'entrepreneurship')}
      </div>

      {/* Incubators Section */}
      <div id="incubators" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {isArabic ? 'محتوى حاضنات الأعمال' : 'Incubators Content'}
          </h2>
          <button
            disabled
            aria-disabled="true"
            title={isArabic ? 'قريباً' : 'Coming Soon'}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary/50 rounded-md cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            {isArabic ? 'إضافة محتوى' : 'Add Content'}
          </button>
        </div>
        {renderContentList(incubatorsContent, 'incubators')}
      </div>
    </div>
  );
}
