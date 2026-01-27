"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
    Menu,
    X,
    ChevronDown,
    Home,
    Briefcase,
    Building2,
    Users,
    Lightbulb,
    Phone,
} from "lucide-react";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import useLanguage from "@/hooks/use-language";

import { cn } from "@/lib/utils";
import { TranslateButton } from "@/components/buttons/translate-button";
import { MainLogo } from "@/constants";

import { getNavItems } from "./constants";

const MobileSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const pathname = usePathname();
    const t = useTranslations("Navigation");
    const { lang: locale, isArabic } = useLanguage();
    const navItems = getNavItems(t, locale);

    const toggleExpanded = (itemId: string) => {
        setExpandedItems((prev) =>
            prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId]
        );
    };

    const getIcon = (id: string) => {
        switch (id) {
            case "home":
                return <Home className="w-5 h-5" />;
            case "entrepreneurship":
                return <Briefcase className="w-5 h-5" />;
            case "incubators":
                return <Building2 className="w-5 h-5" />;
            case "collaborators":
                return <Users className="w-5 h-5" />;
            case "innovators":
                return <Lightbulb className="w-5 h-5" />;
            case "contact":
                return <Phone className="w-5 h-5" />;
            default:
                return null;
        }
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 z-50 p-2 rounded-lg bg-white/90 backdrop-blur-md shadow-lg border border-gray-200"
                style={{ [isArabic ? "right" : "left"]: "1rem" }}
                aria-label="Toggle menu"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: isArabic ? "100%" : "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: isArabic ? "100%" : "-100%" }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        className={cn(
                            "lg:hidden fixed top-0 bottom-0 w-80 bg-white shadow-2xl z-50 overflow-y-auto",
                            isArabic ? "right-0" : "left-0"
                        )}
                    >
                        {/* Header */}
                        <div className="relative p-6 border-b border-gray-100 bg-white overflow-hidden">
                            {/* Decorative accent blur */}
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-orange-50/40 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative flex flex-col gap-6">
                                {/* Center Branding (Main Section) */}
                                <div className="flex items-center gap-4">
                                    <div className="relative shrink-0">
                                        <div className="absolute -inset-2 bg-gradient-to-tr from-orange-100/40 to-orange-50/20 rounded-2xl blur-lg" />
                                        <div className="relative p-2 bg-white rounded-2xl border border-orange-100/80 shadow-[0_4px_20px_-4px_rgba(249,115,22,0.1)] transition-transform hover:scale-105 duration-300">
                                            <Image
                                                src={MainLogo.Logo}
                                                alt="Center Logo"
                                                width={52}
                                                height={52}
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-lg font-black text-gray-900 leading-[1.2] tracking-tight">
                                            {t("centerName")}
                                        </h2>
                                    </div>
                                </div>

                                {/* College Affiliation (Secondary Section) */}
                                <div className="flex items-center gap-3 ps-1 border-t border-gray-100/50 pt-5">
                                    <div className="shrink-0 p-1.5 bg-gray-50/80 rounded-full border border-gray-100 shadow-sm">
                                        <Image
                                            src={MainLogo.LogoCollege}
                                            alt="College Logo"
                                            width={28}
                                            height={28}
                                            className="rounded-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xs font-bold text-gray-600 leading-tight">
                                            {t("collegeName")}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Items */}
                        <nav className="p-4">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const hasChildren = item.children && item.children.length > 0;

                                return (
                                    <div key={item.id} className="mb-2">
                                        {hasChildren ? (
                                            <>
                                                <button
                                                    onClick={() => toggleExpanded(item.id)}
                                                    className={cn(
                                                        "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors",
                                                        isActive
                                                            ? "bg-orange-50 text-orange-600"
                                                            : "text-gray-700 hover:bg-gray-100"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {getIcon(item.id)}
                                                        <span className="font-medium text-sm">
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                    <ChevronDown
                                                        className={cn(
                                                            "w-4 h-4 transition-transform",
                                                            expandedItems.includes(item.id) && "rotate-180"
                                                        )}
                                                    />
                                                </button>

                                                <AnimatePresence>
                                                    {expandedItems.includes(item.id) && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div
                                                                className={cn(
                                                                    "py-2",
                                                                    isArabic ? "pr-12" : "pl-12"
                                                                )}
                                                            >
                                                                {item.children?.map((child, index) => (
                                                                    <Link
                                                                        key={index}
                                                                        href={child.href}
                                                                        onClick={() => setIsOpen(false)}
                                                                        className="block px-4 py-2 text-sm text-gray-600 hover:text-orange-600 transition-colors"
                                                                    >
                                                                        <div className="font-medium">
                                                                            {child.label}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 mt-1">
                                                                            {child.description}
                                                                        </div>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        ) : (
                                            <Link
                                                href={item.href || "#"}
                                                onClick={() => setIsOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                                    isActive
                                                        ? "bg-orange-50 text-orange-600"
                                                        : "text-gray-700 hover:bg-gray-100"
                                                )}
                                            >
                                                {getIcon(item.id)}
                                                <span className="font-medium text-sm">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>

                        {/* Footer with Language Switcher */}
                        <div className="p-4 border-t border-gray-200 mt-auto">
                            <TranslateButton />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MobileSidebar;