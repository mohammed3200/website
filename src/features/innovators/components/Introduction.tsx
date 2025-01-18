"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";

import { useTranslations } from "next-intl";
import useLanguage from "@/hooks/uselanguage";

import { ActiveButton } from "@/components";

import { InterfaceImage } from "@/constants";

export const Introduction = () => {
  const router = useRouter();
  const { isArabic, lang } = useLanguage();
  const t = useTranslations("CreatorsAndInnovators");
  return (
    <div
      className="w-full h-full grid grid-row-2 md:grid-cols-8 items-center md:px-8 px-2"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="row-span-1 md:col-span-5 items-center flex max-md:flex-col gay-2"
      >
        <Image
          src={InterfaceImage.InnovationRafiki}
          alt="interface image item1"
          width={400}
          height={400}
          sizes="(max-width: 640px) 100vw, (min-width: 641px) 50vw"
          className="object-cover h-auto"
        />
        <div className="flex flex-col space-y-2 grow w-full">
          <p className="font-din-regular h5 max-md:h6">{t("title")}</p>
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
    </div>
  );
};
