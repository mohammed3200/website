import { z } from "zod";
import { step1Schema, step2Schema, step3Schema, step4Schema } from "../schemas/step-schemas";

// Define generic types based on schemas
export type Step1Data = z.infer<ReturnType<typeof step1Schema>>;
export type Step2Data = z.infer<ReturnType<typeof step2Schema>>;
export type Step3Data = z.infer<ReturnType<typeof step3Schema>>;
export type Step4Data = z.infer<ReturnType<typeof step4Schema>>;

export type CompleteFormData = Step1Data & Step2Data & Step3Data & Step4Data;

export interface StepComponentProps<T = CompleteFormData> {
  data: Partial<T>;
  onNext: (data: T) => void;
  onPrevious: () => void;
  isLoading?: boolean;
  currentStep?: number;
  totalSteps?: number;
  isArabic?: boolean;
  onSave?: (data: Partial<T>) => void;
}

export interface MultiStepFormData {
  version: string;
  timestamp: Date;
  expiresAt: Date;
  currentStep: number;
  completedSteps: number[];
  formData: Partial<CompleteFormData>;
}

export interface UseMultiStepFormReturn {
  currentStep: number;
  totalSteps: number;
  formData: Partial<CompleteFormData>;
  completedSteps: number[];
  isStepValid: (step: number) => boolean;
  isStepCompleted: (step: number) => boolean;
  canGoToStep: (step: number) => boolean;
  goToStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  updateStepData: <T>(data: T) => void;
  resetForm: () => void;
  getStepData: <T>(step: number) => Partial<T>;
}
