"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import useLanguage from "@/hooks/use-language";
import { useTranslations } from "next-intl";

export const Hero = () => {
  const { isArabic } = useLanguage();
  const t = useTranslations("Contact");

  const contactCards = [
    {
      icon: Mail,
      title: t("email"),
      value: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "ebic@cit.edu.ly",
      href: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "ebic@cit.edu.ly"}`,
      color: "bg-blue-50 text-blue-600",
      hoverBorder: "hover:border-blue-200"
    },
    {
      icon: Phone,
      title: t("phone"),
      value: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+218 91 000 0000",
      href: `tel:${(process.env.NEXT_PUBLIC_CONTACT_PHONE || "+218910000000").replace(/\s/g, '')}`,
      color: "bg-orange-50 text-orange-600",
      hoverBorder: "hover:border-orange-200"
    },
    {
      icon: MapPin,
      title: t("location"),
      value: process.env.NEXT_PUBLIC_CONTACT_LOCATION || "Industrial Technical College, Misurata, Libya",
      href: "#map",
      color: "bg-green-50 text-green-600",
      hoverBorder: "hover:border-green-200"
    }
  ];

  return (
    <section className="bg-secondary min-h-screen pt-24 pb-20" dir={isArabic ? "rtl" : "ltr"}>

      {/* 1️⃣ Header */}
      <div className="container mx-auto px-4 md:px-6 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-4"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white border border-gray-200 text-primary text-sm font-bold tracking-wide shadow-sm">
            CONTACT US
          </span>
          <h1 className="font-almarai font-extrabold text-4xl md:text-5xl lg:text-6xl text-foreground">
            {t("title")}
          </h1>
          <p className="font-outfit text-lg text-gray-500">
            {t("subtitle")}
          </p>
        </motion.div>
      </div>

      {/* 2️⃣ Action Cards */}
      <div className="container mx-auto px-4 md:px-6 mb-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {contactCards.map((card, index) => (
            <motion.a
              key={index}
              href={card.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center ${card.hoverBorder}`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${card.color}`}>
                <card.icon className="w-8 h-8" />
              </div>

              <h3 className="font-almarai font-bold text-xl text-foreground mb-2">
                {card.title}
              </h3>
              <p className="font-outfit text-lg text-gray-600 group-hover:text-primary transition-colors">
                {card.value}
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-gray-400 group-hover:text-foreground transition-colors">
                Connect
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* 3️⃣ Map & Hours Integration */}
      <div id="map" className="container mx-auto px-4 md:px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[2.5rem] p-3 shadow-2xl shadow-gray-200/50 border border-white"
        >
          <div className="relative rounded-[2rem] overflow-hidden h-[500px] bg-gray-100">

            {/* Map */}
            <iframe
              src={process.env.NEXT_PUBLIC_MAP_EMBED_URL || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3356.568467699703!2d15.0944!3d32.3752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDIyJzMwLjciTiAxNcKwMDUnMzkuOCJF!5e0!3m2!1sen!2sly!4v1234567890"}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="w-full h-full"
            />

            {/* Floating Hours Card */}
            <div className="absolute top-6 left-6 md:top-10 md:left-10 bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100 max-w-xs ltr:left-6 ltr:md:left-10 rtl:right-6 rtl:md:right-10 rtl:left-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-almarai font-bold text-lg text-foreground leading-tight">
                    {t("workingHours")}
                  </h3>
                  <p className="text-xs text-gray-500">Local Time</p>
                </div>
              </div>

              <div className="space-y-4 font-outfit">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">{t("openDays")}</span>
                  <span className="font-bold text-foreground text-sm">{t("openTime")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">{t("closedDays")}</span>
                  <span className="text-red-500 font-bold text-sm bg-red-50 px-2 py-0.5 rounded-md">
                    {t("closedText")}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

    </section>
  );
};
