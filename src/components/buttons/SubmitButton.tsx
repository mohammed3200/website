import React from "react";
import { IconsInterface } from "@/constants";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
        <button
        {...props}
        type="submit"
            className={cn(
                "font-din-regular text-base bg-primary px-4 py-3 pl-[0.9em] flex items-center border-none rounded-full overflow-hidden transition-all duration-200 cursor-pointer",
                className,
                { "opacity-50 cursor-not-allowed": isLoading } // Disable button when loading
            )}
            disabled={isLoading} // Disable button click when loading
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
    );
};