
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { StepComponentProps } from '@/lib/forms/types';
import { SelectField, EnhancedFileUpload } from '@/lib/forms/components/fields';
import { CompleteFormData } from '../schemas/step-schemas';
import { StageDevelopment } from '../types/types';

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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SelectField
                label={t('stageDevelopment')}
                value={data.stageDevelopment}
                onValueChange={(value) => updateData({ stageDevelopment: value as StageDevelopment })}
                options={stageOptions}
                error={errors.stageDevelopment}
                required
                placeholder={t('selectStage')}
            />

            <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('projectFiles')}</h3>
                <p className="text-sm text-muted-foreground">{t('projectFilesDescription')}</p>

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
            </div>
        </div>
    );
}
