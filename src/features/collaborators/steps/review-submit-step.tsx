'use client';

import { useTranslations } from 'next-intl';
import { StepComponentProps } from '@/lib/forms/types';
import { CheckboxField } from '@/lib/forms/components/fields';
import { Collaborator } from '@/features/collaborators/types/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { StepLayout } from '@/lib/forms/components/shared/StepLayout';

export function ReviewSubmitStep({
  data,
  updateData,
  errors,
  onPrevious,
  onNext, // This will be the actual submit action
  isSubmitting,
}: StepComponentProps<Collaborator>) {
  const t = useTranslations('Collaborators.form');
  const tEnum = useTranslations('Enums.IndustrialSectors');

  const SummaryItem = ({
    label,
    value,
  }: {
    label: string;
    value?: string | null;
  }) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-4 border-b last:border-0 border-slate-100 dark:border-slate-800">
      <dt className="font-medium text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="sm:col-span-2 font-semibold text-slate-900 dark:text-slate-100 break-words">
        {value || '-'}
      </dd>
    </div>
  );

  return (
    <StepLayout
      errors={errors}
      onBack={onPrevious}
      onNext={onNext} // Submit
      isLastStep={true}
      isSubmitting={isSubmitting}
    >
      {/* Review Card */}
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg">{t('reviewInformation')}</CardTitle>
          <CardDescription>{t('reviewDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <dl>
            <SummaryItem label={t('companyName')} value={data.companyName} />
            <SummaryItem
              label={t('primaryPhoneNumber')}
              value={data.primaryPhoneNumber}
            />
            <SummaryItem label={t('email')} value={data.email} />
            <SummaryItem label={t('location')} value={data.location} />
            <SummaryItem
              label={t('industrialSector')}
              value={
                data.industrialSector
                  ? tEnum(data.industrialSector as any)
                  : '-'
              }
            />
            <SummaryItem
              label={t('specialization')}
              value={data.specialization}
            />
          </dl>
        </CardContent>
      </Card>

      {/* Terms Checkbox */}
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800">
        <CardContent className="pt-6">
          <CheckboxField
            label={
              <span>
                {t('agreeTo')}{' '}
                <a
                  href="/terms"
                  className="text-primary hover:underline underline-offset-4 font-medium"
                  target="_blank"
                >
                  {t('termsOfUse')}
                </a>
              </span>
            }
            checked={!!data.TermsOfUse}
            onCheckedChange={(checked) => updateData({ TermsOfUse: checked })}
            error={errors.TermsOfUse}
            required
          />
        </CardContent>
      </Card>
    </StepLayout>
  );
}
