"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useTranslations } from "next-intl";
import useLanguage from "@/hooks/uselanguage";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

interface BackProps {
  className?: string;
}
export const Back = ({ className }: BackProps) => {
  const router = useRouter();
  const t = useTranslations("ui");
  const { isArabic } = useLanguage();

  return (
    <Button
      variant="secondary"
      className={cn(
        "flex flex-row items-center justify-center max-sm:size-7 md:gap-2 bg-transparent",
        className
      )}
      onClick={() => router.back()}
      dir={!isArabic ? "rtl" : "ltr"}
    >
      <p className="hidden md:block font-din-bold text-light-100">
        {t("back")}
      </p>
      {isArabic ? (
        <ChevronRight className="size-4 md:size-8" />
      ) : (
        <ChevronLeft className="size-4 md:size-8" />
      )}
    </Button>
  );
};
