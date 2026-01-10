"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, BookOpen, Users, Target, TrendingUp, Lightbulb } from "lucide-react";
import useLanguage from "@/hooks/use-language";
import { useTranslations } from "next-intl";

export const Hero = () => {
  const { isArabic } = useLanguage();
  const t = useTranslations("Entrepreneurship");

  const programs = [
    {
      icon: BookOpen,
      titleKey: "workshops",
      descKey: "workshopsDesc",
    },
    {
      icon: Users,
      titleKey: "mentorship",
      descKey: "mentorshipDesc",
    },
    {
      icon: Target,
      titleKey: "strategic",
      descKey: "strategicDesc",
    },
    {
      icon: TrendingUp,
      titleKey: "growth",
      descKey: "growthDesc",
    },
  ];

  const values = [
    { icon: Award, labelKey: "excellence" },
    { icon: Lightbulb, labelKey: "innovation" },
    { icon: Users, labelKey: "collaboration" },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-stone-50 to-white dark:from-stone-950 dark:to-stone-900" dir={isArabic ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 space-y-16">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto space-y-6"
        >
          <h1 className="font-din-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="font-din-regular text-lg md:text-xl text-gray-600 dark:text-gray-300">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => (
            <motion.div
              key={program.titleKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white dark:bg-stone-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-gray-100 dark:border-stone-700 hover:border-orange-500"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <program.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-din-bold text-xl text-gray-900 dark:text-white mb-2">
                {t(program.titleKey)}
              </h3>
              <p className="font-din-regular text-gray-600 dark:text-gray-300">
                {t(program.descKey)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 md:p-12 text-white"
        >
          <h2 className="font-din-bold text-3xl md:text-4xl mb-8 text-center">
            {t("coreValues")}
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.labelKey}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3"
              >
                <value.icon className="w-6 h-6" />
                <span className="font-din-bold text-lg">{t(value.labelKey)}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center max-w-3xl mx-auto bg-stone-100 dark:bg-stone-800 rounded-2xl p-8"
        >
          <h2 className="font-din-bold text-2xl md:text-3xl text-gray-900 dark:text-white mb-4">
            {t("mission")}
          </h2>
          <p className="font-din-regular text-lg text-gray-700 dark:text-gray-300">
            {t("missionDesc")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
