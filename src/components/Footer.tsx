"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { useTranslations } from "next-intl";
import useLanguage from "@/hooks/use-language";

import { Separator } from "./ui/separator";
import { socials } from "@/constants";

export const Footer = () => {
  const { isArabic } = useLanguage();
  const t = useTranslations("Footer");

  return (
    <footer dir={isArabic ? "rtl" : "ltr"}>
      <div className="w-full flex flex-col items-center">
        <Separator className="mt-2 md:mt-4 bg-primary w-[80vw]" />
        <div className="py-2 px-10 w-full">
          <div className="flex w-full max-md:flex-col">
            <div className="small-compact flex flex-1 flex-wrap items-center justify-center gap-5">
              <p className="font-din-regular text-xs md:text-ms">
                {t("copyright")}
              </p>
              <div className="flex items-center justify-center ms:ml-auto">
                <p className="font-din-regular relative mr-9 text-p5 transition-all duration-500 hover:text-p1">
                  {t("privacyPolicy")}
                </p>
                <p className="font-din-regular text-p5 transition-all duration-500 hover:text-p1">
                  {t("termsOfUse")}
                </p>
              </div>
            </div>
            <ul className="flex flex-1 justify-center gap-3 mt-4 md:mt-5 md:justify-end">
              {socials.map(({ id, url, icon, title }) => (
                <li key={id}>
                  <Link
                    href={url}
                    className="flex size-7 md:size-10 items-center justify-center rounded-full border-2 border-primary bg-transparent"
                  >
                    <Image
                      src={icon}
                      alt={title}
                      width={20}
                      height={20}
                      title={title}
                      color="primary"
                      className="size-2/3 object-contain h-auto"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
