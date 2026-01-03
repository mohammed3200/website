
import { User, Lightbulb, FileText, ClipboardCheck } from 'lucide-react';
import { FormConfig } from '@/lib/forms/types';
import { CompleteFormData } from './schemas/step-schemas';
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
} from './schemas/step-schemas';
import { PersonalInfoStep } from './steps/personal-info-step';
import { ProjectOverviewStep } from './steps/project-overview-step';
import { ProjectDetailsStep } from './steps/project-details-step';
import { ReviewSubmitStep } from './steps/review-submit-step';

export const getInnovatorFormConfig = (
  t: (key: string) => string
): FormConfig<CompleteFormData> => ({
  formId: 'innovator-registration',
  storageKey: 'innovator-registration-storage',
  basePath: '/innovators/registration',
  successPath: '/innovators/registration/complete',
  steps: [
    {
      id: 'personal-info',
      title: {
        en: 'Personal Info',
        ar: 'المعلومات الشخصية',
      },
      component: PersonalInfoStep,
      schema: step1Schema(t),
      icon: User,
    },
    {
      id: 'project-overview',
      title: {
        en: 'Project Overview',
        ar: 'نظرة عامة على المشروع',
      },
      component: ProjectOverviewStep,
      schema: step2Schema(t),
      icon: Lightbulb,
    },
    {
      id: 'project-details',
      title: {
        en: 'Details & Files',
        ar: 'التفاصيل والملفات',
      },
      component: ProjectDetailsStep,
      schema: step3Schema(t),
      icon: FileText,
    },
    {
      id: 'review',
      title: {
        en: 'Review',
        ar: 'المراجعة',
      },
      component: ReviewSubmitStep,
      schema: step4Schema(t),
      icon: ClipboardCheck,
    },
  ],
  onComplete: async (data) => {
    // Generate FormData
    const formData = new FormData();
    
    // Append helper
    const append = (key: string, value: any) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
          value.forEach((item) => {
              if (item instanceof File) {
                  formData.append(key, item);
              } else {
                  formData.append(key, String(item));
              }
          });
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    };

    // Append data
    Object.keys(data).forEach((key) => {
      const value = (data as any)[key];
      append(key, value);
    });

    const response = await fetch('/api/innovators', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Submission failed');
    }
  },
});
