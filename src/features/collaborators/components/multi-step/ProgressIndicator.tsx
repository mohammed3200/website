"use client";

import useLanguage from "@/hooks/use-language";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressIndicatorProps {
    currentStep: number;
    totalSteps: number;
    completedSteps: number[];
}

export function ProgressIndicator({
    currentStep,
    totalSteps,
    completedSteps,
}: ProgressIndicatorProps) {
    const { isArabic } = useLanguage();

    const steps = [
        { number: 1, label: { en: "Company Info", ar: "معلومات الشركة" } },
        { number: 2, label: { en: "Industry", ar: "القطاع الصناعي" } },
        { number: 3, label: { en: "Capabilities", ar: "القدرات والإمكانيات" } },
        { number: 4, label: { en: "Review", ar: "المراجعة" } },
    ];

    return (
        <div className="w-full mb-10 text-center ">
            <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto px-4">
                {/* Progress Bar Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full" />

                {/* Active Progress Bar */}
                <motion.div
                    className={cn(
                        "absolute top-1/2 h-1 bg-orange-500 -z-10 rounded-full",
                        isArabic ? "right-0" : "left-0"
                    )}
                    initial={{ width: 0 }}
                    animate={{
                        width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />

                {steps.map((step, index) => {
                    const isActive = currentStep === step.number;
                    const isCompleted = completedSteps.includes(step.number) || currentStep > step.number;

                    return (
                        <div
                            key={step.number}
                            className="flex flex-col items-center gap-2 bg-white px-2"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: isActive ? 1.1 : 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={cn(
                                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 font-din-bold",
                                    isActive
                                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-md"
                                        : isCompleted
                                            ? "border-green-500 bg-green-50 text-green-600"
                                            : "border-gray-300 bg-white text-gray-400"
                                )}
                            >
                                {isCompleted ? (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                    >
                                        <Check className="w-6 h-6" />
                                    </motion.div>
                                ) : (
                                    <span>{step.number}</span>
                                )}
                            </motion.div>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                                className={cn(
                                    "absolute top-12 text-xs font-din-medium transition-colors duration-300 w-24 text-center",
                                    isActive ? "text-orange-600 font-bold" : "text-gray-500"
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