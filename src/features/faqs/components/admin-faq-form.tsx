'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { faqSchema, type FaqSchemaType } from '@/features/faqs/schemas';
import { Loader2 } from 'lucide-react';

interface FaqFormProps {
    initialData?: FaqSchemaType;
    onSubmit: (data: FaqSchemaType) => void;
    isLoading: boolean;
    onCancel: () => void;
}

export const FaqForm = ({ initialData, onSubmit, isLoading, onCancel }: FaqFormProps) => {
    const t = useTranslations('Admin.FAQs');
    const form = useForm<FaqSchemaType>({
        resolver: zodResolver(faqSchema((key) => key)) as any, // Cast to avoid strict type mismatch with default values
        defaultValues: initialData || {
            question: '',
            answer: '',
            questionAr: '',
            answerAr: '',
            category: '',
            order: 0,
            isActive: true,
            isSticky: false,
        },
    });

    return (
        <form onSubmit={form.handleSubmit((data) => onSubmit(data))} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* English Content */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 border-b pb-2">English</h3>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Question</label>
                        <input
                            {...form.register('question')}
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter question in English"
                        />
                        {form.formState.errors.question && (
                            <p className="text-sm text-red-500">{form.formState.errors.question.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Answer</label>
                        <textarea
                            {...form.register('answer')}
                            className="w-full p-2 border rounded-md min-h-[100px]"
                            placeholder="Enter answer in English"
                        />
                        {form.formState.errors.answer && (
                            <p className="text-sm text-red-500">{form.formState.errors.answer.message}</p>
                        )}
                    </div>
                </div>

                {/* Arabic Content */}
                <div className="space-y-4" dir="rtl">
                    <h3 className="font-semibold text-gray-900 border-b pb-2">العربية</h3>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">السؤال</label>
                        <input
                            {...form.register('questionAr')}
                            className="w-full p-2 border rounded-md"
                            placeholder="أدخل السؤال بالعربية"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">الإجابة</label>
                        <textarea
                            {...form.register('answerAr')}
                            className="w-full p-2 border rounded-md min-h-[100px]"
                            placeholder="أدخل الإجابة بالعربية"
                        />
                    </div>
                </div>
            </div>

            {/* Settings */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-gray-900">Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <input
                            {...form.register('category')}
                            className="w-full p-2 border rounded-md"
                            placeholder="Optional category"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Order</label>
                        <input
                            type="number"
                            {...form.register('order', { valueAsNumber: true })}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                </div>

                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            {...form.register('isActive')}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">Active</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            {...form.register('isSticky')}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">Sticky (Show at top)</span>
                    </label>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {initialData ? 'Update FAQ' : 'Create FAQ'}
                </button>
            </div>
        </form>
    );
};
