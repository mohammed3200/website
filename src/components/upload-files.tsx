"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Trash2, CircleCheck } from "lucide-react";
import { motion } from "framer-motion";

import { useDropzone } from "react-dropzone";
import useLanguage from "@/hooks/uselanguage";

import {
  cn,
  convertFileToUrl,
  getFileType,
  convertFileSize,
  truncateString,
} from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Thumbnail } from "@/components";

import { InterfaceImage } from "@/constants";

type UploadFilesProps = {
  onFileChange: (files: File[]) => void;
  maxFiles?: number;
  error?: string;
  files?: File[]; // Add files prop
};

export const UploadFiles = ({
  onFileChange,
  maxFiles = 1,
  error,
  files: initialFiles = [], // Initialize with empty array
}: UploadFilesProps) => {
  const [files, setFiles] = useState<File[]>(initialFiles); // Use initialFiles
  const [progress, setProgress] = useState(0);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isArabic } = useLanguage();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        return;
      }
      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);
      onFileChange(newFiles); // Pass files to parent
    },
    [files, maxFiles, onFileChange]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      if (files.length + newFiles.length > maxFiles) {
        return;
      }
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      onFileChange([...files, ...newFiles]);
      // Simulate progress for demonstration
      setTimeout(() => setProgress(150), 1000); // Simulate upload completion
    }
  };

  const handleRemoveFile = (fileName: string) => {
    const updatedFiles = files.filter((file) => file.name !== fileName);
    setFiles(updatedFiles);
    onFileChange(updatedFiles);
  };

  // Effect to show CircleCheck after progress reaches its maximum
  useEffect(() => {
    if (progress === 150) {
      const timer = setTimeout(() => setShowCheckmark(true), 300); // Delay of 300ms
      return () => clearTimeout(timer); // Cleanup timer
    } else {
      setShowCheckmark(false); // Reset checkmark visibility if progress is not at max
    }
  }, [progress]);

  return (
    <Card className="bg-transparent">
      <CardContent
        {...getRootProps()}
        className={cn(
          "p-0 overflow-hidden flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer",
          isDragActive ? "border-primary" : "border-gray-300"
        )}
      >
        <input {...getInputProps()} />
        <div className="text-center flex flex-col items-center justify-center opacity-80 gap-2 py-4 md:py-2">
          <Image
            src={InterfaceImage.UploadFiles}
            alt="upload files"
            width={500}
            height={500}
            className="object-cover h-auto size-1/3 scale-x-125 scale-y-110"
          />
          <p
            className="mt-2 text-sm text-gray-800 font-din-regular text-ms"
            dir={isArabic ? "rtl" : "ltr"}
          >
            {isDragActive
              ? isArabic
                ? "ضع الملفات هنا..."
                : "Drop the files here..."
              : isArabic
              ? "اسحب الملفات وأفلِتها هنا، أو انقر لتحديد الملفات"
              : "Drag and drop files here, or click to select files"}
          </p>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
      </CardContent>

      {files.length > 0 && (
        <ul className="mt-4">
          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li key={`${file.name}-${index}`} className="flex flex-col">
                <div className="flex items-center justify-between gap-3 p-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Thumbnail
                        type={type}
                        extension={extension}
                        url={convertFileToUrl(file)}
                      />
                      <p
                        className="flex flex-col break-all max-md:text-sm"
                        dir="ltr"
                      >
                        {truncateString(file.name, 20)}
                        <span
                          className={cn(
                            "text-xs font-extralight",
                            isArabic ? "text-end" : "text-start"
                          )}
                        >
                          {convertFileSize(file.size)}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}px` }}
                        transition={{ duration: 0.7 }}
                        className={cn(
                          "h-1 bg-primary rounded-full",
                          isArabic ? "rotate-180 ml-1" : "mr-1"
                        )}
                      />
                      {showCheckmark && (
                        <CircleCheck
                          color="#afa"
                          className="size-5 max-md:size-3.5"
                        />
                      )}
                    </div>
                  </div>
                  <button
                    className="cursor-pointer"
                    onClick={() => handleRemoveFile(file.name)}
                  >
                    <Trash2 color="#fe6601" className="size-6 p-0" />
                  </button>
                </div>
                {files.length >= index && (
                  <Separator className="w-[90%] self-center" />
                )}
              </li>
            );
          })}
        </ul>
      )}
      <Input
        id="image"
        type="file"
        name="image"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
        multiple={maxFiles > 1}
      />
    </Card>
  );
};
