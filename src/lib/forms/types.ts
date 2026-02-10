import { ZodSchema } from 'zod';

/**
 * Result of a validation operation
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Props passed to the component rendering a specific step
 * @template T The type of data this step handles
 */
export interface StepComponentProps<T = any> {
  data: Partial<T>;
  updateData: (data: Partial<T>) => void;
  errors: Record<string, string>;
  isValid: boolean;
  isSubmitting: boolean;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}

/**
 * Represents a single step in a multi-step form
 * @template T The type of data this step handles (subset of full form data)
 */
export interface FormStep<T = any> {
  id: string;
  title: { ar: string; en: string };
  description?: { ar: string; en: string };
  icon?: React.ElementType;
  /**
   * Component to render for this step
   */
  component: React.ComponentType<StepComponentProps<T>>;
  /**
   * Zod schema for validating this step's data
   */
  schema?: ZodSchema<any>;
  /**
   * Custom validation function (async supported)
   */
  validate?: (data: Partial<T>) => Promise<ValidationResult>;
  /**
   * Whether this step is optional
   */
  isOptional?: boolean;
}

/**
 * Configuration for an entire multi-step form
 * @template T The complete form data type
 */
export interface FormConfig<T> {
  formId: string;
  storageKey: string;
  basePath: string; // e.g., '/collaborators/registration'
  successPath: string;
  steps: FormStep<any>[];
  /**
   * Final submission handler
   */
  onComplete: (data: T) => Promise<void>;
  onError?: (error: Error) => void;
}

/**
 * State interface for the form store
 * @template T The complete form data type
 */
export interface FormState<T> {
  currentStepIndex: number;
  data: Partial<T>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValidating: boolean;
  /**
   * Metadata like timestamp, version
   */
  metadata: {
    startedAt: number;
    lastUpdatedAt: number;
    version: number;
  };
}

export interface FormActions<T> {
  setStep: (index: number) => void;
  setData: (data: Partial<T>) => void;
  setErrors: (errors: Record<string, string>) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setValidating: (isValidating: boolean) => void;
  reset: () => void;
}

export type FormStore<T> = FormState<T> & FormActions<T>;

export interface SelectOption {
  value: string;
  label: string | { ar: string; en: string };
}
