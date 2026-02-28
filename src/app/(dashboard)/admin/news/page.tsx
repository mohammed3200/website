'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Plus, Search, Newspaper, ArrowLeft } from 'lucide-react';

import type { NewsWithRelations } from '@/features/news/types';

import { useGetNews } from '@/features/news/api/use-get-news';
import { useCreateNews } from '@/features/news/api/use-create-news';
import { useUpdateNews } from '@/features/news/api/use-update-news';
import { useDeleteNews } from '@/features/news/api/use-delete-news';
import { useConfirm } from '@/hooks/use-confirm';
import { NewsList } from '@/features/news/components/admin-news-list';
import { AdminNewsForm } from '@/features/news/components/admin-news-form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function AdminNewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsWithRelations | null>(
    null,
  );

  const { data: news = [], isLoading } = useGetNews();
  const createMutation = useCreateNews();
  const updateMutation = useUpdateNews();
  const deleteMutation = useDeleteNews();

  const filteredNews = news.filter((item) => {
    const title = item.titleEn || item.title;
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleCreate = () => {
    setEditingNews(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: NewsWithRelations) => {
    setEditingNews(item);
    setIsFormOpen(true);
  };

  const [DeleteDialog, confirmDelete] = useConfirm(
    'Delete News',
    'Are you sure you want to delete this news article?',
    'destructive',
    {
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    },
  );

  const handleDelete = async (id: string) => {
    const ok = await confirmDelete();
    if (ok) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingNews) {
        await updateMutation.mutateAsync({
          id: editingNews.id,
          values: data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsFormOpen(false);
      setEditingNews(null);
    } catch (error) {
      console.error('Failed to submit news form:', error);
    }
  };

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 font-din-regular" dir="ltr">
      <DeleteDialog />
      <div className="flex items-center justify-between space-y-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/admin"
              className="text-gray-500 hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>News</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <h2 className="text-3xl font-din-bold tracking-tight text-gray-900">
            News Management
          </h2>
          <p className="text-gray-500 mt-1">
            Manage platform news articles and announcements
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleCreate} className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            Create News
          </Button>
        </div>
      </div>

      <Separator className="bg-gray-100" />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 border-gray-200 focus:ring-primary shadow-none"
            />
          </div>
          <div className="text-sm text-gray-500 font-medium">
            {filteredNews.length} news items
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
            <Newspaper className="h-12 w-12 text-gray-200 animate-pulse mb-4" />
            <p className="text-gray-500 animate-pulse">
              Loading news articles...
            </p>
          </div>
        ) : (
          <NewsList
            news={filteredNews}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={(item) => {
              const slugOrId = item.slug || item.id;
              window.open(
                `/en/News/${encodeURIComponent(slugOrId)}`,
                '_blank',
                'noopener,noreferrer',
              );
            }}
            isDeleting={deleteMutation.isPending}
            locale="en"
          />
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto font-din-regular">
          <DialogHeader>
            <DialogTitle className="text-2xl font-din-bold">
              {editingNews ? 'Edit News' : 'Create News'}
            </DialogTitle>
            <DialogDescription>
              {editingNews
                ? 'Update the details of the existing news article.'
                : 'Add a new news article to the platform.'}
            </DialogDescription>
          </DialogHeader>
          <AdminNewsForm
            initialData={editingNews}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
