"use client";

import { useEffect, use } from "react";
import { notFound, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useMultiStepForm } from "@/features/collaborators/hooks/useMultiStepForm";
import {
    CompanyInfoStep,
    IndustryInfoStep,
    CapabilitiesStep,
    ProgressIndicator,
} from "@/features/collaborators/components/multi-step";
import { ReviewStep } from "@/features/collaborators/components/multi-step/ReviewStep";
import { useJoiningCollaborators } from "@/features/collaborators/api";
import type { CompleteFormData } from "@/features/collaborators/types/multi-step-types";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import useLanguage from "@/hooks/use-language";

export default function StepPage({
    params,
}: {
    params: Promise<{ step: string; locale: string }>;
}) {
    const { step: stepParam, locale } = use(params);
    const step = parseInt(stepParam);
    const router = useRouter();
    const t = useTranslations("collaboratingPartners");
    const { toast } = useToast();
    const { isArabic } = useLanguage();

    // Use existing API hook for submission
    const { mutate, isPending } = useJoiningCollaborators();

    const {
        currentStep,
        totalSteps,
        formData,
        completedSteps,
        nextStep,
        previousStep,
        updateStepData,
        resetForm,
    } = useMultiStepForm(step);

    // Validate step number
    if (isNaN(step) || step < 1 || step > 4) {
        notFound();
    }

    // Effect to sync URL with internal state if needed or handle direct access checks
    // Note: The hook takes initialStep, but we might want to enforce sequential access here
    useEffect(() => {
        // If trying to access step > 1 without data, redirect to step 1
        // (Simple protection, can be robustified)
        if (step > 1 && Object.keys(formData).length === 0) {
            // router.replace(`/${params.locale}/collaborators/registration/1`);
        }
    }, [step, formData, locale, router]);


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleNext = (data: any) => {
        updateStepData(data);

        if (currentStep === totalSteps) {
            handleSubmission({ ...formData, ...data });
        } else {
            nextStep();
        }
    };

    const handleSubmission = async (data: Partial<CompleteFormData>) => {
        try {
            // Final Validation (optional, but good practice)
            // const result = completeCollaboratorRegistrationSchema(tForm).safeParse(data);
            // if (!result.success) { ...handle error... }

            const finalData = data as CompleteFormData;

            // Prepare payload for API
            // Note: The structure must match what the API expects
            const payload = {
                ...finalData,
                // Ensure arrays for media
                experienceProvidedMedia: Array.isArray(finalData.experienceProvidedMedia) ? finalData.experienceProvidedMedia : [],
                machineryAndEquipmentMedia: Array.isArray(finalData.machineryAndEquipmentMedia) ? finalData.machineryAndEquipmentMedia : [],
                // TermsOfUse is likely removed or handled
            };

            mutate(
                { form: payload },
                {
                    onSuccess: () => {
                        resetForm();
                        router.push(`/${locale}/collaborators/registration/complete`);
                    },
                    onError: (error) => {
                        console.error("Error submitting form:", error);
                        toast({
                            title: "Error",
                            description: t("error_submitting") || "An error occurred while submitting.",
                            variant: "destructive"
                        });
                    },
                }
            );
        } catch (error) {
            console.error("Error in submission handler:", error);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <CompanyInfoStep
                        data={formData}
                        onNext={handleNext}
                        onPrevious={previousStep}
                        isLoading={isPending}
                        currentStep={step}
                        totalSteps={totalSteps}
                    />
                );
            case 2:
                return (
                    <IndustryInfoStep
                        data={formData}
                        onNext={handleNext}
                        onPrevious={previousStep}
                        isLoading={isPending}
                        currentStep={step}
                        totalSteps={totalSteps}
                    />
                );
            case 3:
                return (
                    <CapabilitiesStep
                        data={formData}
                        onNext={handleNext}
                        onPrevious={previousStep}
                        isLoading={isPending}
                        currentStep={step}
                        totalSteps={totalSteps}
                    />
                );
            case 4:
                return (
                    <ReviewStep
                        data={formData}
                        onNext={handleNext} // This triggers submission
                        onPrevious={previousStep}
                        isLoading={isPending}
                        currentStep={step}
                        totalSteps={totalSteps}
                    />
                );
            default:
                return null; // or Error component
        }
    };

    return (
        <div className="container max-w-5xl mx-auto py-10 px-4">
            <div className="mb-8">
                <ProgressIndicator
                    currentStep={step}
                    totalSteps={totalSteps}
                    completedSteps={completedSteps}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 min-h-[500px] overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ x: isArabic ? -20 : 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: isArabic ? 20 : -20, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Error Display if needed globally */}
        </div>
    );
}
