 
"use client";

import React, { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const locales = [
  { code: "en", title: "English" },
  { code: "ar", title: "العربي" },
];

export const TranslateButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [isPending, startTransition] = useTransition();

  const handleChange = (localeCode: string) => {
    startTransition(() => {
      const pathSegments = pathname.split("/").filter(Boolean);
      if (pathSegments.length > 0) {
        pathSegments[0] = localeCode; 
        const newPath = `/${pathSegments.join("/")}`; 
        router.replace(newPath); 
      }
    });
  };

  // Find the first language code in the pathname
  const currentLocale = () => pathname.split("/").filter(Boolean)[0];


  return (
    <div className="flex flex-row items-center space-x-1">
      {locales.map((locale, index) => (
        <React.Fragment key={locale.code}>
          <button
            onClick={() => handleChange(locale.code)}
            className={cn(
              "font-din-bold cursor-pointer text-xs md:text-base",
              currentLocale() === locale.code ? "text-primary" : "text-light-100"
            )}
          >
            {locale.title}
          </button>
          {locales.length - 1 > index && (
            <div className="flex rounded-full h-5 w-[1px] bg-black" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};