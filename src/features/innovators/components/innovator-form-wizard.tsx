'use client';

import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useFormController } from '@/lib/forms/use-form-controller';
import { getInnovatorFormConfig } from '../form-config';
import { useInnovatorFormStore } from '../store';
import { ProgressIndicator } from '@/lib/forms/components/progress-indicator';
import { StepNavigation } from '@/lib/forms/components/step-navigation';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function InnovatorFormWizard() {
    const t = useTranslations('Innovators.form');
    const tValidation = useTranslations('Validation');

    const tV = (key: string) => {
        // Need translation mapping logic or robust backend validation messages
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
        validateStep
    } = useFormController(useInnovatorFormStore, config);

    const errors = useInnovatorFormStore(state => state.errors);
    const router = useRouter();

    const stepIdFromUrl = params.step as string;

    useEffect(() => {
        if (stepIdFromUrl) {
            const stepIndex = config.steps.findIndex(s => s.id === stepIdFromUrl);
            if (stepIndex !== -1 && stepIndex !== currentStepIndex) {
                useInnovatorFormStore.getState().setStep(stepIndex);
            }
        }
    }, [stepIdFromUrl, config.steps, currentStepIndex]);

    if (!currentStep) return null;

    const StepComponent = currentStep.component;

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8 pb-24 md:pb-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    {t('formTitle')}
                </h1>
                <p className="text-muted-foreground">
                    {t('formDescription')}
                </p>
            </div>

            <ProgressIndicator
                steps={config.steps}
                currentStepIndex={currentStepIndex}
                onStepClick={(index) => {
                    if (index < currentStepIndex) {
                        useInnovatorFormStore.getState().setStep(index);
                        router.push(`${config.basePath}/${config.steps[index].id}`);
                    }
                }}
            />

            {Object.keys(errors).length > 0 && (
                <Alert variant="destructive" className="animate-in fade-in zoom-in-95">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t('errorTitle')}</AlertTitle>
                    <AlertDescription>
                        {t('errorDescription')}
                    </AlertDescription>
                </Alert>
            )}

            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep.id}
                        initial={{ x: 10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <StepComponent
                            data={data}
                            updateData={updateData}
                            errors={errors}
                            isValid={Object.keys(errors).length === 0}
                            isSubmitting={isSubmitting}
                            onNext={nextStep}
                            onPrevious={prevStep}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            <StepNavigation
                onNext={nextStep}
                onPrevious={prevStep}
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
