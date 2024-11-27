/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const locales = ["ar", "en"];

export const TranslateButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (localeCode: string) => {
    startTransition(() => {
      // Get the current path segments
      const pathSegments = pathname.split('/').filter(Boolean);

      // Update the first segment with the new locale
      if (pathSegments.length > 0) {
        pathSegments[0] = localeCode; // Update the locale segment
        const newPath = `/${pathSegments.join('/')}`; // Reconstruct the path
        router.replace(newPath); // Navigate to the new path
      }
    });
  };

  return (
    <div className="flex flex-row items-center space-x-1">
      {locales.map((code, index) => (
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
          {locales.length - 1 > index && (
            <div className="flex rounded-full h-5 w-[1px] bg-black" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};