'use client';

import React, { useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useFormController } from '@/lib/forms/use-form-controller';
import { getInnovatorFormConfig } from '../form-config';
import { useInnovatorFormStore } from '../store';
import { RegistrationLayout } from '@/lib/forms/components/layout/RegistrationLayout';
import { Skeleton } from '@/components/ui/skeleton';

export function InnovatorFormWizard() {
  const t = useTranslations('Innovators.form');
  const tValidation = useTranslations('Validation');

  const tV = (key: string) => {
    return tValidation(key) || key;
  };

  const config = useMemo(() => getInnovatorFormConfig(tV), [tValidation]);
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
    goToStep,
  } = useFormController(useInnovatorFormStore, config);

  const errors = useInnovatorFormStore((state) => state.errors);
  const hasHydrated = useInnovatorFormStore((state) => state.hasHydrated);
  const highestStepIndex = useInnovatorFormStore((state) => state.highestStepIndex);
  const isValid = Object.keys(errors).length === 0;
  const router = useRouter();

  const stepIdFromUrl = params.step as string;

  useEffect(() => {
    if (!hasHydrated) return;
    if (stepIdFromUrl) {
      const stepIndex = config.steps.findIndex((s) => s.id === stepIdFromUrl);
      if (stepIndex === -1) return;

      // Read current store state directly to avoid stale closure issues
      const storeState = useInnovatorFormStore.getState();
      const storeStepIndex = storeState.currentStepIndex;
      const storeHighestStep = storeState.highestStepIndex;

      // Only sync if URL step differs from store (user-initiated navigation)
      if (stepIndex !== storeStepIndex) {
        if (stepIndex <= storeHighestStep) {
          useInnovatorFormStore.setState({ currentStepIndex: stepIndex });
        } else {
          // Redirect back to highest valid step
          router.replace(
            `/${params.locale}/innovators/registration/${config.steps[storeHighestStep].id}`,
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
