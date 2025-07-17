"use client";

import React, { useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import useLanguage from "@/hooks/uselanguage";

import { cn } from "@/lib/utils";

import { Form, FormControl } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";

import { InterfaceImage, IconsInterface } from "@/constants";
import {
  Back,
  CustomFormField,
  FormFieldType,
  SubmitButton,
} from "@/components";

import { createCreativeRegistrationSchema } from "../schemas";
import { StagesDevelopment } from "../constants";
import { useJoiningInnovators } from "../api/use-joining-innovators";
import { StageDevelopment } from "../types";

export const InnovatorsRegistrationForm = () => {
  const router = useRouter();
  const { mutate, isPending } = useJoiningInnovators();
  const { isArabic, isEnglish, lang } = useLanguage();
  const [fileName, setFileName] = useState<string | null>(null);
  const t = useTranslations("CreatorsAndInnovators");
  const tForm = useTranslations("Form");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      setFileName(file.name);
    }
  };

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
      stageDevelopment: StageDevelopment.STAGE,
      TermsOfUse: false,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof creativeRegistrationSchema>
  ) => {
    try {
      const newInnovators = {
        ...values,
        // TODO: TermsOfUse boolean
        TermsOfUse: values.TermsOfUse ? "true" : "false",
      };

      mutate(
        {
          form: newInnovators,
        },
        {
          onSuccess: () => {
            form.reset();
            router.push(`/${lang}/innovators`);
          },
        }
      );
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="w-full md:px-4 px-6 md:py-2">
      <div className="relative w-full flex md:flex-col items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full md:space-y-10"
          >
            <div className="w-[90%] flex flex-col md:flex-row items-center gap-8 ml-8 md:pl-12">
              <div
                className={cn(
                  "w-full row-span-1 md:col-span-3 max-md:order-last",
                  isEnglish && "order-last"
                )}
              >
                <section
                  className="grid md:grid-cols-6 flex-col gap-8"
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  <div className="col-span-2">
                    <CustomFormField
                      fieldType={FormFieldType.SKELETON}
                      control={form.control}
                      name="image"
                      label={t("form.Image")}
                      renderSkeleton={(field) => (
                        <FormControl className="h-full overflow-hidden">
                          <div className="flex flex-col items-center gap-y-2 overflow-hidden h-full ">
                            {field.value ? (
                              <div className="w-full h-full flex items-center justify-center py-2 rounded-lg overflow-hidden border-gray-300 border-dashed border-2 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] ">
                                <Image
                                  src={
                                    field.value instanceof File
                                      ? URL.createObjectURL(field.value)
                                      : field.value
                                  }
                                  width={250}
                                  height={250}
                                  alt="Image"
                                  sizes="(max-width: 640px) 90vw, (min-width: 641px) 45vw"
                                  className="object-content rounded-md"
                                />
                              </div>
                            ) : (
                              <div className="flex-1 w-full">
                                <input
                                  className="hidden"
                                  type="file"
                                  accept="image/*"
                                  ref={inputRef}
                                  onChange={handleImageChange}
                                />
                                <button
                                  className="bg-transparent font-din-regular gap-2 px-12 py-2 w-full flex cursor-pointer flex-col items-center justify-center rounded-lg border-gray-300 border-dashed border-2 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                                  type="button"
                                  onClick={() => inputRef.current?.click()}
                                >
                                  <Image
                                    src={IconsInterface.Upload}
                                    width={100}
                                    height={100}
                                    sizes="(max-width: 640px) 90vw, (min-width: 641px) 45vw"
                                    alt="upload"
                                  />
                                  <div
                                    className="flex flex-col justify-center gap-2 text-center text-black"
                                    dir={isArabic ? "rtl" : "ltr"}
                                  >
                                    <p className="font-din-regular text-base">
                                      <span className="">
                                        {isArabic
                                          ? "انقر للتحميل"
                                          : "Click to upload"}{" "}
                                      </span>
                                      {isArabic
                                        ? "أو اسحب وأفلِت"
                                        : "or drag and drop"}
                                    </p>
                                    <p className="font-din-regular text-sm">
                                      SVG, PNG, JPG or GIF (max. 800x400px)
                                    </p>
                                  </div>
                                </button>
                              </div>
                            )}
                            <div
                              className="bg-gray-200  w-full h-10 rounded-xl cursor-pointer flex items-center gap-4 px-2 border-none"
                              dir={isArabic ? "rtl" : "ltr"}
                            >
                              <button
                                className="cursor-pointer"
                                onClick={() => {
                                  field.onChange(null);
                                  if (inputRef.current) {
                                    inputRef.current.value = "";
                                    setFileName(null);
                                  }
                                }}
                              >
                                <Trash2
                                  color="#fe6601"
                                  className="size-8 rounded-full p-1 cursor-pointer"
                                />
                              </button>
                              <p className="font-din-regular truncate max-md:text-sm">
                                {fileName ? fileName : "Not selected file"}
                              </p>
                            </div>
                          </div>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div
                    className="col-span-4 flex flex-col"
                    dir={isArabic ? "rtl" : "ltr"}
                  >
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
                  </div>
                </section>
              </div>

              <div
                dir={isArabic ? "rtl" : "ltr"}
                className={cn(
                  "w-fit gap-2 row-span-1 md:col-span-2 justify-center space-y-2 max-md:order-first",
                  isEnglish && "order-first"
                )}
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
                    className={cn("object-cover h-auto scale-90 md:scale-110")}
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex max-md:items-center flex-col md:px-20 max-md:mt-4">
              <div
                dir={isArabic ? "rtl" : "ltr"}
                className="md:w-[70%] md:-mt-10 md:ml-auto w-full"
              >
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="projectTitle"
                  label={t("form.projectTitle")}
                  iconSrc={IconsInterface.Text}
                  iconAlt="text"
                  placeholder={
                    isArabic
                      ? "عنوان تصف به فكرتك"
                      : "A title to describe your idea"
                  }
                />
              </div>

              <div
                dir={isArabic ? "rtl" : "ltr"}
                className="w-full grid grid-cols-1 md:grid-cols-5 items-center gap-4 pt-4"
              >
                <div className="md:col-span-3 col-span-1 w-full">
                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="projectDescription"
                    label={t("form.projectDescription")}
                    placeholder={
                      isArabic
                        ? "وصف بسيط بما لا يتجاوز 250 كلمة"
                        : "A simple description of no more than 250 words"
                    }
                  />
                </div>
                <div className="md:col-span-2 col-span-1 w-full">
                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="objective"
                    label={t("form.objective")}
                    placeholder={
                      isArabic
                        ? "ما هي أهداف فكرتك؟ وما هي المشكلة التي تحلها؟"
                        : "What are the goals of the idea? What problem does it solve?"
                    }
                  />
                </div>
              </div>

              <div
                dir={isArabic ? "rtl" : "ltr"}
                className="w-full max-md:pt-2"
              >
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="stageDevelopment"
                  label={t("form.stageDevelopment")}
                >
                  {Object.entries(StagesDevelopment).map(([key, value]) => (
                    <SelectItem
                      key={key}
                      value={key} // Use enum key instead of value
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
                  {/* TODO: Remove Terms of user */}
                  <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="TermsOfUse"
                    label={t("form.TermsOfUse")}
                  />
                </div>
                <div dir={isArabic ? "rtl" : "ltr"} className="">
                  <SubmitButton
                    isLoading={isPending}
                    dir={isArabic ? "rtl" : "ltr"}
                    classNameContent={`max-md:items-center ${
                      isArabic ? "flex-row-reverse" : "flex-row"
                    }`}
                    className="max-md:w-full max-md:h-1/2"
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
