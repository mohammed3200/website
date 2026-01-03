
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { StepComponentProps } from '@/lib/forms/types';
import {
    TextInput,
    PhoneNumberInput,
    EnhancedFileUpload,
} from '@/lib/forms/components/fields';
import { CompleteFormData } from '../schemas/step-schemas';

export function PersonalInfoStep({
    data,
    updateData,
    errors,
}: StepComponentProps<CompleteFormData>) {
    const t = useTranslations('Innovators.form');
    const tCommon = useTranslations('Common');

    return (
        <div className="flex flex-col-reverse md:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex-1 space-y-6">
                <TextInput
                    name="name"
                    label={t('name')}
                    value={data.name || ''}
                    onChange={(e) => updateData({ name: e.target.value })}
                    error={errors.name}
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PhoneNumberInput
                        name="phoneNumber"
                        label={t('phoneNumber')}
                        value={data.phoneNumber || ''}
                        onChange={(value) => updateData({ phoneNumber: value })}
                        error={errors.phoneNumber}
                        required
                        placeholder="+218..."
                    />

                    <TextInput
                        name="email"
                        type="email"
                        label={t('email')}
                        value={data.email || ''}
                        onChange={(e) => updateData({ email: e.target.value })}
                        error={errors.email}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextInput
                        name="country"
                        label={t('country')}
                        value={data.country || ''}
                        onChange={(e) => updateData({ country: e.target.value })}
                        error={errors.country}
                        required
                    />

                    <TextInput
                        name="city"
                        label={t('city')}
                        value={data.city || ''}
                        onChange={(e) => updateData({ city: e.target.value })}
                        error={errors.city}
                        required
                    />
                </div>

                <TextInput
                    name="specialization"
                    label={t('specialization')}
                    value={data.specialization || ''}
                    onChange={(e) => updateData({ specialization: e.target.value })}
                    error={errors.specialization}
                    required
                />
            </div>

            <div className="w-full md:w-1/3 space-y-4">
                <EnhancedFileUpload
                    label={t('image')}
                    description={t('imageDescription')}
                    files={data.image ? (data.image instanceof File ? [data.image] : []) : []}
                    onFilesChange={(files) => updateData({ image: files[0] })}
                    maxFiles={1}
                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                    error={errors.image}
                />
            </div>
        </div>
    );
}
