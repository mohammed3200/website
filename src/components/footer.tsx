"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import useLanguage from "@/hooks/use-language";
import { useTranslations } from "next-intl";
import { getNavItems } from "@/components/navigation/constants";

export const Footer = () => {
  const { isArabic, lang } = useLanguage();
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navigation");

  // Use existing navigation items to ensure links are valid
  const navItems = getNavItems(tNav, lang);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white border-t border-gray-200" dir={isArabic ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">

        {/* Main Grid Content */}
        <div className="py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* 1️⃣ Brand Section (Large) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/20">
                C
              </div>
              <div className="flex flex-col">
                <span className="font-almarai font-bold text-xl text-foreground leading-none">
                  {tNav("centerName")}
                </span>
                <span className="font-outfit text-xs text-gray-500 tracking-widest uppercase mt-1">
                  Partners
                </span>
              </div>
            </div>

            <p className="text-gray-500 font-outfit text-base leading-relaxed max-w-sm">
              {t("subtitle")}
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* 2️⃣ Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-almarai font-bold text-lg text-foreground relative inline-block">
              {t("quickLinks")}
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full" />
            </h3>
            <ul className="space-y-3">
              {navItems.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href || "#"}
                    className="text-gray-500 hover:text-primary transition-colors text-sm font-medium flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-primary transition-colors" />
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={`/${lang}/faq`}
                  className="text-gray-500 hover:text-primary transition-colors text-sm font-medium flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-primary transition-colors" />
                  {t("faq")}
                </Link>
              </li>
            </ul>
          </div>

          {/* 3️⃣ Contact Info */}
          <div className="lg:col-span-3 space-y-6">
            <h3 className="font-almarai font-bold text-lg text-foreground relative inline-block">
              {t("contactUs")}
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full" />
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 text-primary mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <a href="tel:+218910000000" className="block font-bold text-foreground hover:text-primary transition-colors">
                    +218 91 000 0000
                  </a>
                  <span className="text-xs text-gray-400">Mon-Fri, 9am-5pm</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 text-primary mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <a href="mailto:info@cit.edu.ly" className="block font-bold text-foreground hover:text-primary transition-colors">
                    info@cit.edu.ly
                  </a>
                  <span className="text-xs text-gray-400">Online Support</span>
                </div>
              </li>
            </ul>
          </div>

          {/* 4️⃣ Map Section (Replaces FooterMap for stability) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="w-full h-48 rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1786539269224!2d55.27218771500953!3d25.197197983896188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff45e502e1ceb7e2!2sBurj%20Khalifa!5e0!3m2!1sen!2sae!4v1622285623635!5m2!1sen!2sae"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(100%)' }}
                allowFullScreen
                loading="lazy"
                className="w-full h-full group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute top-3 right-3 bg-white p-2 rounded-lg shadow-md">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-100 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm font-outfit">
              {t("copyright", { year: new Date().getFullYear() })}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">{t("termsOfUse")}</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-primary transition-colors">{t("privacyPolicy")}</Link>

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="ml-4 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-orange-600 hover:-translate-y-1 transition-all duration-300"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
