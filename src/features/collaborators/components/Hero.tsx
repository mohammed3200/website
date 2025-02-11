import React from "react";
import { Introduction } from "./Introduction";
import { AnimatedList, SeparatorGradients } from "@/components";
import { MockCompaniesData } from "@/mock";
import { CardCompanies } from "./CardCompanies";

export const Hero = () => {
  return (
    <section className="py-0">
      <div className="container mx-auto space-y-5 sm:space-y-10">
        <Introduction />
        <SeparatorGradients className="-translate-y-2 md:-translate-y-6 lg:-translate-y-12" />
        <div
          dir="ltr"
          className="-translate-y-2 md:-translate-y-6 lg:-translate-y-12"
        >
          <AnimatedList
            direction="left"
            speed="slow"
            pauseOnHover={true}
            layout="horizontal"
            items={MockCompaniesData}
            renderItem={(item) => (
              <CardCompanies
                CompaniesName={item.company_name_en}
                ExperienceProvided={item.experience_provided_en}
                companyImage={item.company_image}
              />
            )}
          />
        </div>
      </div>
    </section>
  );
};
