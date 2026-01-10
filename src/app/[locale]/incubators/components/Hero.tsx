"use client";

import React from "react";
import { motion } from "framer-motion";
import { Rocket, Users, Package, TrendingUp, Building2, GraduationCap, Briefcase, LineChart } from "lucide-react";
import useLanguage from "@/hooks/use-language";
import { useTranslations } from "next-intl";

export const Hero = () => {
  const { isArabic } = useLanguage();
  const t = useTranslations("Incubators");

  const phases = [
    {
      icon: GraduationCap,
      titleKey: "ideation",
      descKey: "ideationDesc",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Building2,
      titleKey: "incubation",
      descKey: "incubationDesc",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: TrendingUp,
      titleKey: "growth",
      descKey: "growthDesc",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: Rocket,
      titleKey: "launch",
      descKey: "launchDesc",
      color: "from-green-500 to-green-600",
    },
  ];

  const resources = [
    { icon: Users, labelKey: "mentorship" },
    { icon: Package, labelKey: "workspace" },
    { icon: Briefcase, labelKey: "fundingAccess" },
    { icon: LineChart, labelKey: "training" },
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

        {/* Incubation Phases */}
        <div>
          <h2 className="font-din-bold text-3xl md:text-4xl text-center text-gray-900 dark:text-white mb-12">
            {t("phasesTitle")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.titleKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-white dark:bg-stone-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-gray-100 dark:border-stone-700 hover:border-orange-500 h-full">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <phase.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-din-bold text-3xl text-gray-300 dark:text-gray-600">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <h3 className="font-din-bold text-xl text-gray-900 dark:text-white">
                      {t(phase.titleKey)}
                    </h3>
                  </div>
                  <p className="font-din-regular text-gray-600 dark:text-gray-300">
                    {t(phase.descKey)}
                  </p>
                </div>
                {/* Connector Line */}
                {index < phases.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-orange-500 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 md:p-12 text-white"
        >
          <h2 className="font-din-bold text-3xl md:text-4xl mb-8 text-center">
            {t("resourcesTitle")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.labelKey}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center"
              >
                <resource.icon className="w-10 h-10 mx-auto mb-3" />
                <span className="font-din-bold text-lg">{t(resource.labelKey)}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Success Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            { numberKey: "startups", labelKey: "startupsLabel" },
            { numberKey: "success", labelKey: "successLabel" },
            { numberKey: "fundingRaised", labelKey: "fundingLabel" },
          ].map((metric, index) => (
            <motion.div
              key={metric.labelKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="bg-stone-100 dark:bg-stone-800 rounded-2xl p-8 text-center"
            >
              <div className="font-din-bold text-5xl md:text-6xl text-orange-600 mb-2">
                {t(metric.numberKey)}
              </div>
              <div className="font-din-regular text-lg text-gray-700 dark:text-gray-300">
                {t(metric.labelKey)}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-din-bold text-2xl md:text-3xl text-gray-900 dark:text-white mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="font-din-regular text-lg text-gray-600 dark:text-gray-300 mb-6">
            {t("ctaDesc")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
