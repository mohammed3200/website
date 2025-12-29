"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Telescope, GraduationCap } from "lucide-react";
import useLanguage from "@/hooks/use-language";

import { Form, FormControl } from "@/components/ui/form";
import { CustomFormField, FormFieldType, UploadFiles } from "@/components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { step3Schema } from "../../schemas/step-schemas";
import type { Step3Data, StepComponentProps } from "../../types/multi-step-types";
import { StepNavigation } from "./step-navigation";

export function CapabilitiesStep({
    data,
    onNext,
    onPrevious,
    isLoading,
    currentStep,
    totalSteps,
}: StepComponentProps<Step3Data>) {
    const t = useTranslations("collaboratingPartners");
    const tForm = useTranslations("Form");
    const { isArabic } = useLanguage();

    const [experienceFiles, setExperienceFiles] = useState<File[]>(data.experienceProvidedMedia || []);
    const [machineryFiles, setMachineryFiles] = useState<File[]>(data.machineryAndEquipmentMedia || []);

    const form = useForm<Step3Data>({
        resolver: zodResolver(step3Schema(tForm)),
        mode: "onTouched",
        defaultValues: {
            experienceProvided: data.experienceProvided || "",
            experienceProvidedMedia: data.experienceProvidedMedia || [],
            machineryAndEquipment: data.machineryAndEquipment || "",
            machineryAndEquipmentMedia: data.machineryAndEquipmentMedia || [],
        },
    });

    const onSubmit = (values: Step3Data) => {
        onNext(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                {/* Section Header */}
                <div className="border-b-2 border-gray-200 pb-6 text-center">
                    <h2 className="text-2xl font-din-bold text-gray-800">
                        {t("form.CompanyCapabilities")}
                    </h2>
                    <p className="text-gray-600 font-din-regular mt-2">
                        {isArabic ? "شاركنا خبراتك وامكانياتك" : "Share your experiences and capabilities"}
                    </p>
                </div>

                <Tabs
                    defaultValue="experiences"
                    className="w-full h-full overflow-hidden"
                    dir={isArabic ? "rtl" : "ltr"}
                >
                    <TabsList className="w-full grid grid-cols-2 mb-6 h-auto p-1 bg-gray-100/80">
                        <TabsTrigger
                            value="experiences"
                            className="data-[state=active]:bg-white data-[state=active]:shadow-sm p-3 gap-2"
                        >
                            <GraduationCap className="w-5 h-5 opacity-70" />
                            <p className="font-din-regular base max-md:base-small">
                                {isArabic ? "الخبرات" : "Experiences"}
                            </p>
                        </TabsTrigger>
                        <TabsTrigger
                            value="MachineryAndEquipment"
                            className="data-[state=active]:bg-white data-[state=active]:shadow-sm p-3 gap-2"
                        >
                            <Telescope className="w-5 h-5 opacity-70" />
                            <p className="font-din-regular base max-md:base-small">
                                {isArabic ? "الآلات والمعدات" : "Machinery & Equipment"}
                            </p>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="experiences" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <CustomFormField
                                    fieldType={FormFieldType.TEXTAREA}
                                    control={form.control}
                                    name="experienceProvided"
                                    label={t("form.ExperienceProvided")}
                                    placeholder={
                                        isArabic
                                            ? "وصف بسيط للخبرات للكادر الوظيفي بالشركة..."
                                            : "A simple description of the company staff experiences..."
                                    }
                                    className="min-h-[200px]"
                                />
                            </div>
                            <div className="lg:col-span-1">
                                <CustomFormField
                                    fieldType={FormFieldType.SKELETON}
                                    control={form.control}
                                    name="experienceProvidedMedia"
                                    label={t("form.ExperienceProvidedMedia")}
                                    renderSkeleton={() => (
                                        <FormControl>
                                            <UploadFiles
                                                onFileChange={(files) => {
                                                    setExperienceFiles(files);
                                                    form.setValue("experienceProvidedMedia", files, { shouldValidate: true });
                                                }}
                                                maxFiles={5}
                                                error={form.formState.errors.experienceProvidedMedia?.message}
                                                files={experienceFiles}
                                            />
                                        </FormControl>
                                    )}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="MachineryAndEquipment" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <CustomFormField
                                    fieldType={FormFieldType.TEXTAREA}
                                    control={form.control}
                                    name="machineryAndEquipment"
                                    label={t("form.MachineryAndEquipment")}
                                    placeholder={
                                        isArabic
                                            ? "معلومات حول الآلات والمعدات الخاصة بك..."
                                            : "Information about your machinery and equipment..."
                                    }
                                    className="min-h-[200px]"
                                />
                            </div>
                            <div className="lg:col-span-1">
                                <CustomFormField
                                    fieldType={FormFieldType.SKELETON}
                                    control={form.control}
                                    name="machineryAndEquipmentMedia"
                                    label={t("form.MachineryAndEquipmentMedia")}
                                    renderSkeleton={() => (
                                        <FormControl>
                                            <UploadFiles
                                                onFileChange={(files) => {
                                                    setMachineryFiles(files);
                                                    form.setValue("machineryAndEquipmentMedia", files, { shouldValidate: true });
                                                }}
                                                maxFiles={5}
                                                error={form.formState.errors.machineryAndEquipmentMedia?.message}
                                                files={machineryFiles}
                                            />
                                        </FormControl>
                                    )}
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <StepNavigation
                    currentStep={currentStep || 3}
                    totalSteps={totalSteps || 4}
                    onNext={form.handleSubmit(onSubmit)}
                    onPrevious={onPrevious}
                    canGoNext={true} // Fields are optional
                    canGoPrevious={true}
                    isLoading={isLoading}
                    isArabic={isArabic}
                />
            </form>
        </Form>
    );
}
