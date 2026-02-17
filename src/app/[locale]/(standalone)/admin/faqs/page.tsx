'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useConfirm } from '@/hooks/use-confirm';
import { FaqList } from '@/features/faqs/components/admin-faq-list';
import { FaqForm } from '@/features/faqs/components/admin-faq-form';
import { toast } from 'sonner';
import type { FaqSchemaType } from '@/features/faqs/schemas';

// Temporary fetcher until we have a proper client helper
const fetchFaqs = async () => {
  const res = await fetch('/api/faqs'); // Admin route
  if (!res.ok) throw new Error('Failed to fetch FAQs');
  const json = await res.json();
  return json.data;
};

const FAQ_QUERY_KEY = 'admin-faqs'; // Define a constant for the query key

export default function AdminFaqsPage() {
  const t = useTranslations('Admin.FAQs');
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<
    (FaqSchemaType & { id: string }) | null
  >(null);

  const { data: faqs, isLoading } = useQuery({
    queryKey: [FAQ_QUERY_KEY],
    queryFn: fetchFaqs,
  });

  const createMutation = useMutation({
    mutationFn: async (data: FaqSchemaType) => {
      const res = await fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create FAQ');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FAQ_QUERY_KEY] });
      setIsModalOpen(false);
      toast.success(t('messages.createSuccess'));
    },
    onError: () => toast.error(t('messages.createError')),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FaqSchemaType }) => {
      const res = await fetch(`/api/faqs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update FAQ');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FAQ_QUERY_KEY] });
      setIsModalOpen(false);
      setEditingFaq(null);
      toast.success(t('messages.updateSuccess'));
    },
    onError: () => toast.error(t('messages.updateError')),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete FAQ');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FAQ_QUERY_KEY] });
      toast.success(t('messages.deleteSuccess'));
    },
    onError: () => toast.error(t('messages.deleteError')),
  });

  const [DeleteDialog, confirmDelete] = useConfirm(
    t('dialogs.deleteTitle'),
    t('dialogs.deleteConfirm'),
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
      updateMutation.mutate({ id: editingFaq.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('title', { fallback: 'FAQ Management' })}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('description', {
              fallback: 'Manage frequently asked questions',
            })}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t('actions.add', { fallback: 'Add FAQ' })}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
              {editingFaq
                ? t('actions.edit', { fallback: 'Edit FAQ' })
                : t('actions.create', { fallback: 'Create New FAQ' })}
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
    </div>
  );
}
