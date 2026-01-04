
import { Building2, Factory, Briefcase, ClipboardCheck } from 'lucide-react';
import { FormConfig } from '@/lib/forms/types';
import { Collaborator } from '@/features/collaborators/types/types';
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
} from '@/features/collaborators/schemas/step-schemas';
import { CompanyInfoStep } from '@/features/collaborators/steps/company-info-step';
import { IndustryInfoStep } from '@/features/collaborators/steps/industry-info-step';
import { CapabilitiesStep } from '@/features/collaborators/steps/capabilities-step';
import { ReviewSubmitStep } from '@/features/collaborators/steps/review-submit-step';

export const getCollaboratorFormConfig = (
  t: (key: string) => string
): FormConfig<Collaborator> => ({
  formId: 'collaborator-registration',
  storageKey: 'collaborator-registration-storage',
  basePath: '/collaborators/registration',
  successPath: '/collaborators/registration/complete',
  steps: [
    {
      id: 'company-info',
      title: {
        en: 'Company Info',
        ar: 'معلومات الشركة',
      },
      component: CompanyInfoStep,
      schema: step1Schema(t),
      icon: Building2,
    },
    {
      id: 'industry-info',
      title: {
        en: 'Industry',
        ar: 'المجال الصناعي',
      },
      component: IndustryInfoStep,
      schema: step2Schema(t),
      icon: Factory,
    },
    {
      id: 'capabilities',
      title: {
        en: 'Capabilities',
        ar: 'القدرات',
      },
      component: CapabilitiesStep,
      schema: step3Schema(t),
      icon: Briefcase,
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
    // Convert to FormData for file uploads
    const formData = new FormData();
    
    // Helper to append data
    const append = (key: string, value: any) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
          // Handle arrays of files or strings
          value.forEach((item, index) => {
              if (item instanceof File) {
                  formData.append(key, item); // Usually backend expects 'key' or 'key[]'
                  // If using Next.js server actions or standard upload, 'key' allows multiple files
              } else {
                   formData.append(key, String(item));
              }
          });
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    };

    // Iterate and append
    Object.keys(data).forEach((key) => {
      const value = (data as any)[key];
      // Special handling for file arrays if needed, but the generic Array check above covers it
      append(key, value);
    });

    const response = await fetch('/api/collaborator', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Submission failed');
    }
  },
});
