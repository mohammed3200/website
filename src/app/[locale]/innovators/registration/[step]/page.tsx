"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import useLanguage from "@/hooks/uselanguage";
import { useMultiStepForm } from "@/features/innovators/hooks/useMultiStepForm";
import { useJoiningInnovators } from "@/features/innovators/api/use-joining-innovators";
import {
    PersonalInfoStep,
    ProjectOverviewStep,
    ProjectDetailsStep,
    ReviewStep,
    ProgressIndicator,
} from "@/features/innovators/components/multi-step";
import { STEP_CONFIGS } from "@/features/innovators/constants/step-config";
import { Back } from "@/components";

export default function RegistrationStepPage() {
    const router = useRouter();
    const params = useParams();
    const { lang, isArabic } = useLanguage();
    const { mutate, isPending } = useJoiningInnovators();

    const stepParam = params.step as string;
    const currentStepNumber = parseInt(stepParam, 10);

    const {
        currentStep,
        totalSteps,
        formData,
        completedSteps,
        canGoToStep,
        goToStep,
        nextStep,
        previousStep,
        updateStepData,
        resetForm,
        getStepData,
    } = useMultiStepForm(currentStepNumber);

    // Sync URL with hook state
    useEffect(() => {
        if (currentStep !== currentStepNumber) {
            router.replace(`/${lang}/innovators/registration/${currentStep}`);
        }
    }, [currentStep, currentStepNumber, router, lang]);

    // Validate step access
    useEffect(() => {
        if (isNaN(currentStepNumber) || currentStepNumber < 1 || currentStepNumber > totalSteps) {
            router.replace(`/${lang}/innovators/registration/1`);
            return;
        }

        if (!canGoToStep(currentStepNumber)) {
            router.replace(`/${lang}/innovators/registration/${currentStep}`);
        }
    }, [currentStepNumber, currentStep, totalSteps, canGoToStep, router, lang]);

    const handleStepComplete = (stepData: any) => {
        updateStepData(stepData);

        if (currentStep === totalSteps) {
            // Final submission
            const completeData = {
                ...formData,
                ...stepData,
                TermsOfUse: stepData.TermsOfUse ? "true" : "false",
            };

            mutate(
                { form: completeData },
                {
                    onSuccess: () => {
                        resetForm();
                        router.push(`/${lang}/innovators/registration/complete`);
                    },
                    onError: (error) => {
                        console.error("Submission error:", error);
                    },
                }
            );
        } else {
            nextStep();
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <PersonalInfoStep
                        data={getStepData(1)}
                        onNext={handleStepComplete}
                        onPrevious={previousStep}
                        isLoading={isPending}
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                        completedSteps={completedSteps}
                    />
                );
            case 2:
                return (
                    <ProjectOverviewStep
                        data={getStepData(2)}
                        onNext={handleStepComplete}
                        onPrevious={previousStep}
                        isLoading={isPending}
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                        completedSteps={completedSteps}
                    />
                );
            case 3:
                return (
                    <ProjectDetailsStep
                        data={getStepData(3)}
                        onNext={handleStepComplete}
                        onPrevious={previousStep}
                        isLoading={isPending}
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                        completedSteps={completedSteps}
                    />
                );
            case 4:
                return (
                    <ReviewStep
                        data={getStepData(4)}
                        allFormData={formData}
                        onNext={handleStepComplete}
                        onPrevious={previousStep}
                        onEdit={goToStep}
                        isLoading={isPending}
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                        completedSteps={completedSteps}
                    />
                );
            default:
                return null;
        }
    };

    if (isNaN(currentStepNumber) || currentStepNumber < 1 || currentStepNumber > totalSteps) {
        return null;
    }

    return (
        <div className="w-full min-h-screen py-8 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <div className={`mb-6 ${isArabic ? "text-right" : "text-left"}`}>
                    <Back />
                </div>

                {/* Progress Indicator */}
                <ProgressIndicator
                    steps={STEP_CONFIGS}
                    currentStep={currentStep}
                    completedSteps={completedSteps}
                    onStepClick={goToStep}
                    isArabic={isArabic}
                />

                {/* Step Content */}
                <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                    {renderStep()}
                </div>
            </div>
        </div>
    );
}
