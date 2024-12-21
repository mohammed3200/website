import React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { IconsInterface,BackGroundEffect } from "@/constants";

type SubmitButtonProps = {
    className?: string;
    classNameContent?: string;
    children: React.ReactNode;
    isLoading: boolean;
} & React.ComponentProps<'button'>

export const SubmitButton: React.FC<SubmitButtonProps> = ({
    classNameContent,
    className,
    children,
    isLoading,
    ...props
}) => {
    return (
        <div
        className="w-fit h-fit rounded-full p-2"
        style={{
            backgroundImage: `url(${BackGroundEffect.GlassBackground})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >

        <button
        {...props}
        type="submit"
        className={cn(
            "font-din-regular text-base bg-gradient-to-r from-[#fe7921] to-[#fe7011] px-4 py-3 pl-[0.9em] flex items-center border-none rounded-full overflow-hidden transition-all duration-200 cursor-pointer",
            className,
            { "opacity-50 cursor-not-allowed": isLoading }
        )}
        disabled={isLoading}
        >
            <div className={cn("flex items-center",classNameContent)}>
                <div className={`${isLoading ? "animate-fly-1 duration-700 ease-in-out direction-alternate" : ""}`}>
                    <Image
                        src={IconsInterface.Send}
                        alt="send"
                        width={24}
                        height={24}
                        className={cn("w-6 h-6 object-contain block origin-center transition-transform duration-300 ease-in-out fill-gray-500", isLoading && "translate-x-[1.2em] rotate-45 scale-110")}
                    />
                </div>
                <span
                    className={`block ml-[0.3em] transition-all duration-300 ease-in-out ${isLoading ? "translate-x-[5em]" : ""}`}
                >
                    {isLoading ? "Loading..." : children}
                </span>
            </div>
        </button>
                        </div>
    );
};