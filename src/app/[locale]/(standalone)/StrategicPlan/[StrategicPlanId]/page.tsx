"use client";

import React from "react";
import useLanguage from "@/hooks/uselanguage";

import { strategics } from "@/constants";
import { Back } from "@/components/buttons";
import { useStrategicPlanId } from "@/features/strategic-plan/hooks";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PageStrategicPlan = () => {
  const StrategicPlanId = useStrategicPlanId();
  const { isArabic } = useLanguage();
  const StrategicPlan = strategics.find(
    (strategic) => strategic.id === StrategicPlanId
  );
  return (
    <div
      className="w-full flex flex-col justify-center items-center gap-6"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="w-full flex flex-row">
        <Back />
      </div>
      <div className="w-full h-full flex-col items-center justify-center gap-2">
        <Card>
          <CardHeader className="w-full items-center">
            <CardTitle className="font-din-regular text-base md:text-lg">
              {isArabic
                ? StrategicPlan?.arabic.title
                : StrategicPlan?.english.title}
            </CardTitle>
            <div className="w-[60vw] h-1 rounded-full bg-primary"/>
            <CardDescription className="font-din-regular text-ms md:text-base">
              {isArabic
                ? StrategicPlan?.arabic.caption
                : StrategicPlan?.english.caption}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-din-regular text-ms text-wrap whitespace-pre">
              {isArabic
                ? StrategicPlan?.arabic.text
                : StrategicPlan?.english.text}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PageStrategicPlan;
