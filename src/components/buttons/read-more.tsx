/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import useLanguage from "@/hooks/uselanguage";

interface ReactMoreProps {
  href: string;
}

export const ReadMore = ({ href }: ReactMoreProps) => {
  const t = useTranslations("ui");
  const { isArabic } = useLanguage();
  return (
    <div className="bg-transparent" dir={isArabic ? "rtl" : "ltr"}>
      <Link href={href}>
        <p className="font-din-regular text-primary">{t("readMore")}</p>
      </Link>
    </div>
  );
};

