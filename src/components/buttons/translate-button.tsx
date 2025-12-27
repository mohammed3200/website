"use client";

import React, { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMedia } from "react-use";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const locales = [
    { code: "ar", title: "العربية" },
    { code: "en", title: "English" },
];

export const TranslateButton = () => {
    const router = useRouter();
    const pathname = usePathname();
    const isDesktop = useMedia("(min-width: 1024px)", true);
    const [isPending, startTransition] = useTransition();

    // Get current locale from pathname
    const currentLocale = pathname.split("/").filter(Boolean)[0] || "en";

    const handleLanguageChange = (localeCode: string) => {
        if (localeCode === currentLocale) return;

        startTransition(() => {
            const pathSegments = pathname.split("/").filter(Boolean);

            // Replace the first segment (locale) or add it if missing
            if (pathSegments.length > 0 && (pathSegments[0] === "en" || pathSegments[0] === "ar")) {
                pathSegments[0] = localeCode;
            } else {
                pathSegments.unshift(localeCode);
            }

            const newPath = `/${pathSegments.join("/")}`;
            router.replace(newPath);
        });
    };

    const LanguageButton = ({ locale }: { locale: typeof locales[0] }) => {
        const isActive = currentLocale === locale.code;

        return (
            <button
                onClick={() => handleLanguageChange(locale.code)}
                disabled={isPending}
                className={cn(
                    "px-3 py-1.5 text-sm rounded-md transition-all duration-200 font-medium",
                    "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                        : "text-gray-600 hover:text-orange-600 hover:bg-orange-50 dark:text-gray-400 dark:hover:text-orange-400 dark:hover:bg-orange-900/20",
                    isDesktop ? "" : "flex-1 text-center"
                )}
                aria-label={`Switch to ${locale.title}`}
            >
                {locale.title}
            </button>
        );
    };

    return (
        <div className={cn(
            "flex items-center gap-2",
            !isDesktop && "p-4 border-t border-gray-200 dark:border-gray-700"
        )}>
            {isDesktop && <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />}

            <div className={cn(
                "flex gap-1",
                !isDesktop && "w-full gap-2"
            )}>
                {locales.map((locale) => (
                    <LanguageButton key={locale.code} locale={locale} />
                ))}
            </div>

            {isPending && (
                <div className="ml-2">
                    <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
};
