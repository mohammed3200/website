"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const useLanguage = () => {
  const [lang, setLang] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    // Extract language from the pathname, default to an empty string if not found
    const language = pathname.split("/")[1] || "";
    setLang(language);
  }, [pathname]); // Re-run when pathname changes

  // Determine if the language is Arabic
  const isArabic = lang === "ar";
  const isEnglish = lang === "en";

  return { lang, isArabic, isEnglish }; // Return the current language and whether it's Arabic
};

export default useLanguage;
