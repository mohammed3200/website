'use client';

import React, { useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useFormController } from '@/lib/forms/use-form-controller';
import { getInnovatorFormConfig } from '../form-config';
import { useInnovatorFormStore } from '../store';
import { RegistrationLayout } from '@/lib/forms/components/layout/RegistrationLayout';

export function InnovatorFormWizard() {
    const t = useTranslations('Innovators.form');
    const tValidation = useTranslations('Validation');

    const tV = (key: string) => {
        return tValidation(key) || key;
    };

    const config = useMemo(() => getInnovatorFormConfig(tV), []);
    const params = useParams();

    const {
        currentStep,
        currentStepIndex,
        isFirstStep,
        isLastStep,
        isSubmitting,
        data,
        updateData,
        nextStep,
        prevStep,
        validateStep,
        goToStep
    } = useFormController(useInnovatorFormStore, config);

    const errors = useInnovatorFormStore(state => state.errors);
    const isValid = Object.keys(errors).length === 0;
    const router = useRouter();

    const stepIdFromUrl = params.step as string;

    useEffect(() => {
        if (stepIdFromUrl) {
            const stepIndex = config.steps.findIndex(s => s.id === stepIdFromUrl);
            if (stepIndex !== -1 && stepIndex !== currentStepIndex) {
                // only update if different
                useInnovatorFormStore.setState({ currentStepIndex: stepIndex });
            }
        }
    }, [stepIdFromUrl, config.steps, currentStepIndex]);

    if (!currentStep) return null;

    const CurrentStepComponent = currentStep.component;

    return (
        <RegistrationLayout
            steps={config.steps}
            currentStepIndex={currentStepIndex}
            onStepClick={goToStep}
        >
            <AnimatePresence mode="wait">
                <CurrentStepComponent
                    key={currentStep.id}
                    data={data}
                    updateData={updateData}
                    errors={errors}
                    isValid={isValid}
                    isSubmitting={isSubmitting}
                    onNext={nextStep}
                    onPrevious={prevStep}
                />
            </AnimatePresence>
        </RegistrationLayout>
    );
}
