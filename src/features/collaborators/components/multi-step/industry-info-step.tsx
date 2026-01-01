'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import useLanguage from '@/hooks/use-language';

import { Form } from '@/components/ui/form';
import { SelectItem } from '@/components/ui/select';
import { CustomFormField, FormFieldType } from '@/components';

import { SectorTranslations } from '../../constants';
import { ListOfIndustrialSectors } from '@/features/collaborators/types';
import { step2Schema } from '../../schemas/step-schemas';
import type {
  Step2Data,
  StepComponentProps,
} from '../../types/multi-step-types';
import { StepNavigation } from './step-navigation';

export function IndustryInfoStep({
  data,
  onNext,
  onPrevious,
  isLoading,
  currentStep,
  totalSteps,
}: StepComponentProps<Step2Data>) {
  const t = useTranslations('collaboratingPartners');
  const tForm = useTranslations('Form');
  const { isArabic } = useLanguage();

  const form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema(tForm)),
    mode: 'onTouched',
    defaultValues: {
      industrialSector: data.industrialSector as ListOfIndustrialSectors,
      specialization: data.specialization || '',
    },
  });

  // Reset form when data changes
  React.useEffect(() => {
    form.reset({
      industrialSector: data.industrialSector as ListOfIndustrialSectors,
      specialization: data.specialization || '',
    });
  }, [data, form]);

  const { isValid } = form.formState;

  const onSubmit = (values: Step2Data) => {
    onNext(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="border-b-2 border-gray-200 pb-6 text-center">
            <h2 className="text-2xl font-din-bold text-gray-800">
              {isArabic ? 'معلومات القطاع' : 'Industry Information'}
            </h2>
            <p className="text-gray-600 font-din-regular mt-2">
              {isArabic
                ? 'حدد مجال عملك وتخصصك'
                : 'Select your field of work and specialization'}
            </p>
          </div>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="industrialSector"
            label={t('form.IndustrialSector')}
          >
            {Object.entries(SectorTranslations).map(([key, value]) => (
              <SelectItem key={key} value={key} dir={isArabic ? 'rtl' : 'ltr'}>
                <p className="font-din-regular base max-md:base-small">
                  {isArabic ? value.ar : value.en}
                </p>
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="specialization"
            label={t('form.Specialization')}
            placeholder={
              isArabic
                ? 'وصف المجال الذي تختص به...'
                : 'Describe your field of expertise...'
            }
          />
        </div>

        <StepNavigation
          currentStep={currentStep || 2}
          totalSteps={totalSteps || 4}
          onNext={form.handleSubmit(onSubmit)}
          onPrevious={onPrevious}
          canGoNext={isValid}
          canGoPrevious={true}
          isLoading={isLoading}
          isArabic={isArabic}
        />
      </form>
    </Form>
  );
}
