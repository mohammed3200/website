
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { StepComponentProps } from '@/lib/forms/types';
import { TextInput, TextArea } from '@/lib/forms/components/fields';
import { CompleteFormData } from '../schemas/step-schemas';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StepLayout } from '@/lib/forms/components/shared/StepLayout';

export function ProjectOverviewStep({
    data,
    updateData,
    errors,
}: StepComponentProps<CompleteFormData>) {
    const t = useTranslations('Innovators.form');

    return (
        <StepLayout
            title={t('projectOverviewTitle')}
            description={t('projectOverviewDescription')}
            errors={errors}
        >
            <Card className="bg-transparent border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle>{t('projectBasicInfo')}</CardTitle>
                    <CardDescription>{t('projectBasicInfoDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <TextInput
                        name="projectTitle"
                        label={t('projectTitle')}
                        value={data.projectTitle || ''}
                        onChange={(e) => updateData({ projectTitle: e.target.value })}
                        error={errors.projectTitle}
                        required
                        className="bg-transparent"
                    />

                    <TextArea
                        name="projectDescription"
                        label={t('projectDescription')}
                        value={data.projectDescription || ''}
                        onChange={(e) => updateData({ projectDescription: e.target.value })}
                        error={errors.projectDescription}
                        required
                        rows={6}
                        className="bg-transparent"
                        description={t('projectDescriptionHint')}
                    />

                    <TextArea
                        name="objective"
                        label={t('objective')}
                        value={data.objective || ''}
                        onChange={(e) => updateData({ objective: e.target.value })}
                        error={errors.objective}
                        rows={4}
                        className="bg-transparent"
                        description={t('objectiveHint')}
                    />
                </CardContent>
            </Card>
        </StepLayout>
    );
}
