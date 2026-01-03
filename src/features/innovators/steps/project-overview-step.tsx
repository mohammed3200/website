
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { StepComponentProps } from '@/lib/forms/types';
import { TextInput, TextArea } from '@/lib/forms/components/fields';
import { CompleteFormData } from '../schemas/step-schemas';

export function ProjectOverviewStep({
    data,
    updateData,
    errors,
}: StepComponentProps<CompleteFormData>) {
    const t = useTranslations('Innovators.form');

    return (
        <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TextInput
                name="projectTitle"
                label={t('projectTitle')}
                value={data.projectTitle || ''}
                onChange={(e) => updateData({ projectTitle: e.target.value })}
                error={errors.projectTitle}
                required
            />

            <TextArea
                name="projectDescription"
                label={t('projectDescription')}
                value={data.projectDescription || ''}
                onChange={(e) => updateData({ projectDescription: e.target.value })}
                error={errors.projectDescription}
                required
                rows={6}
                description={t('projectDescriptionHint')}
            />

            <TextArea
                name="objective"
                label={t('objective')}
                value={data.objective || ''}
                onChange={(e) => updateData({ objective: e.target.value })}
                error={errors.objective}
                rows={4}
            />
        </div>
    );
}
