'use client';

import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import useLanguage from '@/hooks/use-language';

import { Form, FormControl } from '@/components/ui/form';
import { CustomFormField, FormFieldType } from '@/components';
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
}: StepComponentProps<Step1Data>) {
  const t = useTranslations('collaboratingPartners');
  const tForm = useTranslations('Form');
  const { isArabic } = useLanguage();

  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Reset form when data changes (e.g. loaded from localStorage)
  React.useEffect(() => {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      form.setValue('image', file, { shouldValidate: true });
    }
  };

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
            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="image"
              label={t('form.MainImage')}
              renderSkeleton={(field) => (
                <FormControl className="h-full overflow-hidden">
                  <div className="flex flex-col items-center gap-y-2 overflow-hidden h-full">
                    {field.value ? (
                      <div className="w-full h-full min-h-[200px] flex items-center justify-center py-2 rounded-lg overflow-hidden border-gray-300 border-dashed border-2 shadow-sm">
                        <Image
                          src={
                            field.value instanceof File
                              ? URL.createObjectURL(field.value)
                              : typeof field.value === 'string' &&
                                  field.value !== ''
                                ? field.value
                                : ''
                          }
                          width={250}
                          height={250}
                          alt="Company Logo"
                          className="object-cover rounded-md"
                        />
                      </div>
                    ) : (
                      <div className="flex-1 w-full min-h-[200px]">
                        <input
                          className="sr-only"
                          type="file"
                          accept="image/*"
                          ref={inputRef}
                          onChange={handleImageChange}
                          id="id-img-upload-step1"
                        />
                        <label
                          htmlFor="id-img-upload-step1"
                          className="bg-transparent font-din-regular gap-2 px-12 py-8 w-full h-full flex cursor-pointer flex-col items-center justify-center rounded-lg border-gray-300 border-dashed border-2 shadow-sm hover:border-orange-400 focus-within:ring-2 focus-within:ring-orange-500 transition-all"
                        >
                          <Image
                            src={IconsInterface.Upload}
                            width={80}
                            height={80}
                            alt="upload"
                          />
                          <div className="flex flex-col justify-center gap-2 text-center text-black">
                            <p className="font-din-regular text-base">
                              {isArabic
                                ? 'انقر للتحميل أو اسحب وأفلِت'
                                : 'Click to upload or drag and drop'}
                            </p>
                            <p className="font-din-regular text-sm text-gray-500">
                              PNG, JPG or SVG (max. 800x400px)
                            </p>
                          </div>
                        </label>
                      </div>
                    )}
                    <div
                      className="bg-gray-200 w-full h-10 rounded-xl cursor-pointer flex items-center gap-4 px-2 border-none"
                      dir={isArabic ? 'rtl' : 'ltr'}
                    >
                      <button
                        type="button"
                        className="cursor-pointer hover:bg-orange-50 p-1 rounded transition-colors focus-visible:ring-2 focus-visible:ring-orange-500"
                        onClick={() => {
                          field.onChange(null);
                          if (inputRef.current) {
                            inputRef.current.value = '';
                            setFileName(null);
                          }
                        }}
                      >
                        <Trash2
                          color="#fe6601"
                          className="size-8 rounded-full p-1 cursor-pointer"
                        />
                      </button>
                      <p className="font-din-regular truncate max-md:text-sm text-gray-600">
                        {fileName
                          ? fileName
                          : isArabic
                            ? 'لم يتم اختيار ملف'
                            : 'No file selected'}
                      </p>
                    </div>
                  </div>
                </FormControl>
              )}
            />
          </div>
        </div>

        <StepNavigation
          currentStep={currentStep || 1}
          totalSteps={totalSteps || 4}
          onNext={form.handleSubmit(onSubmit)}
          onPrevious={onPrevious}
          canGoNext={form.formState.isValid}
          canGoPrevious={false}
          isLoading={isLoading}
          isArabic={isArabic}
        />
      </form>
    </Form>
  );
}
