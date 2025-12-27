"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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
                    <motion.div
                        className="h-full bg-orange-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-sm font-din-regular text-gray-600">
                        {isArabic
                            ? `الخطوة ${currentStep} من ${steps.length}`
                            : `Step ${currentStep} of ${steps.length}`}
                    </span>
                    <motion.span
                        key={currentStep}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm font-din-bold text-orange-600"
                    >
                        {Math.round(progressPercent)}%
                    </motion.span>
                </div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between relative">
                {/* Connection Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
                <motion.div
                    className="absolute top-5 left-0 h-0.5 bg-orange-500 -z-10"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />

                {steps.map((step, index) => {
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
                            <motion.button
                                type="button"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: isActive ? 1.1 : 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => canClick && onStepClick(stepNumber)}
                                disabled={!canClick}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                                    isActive &&
                                    "bg-orange-500 border-orange-500 shadow-lg",
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
                                    <motion.div
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                    >
                                        <Check className="w-5 h-5 text-white" />
                                    </motion.div>
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
                            </motion.button>

                            {/* Step Label */}
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                                className={cn(
                                    "mt-2 text-xs font-din-regular text-center max-w-[80px]",
                                    isActive && "text-orange-600 font-din-bold",
                                    isCompleted && !isActive && "text-gray-700",
                                    !isActive && !isCompleted && "text-gray-400"
                                )}
                            >
                                {isArabic ? step.label.ar : step.label.en}
                            </motion.span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
