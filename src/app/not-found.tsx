"use client";

import Link from "next/link";
import Image from "next/image";
import { InterfaceImage } from "@/constants";
import useLanguage from "@/hooks/uselanguage";
import { BackgroundBeams } from "@/components/ui/background-beams";

const NotFound = () => {
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
                  src={InterfaceImage.Error404}
                  alt="not found"
                  width={300}
                  height={300}
                  sizes="(max-width: 640px) 100vw, (min-width: 641px) 50vw" // Responsive sizes for mobile and desktop
                  className="object-cover h-auto"
                />
                <h2 className="font-din-bold h6 md:h5 ">
                  {isArabic ? "لم يتم العثور على الصفحة" : "Page not found"}
                </h2>
                <div className="font-din-regular body-2 max-lg:max-w-sm">
                  {isArabic ? (
                    <p className="">
                      لم نتمكن من العثور على الصفحة التي تبحث عنها. يرجى التحقق
                      من عنوان URL أو العودة إلى{" "}
                      <Link href={`/${lang}`}>
                        <span className="text-primary cursor-pointer hover:underline hover:decoration-4 hover:underline-offset-[6px]">
                          الصفحة الرئيسية
                        </span>
                      </Link>
                    </p>
                  ) : (
                    <p className="">
                      We couldn&apos;t find the page you were looking for.
                      Please check the URL or return to{" "}
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

export default NotFound;
