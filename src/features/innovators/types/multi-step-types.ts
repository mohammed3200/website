import type {
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
  CompleteFormData,
} from "../schemas/step-schemas";

export interface MultiStepFormData {
  version: string;
  timestamp: Date;
  expiresAt: Date;
  currentStep: number;
  completedSteps: number[];
  formData: Partial<CompleteFormData>;
}

export interface StepConfig {
  number: number;
  label: {
    en: string;
    ar: string;
  };
  path: string;
  isRequired: boolean;
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
  updateStepData: <T>(stepData: T) => void;
  resetForm: () => void;
  getStepData: <T>(step: number) => Partial<T>;
}

export interface StepComponentProps<T = CompleteFormData> {
  data: Partial<T>;
  onNext: (data: T) => void;
  onPrevious: () => void;
  isLoading?: boolean;
  currentStep?: number;
  totalSteps?: number;
  completedSteps: number[];
  onSave?: (data: Partial<T>) => void;
  isArabic?: boolean;
}

export interface NavigationProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  isLoading: boolean;
  isArabic: boolean;
}

export interface ProgressProps {
  steps: StepConfig[];
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
  isArabic: boolean;
}

// Re-export for convenience
export type {
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
  CompleteFormData,
};
