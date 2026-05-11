'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { AcademicExpert } from '../types';
import { expertSchema, type ExpertFormValues } from '../schemas';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useCreateExpert } from '../api/use-create-expert';
import { useUpdateExpert } from '../api/use-update-expert';

interface AdminExpertFormProps {
  initialData?: AcademicExpert | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AdminExpertForm = ({
  initialData,
  onSuccess,
  onCancel,
}: AdminExpertFormProps) => {
  const t = useTranslations('Admin');
  const createExpert = useCreateExpert();
  const updateExpert = useUpdateExpert(initialData?.id || '');

  const form = useForm<ExpertFormValues>({
    resolver: zodResolver(expertSchema) as any,
    defaultValues: {
      fullName: '',
      fullNameEn: '',
      title: '',
      titleEn: '',
      specialization: '',
      specializationEn: '',
      university: '',
      universityEn: '',
      bio: '',
      bioEn: '',
      cv: '',
      cvEn: '',
      profileImage: '',
      email: '',
      linkedin: '',
      order: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        fullName: initialData.fullName,
        fullNameEn: initialData.fullNameEn || '',
        title: initialData.title,
        titleEn: initialData.titleEn || '',
        specialization: initialData.specialization,
        specializationEn: initialData.specializationEn || '',
        university: initialData.university,
        universityEn: initialData.universityEn || '',
        bio: initialData.bio,
        bioEn: initialData.bioEn || '',
        cv: initialData.cv || '',
        cvEn: initialData.cvEn || '',
        profileImage: initialData.profileImage || '',
        email: initialData.email || '',
        linkedin: initialData.linkedin || '',
        order: initialData.order,
        isActive: initialData.isActive,
      });
    }
  }, [initialData]);

  const isLoading = createExpert.isPending || updateExpert.isPending;

  const onSubmit = (values: ExpertFormValues) => {
    if (initialData) {
      updateExpert.mutate(values, {
        onSuccess: () => {
          form.reset();
          if (onSuccess) onSuccess();
        },
      });
    } else {
      createExpert.mutate(values, {
        onSuccess: () => {
          form.reset();
          if (onSuccess) onSuccess();
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name (Arabic) *</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} dir="rtl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fullNameEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name (English)</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} dir="ltr" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title (Arabic) *</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} dir="rtl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="titleEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title (English)</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} dir="ltr" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="university"
            render={({ field }) => (
              <FormItem>
                <FormLabel>University (Arabic) *</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} dir="rtl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="universityEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>University (English)</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} dir="ltr" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialization (Arabic) *</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} dir="rtl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specializationEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialization (English)</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} dir="ltr" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} type="email" dir="ltr" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn URL</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} type="url" dir="ltr" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profileImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image URL</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} type="url" dir="ltr" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val === '' ? undefined : Number(val));
                    }}
                    disabled={isLoading} 
                    type="number" 
                    dir="ltr" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio (Arabic) *</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={isLoading} rows={3} dir="rtl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bioEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio (English)</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={isLoading} rows={3} dir="ltr" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full CV HTML (Arabic)</FormLabel>
                <div className="text-xs text-amber-600 mb-2">⚠️ Note: Raw HTML will be displayed. Please ensure you only paste trusted formatting.</div>
                <FormControl>
                  <Textarea {...field} disabled={isLoading} rows={6} dir="ltr" className="font-mono text-xs" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cvEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full CV HTML (English)</FormLabel>
                <div className="text-xs text-amber-600 mb-2">⚠️ Note: Raw HTML will be displayed. Please ensure you only paste trusted formatting.</div>
                <FormControl>
                  <Textarea {...field} disabled={isLoading} rows={6} dir="ltr" className="font-mono text-xs" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {initialData ? 'Update Expert' : 'Create Expert'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
