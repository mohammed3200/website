'use client';

import { useRouter } from 'next/navigation';
import { useConfirm } from '@/hooks/use-confirm';
import { useUpdateInnovatorStatus } from '@/features/innovators/api/use-update-innovator-status';
import { useUpdateCollaboratorStatus } from '@/features/collaborators/api/use-update-collaborator-status';
import { useDeleteInnovator } from '@/features/innovators/api/use-delete-innovator';
import { useDeleteCollaborator } from '@/features/collaborators/api/use-delete-collaborator';

export const useSubmissionsLogic = () => {
  const router = useRouter();

  const updateInnovatorStatus = useUpdateInnovatorStatus();
  const updateCollaboratorStatus = useUpdateCollaboratorStatus();
  const deleteInnovator = useDeleteInnovator();
  const deleteCollaborator = useDeleteCollaborator();

  const [ApproveDialog, confirmApprove] = useConfirm(
    'Approve Submission',
    'Are you sure you want to approve this submission?',
    'default',
    {
      confirmLabel: 'Confirm Approve',
      cancelLabel: 'Cancel',
    },
  );

  const [RejectDialog, confirmReject] = useConfirm(
    'Reject Submission',
    'Are you sure you want to reject this submission?',
    'destructive',
    {
      confirmLabel: 'Confirm Reject',
      cancelLabel: 'Cancel',
    },
  );

  const [DeleteDialog, confirmDelete] = useConfirm(
    'Delete Submission',
    'Are you sure you want to delete this submission? This cannot be undone.',
    'destructive',
    {
      confirmLabel: 'Delete Permanently',
      cancelLabel: 'Cancel',
    },
  );

  const handleView = (type: 'innovators' | 'collaborators', id: string) => {
    router.push(`/admin/submissions/${type}/${id}`);
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
        json: { status: 'APPROVED', locale: 'en' },
      });
    } else {
      updateCollaboratorStatus.mutate({
        param: { collaboratorId: id },
        json: { status: 'APPROVED', locale: 'en' },
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
        json: { status: 'REJECTED', locale: 'en' },
      });
    } else {
      updateCollaboratorStatus.mutate({
        param: { collaboratorId: id },
        json: { status: 'REJECTED', locale: 'en' },
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
