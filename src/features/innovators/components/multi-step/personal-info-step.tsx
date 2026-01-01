'use client';

import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import useLanguage from '@/hooks/use-language';

import { Form, FormControl } from '@/components/ui/form';
import { SelectItem } from '@/components/ui/select';
import { CustomFormField, FormFieldType } from '@/components';
import { IconsInterface } from '@/constants';

import { step1Schema } from '../../schemas/step-schemas';
import { Countries } from '../../constants/constants';
import type {
  Step1Data,
  StepComponentProps,
} from '../../types/multi-step-types';
import { StepNavigation } from './step-navigation';

export function PersonalInfoStep({
  data,
  onNext,
  onPrevious,
  isLoading,
  currentStep,
  totalSteps,
}: StepComponentProps<Step1Data>) {
  const t = useTranslations('CreatorsAndInnovators');
  const tForm = useTranslations('Form');
  const { isArabic } = useLanguage();

  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Reset form when data changes
  React.useEffect(() => {
    form.reset({
      name: data.name || '',
      phoneNumber: data.phoneNumber || '',
      email: data.email || '',
      country: data.country || '',
      city: data.city || '',
      specialization: data.specialization || '',
      image: data.image,
    });

    // Sync local state for file name if image exists
    if (data.image instanceof File) {
      setFileName(data.image.name);
    } else if (typeof data.image === 'string') {
      // If it's a string (URL), we might not have the original filename,
      // but we can try to extract it or leave it null as the UI handles string preview
      setFileName(null);
    }
  }, [data, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      form.setValue('image', file);
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
            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="image"
              label={t('form.Image')}
              renderSkeleton={(field) => (
                <FormControl className="h-full overflow-hidden">
                  <div className="flex flex-col items-center gap-y-2 overflow-hidden h-full">
                    {field.value ? (
                      <div className="w-full h-full min-h-[200px] flex items-center justify-center py-2 rounded-lg overflow-hidden border-gray-300 border-dashed border-2 shadow-sm">
                        <Image
                          src={
                            field.value instanceof File
                              ? URL.createObjectURL(field.value)
                              : typeof field.value === 'string'
                                ? field.value
                                : ''
                          }
                          width={250}
                          height={250}
                          alt="Profile Image"
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
                          id="profile-image-upload-step1"
                          aria-label={
                            isArabic
                              ? 'تحميل صورة الملف الشخصي'
                              : 'Upload profile picture'
                          }
                        />
                        <label
                          htmlFor="profile-image-upload-step1"
                          className="bg-transparent font-din-regular gap-2 px-12 py-8 w-full h-full flex cursor-pointer flex-col items-center justify-center rounded-lg border-gray-300 border-dashed border-2 shadow-sm hover:border-orange-400 focus-within:ring-2 focus-within:ring-orange-500 transition-all"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              inputRef.current?.click();
                            }
                          }}
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
                              PNG, JPG or GIF (max. 800x400px)
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
                        aria-label={isArabic ? 'حذف الصورة' : 'Remove image'}
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
          currentStep={currentStep}
          totalSteps={totalSteps}
          canGoNext={form.formState.isValid}
          canGoPrevious={false}
          onNext={form.handleSubmit(onSubmit)}
          onPrevious={onPrevious}
          isLoading={isLoading}
          isArabic={isArabic}
        />
      </form>
    </Form>
  );
}
