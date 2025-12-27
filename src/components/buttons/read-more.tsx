
"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import useLanguage from "@/hooks/use-language";

interface ReactMoreProps {
  href: string;
}

export const ReadMore = ({ href }: ReactMoreProps) => {
  const t = useTranslations("ui");
  const { isArabic } = useLanguage();
  return (
    <span className="bg-transparent" dir={isArabic ? "rtl" : "ltr"}>
      <Link href={href}>
        <span className="font-din-regular text-primary">{t("readMore")}</span>
      </Link>
    </span>
  );
};

