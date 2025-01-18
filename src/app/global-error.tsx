"use client";

import React from "react";
import Image from "next/image";

import useLanguage from "@/hooks/uselanguage";

import { InterfaceImage } from "@/constants";
import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/background-beams";

const Error = () => {
  const { isArabic, lang } = useLanguage();
  return (
    <html>
      <body>
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
                  {isArabic ? "تحت الصيانة" : "Under Maintenance"}
                </h2>
                <div className="font-din-regular body-2 max-lg:max-w-sm">
                  {isArabic ? (
                    <p className="">
                      نعمل حاليًا على تحسين موقعنا. يُرجى التحقق مرة أخرى قريبًا. العودة الي{" "}
                      <Link href={`/${lang}`}>
                        <span className="text-primary cursor-pointer hover:underline hover:decoration-4 hover:underline-offset-[6px]">
                          الصفحة الرئيسية
                        </span>
                      </Link>
                    </p>
                  ) : (
                    <p className="">
                      We are currently working on improving our site. Please check back soon. Back to{" "}
                      <Link href={`/${lang}`}>
                        <span className="text-primary cursor-pointer hover:underline hover:decoration-4 hover:underline-offset-[6px]">
                          Home Page
                        </span>
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            </section>
          </main>
        </div>
      </body>
    </html>
  );
};

export default Error;
