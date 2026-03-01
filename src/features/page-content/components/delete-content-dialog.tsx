'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeletePageContent } from '../api/use-delete-page-content';
import type { PageContent } from '../types/page-content-type';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  content: PageContent | null;
};

export const DeleteContentDialog = ({ isOpen, onClose, content }: Props) => {
  const { mutate: deleteContent, isPending } = useDeletePageContent();

  const handleConfirm = () => {
    if (!content) return;
    deleteContent(
      { param: { id: content.id } },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            content block for the{' '}
            <span className="font-semibold">{content?.section}</span> section (
            {content?.titleEn || content?.titleAr || 'Untitled'}).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? 'Deleting...' : 'Delete Content'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
