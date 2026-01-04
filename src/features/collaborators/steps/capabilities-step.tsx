
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { StepComponentProps } from '@/lib/forms/types';
import { TextArea, EnhancedFileUpload } from '@/lib/forms/components/fields';
import { Collaborator } from '../types/types';
import { StepLayout } from '@/lib/forms/components/shared/StepLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function CapabilitiesStep({
    data,
    updateData,
    errors,
    onNext,
    onPrevious,
    isSubmitting,
}: StepComponentProps<Collaborator>) {
    const t = useTranslations('Collaborators.form');

    return (
        <StepLayout
            errors={errors}
            onNext={onNext}
            onBack={onPrevious}
            isSubmitting={isSubmitting}
        >
            <div className="space-y-6">
                {/* Experience Section */}
                <Card className="bg-transparent border-slate-200 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg">{t('experienceProvided')}</CardTitle>
                        <CardDescription>{t('experienceProvidedMedia')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <TextArea
                            name="experienceProvided"
                            label={t('experienceProvided')}
                            value={data.experienceProvided || ''}
                            onChange={(e) => updateData({ experienceProvided: e.target.value })}
                            error={errors.experienceProvided}
                            rows={4}
                            className="bg-transparent"
                        />

                        <EnhancedFileUpload
                            label={t('experienceProvidedMedia')}
                            files={(data.experienceProvidedMedia as unknown as File[]) || []}
                            onFilesChange={(files) => updateData({ experienceProvidedMedia: files as any })}
                            maxFiles={5}
                            maxSize={50 * 1024 * 1024} // 50MB
                            accept={{
                                'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
                                'application/pdf': ['.pdf'],
                                'video/mp4': ['.mp4']
                            }}
                            error={errors.experienceProvidedMedia as string}
                        />
                    </CardContent>
                </Card>

                {/* Machinery Section */}
                <Card className="bg-transparent border-slate-200 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg">{t('machineryAndEquipment')}</CardTitle>
                        <CardDescription>{t('machineryAndEquipmentMedia')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <TextArea
                            name="machineryAndEquipment"
                            label={t('machineryAndEquipment')}
                            value={data.machineryAndEquipment || ''}
                            onChange={(e) => updateData({ machineryAndEquipment: e.target.value })}
                            error={errors.machineryAndEquipment}
                            rows={4}
                            className="bg-transparent"
                        />

                        <EnhancedFileUpload
                            label={t('machineryAndEquipmentMedia')}
                            files={(data.machineryAndEquipmentMedia as unknown as File[]) || []}
                            onFilesChange={(files) => updateData({ machineryAndEquipmentMedia: files as any })}
                            maxFiles={5}
                            maxSize={50 * 1024 * 1024}
                            accept={{
                                'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
                                'application/pdf': ['.pdf'],
                                'video/mp4': ['.mp4']
                            }}
                            error={errors.machineryAndEquipmentMedia as string}
                        />
                    </CardContent>
                </Card>
            </div>
        </StepLayout>
    );
}
