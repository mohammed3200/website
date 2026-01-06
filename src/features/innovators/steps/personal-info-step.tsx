'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { StepComponentProps } from '@/lib/forms/types';
import {
  TextInput,
  PhoneNumberInput,
  EnhancedFileUpload,
} from '@/lib/forms/components/fields';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StepLayout } from '@/lib/forms/components/shared/StepLayout';
import { CompleteFormData } from '../schemas/step-schemas';

export function PersonalInfoStep({
  data,
  updateData,
  errors,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  isSubmitting,
}: StepComponentProps<CompleteFormData>) {
  const t = useTranslations('Innovators.form');
  // const tCommon = useTranslations('Common');

  return (
    <StepLayout
      title={t('personalInfoTitle')}
      description={t('personalInfoDescription')}
      errors={errors}
      onNext={onNext}
      onBack={onPrevious}
      isFirstStep={isFirstStep}
      isLastStep={isLastStep}
      isSubmitting={isSubmitting}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <Card className="md:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>{t('basicInfo')}</CardTitle>
            <CardDescription>{t('basicInfoDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TextInput
              name="name"
              label={t('name')}
              value={data.name || ''}
              onChange={(e) => updateData({ name: e.target.value })}
              error={errors.name}
              required

            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PhoneNumberInput
                name="phoneNumber"
                label={t('phoneNumber')}
                value={data.phoneNumber || ''}
                onChange={(value) => updateData({ phoneNumber: value })}
                error={errors.phoneNumber}
                required
                placeholder="+218..."

              />

              <TextInput
                name="email"
                type="email"
                label={t('email')}
                value={data.email || ''}
                onChange={(e) => updateData({ email: e.target.value })}
                error={errors.email}
                required

              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                name="country"
                label={t('country')}
                value={data.country || ''}
                onChange={(e) => updateData({ country: e.target.value })}
                error={errors.country}
                required

              />

              <TextInput
                name="city"
                label={t('city')}
                value={data.city || ''}
                onChange={(e) => updateData({ city: e.target.value })}
                error={errors.city}
                required

              />
            </div>

            <TextInput
              name="specialization"
              label={t('specialization')}
              value={data.specialization || ''}
              onChange={(e) => updateData({ specialization: e.target.value })}
              error={errors.specialization}
              required

            />
          </CardContent>
        </Card>

        {/* Profile Image Card */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>{t('profileImage')}</CardTitle>
            <CardDescription>{t('profileImageDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <EnhancedFileUpload
              label={t('image')}
              // description={t('imageDescription')} // Optional if card desc is enough
              files={
                data.image
                  ? data.image instanceof File
                    ? [data.image]
                    : []
                  : []
              }
              onFilesChange={(files) => updateData({ image: files[0] })}
              maxFiles={1}
              accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
              error={errors.image}

            />
          </CardContent>
        </Card>
      </div>
    </StepLayout>
  );
}
