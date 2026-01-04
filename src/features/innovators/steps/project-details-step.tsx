
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { StepComponentProps } from '@/lib/forms/types';
import { SelectField, EnhancedFileUpload } from '@/lib/forms/components/fields';
import { CompleteFormData } from '../schemas/step-schemas';
import { StageDevelopment } from '../types/types';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StepLayout } from '@/lib/forms/components/shared/StepLayout';

export function ProjectDetailsStep({
    data,
    updateData,
    errors,
}: StepComponentProps<CompleteFormData>) {
    const t = useTranslations('Innovators.form');
    const tEnum = useTranslations('Enums.StageDevelopment');

    const stageOptions = Object.values(StageDevelopment).map((stage) => ({
        value: stage,
        label: tEnum(stage),
    }));

    return (
        <StepLayout
            title={t('projectDetailsTitle')}
            description={t('projectDetailsDescription')}
            errors={errors}
        >
            <div className="grid gap-6">
                <Card className="bg-transparent border-slate-200 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle>{t('stageDevelopment')}</CardTitle>
                        <CardDescription>{t('stageDevelopmentHint')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SelectField
                            label={t('stageDevelopment')}
                            value={data.stageDevelopment}
                            onValueChange={(value) => updateData({ stageDevelopment: value as StageDevelopment })}
                            options={stageOptions}
                            error={errors.stageDevelopment}
                            required
                            placeholder={t('selectStage') || ''}
                        />
                    </CardContent>
                </Card>

                <Card className="bg-transparent border-slate-200 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle>{t('projectFiles')}</CardTitle>
                        <CardDescription>{t('projectFilesHint')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EnhancedFileUpload
                            label={t('uploadFiles')}
                            files={(data.projectFiles as File[]) || []}
                            onFilesChange={(files) => updateData({ projectFiles: files })}
                            maxFiles={10}
                            maxSize={10 * 1024 * 1024} // 10MB
                            accept={{
                                'application/pdf': ['.pdf'],
                                'application/msword': ['.doc'],
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                                'image/jpeg': ['.jpg', '.jpeg'],
                                'image/png': ['.png'],
                                'image/webp': ['.webp'],
                                'application/vnd.ms-powerpoint': ['.ppt'],
                                'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
                            }}
                            error={errors.projectFiles as string}
                        />
                    </CardContent>
                </Card>
            </div>
        </StepLayout>
    );
}
