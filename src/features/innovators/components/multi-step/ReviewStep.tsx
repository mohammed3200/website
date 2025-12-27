"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Edit2, FileText, Image as ImageIcon, File as FileIcon } from "lucide-react";
import useLanguage from "@/hooks/use-language";
import Image from "next/image";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CustomFormField, FormFieldType } from "@/components";

import { step4Schema } from "../../schemas/step-schemas";
import { Countries, StagesDevelopment } from "../../constants/constants";
import type { Step4Data, StepComponentProps, CompleteFormData } from "../../types/multi-step-types";
import { StepNavigation } from "./StepNavigation";

interface ReviewStepProps extends StepComponentProps<Step4Data> {
    allFormData: Partial<CompleteFormData>;
    onEdit: (step: number) => void;
}

export function ReviewStep({
    data,
    allFormData,
    onNext,
    onPrevious,
    onEdit,
    isLoading,
    currentStep,
    totalSteps,
}: ReviewStepProps) {
    const t = useTranslations("CreatorsAndInnovators");
    const tForm = useTranslations("Form");
    const { isArabic } = useLanguage();

    const form = useForm<Step4Data>({
        resolver: zodResolver(step4Schema(tForm)),
        mode: "onChange",
        defaultValues: {
            TermsOfUse: data.TermsOfUse || false,
        },
    });

    const onSubmit = (values: Step4Data) => {
        onNext(values);
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith("image/")) {
            return <ImageIcon className="w-4 h-4 text-blue-500" />;
        } else if (fileType.includes("pdf")) {
            return <FileText className="w-4 h-4 text-red-500" />;
        } else {
            return <FileIcon className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                {/* Section Header */}
                <div className="border-b border-gray-200 pb-4" dir={isArabic ? "rtl" : "ltr"}>
                    <h2 className="text-2xl font-din-bold text-gray-800">
                        {isArabic ? "المراجعة والإرسال" : "Review & Submit"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {isArabic ? "راجع معلوماتك قبل الإرسال" : "Review your information before submitting"}
                    </p>
                </div>

                {/* Summary Sections */}
                <div className="space-y-6">
                    {/* Personal Information Section */}
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4" dir={isArabic ? "rtl" : "ltr"}>
                            <h3 className="text-lg font-din-bold text-gray-800">
                                {isArabic ? "المعلومات الشخصية" : "Personal Information"}
                            </h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(1)}
                                className="flex items-center gap-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                {isArabic ? "تعديل" : "Edit"}
                            </Button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4" dir={isArabic ? "rtl" : "ltr"}>
                            {allFormData.image && (
                                <div className="col-span-2">
                                    <Image
                                        src={
                                            allFormData.image instanceof File
                                                ? URL.createObjectURL(allFormData.image)
                                                : allFormData.image
                                        }
                                        width={100}
                                        height={100}
                                        alt="Profile"
                                        className="rounded-lg border border-gray-300"
                                    />
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-gray-500">{t("form.name")}</p>
                                <p className="font-din-regular text-gray-800">{allFormData.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t("form.email")}</p>
                                <p className="font-din-regular text-gray-800">{allFormData.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t("form.phone")}</p>
                                <p className="font-din-regular text-gray-800">{allFormData.phoneNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t("form.country")}</p>
                                <p className="font-din-regular text-gray-800">
                                    {allFormData.country && Countries[allFormData.country as keyof typeof Countries]
                                        ? (isArabic ? Countries[allFormData.country as keyof typeof Countries].ar : Countries[allFormData.country as keyof typeof Countries].en)
                                        : allFormData.country}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t("form.city")}</p>
                                <p className="font-din-regular text-gray-800">{allFormData.city}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t("form.specialization")}</p>
                                <p className="font-din-regular text-gray-800">{allFormData.specialization}</p>
                            </div>
                        </div>
                    </div>

                    {/* Project Overview Section */}
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4" dir={isArabic ? "rtl" : "ltr"}>
                            <h3 className="text-lg font-din-bold text-gray-800">
                                {isArabic ? "نظرة عامة على المشروع" : "Project Overview"}
                            </h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(2)}
                                className="flex items-center gap-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                {isArabic ? "تعديل" : "Edit"}
                            </Button>
                        </div>
                        <div className="space-y-4" dir={isArabic ? "rtl" : "ltr"}>
                            <div>
                                <p className="text-sm text-gray-500">{t("form.projectTitle")}</p>
                                <p className="font-din-regular text-gray-800">{allFormData.projectTitle}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t("form.projectDescription")}</p>
                                <p className="font-din-regular text-gray-800 whitespace-pre-wrap">
                                    {allFormData.projectDescription}
                                </p>
                            </div>
                            {allFormData.objective && (
                                <div>
                                    <p className="text-sm text-gray-500">{t("form.objective")}</p>
                                    <p className="font-din-regular text-gray-800 whitespace-pre-wrap">
                                        {allFormData.objective}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Project Details Section */}
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4" dir={isArabic ? "rtl" : "ltr"}>
                            <h3 className="text-lg font-din-bold text-gray-800">
                                {isArabic ? "تفاصيل المشروع" : "Project Details"}
                            </h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(3)}
                                className="flex items-center gap-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                {isArabic ? "تعديل" : "Edit"}
                            </Button>
                        </div>
                        <div className="space-y-4" dir={isArabic ? "rtl" : "ltr"}>
                            <div>
                                <p className="text-sm text-gray-500">{t("form.stageDevelopment")}</p>
                                <p className="font-din-regular text-gray-800">
                                    {allFormData.stageDevelopment && StagesDevelopment[allFormData.stageDevelopment as keyof typeof StagesDevelopment]
                                        ? (isArabic
                                            ? StagesDevelopment[allFormData.stageDevelopment as keyof typeof StagesDevelopment].ar
                                            : StagesDevelopment[allFormData.stageDevelopment as keyof typeof StagesDevelopment].en)
                                        : allFormData.stageDevelopment}
                                </p>
                            </div>
                            {allFormData.projectFiles && allFormData.projectFiles.length > 0 && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">
                                        {t("form.projectFiles")} ({allFormData.projectFiles.length})
                                    </p>
                                    <div className="space-y-2">
                                        {allFormData.projectFiles.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 text-sm text-gray-700 bg-white p-2 rounded border border-gray-200"
                                            >
                                                {getFileIcon(file.type)}
                                                <span className="truncate">{file.name}</span>
                                                <span className="text-xs text-gray-500">
                                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Terms of Use */}
                <div dir={isArabic ? "rtl" : "ltr"}>
                    <CustomFormField
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="TermsOfUse"
                        label={t("form.TermsOfUse")}
                    />
                </div>

                {/* Navigation */}
                <StepNavigation
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    canGoNext={form.formState.isValid && form.watch("TermsOfUse")}
                    canGoPrevious={true}
                    onNext={form.handleSubmit(onSubmit)}
                    onPrevious={onPrevious}
                    isLoading={isLoading}
                    isArabic={isArabic}
                />
            </form>
        </Form>
    );
}
