"use client";

import { useTranslations } from "next-intl";
import  useLanguage  from "./use-language";

export function useNavigationItems() {
  const { lang } = useLanguage();
  const t = useTranslations("Navigation");

  return [
    { title: t("home"), href: `/${lang}` },
    { title: t("entrepreneurship"), href: `/${lang}/entrepreneurship` },
    { title: t("incubators"), href: `/${lang}/incubators` },
    { title: t("collaboratingPartners"), href: `/${lang}/collaborators` },
    { title: t("CreatorsAndInnovators"), href: `/${lang}/innovators`},
    { title: t("contact"), href: `/${lang}/contact` },
  ];
}