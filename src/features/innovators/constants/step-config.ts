import type { StepConfig } from "../types/multi-step-types";

export const STEP_CONFIGS: StepConfig[] = [
  {
    number: 1,
    label: {
      en: "Personal Information",
      ar: "المعلومات الشخصية",
    },
    path: "/registration/1",
    isRequired: true,
  },
  {
    number: 2,
    label: {
      en: "Project Overview",
      ar: "نظرة عامة على المشروع",
    },
    path: "/registration/2",
    isRequired: true,
  },
  {
    number: 3,
    label: {
      en: "Project Stage & Files",
      ar: "مرحلة المشروع والملفات",
    },
    path: "/registration/3",
    isRequired: true,
  },
  {
    number: 4,
    label: {
      en: "Review & Submit",
      ar: "المراجعة والإرسال",
    },
    path: "/registration/4",
    isRequired: true,
  },
];

export const getTotalSteps = () => STEP_CONFIGS.length;

export const getStepConfig = (step: number): StepConfig | undefined => {
  return STEP_CONFIGS.find((config) => config.number === step);
};

export const getStepLabel = (step: number, isArabic: boolean): string => {
  const config = getStepConfig(step);
  if (!config) return "";
  return isArabic ? config.label.ar : config.label.en;
};
