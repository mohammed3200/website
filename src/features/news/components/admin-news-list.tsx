'use client';

import { useTranslations } from 'next-intl';
import { Pencil, Trash2, Eye, Calendar, User, Star } from 'lucide-react';
import type { NewsWithRelations } from '../types';
import Image from 'next/image';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';

interface NewsListProps {
    news: NewsWithRelations[];
    onEdit: (news: NewsWithRelations) => void;
    onDelete: (id: string) => void;
    onView: (news: NewsWithRelations) => void;
    isDeleting: boolean;
    locale: string;
}

export const NewsList = ({ news, onEdit, onDelete, onView, isDeleting, locale }: NewsListProps) => {
    const t = useTranslations('Admin.News');
    const isArabic = locale === 'ar';

    if (news.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                <p className="text-gray-500">{isArabic ? 'لا توجد أخبار حالياً' : 'No news found'}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className={cn("px-6 py-3", isArabic ? "text-right" : "text-left")}>
                            {t('table.title')}
                        </TableHead>
                        <TableHead className={cn("px-6 py-3", isArabic ? "text-right" : "text-left")}>
                            {t('table.status')}
                        </TableHead>
                        <TableHead className={cn("px-6 py-3", isArabic ? "text-right" : "text-left")}>
                            {t('table.date')}
                        </TableHead>
                        <TableHead className={cn("px-6 py-3 text-end")}>
                            {t('table.actions')}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {news.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                        <Image
                                            src={item.image?.url || '/images/placeholders/news-placeholder.jpg'}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="max-w-xs md:max-w-md">
                                        <div className="font-semibold text-gray-900 truncate">
                                            {isArabic ? item.title : (item.titleEn || item.title)}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <User className="h-3 w-3 text-gray-400" />
                                            <span className="text-xs text-gray-500 truncate">
                                                {item.createdBy?.name || 'Admin'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <div className="flex flex-wrap gap-2">
                                    <span className={cn(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                        item.isActive ? "bg-green-50 text-green-700 border-green-100" : "bg-gray-50 text-gray-600 border-gray-100"
                                    )}>
                                        {item.isActive ? t('status.active') : t('status.inactive')}
                                    </span>
                                    {item.isFeatured && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                            <Star className="h-3 w-3 fill-amber-700" />
                                            {t('status.featured')}
                                        </span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                                </div>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-end">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onView(item)}
                                        className="h-8 w-8 text-gray-400 hover:text-primary hover:bg-primary/5 transition-all"
                                        title={t('actions.view')}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(item)}
                                        className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                        title={t('actions.edit')}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete(item.id)}
                                        disabled={isDeleting}
                                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50"
                                        title={t('actions.delete')}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
