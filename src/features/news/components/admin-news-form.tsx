'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { updateNewsSchema, type UpdateNewsInput, type CreateNewsInput } from '../schemas';
import { Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload } from '@/components/image-upload';
import { useState } from 'react';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

interface NewsFormProps {
    initialData?: any;
    onSubmit: (data: any) => void;
    isLoading: boolean;
    onCancel: () => void;
}

export const AdminNewsForm = ({ initialData, onSubmit, isLoading, onCancel }: NewsFormProps) => {
    const t = useTranslations('Admin.News');
    const [imageFile, setImageFile] = useState<File | null>(null);

    const form = useForm<UpdateNewsInput>({
        resolver: zodResolver(updateNewsSchema),
        defaultValues: initialData || {
            title: '',
            titleEn: '',
            content: '',
            contentEn: '',
            slug: '',
            excerpt: '',
            excerptEn: '',
            tags: '',
            isActive: true,
            isFeatured: false,
            publishedAt: new Date().toISOString(),
        },
    });

    const handleSubmit = (values: UpdateNewsInput) => {
        // Handle file upload separately if needed, or include in values if the API supports it
        // For now, we'll pass both
        onSubmit({ ...values, imageFile });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Arabic Content */}
                    <div className="space-y-6" dir="rtl">
                        <h3 className="text-lg font-semibold border-b pb-2">المحتوى العربي</h3>

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.title')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="أدخل العنوان بالعربية" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="excerpt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.excerpt')}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="أدخل مقتطفاً قصيراً بالعربية"
                                            className="min-h-[100px]"
                                            {...(field as any)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.content')}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="أدخل المحتوى الكامل بالعربية"
                                            className="min-h-[200px]"
                                            {...(field as any)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* English Content */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold border-b pb-2">English Content</h3>

                        <FormField
                            control={form.control}
                            name="titleEn"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.titleEn')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter title in English" {...(field as any)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="excerptEn"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.excerptEn')}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter short excerpt in English"
                                            className="min-h-[100px]"
                                            {...(field as any)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contentEn"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.contentEn')}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter full content in English"
                                            className="min-h-[200px]"
                                            {...(field as any)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t font-din-regular">
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold">Media & Metadata</h3>

                        <div className="space-y-2">
                            <Label>{t('form.image')}</Label>
                            <ImageUpload
                                onFileChange={setImageFile}
                                variant="square"
                                description="Recommended size: 1200x800px"
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.slug')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="news-slug-format" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Used in the URL: /news/your-slug
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.tags')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="tag1, tag2, tag3" {...(field as any)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h3 className="text-lg font-semibold">Settings</h3>

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-white">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            {t('form.isActive')}
                                        </FormLabel>
                                        <FormDescription>
                                            Whether this news item is visible to users.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-white">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            {t('form.isFeatured')}
                                        </FormLabel>
                                        <FormDescription>
                                            Featured news will be highlighted or shown in sliders.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="publishedAt"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>{t('form.publishedAt')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="datetime-local"
                                            value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                                            onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-8 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {t('actions.cancel')}
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="min-w-[120px]"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? t('actions.edit') : t('actions.create')}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
