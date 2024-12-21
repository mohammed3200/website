import React from "react";
import { Introduction } from "./Introduction";
import { SeparatorGradients } from "@/components";
import { CollaboratingCompaniesList } from "./CollaboratingCompaniesList";


export const Hero = () => {
  return (
    <section className="py-0">
      <div className="container mx-auto space-y-5 sm:space-y-10">
        <Introduction />
        <SeparatorGradients className="-translate-y-2 md:-translate-y-6 lg:-translate-y-12" />
        <div dir="ltr" className="-translate-y-2 md:-translate-y-6 lg:-translate-y-12">
        <CollaboratingCompaniesList speed="slow" />
        </div>
      </div>
    </section>
  );
};
