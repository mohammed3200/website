"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FileText } from "lucide-react";
import useLanguage from "@/hooks/use-language";

import { Form } from "@/components/ui/form";

import { step4Schema } from "../../schemas/step-schemas";
import { SectorTranslations } from "../../constants";
import type { Step4Data, StepComponentProps, CompleteFormData } from "../../types/multi-step-types";
import { StepNavigation } from "./step-navigation";

export function ReviewStep({
    data,
    onNext,
    onPrevious,
    isLoading,
    currentStep,
    totalSteps,
}: StepComponentProps<Step4Data>) {
    const t = useTranslations("collaboratingPartners");
    const tForm = useTranslations("Form");
    const { isArabic } = useLanguage();

    // Type casting to access full form data
    const allFormData = data as CompleteFormData;

    const form = useForm<Step4Data>({
        resolver: zodResolver(step4Schema(tForm)),
        mode: "onTouched",
        defaultValues: {},
    });

    const onSubmit = (values: Step4Data) => {
        onNext(values);
    };

    // Submit handler

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                {/* Section Header */}
                <div className="border-b-2 border-gray-200 pb-6 text-center">
                    <h2 className="text-2xl font-din-bold text-gray-800">
                        {isArabic ? "مراجعة البيانات" : "Review Information"}
                    </h2>
                    <p className="text-gray-600 font-din-regular mt-2">
                        {isArabic ? "يرجى مراجعة بياناتك قبل الإرسال النهائي" : "Please review your information before final submission"}
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Compact Summary Cards */}

                    {/* Company Info */}
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4 border-b pb-2">
                            <h3 className="font-din-bold text-lg text-gray-800">
                                {t("form.title")}
                            </h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex gap-4 items-start">
                                {allFormData.image && (
                                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                                        <Image
                                            src={
                                                allFormData.image instanceof File
                                                    ? URL.createObjectURL(allFormData.image)
                                                    : allFormData.image
                                            }
                                            alt="Logo"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div>
                                    <p className="font-din-bold text-lg">{allFormData.companyName}</p>
                                    <p className="text-gray-500 font-din-regular">{allFormData.email}</p>
                                    <p className="text-gray-500 font-din-regular" dir="ltr">{allFormData.primaryPhoneNumber}</p>
                                    <p className="text-gray-500 text-sm mt-1">{allFormData.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Industry */}
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4 border-b pb-2">
                            <h3 className="font-din-bold text-lg text-gray-800">
                                {isArabic ? "القطاع والتخصص" : "Industry & Specialization"}
                            </h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{t("form.IndustrialSector")}</p>
                                <p className="font-din-medium">
                                    {allFormData.industrialSector && SectorTranslations[allFormData.industrialSector as keyof typeof SectorTranslations]
                                        ? (isArabic ? SectorTranslations[allFormData.industrialSector as keyof typeof SectorTranslations].ar : SectorTranslations[allFormData.industrialSector as keyof typeof SectorTranslations].en)
                                        : allFormData.industrialSector}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{t("form.Specialization")}</p>
                                <p className="font-din-medium">{allFormData.specialization}</p>
                            </div>
                        </div>
                    </div>

                    {/* Capabilities */}
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4 border-b pb-2">
                            <h3 className="font-din-bold text-lg text-gray-800">
                                {t("form.CompanyCapabilities")}
                            </h3>
                        </div>
                        <div className="space-y-6">
                            {(allFormData.experienceProvided || (allFormData.experienceProvidedMedia && allFormData.experienceProvidedMedia.length > 0)) && (
                                <div>
                                    <p className="font-din-bold mb-2 text-orange-600">{t("form.ExperienceProvided")}</p>
                                    <p className="text-gray-700 whitespace-pre-wrap mb-3 text-sm">{allFormData.experienceProvided || (isArabic ? "لا يوجد وصف" : "No description")}</p>
                                    {allFormData.experienceProvidedMedia && allFormData.experienceProvidedMedia.length > 0 && (
                                        <div className="flex gap-2 flex-wrap">
                                            {allFormData.experienceProvidedMedia.map((file, i) => (
                                                <div key={i} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border text-xs">
                                                    <FileText className="w-3 h-3 text-gray-500" />
                                                    <span className="truncate max-w-[150px]">{file.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {(allFormData.machineryAndEquipment || (allFormData.machineryAndEquipmentMedia && allFormData.machineryAndEquipmentMedia.length > 0)) && (
                                <div>
                                    <p className="font-din-bold mb-2 text-orange-600">{t("form.MachineryAndEquipment")}</p>
                                    <p className="text-gray-700 whitespace-pre-wrap mb-3 text-sm">{allFormData.machineryAndEquipment || (isArabic ? "لا يوجد وصف" : "No description")}</p>
                                    {allFormData.machineryAndEquipmentMedia && allFormData.machineryAndEquipmentMedia.length > 0 && (
                                        <div className="flex gap-2 flex-wrap">
                                            {allFormData.machineryAndEquipmentMedia.map((file, i) => (
                                                <div key={i} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border text-xs">
                                                    <FileText className="w-3 h-3 text-gray-500" />
                                                    <span className="truncate max-w-[150px]">{file.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <StepNavigation
                    currentStep={currentStep || 4}
                    totalSteps={totalSteps || 4}
                    onNext={form.handleSubmit(onSubmit)}
                    onPrevious={onPrevious}
                    canGoNext={true}
                    canGoPrevious={true}
                    isLoading={!!isLoading}
                    isArabic={!!isArabic}
                />
            </form>
        </Form>
    );
}
