import { useLocale } from "next-intl";

const useLanguage = () => {
  const lang = useLocale();

  // Determine if the language is Arabic
  const isArabic = lang === "ar";
  const isEnglish = lang === "en";

  return { lang, isArabic, isEnglish };
};

export default useLanguage;
