
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { StepComponentProps } from '@/lib/forms/types';
import {
    TextInput,
    PhoneNumberInput,
    EnhancedFileUpload,
} from '@/lib/forms/components/fields';
import { Collaborator } from '../types';

export function CompanyInfoStep({
    data,
    updateData,
    errors,
}: StepComponentProps<Collaborator>) {
    const t = useTranslations('Collaborators.form');
    const tCommon = useTranslations('Common');

    return (
        <div className="flex flex-col-reverse md:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Form Fields - Left Side */}
            <div className="flex-1 space-y-6">
                <TextInput
                    name="companyName"
                    label={t('companyName')}
                    value={data.companyName || ''}
                    onChange={(e) => updateData({ companyName: e.target.value })}
                    error={errors.companyName} // Should map from errors['companyName']
                    required
                    placeholder={t('companyNamePlaceholder')}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PhoneNumberInput
                        name="primaryPhoneNumber"
                        label={t('primaryPhoneNumber')}
                        value={data.primaryPhoneNumber || ''}
                        onChange={(value) => updateData({ primaryPhoneNumber: value })}
                        error={errors.primaryPhoneNumber}
                        required
                        placeholder="+218..."
                    />

                    <PhoneNumberInput
                        name="optionalPhoneNumber"
                        label={t('optionalPhoneNumber')}
                        value={data.optionalPhoneNumber || ''}
                        onChange={(value) => updateData({ optionalPhoneNumber: value })}
                        error={errors.optionalPhoneNumber}
                        placeholder={t('optional')}
                    />
                </div>

                <TextInput
                    name="email"
                    type="email"
                    label={t('email')}
                    value={data.email || ''}
                    onChange={(e) => updateData({ email: e.target.value })}
                    error={errors.email}
                    required
                    placeholder="contact@company.com"
                />

                <TextInput
                    name="location"
                    label={t('location')}
                    value={data.location || ''}
                    onChange={(e) => updateData({ location: e.target.value })}
                    error={errors.location}
                    description={t('locationDescription')}
                />

                <TextInput
                    name="site"
                    label={t('site')}
                    value={data.site || ''}
                    onChange={(e) => updateData({ site: e.target.value })}
                    error={errors.site}
                    placeholder="https://..."
                />
            </div>

            {/* Image Upload - Right Side */}
            <div className="w-full md:w-1/3 space-y-4">
                <EnhancedFileUpload
                    label={t('image')}
                    description="Upload your company logo or main image"
                    files={data.image ? (data.image instanceof File ? [data.image] : []) : []} // Handle if image is File or Media object. Type says Media | null, but form state might hold File temporarily.
                    // We need to handle the File vs Media type discrepancy. 
                    // During form editing (client-side), it's likely a File.
                    // Types.ts says `image: Media | null`.
                    // But our schemas validate `z.instanceof(File)`.
                    // We should update `updateData` to store the File.
                    onFilesChange={(files) => updateData({ image: files[0] as any })} // Cast because of type mismatch in Collaborator definition vs form state
                    maxFiles={1}
                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                    error={errors.image}
                />
            </div>
        </div>
    );
}
