"use client";

import React from "react";
import { Introduction } from "./introduction";
import { AnimatedList, SeparatorGradients } from "@/components";
import { MockCompaniesData } from "@/mock";
import { CardCompanies } from "./card-companies";
import { useGetCollaborators } from "@/features/collaborators/api/use-get-public-collaborators";
import { config } from "@/lib/config";

type DisplayItem = {
  id: string;
  companyName: string;
  experience: string;
  image: string;
};

export const Hero = () => {
  const { data: realCollaborators, isLoading } = useGetCollaborators();

  // Hybrid data strategy:
  // - In production: use real data only (show nothing if < threshold)
  // - In development: use mock data as fallback if real data < threshold
  const displayItems = React.useMemo((): DisplayItem[] => {
    if (isLoading) return [];

    const realData = realCollaborators || [];

    if (realData.length >= config.thresholds.collaborators) {
      return realData.map((item) => ({
        id: item.id,
        companyName: item.companyName,
        experience: item.specialization || "",
        image: item.image?.data || "",
      }));
    }

    if (config.isProduction) return [];

    // Fallback to mock data in development
    return MockCompaniesData.map((item) => ({
      id: item.id,
      companyName: item.company_name_en,
      experience: item.experience_provided_en,
      image: typeof item.company_image === "string" ? item.company_image : "",
    }));
  }, [realCollaborators, isLoading]);

  if (!isLoading && displayItems.length === 0) return null;

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
            items={displayItems}
            renderItem={(item) => (
              <CardCompanies
                CompaniesName={item.companyName}
                ExperienceProvided={item.experience}
                companyImage={item.image}
              />
            )}
          />
        </div>
      </div>
    </section>
  );
};


