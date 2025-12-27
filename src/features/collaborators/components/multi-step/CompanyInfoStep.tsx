"use client";

import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import useLanguage from "@/hooks/use-language";

import { Form, FormControl } from "@/components/ui/form";
import { CustomFormField, FormFieldType } from "@/components";
import { IconsInterface } from "@/constants";

import { step1Schema } from "../../schemas/step-schemas";
import type { Step1Data, StepComponentProps } from "../../types/multi-step-types";
import { StepNavigation } from "./StepNavigation";

export function CompanyInfoStep({
    data,
    onNext,
    onPrevious,
    isLoading,
    currentStep,
    totalSteps,
}: StepComponentProps<Step1Data>) {
    const t = useTranslations("collaboratingPartners");
    const tForm = useTranslations("Form");
    const { isArabic, isEnglish } = useLanguage();

    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<Step1Data>({
        resolver: zodResolver(step1Schema(tForm)),
        defaultValues: {
            companyName: data.companyName || "",
            image: data.image,
            primaryPhoneNumber: data.primaryPhoneNumber || "",
            optionalPhoneNumber: data.optionalPhoneNumber || "",
            email: data.email || "",
            location: data.location || "",
            site: data.site || "",
        },
    });

    // Check valid state for navigation buttons
    const { isValid } = form.formState;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue("image", file, { shouldValidate: true });
        }
    };

    const onSubmit = (values: Step1Data) => {
        onNext(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6 items-start">
                        {/* Left Column: Form Fields */}
                        <div className={isEnglish ? "order-1" : "order-2"}>
                            <div className="mb-6">
                                <h2 className="text-2xl font-din-bold text-gray-800 mb-2">
                                    {t("form.title")}
                                </h2>
                                <p className="text-gray-600 font-din-regular">
                                    {t("form.subtitle")}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block text-gray-700">
                                        {t("form.CompanyNameField")}
                                    </label>
                                    <CustomFormField
                                        fieldType={FormFieldType.INPUT} // Fallback to basic input if PlaceholdersAndVanishInput needs special handling inside CustomFormField or use directly
                                        control={form.control}
                                        name="companyName"
                                        label="" // Handled above
                                        // placeholder handled by custom logic usually, but here we can pass basic placeholder
                                        placeholder={isArabic ? "اسم الشركة" : "Company Name"}
                                    />
                                    {/* Note: In original form PlaceholdersAndVanishInput was used. 
                                        If CustomFormField doesn't support it directly, we might need to use it directly 
                                        inside a RenderField or just standard Input for consistency in multi-step. 
                                        Standard Input is safer for multi-step state. */}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CustomFormField
                                        fieldType={FormFieldType.PHONE_INPUT}
                                        control={form.control}
                                        name="primaryPhoneNumber"
                                        label={t("form.PrimaryPhone")}
                                    />
                                    <CustomFormField
                                        fieldType={FormFieldType.PHONE_INPUT}
                                        control={form.control}
                                        name="optionalPhoneNumber"
                                        label={t("form.OptionalPhone")}
                                    />
                                </div>

                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="email"
                                    label={t("form.Email")}
                                    placeholder="example@company.com"
                                    iconSrc={IconsInterface.Email}
                                    iconAlt="email"
                                    isEnglish
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CustomFormField
                                        fieldType={FormFieldType.INPUT}
                                        control={form.control}
                                        name="location"
                                        label={t("form.Location")}
                                        placeholder={isArabic ? "المدينة - الحي" : "City - District"}
                                        iconSrc={IconsInterface.Location}
                                        iconAlt="Location"
                                    />
                                    <CustomFormField
                                        fieldType={FormFieldType.INPUT}
                                        control={form.control}
                                        name="site"
                                        label={t("form.Website")}
                                        placeholder="www.example.com"
                                        iconSrc={IconsInterface.Site}
                                        iconAlt="site"
                                        isEnglish
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Image Upload */}
                        <div className={`flex flex-col items-center ${isEnglish ? "order-2" : "order-1"}`}>
                            <CustomFormField
                                fieldType={FormFieldType.SKELETON}
                                control={form.control}
                                name="image"
                                label={t("form.MainImage")}
                                renderSkeleton={(field) => (
                                    <FormControl>
                                        <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
                                            {field.value instanceof File || typeof field.value === 'string' ? (
                                                <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                                                    <Image
                                                        src={
                                                            field.value instanceof File
                                                                ? URL.createObjectURL(field.value)
                                                                : field.value || ""
                                                        }
                                                        alt="Company Logo"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            field.onChange(null);
                                                            if (inputRef.current) inputRef.current.value = "";
                                                        }}
                                                        className="absolute top-2 right-2 bg-white/80 p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => inputRef.current?.click()}
                                                    className="w-full aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all group"
                                                >
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        ref={inputRef}
                                                        onChange={handleImageChange}
                                                        accept="image/*"
                                                    />
                                                    <div className="p-4 bg-orange-100 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                                        <Image
                                                            src={IconsInterface.Upload}
                                                            width={32}
                                                            height={32}
                                                            alt="Upload"
                                                        />
                                                    </div>
                                                    <p className="text-sm font-din-bold text-gray-700">{isArabic ? "تحميل الشعار" : "Upload Logo"}</p>
                                                    <p className="text-xs text-gray-500 mt-2 text-center px-4">SVG, PNG, JPG (max. 800x400px)</p>
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <StepNavigation
                    currentStep={currentStep || 1}
                    totalSteps={totalSteps || 4}
                    onNext={form.handleSubmit(onSubmit)}
                    onPrevious={onPrevious}
                    canGoNext={isValid}
                    canGoPrevious={false}
                    isLoading={isLoading}
                    isArabic={isArabic}
                />
            </form>
        </Form>
    );
}