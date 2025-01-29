"use client";

import React, { useState } from "react";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import useLanguage from "@/hooks/uselanguage";

import { cn } from "@/lib/utils";

import {
  Form,
} from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";

import { InterfaceImage, IconsInterface } from "@/constants";
import { Back, CustomFormField, FormFieldType, SubmitButton } from "@/components";

import { createCreativeRegistrationSchema } from "../schemas";
import { StagesDevelopment } from "../constants";

export const InnovatorsRegistrationForm = () => {
  const router = useRouter();
  const { isArabic, isEnglish, lang } = useLanguage();
  const t = useTranslations("CreatorsAndInnovators");
  const tForm = useTranslations("Form");
  const [isLoading, setIsLoading] = useState(false);

  const creativeRegistrationSchema = createCreativeRegistrationSchema(tForm);

  const form = useForm<z.infer<typeof creativeRegistrationSchema>>({
    resolver: zodResolver(creativeRegistrationSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      projectTitle: "",
      projectDescription: "",
      objective: "",
      stageDevelopment: undefined,
      TermsOfUse: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof creativeRegistrationSchema>) => {
    setIsLoading(true);
      
    try {
      const newInnovators = {
        name: values.name,
        phoneNumber: values.phoneNumber,
        email: values.email,
        projectTitle: values.projectTitle,
        projectDescription: values.projectDescription,
        objective: values.objective,
        stageDevelopment: values.stageDevelopment,
      };
  
      console.log("====================================");
      console.log(newInnovators);
      console.log("====================================");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full md:px-4 px-6 md:py-2">
      <div className="relative w-full flex md:flex-col items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="w-full grid grid-cols-1 md:grid-cols-5 items-center gap-4">

              <div className={cn("w-full row-span-1 md:col-span-3 max-md:order-last", isEnglish && "order-last")}>
                <section className="space-y-2 flex flex-col md:w-[90%] mr-auto"
                  dir={isArabic ? "rtl" : "ltr"}>
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="name"
                    label={t("form.name")}
                    iconSrc={IconsInterface.User}
                    iconAlt="user"
                  />
                  <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    control={form.control}
                    name="phoneNumber"
                    label={t("form.phone")}
                  />
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="email"
                    label={t("form.email")}
                    placeholder="example@example.com"
                    iconSrc={IconsInterface.Email}
                    iconAlt="email"
                    isEnglish
                  />
                </section>
              </div>

              <div
                dir={isArabic ? "rtl" : "ltr"}
                className={cn("w-full gap-2 row-span-1 md:col-span-2 justify-center px-5 space-y-2 max-md:order-first", isEnglish && "order-first")}
              >
                <div
                  className={cn(
                    "max-md:absolute max-md:top-2",
                    isArabic ? "mr-auto" : "ml-auto"
                  )}
                >
                  <Back className="max-md:scale-150 scale-125" />
                </div>
                <div className="flex justify-center w-full">
                  <Image
                    src={InterfaceImage.Innovation}
                    alt="interface image Innovation"
                    width={350}
                    height={350}
                    sizes="(max-width: 640px) 100vw, (min-width: 641px) 50vw"
                    className={cn(
                      "object-cover h-auto scale-90 md:scale-110",
                    )}
                  />
                </div>
              </div>

            </div>
            <div
              className="w-full flex max-md:items-center flex-col md:px-20 max-md:mt-4"
            >
              <div dir={isArabic ? "rtl" : "ltr"}
                className="md:w-[70%] md:-mt-10 md:ml-auto w-full"
              >
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="projectTitle"
                  label={t("form.projectTitle")}
                  iconSrc={IconsInterface.Text}
                  iconAlt="text"
                  placeholder={isArabic ? "عنوان تصف به فكرتك" : "A title to describe your idea"}
                />
              </div>

              <div
                dir={isArabic ? "rtl" : "ltr"}
                className="w-full grid grid-cols-1 md:grid-cols-5 items-center gap-4 pt-4">
                <div className="md:col-span-3 col-span-1 w-full">
                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="projectDescription"
                    label={t("form.projectDescription")}
                    placeholder={isArabic ? "وصف بسيط بما لا يتجاوز 250 كلمة" : "A simple description of no more than 250 words"}
                  />
                </div>
                <div className="md:col-span-2 col-span-1 w-full">
                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="objective"
                    label={t("form.objective")}
                    placeholder={isArabic ? "ما هي أهداف فكرتك؟ وما هي المشكلة التي تحلها؟" : "What are the goals of the idea? What problem does it solve?"}
                  />
                </div>
              </div>

              <div dir={isArabic ? "rtl" : "ltr"} className="w-full max-md:pt-2">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="stageDevelopment"
                  label={t("form.stageDevelopment")}
                >
                  {Object.entries(StagesDevelopment).map(([key, value]) => (
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
              </div>
              <section className="space-y-3 my-4 max-md:w-full">
                <div dir={isArabic ? "rtl" : "ltr"}>
                  <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="TermsOfUse"
                    label={t("form.TermsOfUse")}
                  />
                </div>
                <div dir={isArabic ? "rtl" : "ltr"} className="">
                  <SubmitButton
                    isLoading={isLoading}
                    dir={isArabic ? "rtl" : "ltr"}
                    classNameContent={`max-md:items-center ${isArabic ? "flex-row-reverse" : "flex-row"
                      }`}
                    className="max-md:w-full max-md:h-1/2"
                    type="submit" // Ensure this is set
                  >
                    <p className="font-din-regular text-white">{t("submit")}</p>
                  </SubmitButton>
                </div>
              </section>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
