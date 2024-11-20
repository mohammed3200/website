"use client";

import React from "react";
import { useTranslations } from "next-intl";
import useLanguage from "@/hooks/uselanguage";

export const Footer = () => {
  const { isArabic } = useLanguage();
  const t = useTranslations("Footer");

  return (
    <div className="footer" dir={isArabic ? "rtl" : "ltr"}>
      <div>
        <p className="font-din-regular text-xs text-white md:text-xs">
          {t("copyright")}
        </p>
      </div>
    </div>
  );
};
