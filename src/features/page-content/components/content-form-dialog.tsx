'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useCreatePageContent } from '../api/use-create-page-content';
import { useUpdatePageContent } from '../api/use-update-page-content';
import {
  createPageContentSchema,
  type CreatePageContentInput,
} from '../schemas/page-content-schema';
import type { PageContent } from '../types/page-content-type';

type Page = 'entrepreneurship' | 'incubators' | 'about';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  page: Page;
  content?: PageContent | null;
};

const SECTIONS_BY_PAGE: Record<Page, { value: string; label: string }[]> = {
  entrepreneurship: [
    { value: 'hero', label: 'Hero' },
    { value: 'goals', label: 'Goals' },
    { value: 'cta', label: 'CTA' },
  ],
  incubators: [
    { value: 'hero', label: 'Hero' },
    { value: 'tasks', label: 'Tasks' },
    { value: 'cta', label: 'CTA' },
  ],
  about: [
    { value: 'hero', label: 'Hero' },
    { value: 'goals', label: 'Goals' },
    { value: 'platform', label: 'Platform' },
    { value: 'news', label: 'News' },
  ],
};

export const ContentFormDialog = ({
  isOpen,
  onClose,
  page,
  content,
}: Props) => {
  const isEditing = !!content;
  const { mutate: createContent, isPending: isCreating } =
    useCreatePageContent();
  const { mutate: updateContent, isPending: isUpdating } =
    useUpdatePageContent();

  const form = useForm({
    resolver: zodResolver(createPageContentSchema),
    defaultValues: {
      page,
      section: '',
      titleEn: '',
      titleAr: '',
      contentEn: '',
      contentAr: '',
      icon: '',
      color: '',
      order: 0,
      isActive: true,
      metadata: {},
    } as CreatePageContentInput,
  });

  useEffect(() => {
    if (content) {
      const allowedSections = SECTIONS_BY_PAGE[page]?.map((s) => s.value) ?? [];
      const sectionValue = allowedSections.includes(content.section) ? content.section : '';

      form.reset({
        page: content.page as Page,
        section: sectionValue,
        titleEn: content.titleEn || '',
        titleAr: content.titleAr || '',
        contentEn: content.contentEn || '',
        contentAr: content.contentAr || '',
        icon: content.icon || '',
        color: content.color || '',
        order: content.order,
        isActive: content.isActive,
        metadata: (content.metadata as Record<string, any>) || {},
      });
    } else {
      form.reset({
        page,
        section: '',
        titleEn: '',
        titleAr: '',
        contentEn: '',
        contentAr: '',
        icon: '',
        color: '',
        order: 0,
        isActive: true,
        metadata: {},
      });
    }
  }, [content, form, page, isOpen]);

  const onSubmit = (values: CreatePageContentInput) => {
    if (isEditing && content) {
      updateContent(
        { param: { id: content.id }, json: values },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    } else {
      createContent(
        { json: values },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    }
  };

  const isPending = isCreating || isUpdating;
  const sectionOptions = SECTIONS_BY_PAGE[page] ?? [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Content Block' : 'Add Content Block'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sectionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-4 pt-8">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm w-full">
                      <div className="space-y-0.5">
                        <FormLabel>Active Status</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                              field.onChange(0);
                            } else {
                              const parsed = parseInt(val, 10);
                              field.onChange(isNaN(parsed) ? 0 : parsed);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="titleEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title (English)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter title in English"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="titleAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title (Arabic)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter title in Arabic"
                        dir="rtl"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contentEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (English)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter content in English"
                        className="resize-none h-32"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contentAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (Arabic)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter content in Arabic"
                        dir="rtl"
                        className="resize-none h-32"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon (Lucide Component Name)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Lightbulb, Users, Building2"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
