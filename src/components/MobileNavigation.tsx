"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import useLanguage from "@/hooks/uselanguage";

import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { TranslateButton } from "./TranslateButton";

export const MobileNavigation = () => {
  const { lang, isArabic } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = useTranslations("Navigation");

  const navigationItems = [
    { title: t("home"), href: `/${lang}` },
    { title: t("entrepreneurship"), href: `/${lang}entrepreneurship` },
    { title: t("incubators"), href: `/${lang}incubators` },
    { title: t("projects"), href: `/${lang}projects` },
    { title: t("contact"), href: `/${lang}contact` },
  ];

  return (
    <header className="mobile-header" dir={isArabic ? "rtl" : "ltr"}>
      <Image
        src="./assets/icons/logo.svg"
        alt="logo"
        width={50}
        height={50}
        className="h-auto"
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src="assets/icons/menu.svg"
            alt="Menu"
            width={30}
            height={30}
          />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3 flex flex-col" side={isArabic ? "left" : "right"}>
          <SheetTitle className="pt-2">
            <TranslateButton />
          </SheetTitle>
          <nav className="mobile-nav flex-1">
            <Separator className="mb-4 bg-light-200/20" />
            <ul className="mobile-nav-list">
              {navigationItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={index} href={item.href} className="lg:w-full">
                    <li
                      className={cn(
                        "mobile-nav-item font-din-regular",
                        isActive && "shad-active"
                      )}
                    >
                      <p>{item.title}</p>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};