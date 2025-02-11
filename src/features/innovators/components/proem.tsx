"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";

import { useTranslations } from "next-intl";
import useLanguage from "@/hooks/uselanguage";

import { ActiveButton, AnimatedList } from "@/components";

import { InterfaceImage } from "@/constants";
import { MockCompaniesData } from "@/mock";

export const Introduction = () => {
  const router = useRouter();
  const { isArabic, lang } = useLanguage();
  const t = useTranslations("CreatorsAndInnovators");

  return (
    <div
      className="w-full h-full grid grid-row-2 md:grid-cols-8 items-center md:px-8 px-6 overflow-hidden"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="row-span-1 md:col-span-5 items-center flex max-md:flex-col gap-2"
      >
        <Image
          src={InterfaceImage.InnovationRafiki}
          alt="interface image item1"
          width={300}
          height={300}
          sizes="(max-width: 640px) 100vw, (min-width: 641px) 50vw"
          className="object-cover h-auto"
        />
        <div className="flex flex-col space-y-4 max-md:space-y-2 w-full max-md:mx-6">
          <p className="font-din-regular h5">{t("title")}</p>
          <p className="font-din-regular text-light-100 body-2 max-md:body-2 max-lg:max-w-sm">
            {t("subtitle")}
          </p>
          <ActiveButton
            onClick={() => router.push(`/${lang}/innovators/registration`)}
            className=""
          >
            <div
              className="flex items-center gap-2"
              dir={isArabic ? "rtl" : "ltr"}
            >
              <p
                className="font-din-bold h9 text-gray-50 transition-all
                 duration-500 hover:decoration-[1.5px] hover:underline-offset-[2px] hover:underline
                  hover:decoration-slate-50"
              >
                {t("registration")}
              </p>
              {isArabic ? (
                <CircleArrowLeft className="size-5 max-md:size-4 text-gray-50" />
              ) : (
                <CircleArrowRight className="size-5 max-md:size-4 text-gray-50" />
              )}
            </div>
          </ActiveButton>
        </div>
      </div>
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="row-span-1 md:col-span-3 items-center h-[50dvh] max-md:my-8 flex max-md:flex-row overflow-hidden"
      >
        <AnimatedList
          direction="down"
          speed="fast"
          pauseOnHover={true}
          layout="vertical"
          items={MockCompaniesData}
          renderItem={(item, index) => ( // Corrected: Pass item and index as separate arguments
            <div className="w-44 max-md:w-36 h-36 rounded-md items-center text-black text-base bg-red-500">
              {index + 1}
            </div>
          )}
        />
        <AnimatedList
          direction="up"
          speed="normal"
          pauseOnHover={true}
          layout="vertical"
          items={MockCompaniesData}
          renderItem={(item, index) => ( // Corrected: Pass item and index as separate arguments
            <div className="w-44 max-md:w-36 h-36 rounded-md items-center text-black text-base bg-red-500">
              {index + 1}
            </div>
          )}
        />
      </div>
    </div>
  );
};