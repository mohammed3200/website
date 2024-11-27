"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

import useLanguage from "@/hooks/uselanguage";
import { Button } from "../ui/button";

export const Back = () => {
  const router = useRouter();
  const t = useTranslations("ui");
  const { isArabic } = useLanguage();

  return (
    <Button
      variant="secondary"
      className="flex flex-row items-center justify-center gap-2"
      onClick={() => router.back()}
      dir={!isArabic ? "rtl" : "ltr"}
    >
      <p className="font-din-bold text-light-100">{t("back")}</p>
      {isArabic ? <ChevronRight className="size-4 mr-2" /> : <ChevronLeft className="size-4 mr-2" />}
    </Button>
  );
};
