'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import useLanguage from '@/hooks/use-language';

import { Plus, Search, Newspaper, ArrowLeft } from 'lucide-react';

import type { NewsWithRelations } from '@/features/news/types';

import { useGetNews } from '@/features/news/api/use-get-news';
import { useCreateNews } from '@/features/news/api/use-create-news';
import { useUpdateNews } from '@/features/news/api/use-update-news';
import { useDeleteNews } from '@/features/news/api/use-delete-news';
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
    DialogTitle
} from '@/components/ui/dialog';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";


export default function AdminNewsPage() {
    const t = useTranslations('Admin.News');
    const { lang, isArabic } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingNews, setEditingNews] = useState<NewsWithRelations | null>(null);

    const { data: news = [], isLoading } = useGetNews();
    const createMutation = useCreateNews();
    const updateMutation = useUpdateNews();
    const deleteMutation = useDeleteNews();

    const filteredNews = news.filter((item) => {
        const title = isArabic ? item.title : (item.titleEn || item.title);
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

    const handleDelete = async (id: string) => {
        if (window.confirm(t('dialogs.deleteConfirm'))) {
            await deleteMutation.mutateAsync(id);
        }
    };

    const handleSubmit = async (data: any) => {
        try {
            if (editingNews) {
                await updateMutation.mutateAsync({
                    id: editingNews.id,
                    values: data
                });
            } else {
                await createMutation.mutateAsync(data);
            }
            setIsFormOpen(false);
            setEditingNews(null);
        } catch (error) {
            console.error("Failed to submit news form:", error);
            // Error handling is also managed by the hooks (toast)
        }
    };

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 font-din-regular">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link
                            href="/admin"
                            className="text-gray-500 hover:text-primary transition-colors"
                        >
                            <ArrowLeft className={isArabic ? "h-4 w-4 rotate-180" : "h-4 w-4"} />
                        </Link>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin">
                                        {isArabic ? 'لوحة التحكم' : 'Dashboard'}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{t('title')}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <h2 className="text-3xl font-din-bold tracking-tight text-gray-900">
                        {t('title')}
                    </h2>
                    <p className="text-gray-500 mt-1">
                        {t('subtitle')}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={handleCreate} className="gap-2 shadow-sm">
                        <Plus className="h-4 w-4" />
                        {t('actions.create')}
                    </Button>
                </div>
            </div>

            <Separator className="bg-gray-100" />

            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder={isArabic ? 'بحث عن الأخبار...' : 'Search news...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10 border-gray-200 focus:ring-primary shadow-none"
                        />
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                        {filteredNews.length} {isArabic ? 'خبر' : 'news items'}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <Newspaper className="h-12 w-12 text-gray-200 animate-pulse mb-4" />
                        <p className="text-gray-500 animate-pulse">
                            {isArabic ? 'جاري تحميل الأخبار...' : 'Loading news articles...'}
                        </p>
                    </div>
                ) : (
                    <NewsList
                        news={filteredNews}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={(item) => {
                            const slugOrId = item.slug || item.id;
                            window.open(`/${lang}/News/${slugOrId}`, '_blank');
                        }}
                        isDeleting={deleteMutation.isPending}
                        locale={lang}
                    />
                )}
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto font-din-regular">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-din-bold">
                            {editingNews ? t('actions.edit') : t('actions.create')}
                        </DialogTitle>
                        <DialogDescription>
                            {editingNews
                                ? (isArabic ? 'تعديل بيانات الخبر الحالي' : 'Update the details of the existing news article.')
                                : (isArabic ? 'إضافة خبر جديد إلى المنصة' : 'Add a new news article to the platform.')
                            }
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
