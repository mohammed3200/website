
'use client';

import { useTranslations } from 'next-intl';
import { StepComponentProps } from '@/lib/forms/types';
import { CheckboxField } from '@/lib/forms/components/fields';
import { Collaborator } from '@/features/collaborators/types';
import { Card, CardContent } from '@/components/ui/card';

export function ReviewSubmitStep({
    data,
    updateData,
    errors,
}: StepComponentProps<Collaborator>) {
    const t = useTranslations('Collaborators.form');
    const tEnum = useTranslations('Enums.IndustrialSectors');

    const SummaryItem = ({ label, value }: { label: string; value?: string | null }) => (
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
                        <SummaryItem label={t('companyName')} value={data.companyName} />
                        <SummaryItem label={t('primaryPhoneNumber')} value={data.primaryPhoneNumber} />
                        <SummaryItem label={t('email')} value={data.email} />
                        <SummaryItem label={t('location')} value={data.location} />
                        <SummaryItem
                            label={t('industrialSector')}
                            value={data.industrialSector ? tEnum(data.industrialSector as any) : '-'}
                        />
                        <SummaryItem label={t('specialization')} value={data.specialization} />
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
