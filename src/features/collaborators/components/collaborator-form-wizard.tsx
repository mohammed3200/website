
'use client';

import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import { getCollaboratorFormConfig } from '../form-config';
import { useCollaboratorFormStore } from '../store';
import { useFormController } from '@/lib/forms/use-form-controller';
import { RegistrationLayout } from '@/lib/forms/components/layout/RegistrationLayout';
import { Skeleton } from '@/components/ui/skeleton';

export function CollaboratorFormWizard() {
    const t = useTranslations('Collaborators.form');
    const tValidation = useTranslations('Validation');

    const tV = (key: string) => {
        return tValidation(key) || key;
    };

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
    const hasHydrated = useCollaboratorFormStore(state => state.hasHydrated);
    const highestStepIndex = useCollaboratorFormStore((state) => state.highestStepIndex);
    const isValid = Object.keys(errors).length === 0;

    // Sync URL step with store (only on URL-driven changes like browser back/forward)
    const stepIdFromUrl = params.step as string;

    useEffect(() => {
        if (!hasHydrated) return;
        if (stepIdFromUrl) {
            const stepIndex = config.steps.findIndex(s => s.id === stepIdFromUrl);
            if (stepIndex === -1) return;

            // Read current store state directly to avoid stale closure issues
            const storeState = useCollaboratorFormStore.getState();
            const storeStepIndex = storeState.currentStepIndex;
            const storeHighestStep = storeState.highestStepIndex;

            // Only sync if URL step differs from store (user-initiated navigation)
            if (stepIndex !== storeStepIndex) {
                if (stepIndex <= storeHighestStep) {
                    useCollaboratorFormStore.setState({ currentStepIndex: stepIndex });
                } else {
                    // Redirect back to highest valid step
                    router.replace(
                        `/${params.locale}/collaborators/registration/${config.steps[storeStepIndex].id}`,
                    );
                }
            }
        }
    }, [stepIdFromUrl, config.steps, router, params.locale, hasHydrated]);

    if (!hasHydrated) {
        return (
            <RegistrationLayout
                steps={config.steps}
                currentStepIndex={currentStepIndex}
                onStepClick={() => {}}
            >
                <Skeleton className="w-full h-[600px] rounded-2xl bg-card border border-border" />
            </RegistrationLayout>
        );
    }

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
                    isFirstStep={isFirstStep}
                    isLastStep={isLastStep}
                />
            </AnimatePresence>
        </RegistrationLayout>
    );
}
