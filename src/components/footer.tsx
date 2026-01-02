"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import useLanguage from "@/hooks/use-language";
import { MainLogo, socials } from "@/constants";
import { getNavItems } from "@/components/navigation/constants";
import { Mail, Phone, ArrowUp } from "lucide-react";

export const Footer = () => {
  const { lang, isArabic } = useLanguage();
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navigation");

  // Generate navigation items for Quick Links
  const navItems = getNavItems(tNav, lang);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full bg-white border-t border-gray-200"
    >
      <div className="container mx-auto max-w-[90%]">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

            {/* Left Section: Information Columns (Links, Contact) */}
            <div className="flex flex-col sm:flex-row gap-10 lg:gap-16 flex-1">

              {/* Column 1: Quick Links */}
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {t("quickLinks") || "Quick Links"}
                </h3>
                <ul className="flex flex-col gap-3">
                  {navItems.slice(0, 5).map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href || "#"}
                        className="text-gray-500 hover:text-primary transition-colors text-base font-medium"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  {/* Added FAQ Link */}
                  <li>
                    <Link
                      href={`/${lang}/faq`}
                      className="text-gray-500 hover:text-primary transition-colors text-base font-medium"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2: Contact Info */}
              <div className="flex flex-col gap-4 flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {t("contactUs") || "Contact Us"}
                </h3>
                <ul className="flex flex-col gap-4">
                  {/* Google Map Embed */}
                  <li className="w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                    <iframe
                      src="https://maps.google.com/maps?q=32.37082,15.07411&z=15&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Misurata College of Industrial Technology Location"
                    ></iframe>
                  </li>
                  <li className="flex items-center gap-3 text-gray-500">
                    <Phone className="size-5 text-primary shrink-0" />
                    <span dir="ltr" className="text-base font-medium">
                      <Link href="tel:+218910000000">+218 91 000 0000</Link>
                    </span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-500">
                    <Mail className="size-5 text-primary shrink-0" />
                    <span className="text-base font-medium">
                      <Link href="mailto:info@cit.edu.ly">info@cit.edu.ly</Link>
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Section: Brand & Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col justify-between gap-8 lg:gap-10 lg:min-w-[320px]">

              {/* Brand & Socials */}
              <div className="flex flex-col gap-6">
                {/* Logo Area */}
                <div className="flex items-center gap-4">
                  <Link
                    href={`/${lang}`}
                    className="flex items-center justify-center bg-gray-50 rounded-lg p-3 hover:opacity-90 transition-opacity"
                  >
                    <div className="size-16 flex items-center justify-center">
                      <Image
                        src={MainLogo.Logo}
                        alt={tNav("centerName")}
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                  </Link>
                  <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">
                      {tNav("centerName")}
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">
                      {t("subtitle") || "Empowering innovation"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  {socials.map(({ id, url, icon, title }) => (
                    <Link
                      key={id}
                      href={url}
                      target="_blank"
                      className="group flex size-12 items-center justify-center rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-primary hover:border-primary transition-all duration-200"
                    >
                      <Image
                        src={icon}
                        alt={title}
                        width={24}
                        height={24}
                        className="size-6 transition-all opacity-40 backdrop-grayscale-0 group-hover:opacity-100 group-hover:brightness-0 group-hover:invert dark:brightness-0 dark:invert"
                      />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Back to Top */}
              <div className="flex sm:flex-col items-center sm:items-end gap-3">
                <button
                  onClick={scrollToTop}
                  className="flex items-center justify-center size-10 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-white hover:bg-primary hover:border-primary transition-all duration-200 group"
                  aria-label="Scroll to top"
                >
                  <ArrowUp className="size-5" />
                </button>
                <span className="text-lg font-medium text-gray-900">
                  {t("backToTop")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-200 py-8">
          <p className="text-base text-gray-500">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-base text-gray-500 hover:text-primary transition-colors"
            >
              {t("termsOfUse")}
            </Link>
            <Link
              href="#"
              className="text-base text-gray-500 hover:text-primary transition-colors"
            >
              {t("privacyPolicy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
