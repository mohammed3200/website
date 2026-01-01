'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import useLanguage from '@/hooks/use-language';

import { Form } from '@/components/ui/form';
import { CustomFormField, FormFieldType } from '@/components';

import { step2Schema } from '../../schemas/step-schemas';
import type {
  Step2Data,
  StepComponentProps,
} from '../../types/multi-step-types';
import { StepNavigation } from './step-navigation';

export function ProjectOverviewStep({
  data,
  onNext,
  onPrevious,
  isLoading,
  currentStep,
  totalSteps,
}: StepComponentProps<Step2Data>) {
  const t = useTranslations('CreatorsAndInnovators');
  const tForm = useTranslations('Form');
  const { isArabic } = useLanguage();

  const form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema(tForm)),
    mode: 'onTouched',
    defaultValues: {
      projectTitle: data.projectTitle || '',
      projectDescription: data.projectDescription || '',
      objective: data.objective || '',
    },
  });

  // Reset form when data changes
  React.useEffect(() => {
    form.reset({
      projectTitle: data.projectTitle || '',
      projectDescription: data.projectDescription || '',
      objective: data.objective || '',
    });
  }, [data, form]);

  const onSubmit = (values: Step2Data) => {
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
            {isArabic ? 'نظرة عامة على المشروع' : 'Project Overview'}
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            {isArabic ? 'صف فكرتك ومشروعك' : 'Describe your idea and project'}
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="projectTitle"
            label={t('form.projectTitle')}
            placeholder={
              isArabic ? 'عنوان تصف به فكرتك' : 'A title to describe your idea'
            }
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="projectDescription"
            label={t('form.projectDescription')}
            placeholder={
              isArabic
                ? 'وصف بسيط بما لا يتجاوز 250 كلمة'
                : 'A simple description of no more than 250 words'
            }
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="objective"
            label={t('form.objective')}
            description={t('form.objectiveHint')}
            placeholder={
              isArabic
                ? 'ما هي أهداف فكرتك؟ وما هي المشكلة التي تحلها؟'
                : 'What are the goals of the idea? What problem does it solve?'
            }
          />
        </div>

        {/* Navigation */}
        <StepNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          canGoNext={form.formState.isValid}
          canGoPrevious={true}
          onNext={form.handleSubmit(onSubmit)}
          onPrevious={onPrevious}
          isLoading={isLoading}
          isArabic={isArabic}
        />
      </form>
    </Form>
  );
}
