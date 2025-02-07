"use client";

import React, { useRef, useState } from "react";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Telescope, GraduationCap, Trash2 } from "lucide-react";
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
import { SelectItem } from "@/components/ui/select";
import {
  CustomFormField,
  FormFieldType,
  SubmitButton,
  UploadFiles,
  Back,
} from "@/components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { InterfaceImage, IconsInterface } from "@/constants";

import { EntranceNamePlaceholders, SectorTranslations } from "../constants";
import { createJoiningCompaniesCollaboratorSchema } from "../schemas";
import { useJoiningCollaborators } from "../api";

export const CollaboratorJoiningForm = () => {
  const router = useRouter();
  const { isArabic, isEnglish, lang } = useLanguage();
  const tForm = useTranslations("Form");
  const { mutate, isPending } = useJoiningCollaborators();
  const t = useTranslations("collaboratingPartners");
  const [experienceFiles, setExperienceFiles] = useState<File[]>([]);
  const [machineryFiles, setMachineryFiles] = useState<File[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);

  const JoiningCompaniesCollaboratorSchema =
    createJoiningCompaniesCollaboratorSchema(tForm);

  const form = useForm<z.infer<typeof JoiningCompaniesCollaboratorSchema>>({
    resolver: zodResolver(JoiningCompaniesCollaboratorSchema),
    defaultValues: {
      companyName: "",
      primaryPhoneNumber: "",
      optionalPhoneNumber: "",
      email: "",
      location: "",
      site: "",
      industrialSector: undefined,
      specialization: "",
      experienceProvided: "",
      machineryAndEquipment: "",
      TermsOfUse: false,
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (values: z.infer<typeof JoiningCompaniesCollaboratorSchema>) => {  
    try {
      const newCollaborators = {
        companyName: values.companyName,
        image: values.image,
        primaryPhoneNumber: values.primaryPhoneNumber,
        optionalPhoneNumber: values.optionalPhoneNumber,
        email: values.email,
        location: values.location,
        site: values.site,
        industrialSector: values.industrialSector,
        specialization: values.specialization,
        experienceProvided: values.experienceProvided,
        experienceProvidedMedia: values.experienceProvidedMedia || [], // Ensure it's an array
        machineryAndEquipment: values.machineryAndEquipment,
        machineryAndEquipmentMedia: values.machineryAndEquipmentMedia || [], // Ensure it's an array
        // TODO: TermsOfUse boolean
        TermsOfUse: values.TermsOfUse ? "true" : "false",
      };
  
      mutate(
        { form: newCollaborators },
        {
          onSuccess: () => {
            form.reset();
            router.push(`/${lang}/collaborators`);
          },
          onError: (error) => {
            console.error("Error submitting form:", error);
          },
        }
      );
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      setFileName(file.name);
    }
  };

  return (
    <div className="w-full md:px-4 px-2 md:py-2">
      <div className="relative w-full flex md:flex-col items-center gap-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="w-full grid grid-row-2 md:grid-cols-2 items-center gap-4 ">
              <div
                dir={isArabic ? "rtl" : "ltr"}
                className={cn(
                  "w-full gap-2 row-span-1 md:col-span-1 justify-center px-5 space-y-2",
                  isArabic ? "order-last" : "order-first ml-8"
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
                        <FormControl className="md:scale-x-110 md:-translate-x-2">
                          <PlaceholdersAndVanishInput
                            placeholders={
                              isArabic
                                ? EntranceNamePlaceholders.ar
                                : EntranceNamePlaceholders.en
                            }
                            onChange={field.onChange}
                            onSubmit={(e) => {
                              e.preventDefault();
                              form.handleSubmit(onSubmit)();
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
            <div className="space-y-6 px-6 md:px-4 max-md:pt-8">
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
                        name="site"
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
                        ? "وصف المجال الذي تختص به."
                        : "Describe your field of expertise."
                    }
                  />
                </div>
                <div
                  className="flex flex-col gap-6 xl:flex-row mt-4"
                  dir={isArabic ? "rtl" : "ltr"}
                >
                  <Tabs
                    defaultValue="experiences"
                    className="w-full h-full overflow-hidden"
                    dir={isArabic ? "rtl" : "ltr"}
                  >
                    <h2 className="font-din-regular h5 md:h6 my-4 md:my-2">
                      {t("form.SharedResources")}
                    </h2>
                    <TabsList className="">
                      <TabsTrigger value="experiences">
                        <div
                          className="flex flex-row gap-2 items-center"
                          dir={isArabic ? "rtl" : "lrt"}
                        >
                          <GraduationCap
                            color="#fe6601"
                            className="size-6 opacity-70 p-1"
                          />
                          <p className="font-din-regular base max-md:base-small">
                            {isArabic ? "الخبرات" : "Experiences"}
                          </p>
                        </div>
                      </TabsTrigger>
                      <TabsTrigger value="MachineryAndEquipment">
                        <div
                          className="flex flex-row gap-2 items-center"
                          dir={isArabic ? "rtl" : "ltr"}
                        >
                          <Telescope
                            color="#fe6601"
                            className="size-6 opacity-70 p-1"
                          />
                          <p className="font-din-regular base max-md:base-small">
                            {isArabic
                              ? "الآلات والمعدات"
                              : "Machinery And Equipment"}
                          </p>
                        </div>
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="experiences">
                      <div className="grid grid-cols-8 max-md:grid-cols-1 max-md:gap-2 gap-4">
                        <div className="col-span-6 w-full rounded-lg">
                          <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name="experienceProvided"
                            label={t("form.ExperienceProvided")}
                            placeholder={
                              isArabic
                                ? "وصف بسيط للقدرات والإمكانات التي تتمتع بها مؤسستك."
                                : "A simple description of your organization's capabilities and potential."
                            }
                          />
                        </div>
                        <div className="col-span-2 w-full rounded-lg overflow-y-auto">
                          <CustomFormField
                            fieldType={FormFieldType.SKELETON}
                            control={form.control}
                            name="experienceProvidedMedia"
                            label={t("form.ExperienceProvidedMedia")}
                            renderSkeleton={() => (
                              <FormControl className="h-full overflow-y-auto">
                                <UploadFiles
                                  onFileChange={(files) => {
                                    setExperienceFiles(files); // Update state
                                    form.setValue(
                                      "experienceProvidedMedia",
                                      files
                                    ); // Set File in form
                                  }}
                                  maxFiles={5}
                                  error={
                                    form.formState.errors
                                      .experienceProvidedMedia?.message
                                  }
                                  files={experienceFiles} // Pass files back to UploadFiles
                                />
                              </FormControl>
                            )}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="MachineryAndEquipment">
                      <div className="grid grid-cols-8 max-md:grid-cols-1 max-md:gap-2 gap-4">
                        <div className="col-span-6 w-full rounded-lg">
                          <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name="machineryAndEquipment"
                            label={t("form.MachineryAndEquipment")}
                            placeholder={
                              isArabic
                                ? "توفير معلومات حول الآلات والمعدات الخاصة بك، مثل الأنواع والنماذج. يساعد هذا في تقييم فرص التعاون."
                                : "Provide information about your machinery and equipment, such as types and models. This helps in evaluating cooperation opportunities."
                            }
                          />
                        </div>
                        <div className="col-span-2 w-full rounded-lg overflow-y-auto">
                          <CustomFormField
                            fieldType={FormFieldType.SKELETON}
                            control={form.control}
                            name="machineryAndEquipmentMedia"
                            label={t("form.MachineryAndEquipmentMedia")}
                            renderSkeleton={() => (
                              <FormControl className="h-full overflow-y-auto">
                                <UploadFiles
                                  onFileChange={(files) => {
                                    setMachineryFiles(files); // Update state
                                    form.setValue(
                                      "machineryAndEquipmentMedia",
                                      files
                                    ); // Set File in form
                                  }}
                                  maxFiles={5}
                                  error={
                                    form.formState.errors
                                      .machineryAndEquipmentMedia?.message
                                  }
                                  files={machineryFiles} // Pass files back to UploadFiles
                                />
                              </FormControl>
                            )}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
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
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
