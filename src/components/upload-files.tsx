"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { CheckCircle2, UploadCloud, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useDropzone } from "react-dropzone";
import useLanguage from "@/hooks/use-language";

import {
  cn,
  convertFileToUrl,
  getFileType,
  convertFileSize,
  truncateString,
} from "@/lib/utils";


import { Thumbnail } from "@/components";

import { InterfaceImage } from "@/constants";

type UploadFilesProps = {
  onFileChange: (files: File[]) => void;
  maxFiles?: number;
  error?: string;
  files?: File[];
  accept?: Record<string, string[]>;
  label?: string;
};

export const UploadFiles = ({
  onFileChange,
  maxFiles = 1,
  error,
  files: initialFiles = [],
  accept,
  label,
}: UploadFilesProps) => {
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [isUploading, setIsUploading] = useState(false);

  const { isArabic } = useLanguage();

  // Sync internal state with external prop if it changes
  useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        // Could add a toast notification here
        return;
      }
      setIsUploading(true);

      // Simulate upload delay for effect
      setTimeout(() => {
        const newFiles = [...files, ...acceptedFiles];
        setFiles(newFiles);
        onFileChange(newFiles);
        setIsUploading(false);
      }, 600);
    },
    [files, maxFiles, onFileChange]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    disabled: files.length >= maxFiles,
  });

  const handleRemoveFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);
    onFileChange(updatedFiles);
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      {files.length < maxFiles && (
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            {...getRootProps()}
            className={cn(
              "relative cursor-pointer flex flex-col items-center justify-center w-full min-h-[180px] rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out bg-gray-50/50 hover:bg-orange-50/30",
              isDragActive
                ? "border-orange-500 bg-orange-50 ring-4 ring-orange-100"
                : "border-gray-200 hover:border-orange-300",
              isDragReject && "border-red-500 bg-red-50",
              error && "border-red-500 bg-red-50/10"
            )}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
              <div className={cn(
                "p-4 rounded-full bg-white shadow-sm transition-transform duration-300",
                isDragActive && "scale-110 shadow-md"
              )}>
                {isDragActive ? (
                  <UploadCloud className="w-8 h-8 text-orange-500 animate-bounce" />
                ) : (
                  <Image
                    src={InterfaceImage.UploadFiles}
                    alt="upload"
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain opacity-80"
                  />
                )}
              </div>

              <div className="space-y-1">
                <p className="font-din-bold text-gray-700 text-lg">
                  {label || (isArabic ? "تحميل الملفات" : "Upload Files")}
                </p>
                <p className="text-sm text-gray-500 font-din-regular">
                  {isDragActive
                    ? (isArabic ? "أفلت الملفات هنا" : "Drop files here")
                    : (isArabic
                      ? "انقر للاختيار أو اسحب الملفات هنا"
                      : "Click to select or drag files here")}
                </p>
              </div>

              {maxFiles > 1 && (
                <p className="text-xs text-gray-400 font-din-regular bg-gray-100 px-2 py-1 rounded-full">
                  {isArabic
                    ? `الحد الأقصى: ${maxFiles} ملفات`
                    : `Max: ${maxFiles} files`}
                </p>
              )}
            </div>

            {/* Loading Overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl backdrop-blur-sm z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                  <span className="text-xs font-din-medium text-orange-600">
                    {isArabic ? "جاري الرفع..." : "Uploading..."}
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-500 text-sm font-din-medium flex items-center gap-2 px-1"
          >
            <CheckCircle2 className="w-4 h-4" /> {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* File List */}
      <AnimatePresence mode="popLayout">
        {files.length > 0 && (
          <div className="grid gap-3">
            {files.map((file, index) => {
              const { type, extension } = getFileType(file.name);
              return (
                <motion.div
                  key={`${file.name}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className="group relative flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-orange-100 transition-all duration-200"
                  dir="ltr"
                >
                  {/* Thumbnail / Icon */}
                  <div className="relative shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <Thumbnail
                      type={type}
                      extension={extension}
                      url={convertFileToUrl(file)}
                      className="w-full h-full object-cover"
                      imageClassName="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-din-medium text-gray-800 truncate" title={file.name}>
                        {truncateString(file.name, 25)}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-400 font-din-regular shrink-0 bg-gray-50 px-1.5 py-0.5 rounded">
                        {extension.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-din-regular">
                        {convertFileSize(file.size)}
                      </span>
                      {/* Success Indicator */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isArabic ? "جاهز" : "Ready"}</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Actions */}
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "#FFF5EB" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveFile(index)}
                    className="p-2 rounded-full text-gray-400 hover:text-orange-500 transition-colors"
                    title={isArabic ? "حذف الملف" : "Remove file"}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
