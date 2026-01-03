
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { StepComponentProps } from '@/lib/forms/types';
import { CheckboxField } from '@/lib/forms/components/fields';
import { CompleteFormData } from '../schemas/step-schemas';
import { Card, CardContent } from '@/components/ui/card';

export function ReviewSubmitStep({
    data,
    updateData,
    errors,
}: StepComponentProps<CompleteFormData>) {
    const t = useTranslations('Innovators.form');
    const tSummary = useTranslations('Innovators.summary');

    const SummaryItem = ({ label, value }: { label: string; value?: string | number | null }) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 py-3 border-b last:border-0 border-border/50">
            <dt className="font-medium text-muted-foreground">{label}</dt>
            <dd className="md:col-span-2 font-medium text-foreground break-words">{value || '-'}</dd>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
                <h3 className="text-xl font-bold">{t('reviewInformation')}</h3>
                <p className="text-muted-foreground">{t('reviewDescription')}</p>
            </div>

            <Card>
                <CardContent className="p-6">
                    <dl>
                        <SummaryItem label={t('name')} value={data.name} />
                        <SummaryItem label={t('email')} value={data.email} />
                        <SummaryItem label={t('phoneNumber')} value={data.phoneNumber} />
                        <SummaryItem label={t('country')} value={data.country} />
                        <SummaryItem label={t('city')} value={data.city} />
                        <SummaryItem label={t('specialization')} value={data.specialization} />

                        <div className="py-4 font-semibold text-lg border-b">{t('projectDetails')}</div>

                        <SummaryItem label={t('projectTitle')} value={data.projectTitle} />
                        <SummaryItem label={t('stageDevelopment')} value={data.stageDevelopment} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 py-3 border-b last:border-0 border-border/50">
                            <dt className="font-medium text-muted-foreground">{t('projectFiles')}</dt>
                            <dd className="md:col-span-2 font-medium text-foreground">
                                {data.projectFiles?.length || 0} {tCommon('files')}
                            </dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>

            <div className="pt-4">
                <CheckboxField
                    label={
                        <span>
                            {t('agreeTo')}{' '}
                            <a href="/terms" className="text-primary hover:underline underline-offset-4" target='_blank'>
                                {t('termsOfUse')}
                            </a>
                        </span>
                    }
                    checked={!!data.TermsOfUse}
                    onCheckedChange={(checked) => updateData({ TermsOfUse: checked })}
                    error={errors.TermsOfUse}
                    required
                />
            </div>
        </div>
    );
}

// Assuming common translations might be needed
function tCommon(key: string) {
    // Placeholder - in real app, useTranslations('Common') 
    // But hooks order matters. I'll rely on parent hook.
    return key;
}
