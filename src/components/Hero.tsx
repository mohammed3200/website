import React from "react";
import { StrategicPlan, News, Faq } from "@/components";

export const Hero = () => {
  return (
    <section className="py-10">
      <div className="container mx-auto space-y-5 sm:space-y-10">
        <News />
        <StrategicPlan />
        <Faq />
      </div>
    </section>
  );
};
