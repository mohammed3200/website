/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const locales = ["ar","en"];

export const TranslateButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (localeCode: string) => {
    startTransition(() => {
      router.replace(`/${localeCode}`);
    });
  };

  return (
    <div className="flex flex-row items-center space-x-1">
      {locales.map((code, index ) => (
        <React.Fragment key={code}>
          <button
            onClick={() => handleChange(code)}
            className={cn(
              "font-din-bold cursor-pointer",
              pathname.includes(code) ? "text-primary" : "text-light-100"
            )}
          >
            {code}
          </button>
          {locales.length - 1 > index  && (
            <div className="flex rounded-full h-5 w-[1px] bg-black" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
