/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { cn, convertFileToUrl } from "@/lib/utils";
import useLanguage from "@/hooks/uselanguage";
import { IconsInterface } from "@/constants";

type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
  className?: string;
};

export const FileUploader = ({
  files,
  onChange,
  className,
}: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onChange(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const { isArabic } = useLanguage();

  return (
    <div
      {...getRootProps()}
      className={cn(
        "bg-transparent font-din-regular grow flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-gray-300 border-dashed border-2 p-5 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)]",
        className
      )}
    >
      <input {...getInputProps()} />
      {files && files?.length > 0 ? (
        <Image
          src={convertFileToUrl(files[0])}
          width={1000}
          height={1000}
          alt="uploaded image"
          className="max-h-[150px] overflow-hidden object-cover rounded-md"
        />
      ) : (
        <>
          <Image
            src={IconsInterface.Upload}
            width={120}
            height={120}
            sizes="(max-width: 640px) 90vw, (min-width: 641px) 45vw"
            alt="upload"
          />
          <div 
          className="flex flex-col justify-center gap-2 text-center text-black"
          dir={isArabic ? "rtl" : "ltr"}
          >
            <p className="font-din-regular text-base">
              <span className="text-">
                {isArabic ? "انقر للتحميل" : "Click to upload"}{" "}
              </span>
              {isArabic ?  "أو اسحب وأفلِت" : "or drag and drop"}
            </p>
            <p className="font-din-regular text-sm">
              SVG, PNG, JPG or GIF (max. 800x400px)
            </p>
          </div>
        </>
      )}
    </div>
  );
};
