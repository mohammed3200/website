
'use client';

import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { useFormController } from '@/lib/forms/use-form-controller';
import { ProgressIndicator } from '@/lib/forms/components/progress-indicator';
import { StepNavigation } from '@/lib/forms/components/step-navigation';

import { getCollaboratorFormConfig } from '@/features/collaborators/form-config';
import { useCollaboratorFormStore } from '@/features/collaborators/store';

export function CollaboratorFormWizard() {
    const t = useTranslations('Collaborators.form');
    const tValidation = useTranslations('Validation');

    // Helper for validation messages
    const tV = (key: string) => {
        // We'll try to find the key in Validation namespace, fallback to key if not found
        // Realistically we should pass a specific t function to schema
        return tValidation(key) || key;
    };

    const config = useMemo(() => getCollaboratorFormConfig(tV), []);
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
    } = useFormController(useCollaboratorFormStore, config);

    // Errors from store
    const errors = useCollaboratorFormStore(state => state.errors);
    const router = useRouter();

    // Sync URL step with store step on mount/change
    // params.step is a string (e.g. 'company-info')
    const stepIdFromUrl = params.step as string;

    useEffect(() => {
        if (stepIdFromUrl) {
            const stepIndex = config.steps.findIndex(s => s.id === stepIdFromUrl);
            if (stepIndex !== -1 && stepIndex !== currentStepIndex) {
                // Basic protection: don't allow skipping ahead if previous steps aren't valid?
                // For now, trust the store's state or simply sync the store to the URL 
                // IF the data is present. 
                // Better: The Controller syncs URL based on state.
                // If URL is ahead of State, we might redirect back.
                // But here we'll let the user jump if they know the URL, 
                // relying on per-step validation to block submission.
                useCollaboratorFormStore.getState().setStep(stepIndex);
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
                    // Allow clicking to go back
                    if (index < currentStepIndex) {
                        useCollaboratorFormStore.getState().setStep(index);
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
