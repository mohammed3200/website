"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { NextIntlClientProvider, useTranslations, type AbstractIntlMessages } from "next-intl";

import useLanguage from "@/hooks/use-language";
import { InterfaceImage } from "@/constants";
import { BackgroundBeams } from "@/components/ui/background-beams";

import arMessages from "../../messages/ar.json";
import enMessages from "../../messages/en.json";

const messagesMap: Record<string, AbstractIntlMessages> = {
  ar: arMessages,
  en: enMessages,
};

export default function GlobalError({
  error: _error,
  reset: _reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  // Safe fallback to 'ar' if locale is missing or invalid
  const localeParam = params?.locale as string;
  const locale = (localeParam && messagesMap[localeParam]) ? localeParam : "ar";
  const messages = messagesMap[locale];
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="Africa/Tripoli">
          <ErrorContent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

function ErrorContent() {
  const { isArabic, lang } = useLanguage();
  const t = useTranslations("GlobalError");

  return (
    <div>
      <BackgroundBeams className="-z-10" />
      <main className="flex h-screen">
        <section className="flex h-full flex-1 flex-col">
          <div
            className="flex flex-1 items-center justify-center flex-col gap-2"
            dir={isArabic ? "rtl" : "ltr"}
          >
            <Image
              src={InterfaceImage.Warning}
              alt="Error"
              width={450}
              height={450}
              sizes="(max-width: 640px) 100vw, (min-width: 641px) 50vw"
              className="object-cover h-auto"
            />
            <h2 className="font-din-bold h6 md:h5 ">
              {t("title")}
            </h2>
            <div className="font-din-regular body-2 max-lg:max-w-sm">
              <p className="">
                {t("description")}{" "}
                <Link href={`/${lang}`}>
                  <span className="text-primary cursor-pointer hover:underline hover:decoration-4 hover:underline-offset-[6px]">
                    {t("homePage")}
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
