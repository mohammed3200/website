'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { StepComponentProps } from '@/lib/forms/types';
import {
  TextInput,
  PhoneNumberInput,
  FileUpload,
} from '@/lib/forms/components/fields';
import { Collaborator } from '../types/types';
import { StepLayout } from '@/lib/forms/components/shared/StepLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function CompanyInfoStep({
  data,
  updateData,
  errors,
  onNext,
  onPrevious,
  isSubmitting,
  isValid,
}: StepComponentProps<Collaborator>) {
  const t = useTranslations('Collaborators.form');
  // We don't use tCommon here directly as StepLayout handles defaults,
  // but we could pass custom labels if needed.

  return (
    <StepLayout
      errors={errors}
      onNext={onNext}
      onBack={onPrevious}
      isFirstStep={true} // Company Info is first
      isSubmitting={isSubmitting}
    >
      <div className="space-y-6">
        {/* Group 1: Basic Info */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">{t('companyName')}</CardTitle>
            <CardDescription>{t('companyNamePlaceholder')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TextInput
              name="companyName"
              label={t('companyName')}
              value={data.companyName || ''}
              onChange={(e) => updateData({ companyName: e.target.value })}
              error={errors.companyName}
              required
              placeholder={t('companyNamePlaceholder')}
              className="bg-transparent"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                name="email"
                type="email"
                label={t('email')}
                value={data.email || ''}
                onChange={(e) => updateData({ email: e.target.value })}
                error={errors.email}
                required
                placeholder="contact@company.com"
                className="bg-transparent"
              />
              <TextInput
                name="site"
                label={t('site')}
                value={data.site || ''}
                onChange={(e) => updateData({ site: e.target.value })}
                error={errors.site}
                placeholder="https://example.com"
                className="bg-transparent"
              />
            </div>
          </CardContent>
        </Card>

        {/* Group 2: Contact Details */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">{t('contactDetails')}</CardTitle>
            <CardDescription>{t('howToReach')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PhoneNumberInput
                name="primaryPhoneNumber"
                label={t('primaryPhoneNumber')}
                value={data.primaryPhoneNumber || ''}
                onChange={(value) => updateData({ primaryPhoneNumber: value })}
                error={errors.primaryPhoneNumber}
                required
                placeholder="+218..."

              />

              <PhoneNumberInput
                name="optionalPhoneNumber"
                label={t('optionalPhoneNumber')}
                value={data.optionalPhoneNumber || ''}
                onChange={(value) => updateData({ optionalPhoneNumber: value })}
                error={errors.optionalPhoneNumber}
                placeholder={t('optional')}

              />
            </div>

            <TextInput
              name="location"
              label={t('location')}
              value={data.location || ''}
              onChange={(e) => updateData({ location: e.target.value })}
              error={errors.location}
              description={t('locationDescription')}

            />
          </CardContent>
        </Card>

        {/* Group 3: Branding */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">{t('branding')}</CardTitle>
            <CardDescription>{t('uploadLogoDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload
              label={t('image')}
              files={
                data.image
                  ? data.image instanceof File
                    ? [data.image]
                    : []
                  : []
              }
              onFilesChange={(files) => updateData({ image: files[0] as any })}
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
