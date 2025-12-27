"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import useLanguage from "@/hooks/use-language";

// Storage configuration
const STORAGE_KEY = "collaborator-registration-draft";
const STORAGE_VERSION = "1.0";
const EXPIRY_DAYS = 7;

// Step data types
export type Step1CollabData = {
  companyName: string;
  image?: File | string;
  primaryPhoneNumber: string;
  optionalPhoneNumber?: string;
  email: string;
  location?: string;
  site?: string;
};

export type Step2CollabData = {
  industrialSector: string;
  specialization: string;
};

export type Step3CollabData = {
  experienceProvided?: string;
  experienceProvidedMedia?: File[];
  machineryAndEquipment?: string;
  machineryAndEquipmentMedia?: File[];
};

export type CompleteCollabData = Step1CollabData & Step2CollabData & Step3CollabData;

interface MultiStepCollabFormData {
  version: string;
  timestamp: Date;
  expiresAt: Date;
  currentStep: number;
  completedSteps: number[];
  formData: Partial<CompleteCollabData>;
}

export function useMultiStepCollaboratorForm(initialStep: number = 1) {
  const router = useRouter();
  const { lang } = useLanguage();

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState<Partial<CompleteCollabData>>({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const totalSteps = 3;

  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;

        const parsed: MultiStepCollabFormData = JSON.parse(saved);

        if (parsed.version !== STORAGE_VERSION) {
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        const expiryDate = new Date(parsed.expiresAt);
        if (expiryDate < new Date()) {
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        setFormData(parsed.formData);
        setCompletedSteps(parsed.completedSteps);
      } catch (error) {
        console.error("Error loading saved data:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    };

    loadSavedData();
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (Object.keys(formData).length === 0) return;

    try {
      const now = new Date();
      const expiresAt = new Date();
      expiresAt.setDate(now.getDate() + EXPIRY_DAYS);

      const dataToSave: MultiStepCollabFormData = {
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

  const isStepValid = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1:
          return !!(
            formData.companyName &&
            formData.primaryPhoneNumber &&
            formData.email
          );
        case 2:
          return !!(formData.industrialSector && formData.specialization);
        case 3:
          return true; // Optional step
        default:
          return false;
      }
    },
    [formData]
  );

  const canGoToStep = useCallback(
    (step: number): boolean => {
      if (step === 1) return true;
      if (completedSteps.includes(step)) return true;
      if (step === currentStep + 1 && isStepValid(currentStep)) return true;
      return false;
    },
    [currentStep, completedSteps, isStepValid]
  );

  const goToStep = useCallback(
    (step: number) => {
      if (step < 1 || step > totalSteps) return;
      if (!canGoToStep(step)) return;

      setCurrentStep(step);
      router.push(`/${lang}/collaborators/registration/${step}`);
    },
    [canGoToStep, lang, router, totalSteps]
  );

  const nextStep = useCallback(() => {
    if (currentStep >= totalSteps) return;

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    goToStep(currentStep + 1);
  }, [currentStep, totalSteps, completedSteps, goToStep]);

  const previousStep = useCallback(() => {
    if (currentStep <= 1) return;
    goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  const updateStepData = useCallback(<T,>(stepData: T) => {
    setFormData((prev) => ({
      ...prev,
      ...stepData,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({});
    setCompletedSteps([]);
    setCurrentStep(1);
    localStorage.removeItem(STORAGE_KEY);
    router.push(`/${lang}/collaborators/registration/1`);
  }, [lang, router]);

  const getStepData = useCallback(
    <_T,>(_step: number): Partial<CompleteCollabData> => {
      return formData;
    },
    [formData]
  );

  return {
    currentStep,
    totalSteps,
    formData,
    completedSteps,
    isStepValid,
    canGoToStep,
    goToStep,
    nextStep,
    previousStep,
    updateStepData,
    resetForm,
    getStepData,
  };
}