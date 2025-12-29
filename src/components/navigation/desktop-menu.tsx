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
                "sticky inset-x-0 mx-auto z-50 w-full max-w-7xl px-4 transition-all duration-300",
                isScrolled ? "top-4" : "top-6"
            )}
        >
            <div
                className={cn(
                    "w-full bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg transition-all duration-300",
                    "flex items-center justify-between px-6",
                    isScrolled ? "py-2 shadow-xl" : "py-3 shadow-lg"
                )}
            >
                {/* Logo Section */}
                <Link
                    href={`/${locale}`}
                    className="flex items-center gap-4 shrink-0 transition-transform duration-300 hover:opacity-90"
                >
                    <div className="relative h-12 w-12 md:h-14 md:w-14">
                        <Image
                            src={
                                isArabic
                                    ? MainLogo.Logo
                                    : MainLogo.Logo
                            }
                            alt="Center Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="h-8 w-[1px] bg-gray-300" /> {/* Vertical divider */}
                    <div className="relative h-12 w-12 md:h-14 md:w-14">
                        <Image
                            src={
                                isArabic
                                    ? MainLogo.LogoCollege
                                    : MainLogo.LogoCollege
                            }
                            alt="College Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Navigation Items */}
                <nav className="hidden md:flex items-center gap-1 mx-4">
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
                                        "px-4 py-2 font-din-medium text-sm transition-all duration-200 rounded-lg relative overflow-hidden group",
                                        isActive
                                            ? "text-orange-600 bg-orange-50 font-din-bold"
                                            : "text-gray-700 hover:text-orange-600 hover:bg-orange-50/50"
                                    )}
                                >
                                    <span className="relative z-10">{item.label}</span>
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500" />
                                    )}
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
                                        "px-4 py-2 font-din-medium text-sm transition-all duration-200 rounded-lg flex items-center gap-1 group",
                                        isActive || activeDropdown === item.id
                                            ? "text-orange-600 bg-orange-50"
                                            : "text-gray-700 hover:text-orange-600 hover:bg-orange-50/50"
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
                                <div
                                    className={cn(
                                        "absolute top-full mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 py-2 z-50 transition-all duration-200 origin-top",
                                        activeDropdown === item.id
                                            ? "opacity-100 scale-100 translate-y-0"
                                            : "opacity-0 scale-95 translate-y-2 pointer-events-none",
                                        isArabic ? "right-0" : "left-0"
                                    )}
                                >
                                    {item.children?.map((child, index) => (
                                        <Link
                                            key={index}
                                            href={child.href}
                                            className="block px-4 py-3 hover:bg-orange-50 transition-colors group relative border-l-2 border-transparent hover:border-orange-500"
                                        >
                                            <div className="text-sm font-din-medium text-gray-900 group-hover:text-orange-600">
                                                {child.label}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1 font-din-regular line-clamp-1">
                                                {child.description}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                {/* Language Switcher */}
                <div className="flex items-center gap-2">
                    <TranslateButton />
                </div>
            </div>
        </div>
    );
};

export default DesktopMenu;
