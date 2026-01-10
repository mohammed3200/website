"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Calendar } from "lucide-react";
import useLanguage from "@/hooks/use-language";
import { useTranslations } from "next-intl";

export const Hero = () => {
  const { isArabic } = useLanguage();
  const t = useTranslations("Contact");

  const contactInfo = [
    {
      icon: Mail,
      labelKey: "email",
      valueKey: "emailValue",
      href: "mailto:info@ebic-misurata.ly",
    },
    {
      icon: Phone,
      labelKey: "phone",
      valueKey: "phoneValue",
      href: "tel:+218913456789",
    },
    {
      icon: MapPin,
      labelKey: "location",
      valueKey: "locationValue",
      href: "https://maps.google.com/?q=32.3752,15.0944",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-stone-50 to-white dark:from-stone-950 dark:to-stone-900" dir={isArabic ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <h1 className="font-din-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="font-din-regular text-lg md:text-xl text-gray-600 dark:text-gray-300">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {contactInfo.map((info, index) => (
            <motion.a
              key={info.labelKey}
              href={info.href}
              target={info.href.startsWith("http") ? "_blank" : undefined}
              rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white dark:bg-stone-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-gray-100 dark:border-stone-700 hover:border-orange-500"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <info.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-din-bold text-xl text-gray-900 dark:text-white mb-2">
                {t(info.labelKey)}
              </h3>
              <p className="font-din-regular text-gray-600 dark:text-gray-300">
                {t(info.valueKey)}
              </p>
            </motion.a>
          ))}
        </div>

        {/* Working Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 md:p-12 text-white"
        >
          <h2 className="font-din-bold text-3xl md:text-4xl mb-8 text-center">
            {t("workingHours")}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="font-din-bold text-xl mb-2">{t("workingDays")}</h3>
              <p className="font-din-regular text-lg">{t("workingDaysValue")}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="font-din-bold text-xl mb-2">{t("hours")}</h3>
              <p className="font-din-regular text-lg">{t("hoursValue")}</p>
            </div>
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100 dark:border-stone-700"
        >
          <div className="p-6 border-b-2 border-gray-100 dark:border-stone-700">
            <h2 className="font-din-bold text-2xl text-gray-900 dark:text-white">
              {t("findUs")}
            </h2>
          </div>
          <div className="relative h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6715.856589!2d15.0944!3d32.3752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDIyJzMwLjciTiAxNcKwMDUnMzkuOCJF!5e0!3m2!1sen!2sly!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
