"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProgressProps } from "../../types/multi-step-types";

export function ProgressIndicator({
    steps,
    currentStep,
    completedSteps,
    onStepClick,
    isArabic,
}: ProgressProps) {
    const progressPercent = (currentStep / steps.length) * 100;

    return (
        <div className="w-full mb-8" dir={isArabic ? "rtl" : "ltr"}>
            {/* Progress Bar */}
            <div className="relative mb-8">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-orange-500 transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-sm font-din-regular text-gray-600">
                        {isArabic
                            ? `الخطوة ${currentStep} من ${steps.length}`
                            : `Step ${currentStep} of ${steps.length}`}
                    </span>
                    <span className="text-sm font-din-bold text-orange-600">
                        {Math.round(progressPercent)}%
                    </span>
                </div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between relative">
                {/* Connection Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
                <div
                    className="absolute top-5 left-0 h-0.5 bg-orange-500 -z-10 transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, _) => {
                    const stepNumber = step.number;
                    const isActive = currentStep === stepNumber;
                    const isCompleted = completedSteps.includes(stepNumber);
                    const canClick = isCompleted || stepNumber === currentStep;

                    return (
                        <div
                            key={stepNumber}
                            className="flex flex-col items-center relative"
                            style={{ width: `${100 / steps.length}%` }}
                        >
                            {/* Step Circle */}
                            <button
                                type="button"
                                onClick={() => canClick && onStepClick(stepNumber)}
                                disabled={!canClick}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                                    isActive &&
                                    "bg-orange-500 border-orange-500 scale-110 shadow-lg",
                                    isCompleted &&
                                    !isActive &&
                                    "bg-orange-500 border-orange-500 hover:scale-105 cursor-pointer",
                                    !isActive &&
                                    !isCompleted &&
                                    "bg-white border-gray-300 cursor-not-allowed",
                                    canClick && "focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                                )}
                                aria-label={isArabic ? step.label.ar : step.label.en}
                                aria-current={isActive ? "step" : undefined}
                            >
                                {isCompleted ? (
                                    <Check className="w-5 h-5 text-white" />
                                ) : (
                                    <span
                                        className={cn(
                                            "font-din-bold text-sm",
                                            isActive ? "text-white" : "text-gray-500"
                                        )}
                                    >
                                        {stepNumber}
                                    </span>
                                )}
                            </button>

                            {/* Step Label */}
                            <span
                                className={cn(
                                    "mt-2 text-xs font-din-regular text-center max-w-[80px]",
                                    isActive && "text-orange-600 font-din-bold",
                                    isCompleted && !isActive && "text-gray-700",
                                    !isActive && !isCompleted && "text-gray-400"
                                )}
                            >
                                {isArabic ? step.label.ar : step.label.en}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
