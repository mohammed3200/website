"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

  return { lang, isArabic }; // Return the current language and whether it's Arabic
};

export default useLanguage;
