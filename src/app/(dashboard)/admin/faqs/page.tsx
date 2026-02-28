'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useConfirm } from '@/hooks/use-confirm';
import { FaqList } from '@/features/faqs/components/admin-faq-list';
import { FaqForm } from '@/features/faqs/components/admin-faq-form';
import type { FaqSchemaType } from '@/features/faqs/schemas';

import { useGetFaqs } from '@/features/faqs/api/use-get-faqs';
import { useCreateFaq } from '@/features/faqs/api/use-create-faq';
import { useUpdateFaq } from '@/features/faqs/api/use-update-faq';
import { useDeleteFaq } from '@/features/faqs/api/use-delete-faq';

export default function AdminFaqsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<
    (FaqSchemaType & { id: string }) | null
  >(null);

  const { data: faqs, isLoading, isError, error, refetch } = useGetFaqs();
  const createMutation = useCreateFaq();
  const updateMutation = useUpdateFaq();
  const deleteMutation = useDeleteFaq();

  const [DeleteDialog, confirmDelete] = useConfirm(
    'Delete FAQ',
    'Are you sure you want to delete this FAQ?',
    'destructive',
  );

  const handleEdit = (faq: FaqSchemaType & { id: string }) => {
    setEditingFaq(faq);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
  };

  const handleSubmit = (data: FaqSchemaType) => {
    if (editingFaq) {
      updateMutation.mutate(
        { id: editingFaq.id, data },
        { onSuccess: () => handleClose() },
      );
    } else {
      createMutation.mutate(data, { onSuccess: () => handleClose() });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FAQ Management</h1>
          <p className="text-gray-600 mt-1">
            Manage frequently asked questions
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading || isError}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add FAQ
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-red-600 font-medium mb-4">
            {error instanceof Error ? error.message : 'Failed to load FAQs'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 border border-red-200 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <FaqList
          faqs={faqs || []}
          onEdit={handleEdit}
          onDelete={async (id) => {
            const ok = await confirmDelete();
            if (ok) {
              deleteMutation.mutate(id);
            }
          }}
          isDeleting={deleteMutation.isPending}
        />
      )}

      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingFaq ? 'Edit FAQ' : 'Create New FAQ'}
            </DialogTitle>
          </DialogHeader>
          <FaqForm
            initialData={editingFaq || undefined}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
            onCancel={handleClose}
          />
        </DialogContent>
      </Dialog>
      <DeleteDialog />
    </div>
  );
}
