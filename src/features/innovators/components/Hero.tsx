import React from "react";
import { Introduction } from "./introduction";

export const Hero = () => {
  return (
    <section className="py-0">
      <div className="container mx-auto space-y-5 sm:space-y-10">
        <Introduction />
      </div>
    </section>
  );
};
