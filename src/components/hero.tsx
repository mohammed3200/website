import React from "react";
import { StrategicPlan, News, Faq, HomeHero } from "@/components";

export const Hero = () => {
  return (
    <>
      <HomeHero />
      <section className="py-10">
        <div className="container mx-auto space-y-5 sm:space-y-10">
          <News />
          <StrategicPlan />
          <Faq />
        </div>
      </section>
    </>
  );
};

