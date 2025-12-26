"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Trash2, Upload, FileText, File as FileIcon, Image as ImageIcon } from "lucide-react";
import useLanguage from "@/hooks/uselanguage";
import { useToast } from "@/hooks/use-toast";

import { cn } from "@/lib/utils";
import { Form, FormControl } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { CustomFormField, FormFieldType } from "@/components";

import { step3Schema } from "../../schemas/step-schemas";
import { StagesDevelopment } from "../../constants/constants";
import { StageDevelopment } from "../../types/types";
import type { Step3Data, StepComponentProps } from "../../types/multi-step-types";
import { StepNavigation } from "./StepNavigation";

export function ProjectDetailsStep({
    data,
    onNext,
    onPrevious,
    isLoading,
    currentStep,
    totalSteps,
}: StepComponentProps<Step3Data>) {
    const t = useTranslations("CreatorsAndInnovators");
    const tForm = useTranslations("Form");
    const { isArabic } = useLanguage();
    const { toast } = useToast();

    const [projectFiles, setProjectFiles] = useState<File[]>(data.projectFiles || []);
    const [fileError, setFileError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<Step3Data>({
        resolver: zodResolver(step3Schema(tForm)),
        defaultValues: {
            stageDevelopment: data.stageDevelopment || StageDevelopment.STAGE,
            projectFiles: data.projectFiles || [],
        },
    });

    const validateAndAddFiles = (files: File[]) => {
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ];

        const maxSize = 10 * 1024 * 1024; // 10MB
        const maxFiles = 10;

        for (const file of files) {
            if (!allowedTypes.includes(file.type)) {
                toast({
                    title: tForm("InvalidFileType"),
                    description: `${file.name} - ${isArabic ? "نوع غير مسموح" : "Not allowed type"}`,
                    error: true,
                });
                setFileError(tForm("InvalidFileType"));
                return false;
            }

            if (file.size > maxSize) {
                toast({
                    title: tForm("FileTooLarge"),
                    description: `${file.name} - ${(file.size / 1024 / 1024).toFixed(2)} MB`,
                    error: true,
                });
                setFileError(tForm("FileTooLarge"));
                return false;
            }
        }

        if (projectFiles.length + files.length > maxFiles) {
            toast({
                title: tForm("MaximumFiles"),
                description: isArabic ? `الحد الأقصى ${maxFiles} ملفات` : `Maximum ${maxFiles} files allowed`,
                error: true,
            });
            setFileError(tForm("MaximumFiles"));
            return false;
        }

        setFileError(null);
        return true;
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith("image/")) {
            return <ImageIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />;
        } else if (fileType.includes("pdf")) {
            return <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />;
        } else if (fileType.includes("word") || fileType.includes("document")) {
            return <FileIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />;
        } else if (fileType.includes("powerpoint") || fileType.includes("presentation")) {
            return <FileIcon className="w-5 h-5 text-orange-600 flex-shrink-0" />;
        } else {
            return <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />;
        }
    };

    const onSubmit = (values: Step3Data) => {
        onNext({ ...values, projectFiles });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                {/* Section Header */}
                <div className="border-b border-gray-200 pb-4" dir={isArabic ? "rtl" : "ltr"}>
                    <h2 className="text-2xl font-din-bold text-gray-800">
                        {isArabic ? "مرحلة المشروع والملفات" : "Project Stage & Files"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {isArabic ? "حدد مرحلة التطوير وأرفق الملفات" : "Select development stage and attach files"}
                    </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
                    {/* Stage Development */}
                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="stageDevelopment"
                        label={t("form.stageDevelopment")}
                    >
                        {Object.entries(StagesDevelopment).map(([key, value]) => (
                            <SelectItem key={key} value={key} dir={isArabic ? "rtl" : "ltr"}>
                                <p className="font-din-regular base max-md:base-small">
                                    {isArabic ? value.ar : value.en}
                                </p>
                            </SelectItem>
                        ))}
                    </CustomFormField>

                    {/* Project Files Upload */}
                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="projectFiles"
                        label={t("form.projectFiles")}
                        renderSkeleton={(field) => (
                            <FormControl>
                                <div className="space-y-4">
                                    {/* Upload Area */}
                                    <div
                                        className={cn(
                                            "border-2 border-dashed rounded-lg p-6 transition-all",
                                            projectFiles.length >= 10
                                                ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-60"
                                                : "border-gray-300 bg-gray-50 hover:border-orange-500 hover:bg-orange-50"
                                        )}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.ppt,.pptx"
                                            className="sr-only"
                                            id="project-files-upload"
                                            aria-label={isArabic ? "تحميل ملفات المشروع" : "Upload project files"}
                                            aria-describedby="file-upload-hint"
                                            disabled={projectFiles.length >= 10}
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                if (files.length > 0) {
                                                    if (validateAndAddFiles(files)) {
                                                        const newFiles = [...projectFiles, ...files].slice(0, 10);
                                                        setProjectFiles(newFiles);
                                                        field.onChange(newFiles);
                                                        toast({
                                                            title: isArabic ? "تم إضافة الملفات" : "Files added successfully",
                                                            description: `${files.length} ${isArabic ? "ملف" : "file(s)"}`,
                                                            success: true,
                                                        });
                                                    } else {
                                                        if (e.target) e.target.value = "";
                                                    }
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor="project-files-upload"
                                            className={cn(
                                                "flex flex-col items-center gap-3",
                                                projectFiles.length >= 10 ? "cursor-not-allowed" : "cursor-pointer"
                                            )}
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if ((e.key === "Enter" || e.key === " ") && projectFiles.length < 10) {
                                                    e.preventDefault();
                                                    fileInputRef.current?.click();
                                                }
                                            }}
                                        >
                                            <Upload
                                                className={`w-12 h-12 ${projectFiles.length >= 10 ? "text-gray-400" : "text-orange-500"}`}
                                            />
                                            <p className="font-din-bold text-lg text-gray-700">
                                                {projectFiles.length >= 10
                                                    ? isArabic
                                                        ? "تم الوصول للحد الأقصى"
                                                        : "Maximum files reached"
                                                    : t("form.uploadFiles")}
                                            </p>
                                            <span id="file-upload-hint" className="text-sm text-gray-500 text-center">
                                                {t("form.allowedTypes")}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {t("form.maxFiles")} | {t("form.maxFileSize")}
                                            </span>
                                        </label>
                                        {fileError && (
                                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                <p className="text-sm text-red-600 font-din-regular text-center">
                                                    ⚠️ {fileError}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* File List */}
                                    {projectFiles.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="font-din-bold text-sm text-gray-700">
                                                {t("form.uploadedFiles")} ({projectFiles.length}/10)
                                            </p>
                                            <div className="space-y-2">
                                                {projectFiles.map((file, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg hover:border-orange-300 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            {getFileIcon(file.type)}
                                                            <div className="min-w-0 flex-1">
                                                                <p className="font-din-regular text-sm truncate text-gray-700">
                                                                    {file.name}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const updated = projectFiles.filter((_, i) => i !== index);
                                                                setProjectFiles(updated);
                                                                field.onChange(updated);
                                                                setFileError(null);
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter" || e.key === " ") {
                                                                    e.preventDefault();
                                                                    const updated = projectFiles.filter((_, i) => i !== index);
                                                                    setProjectFiles(updated);
                                                                    field.onChange(updated);
                                                                    setFileError(null);
                                                                }
                                                            }}
                                                            aria-label={`${isArabic ? "حذف" : "Remove"} ${file.name}`}
                                                            className="p-3 hover:bg-red-50 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                        )}
                    />
                </div>

                {/* Navigation */}
                <StepNavigation
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    canGoNext={form.formState.isValid}
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
