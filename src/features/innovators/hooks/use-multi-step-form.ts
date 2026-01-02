"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import useLanguage from "@/hooks/use-language";
import type {
  CompleteFormData,
  UseMultiStepFormReturn,
  MultiStepFormData,
} from "../types/multi-step-types";

const STORAGE_KEY = "innovator-registration-draft";
const STORAGE_VERSION = "1.0";
const EXPIRY_DAYS = 7;

export function useMultiStepForm(initialStep: number = 1): UseMultiStepFormReturn {
  const router = useRouter();
  const { lang } = useLanguage();

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState<Partial<CompleteFormData>>({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const totalSteps = 4;

  // Load from localStorage on mount
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;

        const parsed: MultiStepFormData = JSON.parse(saved);

        // Check version compatibility
        if (parsed.version !== STORAGE_VERSION) {
          console.warn("Storage version mismatch, clearing old data");
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        // Check expiration
        const expiryDate = new Date(parsed.expiresAt);
        if (expiryDate < new Date()) {

          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        // Restore data but clear file fields that can't be persisted as valid File objects
        const sanitizedData = {
          ...parsed.formData,
          // Clear file fields to prevent sending invalid plain objects to server
          image: undefined,
          projectFiles: [] as File[],
        } as Partial<CompleteFormData>;

        setFormData(sanitizedData);
        setCompletedSteps(parsed.completedSteps);
        

      } catch (error) {
        console.error("Error loading saved data:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    };

    loadSavedData();
  }, []);

  // Save to localStorage on data change
  useEffect(() => {
    if (Object.keys(formData).length === 0) return;

    try {
      const now = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(now.getDate() + EXPIRY_DAYS);

      const dataToSave: MultiStepFormData = {
        version: STORAGE_VERSION,
        timestamp: now,
        expiresAt,
        currentStep,
        completedSteps,
        formData,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [formData, currentStep, completedSteps]);

  /**
   * Check if a step has valid data
   */
  const isStepValid = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1:
          return !!(
            formData.name &&
            formData.email &&
            formData.phoneNumber &&
            formData.country &&
            formData.city &&
            formData.specialization
          );
        case 2:
          return !!(formData.projectTitle && formData.projectDescription);
        case 3:
          return !!formData.stageDevelopment;
        case 4:
          return formData.TermsOfUse === true;
        default:
          return false;
      }
    },
    [formData]
  );

  /**
   * Check if a step is completed
   */
  const isStepCompleted = useCallback(
    (step: number): boolean => {
      return completedSteps.includes(step);
    },
    [completedSteps]
  );

  /**
   * Check if user can navigate to a step
   */
  const canGoToStep = useCallback(
    (step: number): boolean => {
      // Can always go back to step 1
      if (step === 1) return true;

      // Can go to a completed step
      if (completedSteps.includes(step)) return true;

      // Can go to next step if current step is valid
      if (step === currentStep + 1 && isStepValid(currentStep)) {
        return true;
      }

      return false;
    },
    [currentStep, completedSteps, isStepValid]
  );

  /**
   * Navigate to a specific step
   */
  const goToStep = useCallback(
    (step: number) => {
      if (step < 1 || step > totalSteps) {
        console.warn(`Invalid step: ${step}`);
        return;
      }

      if (!canGoToStep(step)) {
        console.warn(`Cannot navigate to step ${step}`);
        return;
      }

      setCurrentStep(step);
      router.push(`/${lang}/innovators/registration/${step}`);
    },
    [canGoToStep, lang, router, totalSteps]
  );

  /**
   * Navigate to next step
   */
  const nextStep = useCallback(() => {
    if (currentStep >= totalSteps) return;

    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    goToStep(currentStep + 1);
  }, [currentStep, totalSteps, completedSteps, goToStep]);

  /**
   * Navigate to previous step
   */
  const previousStep = useCallback(() => {
    if (currentStep <= 1) return;
    goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  /**
   * Update data for current step
   */
  const updateStepData = useCallback(<T,>(stepData: T) => {
    setFormData((prev) => ({
      ...prev,
      ...stepData,
    }));
  }, []);

  /**
   * Reset form data
   */
  const resetForm = useCallback(() => {
    setFormData({});
    setCompletedSteps([]);
    setCurrentStep(1);
    localStorage.removeItem(STORAGE_KEY);
    router.push(`/${lang}/innovators/registration/1`);
  }, [lang, router]);

  /**
   * Get data for a specific step
   */
  const getStepData = useCallback(
    <T,>(_step: number): Partial<T> => {
      return formData as Partial<T>;
    },
    [formData]
  );

  return {
    currentStep,
    totalSteps,
    formData,
    completedSteps,
    isStepValid,
    isStepCompleted,
    canGoToStep,
    goToStep,
    nextStep,
    previousStep,
    updateStepData,
    resetForm,
    getStepData,
  };
}
