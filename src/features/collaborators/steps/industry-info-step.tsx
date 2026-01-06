'use client';

import { useTranslations } from 'next-intl';
import { StepComponentProps } from '@/lib/forms/types';
import { SelectField, TextInput } from '@/lib/forms/components/fields';
import {
  Collaborator,
  ListOfIndustrialSectors,
} from '@/features/collaborators/types/types';
import { StepLayout } from '@/lib/forms/components/shared/StepLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export function IndustryInfoStep({
  data,
  updateData,
  errors,
  onNext,
  onPrevious,
  isSubmitting,
}: StepComponentProps<Collaborator>) {
  const t = useTranslations('Collaborators.form');
  const tEnum = useTranslations('Enums.IndustrialSectors');

  const sectorOptions = Object.values(ListOfIndustrialSectors).map(
    (sector) => ({
      value: sector,
      label: tEnum(sector as any),
    }),
  );

  return (
    <StepLayout
      errors={errors}
      onNext={onNext}
      onBack={onPrevious}
      isSubmitting={isSubmitting}
    >
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg">{t('industrialSector')}</CardTitle>
          <CardDescription>{t('selectSector')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SelectField
            label={t('industrialSector')}
            value={data.industrialSector}
            onValueChange={(value) => updateData({ industrialSector: value })}
            options={sectorOptions}
            error={errors.industrialSector}
            required
            placeholder={t('selectSector')}
          />

          <TextInput
            name="specialization"
            label={t('specialization')}
            value={data.specialization || ''}
            onChange={(e) => updateData({ specialization: e.target.value })}
            error={errors.specialization}
            required
            description={t('specializationDescription')}
          />
        </CardContent>
      </Card>
    </StepLayout>
  );
}
