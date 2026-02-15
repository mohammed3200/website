'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

export default function AdminFaqsPage() {
    const t = useTranslations('Admin.FAQs');
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<(FaqSchemaType & { id: string }) | null>(null);

    const { data: faqs, isLoading } = useQuery({
        queryKey: ['admin-faqs'],
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
            queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
            setIsModalOpen(false);
            toast.success('FAQ created successfully');
        },
        onError: () => toast.error('Failed to create FAQ'),
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
            queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
            setIsModalOpen(false);
            setEditingFaq(null);
            toast.success('FAQ updated successfully');
        },
        onError: () => toast.error('Failed to update FAQ'),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete FAQ');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
            toast.success('FAQ deleted successfully');
        },
        onError: () => toast.error('Failed to delete FAQ'),
    });

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
                    <h1 className="text-3xl font-bold text-gray-900">{t('title', { fallback: 'FAQ Management' })}</h1>
                    <p className="text-gray-600 mt-1">{t('description', { fallback: 'Manage frequently asked questions' })}</p>
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
                    onDelete={(id) => {
                        if (window.confirm('Are you sure you want to delete this FAQ?')) {
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
                            {editingFaq ? t('actions.edit', { fallback: 'Edit FAQ' }) : t('actions.create', { fallback: 'Create New FAQ' })}
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
