"use client";

import Link from "next/link";
import Image from "next/image";
import { InterfaceImage } from "@/constants";
import useLanguage from "@/hooks/use-language";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import arMessages from "../../messages/ar.json";

export default function NotFound() {
  return (
    <NextIntlClientProvider locale="ar" messages={arMessages} timeZone="Africa/Tripoli">
      <NotFoundContent />
    </NextIntlClientProvider>
  );
}

function NotFoundContent() {
  const { isArabic, lang } = useLanguage();
  const t = useTranslations("NotFound");

  // Fallback to 'ar' if lang is undefined/empty to prevent 404 loops or broken links
  // But wait, lang comes from useLocale now which defaults to configured locale.
  // Actually in global 404, we might not have a locale in URL.
  // useLanguage uses NextIntl's useLocale, which needs context.
  // NotFoundContent is inside NextIntlClientProvider with "ar" context, so lang will be "ar".

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
              src={InterfaceImage.Error404}
              alt="not found"
              width={300}
              height={300}
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