"use client";

import { Hero } from "@/components";
import useLanguage from "@/hooks/use-language";

export default function HomePage() {
  const { isArabic } = useLanguage();
  return (
    <div dir={isArabic ? "rtl" : "ltr"}>
      <Hero />
    </div>
  );
}