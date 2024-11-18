"use client";

import React from "react";
import Image from "next/image";
import useIsArabic from "@/hooks/useIsArabic";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { TranslateButton } from "./TranslateButton";

export const Header = () => {
  const isArabic = useIsArabic();
  const t = useTranslations("Navigation");

  const navigationItems = [
    { title: t("home"), href: "/" },
    { title: t("entrepreneurship"), href: "/entrepreneurship" },
    { title: t("incubators"), href: "/incubators" },
    { title: t("projects"), href: "/projects" },
    { title: t("contact"), href: "/contact" },
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
            />
          </Link>
        </div>
        {/* Menu Items */}
        <div>
          <ul className="flex space-x-7">
            {navigationItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href}>
                  <p className="font-din-regular">{item.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Translate button */}
        <div>
          <TranslateButton />
      </div>
    </header>
  );
};
