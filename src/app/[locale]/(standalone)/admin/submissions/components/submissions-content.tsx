'use client';

import { useTranslations } from 'next-intl';
import { useSubmissionsLogic } from '@/features/admin/hooks/use-submissions-logic';

import { Innovator, Collaborator } from '@/features/admin/types';

import { Button } from '@/components/ui/button';
import { CardInnovators } from '@/features/innovators/components/card-innovators';
import { CardCompanies } from '@/features/collaborators/components/card-companies';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface SubmissionsContentProps {
  innovators: Innovator[];
  collaborators: Collaborator[];
}

const SubmissionsContent = ({
  innovators,
  collaborators,
}: SubmissionsContentProps) => {
  const t = useTranslations('Admin.Submissions');
  const { handleView, handleApprove, handleReject, isArabic } =
    useSubmissionsLogic();

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-outfit">
          {t('title')}
        </h1>
        <p className="mt-2 text-sm text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Innovators Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {t('innovators')}
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {innovators.length}
            </span>
          </h2>
        </div>

        {innovators.length === 0 ? (
          <div className="bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <p className="text-gray-500 font-medium">{t('empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {innovators.map((innovator) => (
              <div key={innovator.id} className="relative group">
                <CardInnovators
                  innovator={{
                    ...innovator,
                    email: innovator.email ?? undefined,
                    phone: innovator.phone ?? undefined,
                    projectDescription:
                      innovator.projectDescription ?? undefined,
                    objective: innovator.objective ?? undefined,
                    imageId: innovator.imageId ?? undefined,
                    location: innovator.location ?? undefined,
                    city: innovator.city ?? undefined,
                    country: innovator.country ?? undefined,
                    specialization:
                      innovator.fieldOfStudy || innovator.stageDevelopment,
                    stageDevelopment: innovator.stageDevelopment as any,
                    status: (['PENDING', 'APPROVED', 'REJECTED'].includes(
                      innovator.status,
                    )
                      ? (innovator.status as any)
                      : 'PENDING') as any,
                  }}
                  className="h-full"
                />

                {/* Admin Actions Overlay/Footer */}
                <div className="mt-4 flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5 me-1.5" />
                    {t('labels.submittedOn')}{' '}
                    {new Date(innovator.createdAt).toLocaleDateString(
                      isArabic ? 'ar-EG' : 'en-US',
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 text-xs font-bold border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                      onClick={() => handleApprove('innovators', innovator.id)}
                    >
                      <CheckCircle className="w-3.5 h-3.5 me-1.5" />
                      {t('actions.approve')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 text-xs font-bold border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                      onClick={() => handleReject('innovators', innovator.id)}
                    >
                      <XCircle className="w-3.5 h-3.5 me-1.5" />
                      {t('actions.reject')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Collaborators Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {t('collaborators')}
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {collaborators.length}
            </span>
          </h2>
        </div>

        {collaborators.length === 0 ? (
          <div className="bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <p className="text-gray-500 font-medium">{t('empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex flex-col gap-4">
                <CardCompanies
                  collaborator={{
                    ...collaborator,
                    status: (['PENDING', 'APPROVED', 'REJECTED'].includes(
                      collaborator.status,
                    )
                      ? (collaborator.status as any)
                      : 'PENDING') as any,
                    isVisible: collaborator.isVisible ?? false,
                    optionalPhoneNumber:
                      collaborator.optionalPhoneNumber ?? undefined,
                    location: collaborator.location ?? undefined,
                    experienceProvided:
                      collaborator.experienceProvided ?? undefined,
                    machineryAndEquipment:
                      collaborator.machineryAndEquipment ?? undefined,
                    imageId: collaborator.imageId ?? undefined,
                    site: collaborator.site ?? undefined,
                    createdAt: collaborator.createdAt,
                    updatedAt: collaborator.updatedAt,
                  }}
                  showStatus
                  onClick={() => handleView('collaborators', collaborator.id)}
                />

                {/* Admin Actions Footer */}
                <div className="flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 max-w-[600px]">
                  <div className="flex items-center text-xs text-gray-500 font-outfit">
                    <Clock className="w-3.5 h-3.5 me-1.5" />
                    {t('labels.submittedOn')}{' '}
                    {new Date(collaborator.createdAt).toLocaleDateString(
                      isArabic ? 'ar-EG' : 'en-US',
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 text-xs font-bold border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                      onClick={() =>
                        handleApprove('collaborators', collaborator.id)
                      }
                    >
                      <CheckCircle className="w-3.5 h-3.5 me-1.5" />
                      {t('actions.approve')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 text-xs font-bold border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                      onClick={() =>
                        handleReject('collaborators', collaborator.id)
                      }
                    >
                      <XCircle className="w-3.5 h-3.5 me-1.5" />
                      {t('actions.reject')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SubmissionsContent;
