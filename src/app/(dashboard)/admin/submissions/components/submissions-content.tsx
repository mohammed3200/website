'use client';

import { useSubmissionsLogic } from '@/features/admin/hooks/use-submissions-logic';
import { Innovator, Collaborator } from '@/features/admin/types';
import { Button } from '@/components/ui/button';
import { CardInnovators } from '@/features/innovators/components/card-innovators';
import { CardCompanies } from '@/features/collaborators/components/card-companies';
import { CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';

interface SubmissionsContentProps {
  innovators: Innovator[];
  collaborators: Collaborator[];
}

const SubmissionsContent = ({
  innovators,
  collaborators,
}: SubmissionsContentProps) => {
  const {
    handleView,
    handleApprove,
    handleReject,
    handleDelete,
    dialogs,
    isLoading,
  } = useSubmissionsLogic();

  return (
    <div className="space-y-12" dir="ltr">
      <dialogs.ApproveDialog />
      <dialogs.RejectDialog />
      <dialogs.DeleteDialog />
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-outfit">
          Submissions
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Review and manage innovator and collaborator submissions
        </p>
      </div>

      {/* Innovators Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Innovators
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {innovators.length}
            </span>
          </h2>
        </div>

        {innovators.length === 0 ? (
          <div className="bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <p className="text-gray-500 font-medium">
              No pending innovator submissions
            </p>
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
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    Submitted on{' '}
                    {new Date(innovator.createdAt).toLocaleDateString('en-US')}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 text-xs font-bold border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                      onClick={() => handleApprove('innovators', innovator.id)}
                      disabled={isLoading}
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 text-xs font-bold border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                      onClick={() => handleReject('innovators', innovator.id)}
                      disabled={isLoading}
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1.5" />
                      Reject
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete('innovators', innovator.id)}
                      disabled={isLoading}
                      aria-label="Delete innovator"
                    >
                      <Trash2 className="w-4 h-4" />
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
            Collaborators
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {collaborators.length}
            </span>
          </h2>
        </div>

        {collaborators.length === 0 ? (
          <div className="bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <p className="text-gray-500 font-medium">
              No pending collaborator submissions
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex flex-col gap-4">
                <CardCompanies
                  collaborator={{
                    ...collaborator,
                    status: ([
                      'PENDING',
                      'APPROVED',
                      'REJECTED',
                      'ARCHIVED',
                      'UNDER_REVIEW',
                    ].includes(collaborator.status)
                      ? (collaborator.status as any)
                      : 'PENDING') as any,
                    isVisible: collaborator.isVisible ?? false,
                    optionalPhoneNumber:
                      collaborator.optionalPhoneNumber ?? null,
                    location: collaborator.location ?? null,
                    experienceProvided: collaborator.experienceProvided ?? null,
                    machineryAndEquipment:
                      collaborator.machineryAndEquipment ?? null,
                    imageId: collaborator.imageId ?? null,
                    site: collaborator.site ?? null,
                    createdAt: collaborator.createdAt,
                    updatedAt: collaborator.updatedAt,
                    industrialSector: collaborator.industrialSector ?? null,
                    specialization: collaborator.specialization ?? null,
                    image: null,
                    experienceProvidedMedia: [],
                    machineryAndEquipmentMedia: [],
                  }}
                  showStatus
                  onClick={() => handleView('collaborators', collaborator.id)}
                />

                {/* Admin Actions Footer */}
                <div className="flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 max-w-[600px]">
                  <div className="flex items-center text-xs text-gray-500 font-outfit">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    Submitted on{' '}
                    {new Date(collaborator.createdAt).toLocaleDateString(
                      'en-US',
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
                      disabled={isLoading}
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 text-xs font-bold border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                      onClick={() =>
                        handleReject('collaborators', collaborator.id)
                      }
                      disabled={isLoading}
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1.5" />
                      Reject
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() =>
                        handleDelete('collaborators', collaborator.id)
                      }
                      disabled={isLoading}
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
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
