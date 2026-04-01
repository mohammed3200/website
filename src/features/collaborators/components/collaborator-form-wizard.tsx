
'use client';

import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import { getCollaboratorFormConfig } from '../form-config';
import { useCollaboratorFormStore } from '../store';
import { useFormController } from '@/lib/forms/use-form-controller';
import { RegistrationLayout } from '@/lib/forms/components/layout/RegistrationLayout';

export function CollaboratorFormWizard() {
    const t = useTranslations('Collaborators.form');
    const tValidation = useTranslations('Validation');

    const tV = (key: string) => {
        return tValidation(key) || key;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps -- tV is stable per locale
    const config = useMemo(() => getCollaboratorFormConfig(tV), [tValidation]);
    const params = useParams();
    const router = useRouter();

    const {
        currentStep,
        currentStepIndex,
        isFirstStep,
        isLastStep,
        isSubmitting,
        data,
        prevStep,
        validateStep,
        goToStep,
        updateData,
        nextStep
    } = useFormController(useCollaboratorFormStore, config);

    const errors = useCollaboratorFormStore(state => state.errors);
    const isValid = Object.keys(errors).length === 0;

    // Sync URL step with store
    const stepIdFromUrl = params.step as string;

    useEffect(() => {
        if (stepIdFromUrl) {
            const stepIndex = config.steps.findIndex(s => s.id === stepIdFromUrl);
            if (stepIndex !== -1 && stepIndex !== currentStepIndex) {
                // Only allow backward navigation or same step via URL.
                // Forward jumps via URL are blocked — user must use Next button.
                if (stepIndex <= currentStepIndex) {
                    useCollaboratorFormStore.setState({ currentStepIndex: stepIndex });
                } else {
                    // Redirect back to current valid step
                    router.replace(
                        `/${params.locale}/collaborators/registration/${config.steps[currentStepIndex].id}`,
                    );
                }
            }
        }
    }, [stepIdFromUrl, config.steps, currentStepIndex, router, params.locale]);

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
