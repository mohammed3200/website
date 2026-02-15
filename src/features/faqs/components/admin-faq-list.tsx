'use client';

import { useTranslations } from 'next-intl';
import { Pencil, Trash2 } from 'lucide-react';
import type { FaqSchemaType } from '@/features/faqs/schemas';

interface FaqListProps {
    faqs: (FaqSchemaType & { id: string })[];
    onEdit: (faq: FaqSchemaType & { id: string }) => void;
    onDelete: (id: string) => void;
    isDeleting: boolean;
}

export const FaqList = ({ faqs, onEdit, onDelete, isDeleting }: FaqListProps) => {
    const t = useTranslations('Admin.FAQs');

    if (faqs.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">{t('empty')}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {faqs.map((faq) => (
                <div key={faq.id} className="p-4 flex items-start justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${faq.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {faq.isActive ? t('active') : t('inactive')}
                            </span>
                            {faq.isSticky && (
                                <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-blue-100 text-blue-700">
                                    {t('sticky')}
                                </span>
                            )}
                            {faq.category && (
                                <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-purple-100 text-purple-700">
                                    {faq.category}
                                </span>
                            )}
                        </div>

                        <h3 className="font-medium text-gray-900">{faq.question}</h3>
                        {faq.questionAr && (
                            <h3 className="font-medium text-gray-900 text-right" dir="rtl">{faq.questionAr}</h3>
                        )}

                        <div className="text-sm text-gray-600 line-clamp-2">{faq.answer}</div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                        <button
                            onClick={() => onEdit(faq)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title={t('actions.edit')}
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => onDelete(faq.id)}
                            disabled={isDeleting}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                            title={t('actions.delete')}
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
