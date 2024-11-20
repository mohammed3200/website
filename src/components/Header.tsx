"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";


import useLanguage from "@/hooks/uselanguage";

import { TranslateButton } from "./TranslateButton";
import { NavBar } from "./NavBar";

export const Header = () => {
  const { lang, isArabic } = useLanguage();
  const t = useTranslations("Navigation");

  const navigationItems = [
    { title: t("home"), href: `/${lang}` },
    { title: t("entrepreneurship"), href: `/${lang}entrepreneurship` },
    { title: t("incubators"), href: `/${lang}incubators` },
    { title: t("projects"), href: `/${lang}projects` },
    { title: t("contact"), href: `/${lang}contact` },
  ];

  return (
    <header className="header" dir={isArabic ? "rtl" : "ltr"}>
      {/* Logo */}
      <div>
        <Link href="/">
          <Image
            src={
              isArabic
                ? "./assets/icons/logo-full.svg"
                : "./assets/icons/logo-english-full.svg"
            }
            alt="logo"
            width={170}
            height={170}
            className="hidden h-auto md:block"
          />
          <Image
            src="/assets/icons/logo.svg"
            alt="logo"
            width={80}
            height={80}
            className="md:hidden"
          />
        </Link>
      </div>
      {/* Menu Items */}
      <div>
        <NavBar navigationItems={navigationItems} />
      </div>
      {/* Translate button */}
      <div>
        <TranslateButton />
      </div>
    </header>
  );
};