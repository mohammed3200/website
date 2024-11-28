"use client";

import { details, strategics } from "@/constants";
import Image from "next/image";
import React from "react";
import useLanguage from "@/hooks/uselanguage";

import { AmazingButton } from "./AmazingButton";

export const StrategicPlan = () => {
  const { isArabic } = useLanguage();

  return (
    <section>
      <div className="w-full px-5 sm:px-2">
        <div
          className="relative flex md:flex-wrap flex-nowrap border-2 border-primary rounded-3xl 
          md:overflow-hidden max-md:flex-col max-md:border-none 
          max-md:rounded-none feature-after max-md:gap-3 
          md:shadow-gradient-primary-desktop"
                dir={isArabic ? "rtl" : "ltr"}
        >
          {strategics.map(({ id, icon, caption, title, text, button }) => (
            <div
              key={id}
              className="relative z-2 md:px-10 px-5 md:pb-10 pb-5 flex-50
              max-md:border-2 max-md:border-primary max-md:rounded-3xl
              max-md:flex-320 max-sm:shadow-gradient-primary-mobile"
            >
              <div className="w-full flex justify-start items-center">
                <div className="-ml-3 mb-12 flex items-center justify-center flex-col">
                    <div className="w-0.5 h-16 bg-primary"/>
                  <Image 
                  src={icon} 
                  alt={title} 
                  width={100} 
                  height={100}
                  className="size-28 object-contain"
                  />
                </div>
              </div>
              <p className="caption mb-5 max-md:mb-6" >
                {caption}
            </p>
              <h2 className="max-w-400 mb-7 h3 text-p4 max-md:mb-6 max-md:h5" >
                {title}
                </h2>
                <p className="mb-11 body-1 max-md:mb-8 max-md:body-3">
                    {text}
                </p>
                <AmazingButton icon={button.icon} markerFill="#bebebe">
                    {button.title}
                </AmazingButton>
            </div>
          ))}

          <ul className="relative flex justify-around 
          flex-grow px-[5%] border-2 border-primary rounded-3xl
          max-md:hidden"
          >
            <div className="absolute top-[38%] left-0 right-0 w-full h-[1px] z-10" />
            {details.map(({ id,icon,title }) => (
              <li key={id} className="relative pt-16 pb-14">
                <div className="absolute top-8 bottom-0 left-1/2 bg-primary-foreground w-[1px] h-full z-10" />
                <div>
                  <Image
                  src={icon}
                  alt={title}
                  width={100}
                  height={100}
                  className="size-24 object-contain z-20"
                  />
                </div>
              </li>
            ))}

          </ul>
        </div>
      </div>
    </section>
  );
};
