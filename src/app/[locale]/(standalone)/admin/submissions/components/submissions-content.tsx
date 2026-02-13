'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import useLanguage from '@/hooks/use-language';
import { Button } from '@/components/ui/button';

// Define types locally if not available
type Innovator = {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectTitle: string;
  projectDescription?: string | null;
  location?: string | null;
  educationLevel?: string | null;
  stageDevelopment: string;
  createdAt: Date;
  // Add other fields as needed
};

type Collaborator = {
  id: string;
  companyName: string;
  email: string;
  primaryPhoneNumber: string;
  location?: string | null;
  industrialSector: string;
  specialization: string;
  createdAt: Date;
  // Add other fields as needed
};

interface SubmissionsContentProps {
  innovators: Innovator[];
  collaborators: Collaborator[];
}

export default function SubmissionsContent({
  innovators,
  collaborators,
}: SubmissionsContentProps) {
  const t = useTranslations('Admin.Submissions');
  const { lang, isArabic } = useLanguage();
  const router = useRouter();

  const handleView = (type: 'innovators' | 'collaborators', id: string) => {
    router.push(`/${lang}/admin/submissions/${type}/${id}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-2 text-sm text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Innovators Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('innovators')}{' '}
          <span className="text-sm text-gray-500">({innovators.length})</span>
        </h2>

        {innovators.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">{t('empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {innovators.map((innovator) => (
              <div
                key={innovator.id}
                className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {innovator.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {innovator.email}
                    </p>
                    <p className="text-sm text-gray-600">{innovator.phone}</p>

                    <div className="mt-4">
                      <p className="font-semibold text-gray-900">
                        {innovator.projectTitle}
                      </p>
                      {innovator.projectDescription && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {innovator.projectDescription}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {innovator.location && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {innovator.location}
                        </span>
                      )}
                      {innovator.educationLevel && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {innovator.educationLevel}
                        </span>
                      )}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {innovator.stageDevelopment}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView('innovators', innovator.id)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      {t('actions.view')}
                    </Button>
                    <Button
                      size="sm"
                      disabled
                      className="gap-2 bg-green-300 cursor-not-allowed hover:bg-green-300"
                      title="Coming Soon"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {t('actions.approve')}
                    </Button>
                    <Button
                      size="sm"
                      disabled
                      className="gap-2 bg-red-300 cursor-not-allowed hover:bg-red-300"
                      title="Coming Soon"
                    >
                      <XCircle className="h-4 w-4" />
                      {t('actions.reject')}
                    </Button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {t('labels.submittedOn')}{' '}
                  {new Date(innovator.createdAt).toLocaleDateString(
                    isArabic ? 'ar-EG' : 'en-US',
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Collaborators Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('collaborators')}{' '}
          <span className="text-sm text-gray-500">
            ({collaborators.length})
          </span>
        </h2>

        {collaborators.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">{t('empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {collaborator.companyName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {collaborator.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      {collaborator.primaryPhoneNumber}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {collaborator.location && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {collaborator.location}
                        </span>
                      )}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {collaborator.industrialSector}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {collaborator.specialization}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleView('collaborators', collaborator.id)
                      }
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      {t('actions.view')}
                    </Button>
                    <Button
                      size="sm"
                      disabled
                      className="gap-2 bg-green-300 cursor-not-allowed hover:bg-green-300"
                      title="Coming Soon"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {t('actions.approve')}
                    </Button>
                    <Button
                      size="sm"
                      disabled
                      className="gap-2 bg-red-300 cursor-not-allowed hover:bg-red-300"
                      title="Coming Soon"
                    >
                      <XCircle className="h-4 w-4" />
                      {t('actions.reject')}
                    </Button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {t('labels.submittedOn')}{' '}
                  {new Date(collaborator.createdAt).toLocaleDateString(
                    isArabic ? 'ar-EG' : 'en-US',
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
