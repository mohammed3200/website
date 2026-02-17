'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import useLanguage from '@/hooks/use-language';
import { useConfirm } from '@/hooks/use-confirm';
import { useUpdateInnovatorStatus } from '@/features/innovators/api/use-update-innovator-status';
import { useUpdateCollaboratorStatus } from '@/features/collaborators/api/use-update-collaborator-status';
import { useDeleteInnovator } from '@/features/innovators/api/use-delete-innovator';
import { useDeleteCollaborator } from '@/features/collaborators/api/use-delete-collaborator';

export const useSubmissionsLogic = () => {
  const { lang, isArabic } = useLanguage();
  const router = useRouter();
  const t = useTranslations('Admin.Submissions');

  const updateInnovatorStatus = useUpdateInnovatorStatus();
  const updateCollaboratorStatus = useUpdateCollaboratorStatus();
  const deleteInnovator = useDeleteInnovator();
  const deleteCollaborator = useDeleteCollaborator();

  const [ApproveDialog, confirmApprove] = useConfirm(
    t('dialogs.approveTitle'),
    t('dialogs.approveMessage'),
    'default',
  );

  const [RejectDialog, confirmReject] = useConfirm(
    t('dialogs.rejectTitle'),
    t('dialogs.rejectMessage'),
    'destructive',
  );

  const [DeleteDialog, confirmDelete] = useConfirm(
    t('dialogs.deleteTitle'),
    t('dialogs.deleteMessage'),
    'destructive',
  );

  const handleView = (type: 'innovators' | 'collaborators', id: string) => {
    router.push(`/${lang}/admin/submissions/${type}/${id}`);
  };

  const handleApprove = async (
    type: 'innovators' | 'collaborators',
    id: string,
  ) => {
    const ok = await confirmApprove();
    if (!ok) return;

    if (type === 'innovators') {
      updateInnovatorStatus.mutate({
        param: { innovatorId: id },
        json: { status: 'APPROVED', locale: lang as 'ar' | 'en' },
      });
    } else {
      updateCollaboratorStatus.mutate({
        param: { collaboratorId: id },
        json: { status: 'APPROVED', locale: lang as 'ar' | 'en' },
      });
    }
  };

  const handleReject = async (
    type: 'innovators' | 'collaborators',
    id: string,
  ) => {
    const ok = await confirmReject();
    if (!ok) return;

    if (type === 'innovators') {
      updateInnovatorStatus.mutate({
        param: { innovatorId: id },
        json: { status: 'REJECTED', locale: lang as 'ar' | 'en' },
      });
    } else {
      updateCollaboratorStatus.mutate({
        param: { collaboratorId: id },
        json: { status: 'REJECTED', locale: lang as 'ar' | 'en' },
      });
    }
  };

  const handleDelete = async (
    type: 'innovators' | 'collaborators',
    id: string,
  ) => {
    const ok = await confirmDelete();
    if (!ok) return;

    if (type === 'innovators') {
      deleteInnovator.mutate({ param: { innovatorId: id } });
    } else {
      deleteCollaborator.mutate({ param: { collaboratorId: id } });
    }
  };

  return {
    handleView,
    handleApprove,
    handleReject,
    handleDelete,
    isArabic,
    lang,
    dialogs: {
      ApproveDialog,
      RejectDialog,
      DeleteDialog,
    },
    isLoading:
      updateInnovatorStatus.isPending ||
      updateCollaboratorStatus.isPending ||
      deleteInnovator.isPending ||
      deleteCollaborator.isPending,
  };
};
