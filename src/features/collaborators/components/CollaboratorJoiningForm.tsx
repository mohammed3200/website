"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import useLanguage from "@/hooks/uselanguage";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CustomFormField, FormFieldType, SubmitButton } from "@/components";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { createJoiningCompaniesCollaboratorSchema } from "../schemas";
import {
  EntranceNamePlaceholders,
  SectorTranslations,
  CooperationTranslations,
} from "../constants";
import { InterfaceImage, IconsInterface } from "@/constants";
import { FileUploader } from "@/components/FileUploader";
import { SelectItem } from "@/components/ui/select";

interface CollaboratorJoiningFormProps {
  onCancel?: () => void;
}

export const CollaboratorJoiningForm = ({
  onCancel,
}: CollaboratorJoiningFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("collaboratingPartners");
  const tForm = useTranslations("Form");
  const { isArabic, isEnglish } = useLanguage();

  const JoiningCompaniesCollaboratorSchema =
    createJoiningCompaniesCollaboratorSchema(tForm);

  const form = useForm<z.infer<typeof JoiningCompaniesCollaboratorSchema>>({
    resolver: zodResolver(JoiningCompaniesCollaboratorSchema),
    defaultValues: {
      companyName: "",
      email: "",
      location: "",
      site: "",
      primaryPhoneNumber: "",
      optionalPhoneNumber: "",
      image: undefined,
      industrialSector: undefined,
      experienceProvided: "",
      specialization: "",
      availableMaterials: "",
      typeOfCooperation: undefined,
      CooperationInterests: "",
      TermsOfUse: false,
    },
  });

  const onSubmit = (
    values: z.infer<typeof JoiningCompaniesCollaboratorSchema>
  ) => {
    try {
      setIsLoading(true);
      console.log(values);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full md:px-4 px-2 md:py-2 ">
      <div className="w-full h-full flex md:flex-col items-center gap-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="w-full grid grid-row-2 md:grid-cols-2 items-center gap-4 ">
              <div
                dir={isArabic ? "rtl" : "ltr"}
                className={cn(
                  "w-full gap-2 row-span-1 md:col-span-1 justify-center px-5 space-y-2",
                  isArabic ? "order-last" : "order-first",
                  isEnglish && "ml-8"
                )}
              >
                <p className="font-din-bold h4 max-md:h5">{t("form.title")}</p>
                <p className="font-din-regular text-light-100 body-1 max-md:body-2 max-lg:max-w-sm">
                  {t("form.subtitle")}
                </p>
                <div className="w-full translate-y-4">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-din-regular base max-md:base-small">
                          {t("form.CompanyNameField")}
                        </FormLabel>
                        <FormControl className="md:scale-x-110 md:-translate-x-4">
                          <PlaceholdersAndVanishInput
                            placeholders={
                              isArabic
                                ? EntranceNamePlaceholders.ar
                                : EntranceNamePlaceholders.en
                            }
                            onChange={field.onChange} // Use field.onChange
                            onSubmit={(e) => {
                              e.preventDefault(); // Prevent default form submission
                              form.handleSubmit(onSubmit)(); // Call your form submit function
                            }}
                            className="md:w-[calc(100%+10%)] max-md:scale-y-90"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div
                className={cn(
                  "flex justify-center w-full",
                  isArabic ? "order-first" : "order-last"
                )}
              >
                <Image
                  src={InterfaceImage.Form}
                  alt="interface image Form"
                  width={350}
                  height={350}
                  sizes="(max-width: 640px) 100vw, (min-width: 641px) 50vw"
                  className={cn(
                    "object-cover h-auto scale-90 md:scale-110",
                    isEnglish && "mr-14"
                  )}
                />
              </div>
            </div>
            <div className="space-y-6 px-2 md:px-4">
              <section className="space-y-3">
                <div
                  className="grid md:grid-cols-5 md:gap-4 gap-2 grid-cols-1"
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  <div className="md:col-span-2">
                    <CustomFormField
                      fieldType={FormFieldType.SKELETON}
                      control={form.control}
                      name="image"
                      label={t("form.MainImage")}
                      renderSkeleton={(field) => (
                        // occupy all of this height
                        <FormControl className="h-fit">
                          <FileUploader
                            files={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      )}
                    />
                  </div>

                  <div className="md:col-span-3 flex flex-col gap-2">
                    {/* Primary and optional phone numbers */}
                    <div
                      className="flex flex-col gap-6 md:flex-row"
                      dir={isArabic ? "rtl" : "ltr"}
                    >
                      <CustomFormField
                        fieldType={FormFieldType.PHONE_INPUT}
                        control={form.control}
                        name="primaryPhoneNumber"
                        label={t("form.PrimaryPhone")}
                        placeholder="(555) 123-4567"
                      />
                      <CustomFormField
                        fieldType={FormFieldType.PHONE_INPUT}
                        control={form.control}
                        name="optionalPhoneNumber"
                        label={t("form.OptionalPhone")}
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    {/* Email And Location */}
                    <div
                      className="flex flex-col gap-6 md:flex-row"
                      dir={isArabic ? "rtl" : "ltr"}
                    >
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="location"
                        label={t("form.Location")}
                        placeholder={
                          isArabic
                            ? "المدينة - المنطقة - الشارع"
                            : "City - Area - Street"
                        }
                        iconSrc={IconsInterface.Location}
                        iconAlt="Location"
                      />
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="email"
                        label={t("form.Email")}
                        placeholder="example@example.com"
                        iconSrc={IconsInterface.Email}
                        iconAlt="email"
                        isEnglish
                      />
                    </div>

                    <div
                      className="flex flex-col gap-6 md:flex-row"
                      dir={isArabic ? "rtl" : "ltr"}
                    >
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="optionalPhoneNumber"
                        label={t("form.Website")}
                        placeholder="www."
                        iconSrc={IconsInterface.Site}
                        iconAlt="site"
                        isEnglish
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <div
                  className="flex flex-col gap-6 xl:flex-row"
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="industrialSector"
                    label={t("form.IndustrialSector")}
                  >
                    {Object.entries(SectorTranslations).map(([key, value]) => (
                      <SelectItem
                        key={key}
                        value={key}
                        dir={isArabic ? "rtl" : "ltr"}
                      >
                        <p className="font-din-regular base max-md:base-small">
                          {isArabic ? value.ar : value.en}
                        </p>
                      </SelectItem>
                    ))}
                  </CustomFormField>
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="specialization"
                    label={t("form.Specialization")}
                    placeholder={
                      isArabic
                        ? "وصف المجال الذي تختص به"
                        : "Describe your field of expertise"
                    }
                  />
                </div>

                <div
                  className="flex flex-col gap-6 xl:flex-row"
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="availableMaterials"
                    label={t("form.AvailableMaterials")}
                    placeholder={
                      isArabic
                        ? "من خلال تحديد الموارد المتاحة، يمكننا تحديد كيفية دعم بعضنا البعض بشكل أفضل."
                        : "By outlining your resources, we can better identify how to support each other"
                    }
                  />
                </div>

                <div
                  className="flex flex-col gap-6 xl:flex-row"
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="experienceProvided"
                    label={t("form.ExperienceProvided")}
                    placeholder={
                      isArabic
                        ? "وصف بسيط للقدرات والإمكانات التي تتمتع بها مؤسستك"
                        : "A simple description of your organization's capabilities and potential."
                    }
                  />
                </div>
              </section>

              <section className="space-y-3">
                <div
                  className="flex flex-col gap-6 xl:flex-row"
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="typeOfCooperation"
                    label={t("form.TypeOfCooperation")}
                  >
                    {Object.entries(CooperationTranslations).map(
                      ([key, value]) => (
                        <SelectItem
                          key={key}
                          value={key}
                          dir={isArabic ? "rtl" : "ltr"}
                        >
                          <p className="font-din-regular base max-md:base-small">
                            {isArabic ? value.ar : value.en}
                          </p>
                        </SelectItem>
                      )
                    )}
                  </CustomFormField>
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="CooperationInterests"
                    label={t("form.CooperationInterests")}
                    placeholder={
                      isArabic
                        ? "يمكنك وصف وتوضيح الطريقة التي يمكنك من خلالها تقديم التعاون"
                        : "You can describe and explain how you would provide collaboration."
                    }
                  />
                </div>
              </section>

              <section className="space-y-3">
                <div dir={isArabic ? "rtl" : "ltr"}>
                  <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="TermsOfUse"
                    label={t("form.TermsOfUse")}
                  />
                </div>
              </section>
              <div dir={isArabic ? "rtl" : "ltr"}>
                  <SubmitButton 
                  isLoading={isLoading} 
                  dir={isArabic ? "rtl" : "ltr"}
                   classNameContent={`max-md:items-center ${isArabic ? "flex-row-reverse" : "flex-row"}`}
                   className="max-md:w-full max-md:h-1/2"
                   >
                    <p className="font-din-regular text-white">{t("submit")}</p>
                  </SubmitButton>
                </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
