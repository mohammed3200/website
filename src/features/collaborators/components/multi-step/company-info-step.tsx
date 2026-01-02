'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useDebounce } from 'react-use';
import useLanguage from '@/hooks/use-language';

import { Form } from '@/components/ui/form';
import { CustomFormField, FormFieldType, UploadFiles } from '@/components';
import { IconsInterface } from '@/constants';

import { step1Schema } from '../../schemas/step-schemas';
import type {
  Step1Data,
  StepComponentProps,
} from '../../types/multi-step-types';
import { StepNavigation } from './step-navigation';

export function CompanyInfoStep({
  data,
  onNext,
  onPrevious,
  isLoading,
  currentStep,
  totalSteps,
  onSave,
}: StepComponentProps<Step1Data>) {
  const t = useTranslations('collaboratingPartners');
  const tForm = useTranslations('Form');
  const { isArabic } = useLanguage();



  const form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema(tForm)),
    mode: 'onTouched',
    defaultValues: {
      companyName: data.companyName || '',
      image: data.image,
      primaryPhoneNumber: data.primaryPhoneNumber || '',
      optionalPhoneNumber: data.optionalPhoneNumber || '',
      email: data.email || '',
      location: data.location || '',
      site: data.site || '',
    },
  });

  // Watch all form values for auto-save
  const values = form.watch();

  // Auto-save draft data
  useDebounce(
    () => {
      if (onSave && Object.keys(values).length > 0) {
        onSave(values);
      }
    },
    1000,
    [values]
  );

  // Reset form when data changes (e.g. loaded from localStorage)
  React.useEffect(() => {
    if (form.formState.isDirty) return;

    form.reset({
      companyName: data.companyName || '',
      image: data.image,
      primaryPhoneNumber: data.primaryPhoneNumber || '',
      optionalPhoneNumber: data.optionalPhoneNumber || '',
      email: data.email || '',
      location: data.location || '',
      site: data.site || '',
    });
  }, [data, form]);



  const onSubmit = (values: Step1Data) => {
    onNext(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        {/* Section Header */}
        <div
          className="border-b-2 border-gray-200 pb-6"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <h2 className="text-2xl font-din-bold text-gray-800">
            {t('form.title')}
          </h2>
          <p className="text-sm text-gray-600 mt-2">{t('form.subtitle')}</p>
        </div>

        {/* Form Grid */}
        <div
          className="grid md:grid-cols-6 gap-8"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          {/* Form Fields - Left Column */}
          <div className="col-span-6 md:col-span-4 flex flex-col gap-4">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="companyName"
              label={t('form.CompanyNameField')}
              placeholder={isArabic ? 'اسم الشركة' : 'Company Name'}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="primaryPhoneNumber"
                label={t('form.PrimaryPhone')}
              />
              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="optionalPhoneNumber"
                label={t('form.OptionalPhone')}
              />
            </div>

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label={t('form.Email')}
              placeholder="example@company.com"
              iconSrc={IconsInterface.Email}
              iconAlt="email"
              isEnglish
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="location"
                label={t('form.Location')}
                placeholder={isArabic ? 'المدينة - الحي' : 'City - District'}
                iconSrc={IconsInterface.Location}
                iconAlt="Location"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="site"
                label={t('form.Website')}
                placeholder="www.example.com"
                iconSrc={IconsInterface.Site}
                iconAlt="site"
                isEnglish
              />
            </div>
          </div>

          {/* Profile Image - right Column */}
          <div className="col-span-6 md:col-span-2">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-din-medium text-gray-700">
                  {t('form.Image')}
                </label>
                <p className="text-xs text-gray-500 font-din-regular">
                  {isArabic
                    ? 'قم بتحميل شعار الشركة أو صورة تعبر عنها'
                    : 'Upload company logo or representative image'}
                </p>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <UploadFiles
                  onFileChange={(files) => {
                    if (files && files.length > 0) {
                      form.setValue('image', files[0], { shouldValidate: true });
                    } else {
                      form.setValue('image', undefined, { shouldValidate: true });
                    }
                  }}
                  maxFiles={1}
                  files={
                    form.watch('image') instanceof File
                      ? [form.watch('image') as File]
                      : []
                  }
                  accept={{
                    'image/*': ['.png', '.jpg', '.jpeg', '.webp']
                  }}
                  label={isArabic ? 'تحميل الشعار' : 'Upload Logo'}
                />
              </div>
            </div>
          </div>
        </div>

        <StepNavigation
          currentStep={currentStep || 1}
          totalSteps={totalSteps || 4}
          onNext={form.handleSubmit(onSubmit)}
          onPrevious={onPrevious}
          canGoNext={form.formState.isValid}
          canGoPrevious={false}
          isLoading={!!isLoading}
          isArabic={!!isArabic}
        />
      </form>
    </Form>
  );
}
