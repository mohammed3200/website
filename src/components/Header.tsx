"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import useIsArabic from "@/hooks/useIsArabic";
import useLanguage from "@/hooks/uselanguage";

import { TranslateButton } from "./TranslateButton";


export const Header = () => {
  const lang = useLanguage();
  const pathname = usePathname();
  const isArabic = useIsArabic();
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
            width={150}
            height={150}
            className="md:hidden"
          />
        </Link>
      </div>
      {/* Menu Items */}
      <div>
        <ul className="flex space-x-7">
          {navigationItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <li key={index}>
                <Link href={item.href}>
                  <div className="flex flex-col items-center space-y-1">
                    <p
                      className={cn(
                        "font-din-regular",
                        isActive ? "text-primary" : "text-light-100"
                      )}
                    >
                      {item.title}
                    </p>
                    {isActive && (
                      <div className="w-full h-1 bg-primary rounded-full scale-110" />
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Translate button */}
      <div>
        <TranslateButton />
      </div>
    </header>
  );
};
