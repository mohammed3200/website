"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const useLanguage = () => {
  const [lang, setLang] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    // Extract language from the pathname
    const language = pathname.split("/")[1]; // Get the segment after the first slash
    setLang(language);
  }, [pathname]); // Only re-run when pathname changes

  return lang; // Return the current language
};

export default useLanguage;