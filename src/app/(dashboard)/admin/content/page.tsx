'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/features/admin/hooks/use-admin-auth';
import { Skeleton } from '@/components/skeletons';

// Use Prisma type instead of local fallback
import type { PageContent } from '@prisma/client';
import { useGetPageContent } from '@/features/page-content/api/use-get-page-content';

import { Plus, Edit, Trash2 } from 'lucide-react';

import { checkPermission, RESOURCES, ACTIONS } from '@/lib/rbac-base';

const UI_LABELS = {
  TITLE: 'Content Management',
  DESCRIPTION: 'Manage platform pages',
  ADD: 'Add',
  COMING_SOON: 'Coming Soon',
  NO_CONTENT: 'No content found',
  SECTIONS: {
    ENTREPRENEURSHIP: 'Entrepreneurship',
    INCUBATORS: 'Incubators',
  },
  ARIA: {
    EDIT: 'Edit content',
    DELETE: 'Delete content',
    TABS: 'Tabs',
  },
} as const;

const ContentManagementPage = () => {
  const router = useRouter();
  const { session, status } = useAdminAuth();

  const hasContentAccess = useMemo(() => {
    return checkPermission(
      session?.user?.permissions as any,
      RESOURCES.CONTENT,
      ACTIONS.MANAGE,
    );
  }, [session]);

  const { data: entrepreneurshipContent, isLoading: isLoadingEnt } =
    useGetPageContent('entrepreneurship', { enabled: hasContentAccess });
  const { data: incubatorsContent, isLoading: isLoadingInc } =
    useGetPageContent('incubators', { enabled: hasContentAccess });

  useEffect(() => {
    if (status === 'authenticated' && !hasContentAccess) {
      router.push('/');
    }
  }, [status, hasContentAccess, router]);

  // Early return to prevent flash of content before redirect
  if (status === 'authenticated' && !hasContentAccess) {
    return null;
  }

  if (status === 'loading' || isLoadingEnt || isLoadingInc) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96" />
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!session) return null;

  const renderContentList = (content: PageContent[] | undefined) => (
    <div className="space-y-4">
      {!content || content.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">{UI_LABELS.NO_CONTENT}</p>
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
                    Order: {item.order}
                  </span>
                  {!item.isActive && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Inactive
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  {item.titleEn || item.titleAr}
                </h3>

                {(item.contentEn || item.contentAr) && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {item.contentEn || item.contentAr}
                  </p>
                )}

                {item.icon && (
                  <p className="text-sm text-gray-500 mt-2">
                    Icon: {item.icon}
                  </p>
                )}
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  disabled
                  aria-disabled="true"
                  aria-label={UI_LABELS.ARIA.EDIT}
                  title={UI_LABELS.COMING_SOON}
                  className="inline-flex items-center justify-center p-2 text-sm font-semibold text-gray-400 bg-gray-50 border border-gray-200 rounded-md cursor-not-allowed"
                >
                  <Edit className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  disabled
                  aria-disabled="true"
                  aria-label={UI_LABELS.ARIA.DELETE}
                  title={UI_LABELS.COMING_SOON}
                  className="inline-flex items-center justify-center p-2 text-sm font-semibold text-white bg-red-300 rounded-md cursor-not-allowed"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
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
        <h1 className="text-3xl font-bold text-gray-900">{UI_LABELS.TITLE}</h1>
        <p className="mt-2 text-sm text-gray-600">{UI_LABELS.DESCRIPTION}</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label={UI_LABELS.ARIA.TABS}>
          <a
            href="#entrepreneurship"
            className="border-primary text-primary whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
          >
            {UI_LABELS.SECTIONS.ENTREPRENEURSHIP}
          </a>
          <a
            href="#incubators"
            className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
          >
            {UI_LABELS.SECTIONS.INCUBATORS}
          </a>
        </nav>
      </div>

      {/* Entrepreneurship Section */}
      <div id="entrepreneurship" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {UI_LABELS.SECTIONS.ENTREPRENEURSHIP}
          </h2>
          <button
            disabled
            aria-disabled="true"
            title={UI_LABELS.COMING_SOON}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary/50 rounded-md cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            {UI_LABELS.ADD}
          </button>
        </div>
        {renderContentList(entrepreneurshipContent)}
      </div>

      {/* Incubators Section */}
      <div id="incubators" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {UI_LABELS.SECTIONS.INCUBATORS}
          </h2>
          <button
            disabled
            aria-disabled="true"
            title={UI_LABELS.COMING_SOON}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary/50 rounded-md cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            {UI_LABELS.ADD}
          </button>
        </div>
        {renderContentList(incubatorsContent)}
      </div>
    </div>
  );
};

export default ContentManagementPage;
