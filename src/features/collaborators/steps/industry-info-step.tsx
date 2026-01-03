
'use client';

import { useTranslations } from 'next-intl';
import { StepComponentProps } from '@/lib/forms/types';
import { SelectField, TextInput } from '@/lib/forms/components/fields';
import { Collaborator, ListOfIndustrialSectors } from '@/features/collaborators/types';

export function IndustryInfoStep({
    data,
    updateData,
    errors,
}: StepComponentProps<Collaborator>) {
    const t = useTranslations('Collaborators.form');
    const tEnum = useTranslations('Enums.IndustrialSectors');

    const sectorOptions = Object.values(ListOfIndustrialSectors).map((sector) => ({
        value: sector,
        label: tEnum(sector as any), // Assuming translations keys match enum values or mapped
    }));

    return (
        <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
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
        </div>
    );
}
