import React from "react";
import { News } from "./news";
import { StrategicPlan } from "./StrategicPlan";
import { Footer } from "@/components";

export const Hero = () => {
  return (
    <section className="py-0">
      <div className="container mx-auto space-y-5 sm:space-y-10">
        <News />
        <StrategicPlan />
        <Footer />
      </div>
    </section>
  );
};
