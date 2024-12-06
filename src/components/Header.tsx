"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { MainLogo } from "@/constants";

import useLanguage from "@/hooks/uselanguage";

import { TranslateButton } from "./buttons/TranslateButton";
import { NavBar } from "./NavBar";

export const Header = () => {
  const { isArabic } = useLanguage();

  return (
    <header className="header" dir={isArabic ? "rtl" : "ltr"}>
      <div className="container mx-auto flex flex-row justify-between items-center sm:py-4">
        {/* Logo */}

        <div className="">
          <Link href="/">
            <Image
              src={
                isArabic
                  ? MainLogo.LogoFull
                  : MainLogo.logoEnglishFull
              }
              alt="logo"
              width={170}
              height={170}
              className="hidden h-auto md:block"
            />
            <Image
              src={MainLogo.Logo}
              alt="logo"
              width={60}
              height={60}
              className="md:hidden"
            />
          </Link>
        </div>
        {/* Menu Items */}
        <div>
          <NavBar />
        </div>
        {/* Translate button */}
        <div>
          <TranslateButton />
        </div>
      </div>
    </header>
  );
};
