'use client';

import React from 'react';
import { useDebounce } from 'react-use';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import useLanguage from '@/hooks/use-language';

import { Form } from '@/components/ui/form';
import { SelectItem } from '@/components/ui/select';
import { CustomFormField, FormFieldType, UploadFiles } from '@/components';
import { IconsInterface } from '@/constants';

import { step1Schema } from '@/features/innovators/schemas/step-schemas';
import { Countries } from '@/features/innovators/constants/constants';
import type {
  Step1Data,
  StepComponentProps,
} from '@/features/innovators/types/multi-step-types';
import { StepNavigation } from './step-navigation';

export function PersonalInfoStep({
  data,
  onNext,
  onPrevious,
  isLoading,
  currentStep,
  totalSteps,
  onSave,
}: StepComponentProps<Step1Data>) {
  const t = useTranslations('CreatorsAndInnovators');
  const tForm = useTranslations('Form');
  const { isArabic } = useLanguage();



  const form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema(tForm)),
    mode: 'onTouched',
    defaultValues: {
      name: data.name || '',
      phoneNumber: data.phoneNumber || '',
      email: data.email || '',
      country: data.country || '',
      city: data.city || '',
      specialization: data.specialization || '',
      image: data.image,
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

  // Reset form when data changes
  React.useEffect(() => {
    // Prevent overwriting dirty form state with potentially stale parent data while typing
    if (form.formState.isDirty) return;

    form.reset({
      name: data.name || '',
      phoneNumber: data.phoneNumber || '',
      email: data.email || '',
      country: data.country || '',
      city: data.city || '',
      specialization: data.specialization || '',
      image: data.image,
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
            {isArabic ? 'المعلومات الشخصية' : 'Personal Information'}
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            {isArabic
              ? 'أدخل معلوماتك الأساسية'
              : 'Enter your basic information'}
          </p>
        </div>

        {/* Form Grid */}
        <div
          className="grid md:grid-cols-6 gap-8"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          {/* Profile Image - Left Column */}
          <div className="col-span-6 md:col-span-2">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-din-medium text-gray-700">
                  {t('form.Image')}
                </label>
                <p className="text-xs text-gray-500 font-din-regular">
                  {isArabic
                    ? 'صورة شخصية تعبر عنك'
                    : 'Personal profile picture'}
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
                  label={isArabic ? 'صورة شخصية' : 'Profile Picture'}
                />
              </div>
            </div>
          </div>

          {/* Form Fields - Right Column */}
          <div className="col-span-6 md:col-span-4 flex flex-col gap-4">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label={t('form.name')}
              iconSrc={IconsInterface.User}
              iconAlt="user"
            />

            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="phoneNumber"
              label={t('form.phone')}
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label={t('form.email')}
              placeholder="example@example.com"
              iconSrc={IconsInterface.Email}
              iconAlt="email"
              isEnglish
            />

            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="country"
              label={t('form.country')}
            >
              {Object.entries(Countries).map(([key, value]) => (
                <SelectItem
                  key={key}
                  value={key}
                  dir={isArabic ? 'rtl' : 'ltr'}
                >
                  <p className="font-din-regular base max-md:base-small">
                    {isArabic ? value.ar : value.en}
                  </p>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="city"
              label={t('form.city')}
              placeholder={
                isArabic
                  ? 'المدينة، المنطقة، الشارع...'
                  : 'City, Region, Street...'
              }
              iconSrc={IconsInterface.Location}
              iconAlt="location"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="specialization"
              label={t('form.specialization')}
              placeholder={
                isArabic
                  ? 'المجال العلمي أو التخصص'
                  : 'Scientific field or specialization'
              }
              iconSrc={IconsInterface.Text}
              iconAlt="specialization"
            />
          </div>
        </div>

        {/* Navigation */}
        <StepNavigation
          currentStep={currentStep || 1}
          totalSteps={totalSteps || 4}
          canGoNext={form.formState.isValid}
          canGoPrevious={false}
          onNext={form.handleSubmit(onSubmit)}
          onPrevious={onPrevious}
          isLoading={!!isLoading}
          isArabic={!!isArabic}
        />
      </form>
    </Form>
  );
}
