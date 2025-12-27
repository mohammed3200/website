"use client";

import React from 'react';
import Image from "next/image";

import useLanguage from "@/hooks/use-language";
import { useTranslations } from "next-intl";

import { InterfaceImage } from "@/constants";



const Error = () => {
  const t = useTranslations("Error");
  const { isArabic } = useLanguage();
  return (
    <div
      className="flex flex-1 items-center justify-center flex-col gap-2"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Image
        src={InterfaceImage.ComputerError}
        alt="not found"
        width={450}
        height={450}
        sizes="(max-width: 640px) 100vw, (min-width: 641px) 50vw"
        className="object-cover h-auto"
      />
      <h2 className="font-din-bold h6 md:h5 ">
        {t("title")}
      </h2>
      <p className="font-din-regular body-2 max-lg:max-w-sm">
        {t("message")}
      </p>
    </div>
  );
};

export default Error;