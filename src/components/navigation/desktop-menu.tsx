"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

import useLanguage from "@/hooks/use-language";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { TranslateButton } from "@/components/buttons/translate-button";
import { MainLogo } from "@/constants";

import { getNavItems } from "@/components/navigation/constants";

const DesktopMenu = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const { lang: locale, isArabic } = useLanguage();
    const t = useTranslations("Navigation");
    const pathname = usePathname();
    const navItems = getNavItems(t, locale);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className={cn(
                "fixed top-0 inset-x-0 w-full z-50 transition-all duration-300",
                isArabic && "rtl",
                isScrolled
                    ? [
                        "py-3 px-6",
                        "bg-white/95 backdrop-blur-lg",
                        "border-b border-gray-200",
                        "shadow-lg",
                    ]
                    : ["py-4 px-6", "bg-white/80 backdrop-blur-md"]
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo Section */}
                <Link
                    href={`/${locale}`}
                    className={cn(
                        "flex items-center gap-3 transition-transform duration-300",
                        isScrolled && "scale-90"
                    )}
                >
                    <Image
                        src={
                            isArabic
                                ? MainLogo.CenterLogoSmall
                                : MainLogo.CenterLogoSmallEnglish
                        }
                        alt="Center Logo"
                        width={isScrolled ? 50 : 60}
                        height={isScrolled ? 50 : 60}
                        className="h-auto"
                    />
                    <Image
                        src={
                            isArabic
                                ? MainLogo.CollegeLogoSmall
                                : MainLogo.CollegeLogoSmallEnglish
                        }
                        alt="College Logo"
                        width={isScrolled ? 50 : 60}
                        height={isScrolled ? 50 : 60}
                        className="h-auto"
                    />
                </Link>

                {/* Navigation Items */}
                <nav className="flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const hasChildren = item.children && item.children.length > 0;

                        if (!hasChildren) {
                            // Simple link
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href || "#"}
                                    className={cn(
                                        "px-4 py-2 font-medium text-sm transition-all duration-200 rounded-lg",
                                        isActive
                                            ? "text-orange-600 bg-orange-50"
                                            : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            );
                        }

                        // Dropdown menu
                        return (
                            <div
                                key={item.id}
                                className="relative"
                                onMouseEnter={() => setActiveDropdown(item.id)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <button
                                    className={cn(
                                        "px-4 py-2 font-medium text-sm transition-all duration-200 rounded-lg flex items-center gap-1",
                                        isActive
                                            ? "text-orange-600 bg-orange-50"
                                            : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                                    )}
                                >
                                    {item.label}
                                    <ChevronDown
                                        className={cn(
                                            "w-4 h-4 transition-transform duration-200",
                                            activeDropdown === item.id && "rotate-180"
                                        )}
                                    />
                                </button>

                                {/* Dropdown Content */}
                                {activeDropdown === item.id && (
                                    <div
                                        className={cn(
                                            "absolute top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50",
                                            isArabic ? "right-0" : "left-0"
                                        )}
                                    >
                                        {item.children?.map((child, index) => (
                                            <Link
                                                key={index}
                                                href={child.href}
                                                className="block px-4 py-3 hover:bg-orange-50 transition-colors group"
                                            >
                                                <div className="text-sm font-medium text-gray-900 group-hover:text-orange-600">
                                                    {child.label}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {child.description}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Language Switcher */}
                <TranslateButton />
            </div>
        </div>
    );
};

export default DesktopMenu;