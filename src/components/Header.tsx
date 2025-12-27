"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { MainLogo } from "@/constants";

import useLanguage from "@/hooks/use-language";

import { TranslateButton, NavBar } from "@/components";

export const Header = () => {
  const { isArabic } = useLanguage();
  // TODO: Add college logo
  return (
    <header className="header " dir={isArabic ? "rtl" : "ltr"}>
      <div className="mx-auto flex flex-row justify-between items-center w-[90%]">
        {/* Logo */}
        <Link href="/">
          <Image
            src={
              isArabic
                ? MainLogo.CenterLogoLarge
                : MainLogo.CenterLogoLargeEnglish
            }
            alt="Center logo"
            width={170}
            height={170}
            className="hidden h-auto md:block"
          />
        </Link>
        {/* Menu Items */}
        <div>
          <NavBar />
        </div>
        {/* College Logo */}
        <Link href="https://cit.edu.ly/">
          <Image
            src={
              isArabic
                ? MainLogo.CollegeLogoLarge
                : MainLogo.CollegeLogoLargeEnglish
            }
            alt="college logo"
            width={200}
            height={200}
            className="hidden h-auto md:block"
          />
        </Link>
      </div>
      {/* Translate button */}
      <div className="">
        <TranslateButton />
      </div>
    </header>
  );
};
