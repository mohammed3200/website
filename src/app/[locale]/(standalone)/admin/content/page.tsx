'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import useLanguage from '@/hooks/use-language';
import { useGetPageContent } from '@/features/page-content/api/use-get-page-content';
import { PERMISSIONS } from '@/constants';
import type { PageContent } from '@prisma/client'; // Valid assumption? or from types?
import { useEffect, useMemo } from 'react';

// Fallback type if Prisma type isn't readily available or to be safe
type ContentItem = {
  id: string;
  section: string;
  order: number;
  isActive: boolean;
  titleAr: string | null;
  titleEn: string | null;
  contentAr: string | null;
  contentEn: string | null;
  icon: string | null;
};

export default function ContentManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations('Admin.Content');
  const { isArabic, lang } = useLanguage();

  const hasContentAccess = useMemo(() => {
    if (status !== 'authenticated' || !session?.user) return false;

    const permissions = session.user.permissions as
      | Array<{ resource: string; action: string }>
      | undefined;

    return permissions?.some(
      (p) =>
        p.resource === PERMISSIONS.CONTENT.RESOURCE &&
        p.action === PERMISSIONS.CONTENT.ACTION,
    );
  }, [status, session]);

  const { data: entrepreneurshipContent, isLoading: isLoadingEnt } =
    useGetPageContent('entrepreneurship', { enabled: hasContentAccess });
  const { data: incubatorsContent, isLoading: isLoadingInc } =
    useGetPageContent('incubators', { enabled: hasContentAccess });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${lang}/auth/login`);
    } else if (status === 'authenticated' && !hasContentAccess) {
      router.push(`/${lang}/admin`);
    }
  }, [status, hasContentAccess, router, lang]);

  if (status === 'loading' || isLoadingEnt || isLoadingInc) {
    return (
      <div className="p-8 text-center">
        {t('Common.loading', { defaultMessage: 'Loading...' })}
      </div>
    );
  }

  if (!session) return null;

  const renderContentList = (
    content: ContentItem[] | undefined,
    pageName: string,
  ) => (
    <div className="space-y-4">
      {!content || content.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">{t('empty')}</p>
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
                    {t('labels.order')}: {item.order}
                  </span>
                  {!item.isActive && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {t('labels.inactive')}
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
                    {t('labels.icon')}: {item.icon}
                  </p>
                )}
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  disabled
                  aria-disabled="true"
                  title={t('labels.comingSoon')}
                  className="inline-flex items-center justify-center p-2 text-sm font-semibold text-gray-400 bg-gray-50 border border-gray-200 rounded-md cursor-not-allowed"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  disabled
                  aria-disabled="true"
                  title={t('labels.comingSoon')}
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
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-2 text-sm text-gray-600">{t('description')}</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <a
            href="#entrepreneurship"
            className="border-primary text-primary whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
          >
            {t('tabs.entrepreneurship')}
          </a>
          <a
            href="#incubators"
            className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
          >
            {t('tabs.incubators')}
          </a>
        </nav>
      </div>

      {/* Entrepreneurship Section */}
      <div id="entrepreneurship" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('sections.entrepreneurship')}
          </h2>
          <button
            disabled
            aria-disabled="true"
            title={t('labels.comingSoon')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary/50 rounded-md cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            {t('actions.add')}
          </button>
        </div>
        {renderContentList(
          entrepreneurshipContent as ContentItem[],
          'entrepreneurship',
        )}
      </div>

      {/* Incubators Section */}
      <div id="incubators" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('sections.incubators')}
          </h2>
          <button
            disabled
            aria-disabled="true"
            title={t('labels.comingSoon')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary/50 rounded-md cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            {t('actions.add')}
          </button>
        </div>
        {renderContentList(incubatorsContent as ContentItem[], 'incubators')}
      </div>
    </div>
  );
}
