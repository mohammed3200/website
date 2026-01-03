
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { StepComponentProps } from '@/lib/forms/types';
import { TextArea, EnhancedFileUpload } from '@/lib/forms/components/fields';
import { Collaborator } from '../types';

export function CapabilitiesStep({
    data,
    updateData,
    errors,
}: StepComponentProps<Collaborator>) {
    const t = useTranslations('Collaborators.form');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Experience Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('servicesProvided')}</h3>

                <TextArea
                    name="experienceProvided"
                    label={t('experienceProvided')}
                    value={data.experienceProvided || ''}
                    onChange={(e) => updateData({ experienceProvided: e.target.value })}
                    error={errors.experienceProvided}
                    rows={4}
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
                    error={errors.experienceProvidedMedia as string} // Zod error might be string or object
                />
            </div>

            <div className="border-t my-6" />

            {/* Machinery Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('machineryAndEquipment')}</h3>

                <TextArea
                    name="machineryAndEquipment"
                    label={t('machineryAndEquipment')}
                    value={data.machineryAndEquipment || ''}
                    onChange={(e) => updateData({ machineryAndEquipment: e.target.value })}
                    error={errors.machineryAndEquipment}
                    rows={4}
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
            </div>
        </div>
    );
}
