import { useCallback, useEffect } from 'react';
import {
  useRouter,
  useSearchParams,
  usePathname,
  useParams,
} from 'next/navigation';
import { StoreApi, UseBoundStore } from 'zustand';
import { FormConfig, FormStore } from '@/lib/forms/types';

export const useFormController = <T>(
  useStore: UseBoundStore<StoreApi<FormStore<T>>>,
  config: FormConfig<T>,
) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Selectors
  const currentStepIndex = useStore((state) => state.currentStepIndex);
  const data = useStore((state) => state.data);
  const isSubmitting = useStore((state) => state.isSubmitting);
  const setStep = useStore((state) => state.setStep);
  const setErrors = useStore((state) => state.setErrors);
  const setSubmitting = useStore((state) => state.setSubmitting);
  const setValidating = useStore((state) => state.setValidating);
  const reset = useStore((state) => state.reset);
  const updateData = useStore((state) => state.setData);

  const currentStep = config.steps[currentStepIndex];
  const isLastStep = currentStepIndex === config.steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  // Sync step with URL
  useEffect(() => {
    // This assumes the URL structure is like /path/to/form/[step]
    // Or we can use a query param ?step=1
    // The plan suggested ` /[locale]/collaborators/registration/[step]/page.tsx`
    // So usually the page component handles the `params.step`.
    // But this hook can help validate if the URL matches the store state.
    // For now, we'll let the Page component drive the initial step based on URL if needed,
    // or we can sync the URL when step changes.
  }, [currentStepIndex, pathname, router]);

  const validateStep = useCallback(async () => {
    if (!currentStep) return true;

    setValidating(true);
    try {
      let isValid = true;
      let errors: Record<string, string> = {};

      // 1. Schema validation (Zod)
      if (currentStep.schema) {
        const result = currentStep.schema.safeParse(data);
        if (!result.success) {
          isValid = false;
          result.error.issues.forEach((issue) => {
            const path = issue.path.join('.');
            errors[path] = issue.message;
          });
        }
      }

      // 2. Custom validation function
      if (currentStep.validate) {
        const customResult = await currentStep.validate(data);
        if (!customResult.isValid) {
          isValid = false;
          errors = { ...errors, ...customResult.errors };
        }
      }

      setErrors(errors);
      return isValid;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    } finally {
      setValidating(false);
    }
  }, [currentStep, data, setErrors, setValidating]);

  const params = useParams();
  const locale = params.locale as string;

  const getPath = (stepId: string) => {
    // If basePath already includes locale, don't prepend it.
    // However, usually basePath is static like '/collaborators/registration'.
    // We should safely construct the path.
    const path = `${config.basePath}/${stepId}`;
    if (locale && !path.startsWith(`/${locale}`)) {
      return `/${locale}${path.startsWith('/') ? '' : '/'}${path}`;
    }
    return path;
  };

  const nextStep = useCallback(async () => {
    const isValid = await validateStep();
    if (isValid) {
      if (isLastStep) {
        await handleSubmit();
      } else {
        const nextIndex = currentStepIndex + 1;
        setStep(nextIndex);
        router.push(getPath(config.steps[nextIndex].id));
      }
    }
  }, [
    currentStepIndex,
    isLastStep,
    config,
    router,
    setStep,
    validateStep,
    locale,
  ]);

  const prevStep = useCallback(() => {
    if (!isFirstStep) {
      const prevIndex = currentStepIndex - 1;
      setStep(prevIndex);
      router.push(getPath(config.steps[prevIndex].id));
    }
  }, [currentStepIndex, isFirstStep, config, router, setStep, locale]);

  const goToStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < config.steps.length) {
        if (index < currentStepIndex) {
          setStep(index);
          router.push(getPath(config.steps[index].id));
        }
      }
    },
    [currentStepIndex, config, router, setStep, locale],
  );

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      await config.onComplete(data as T);
      router.push(
        config.successPath.startsWith(`/${locale}`)
          ? config.successPath
          : `/${locale}${config.successPath}`,
      );
      reset();
    } catch (error) {
      if (config.onError && error instanceof Error) {
        config.onError(error);
      }
      console.error('Submission error:', error);
    } finally {
      setSubmitting(false);
    }
  }, [config, data, router, setSubmitting, reset, locale]);

  return {
    currentStep,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    isSubmitting,
    data,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    validateStep,
  };
};
