'use client';

import { useEffect, useState } from 'react';
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

type Props = {
  isOpen: boolean;
  onClose: () => void;
  page: 'entrepreneurship' | 'incubators';
  content?: PageContent | null; // null for create mode
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
      form.reset({
        page: content.page as any,
        section: content.section,
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hero">Hero</SelectItem>
                        <SelectItem value="programs">Programs</SelectItem>
                        <SelectItem value="values">Values</SelectItem>
                        <SelectItem value="mission">Mission</SelectItem>
                        <SelectItem value="phases">Phases</SelectItem>
                        <SelectItem value="resources">Resources</SelectItem>
                        <SelectItem value="metrics">Metrics</SelectItem>
                        <SelectItem value="cta">CTA</SelectItem>
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
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon (Lucide Component Name)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Activity, Users, Target"
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
                name="metadata.number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number (for metrics)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 500+, $1M"
                        {...field}
                        value={form.watch('metadata.number') || ''}
                        onChange={(e) => {
                          const currentMeta = form.getValues('metadata') || {};
                          form.setValue('metadata', {
                            ...currentMeta,
                            number: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
