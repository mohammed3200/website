"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Camera, UploadCloud, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useDropzone } from "react-dropzone";
import { useTranslations } from "next-intl";
import useLanguage from "@/hooks/use-language";

import { cn, convertFileToUrl } from "@/lib/utils";

type ImageUploadProps = {
  onFileChange: (file: File | null) => void;
  variant?: 'circle' | 'square';
  maxSizeMB?: number;
  minWidth?: number;
  minHeight?: number;
  error?: string;
  file?: File;
  label?: string;
  description?: string;
};

const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const ImageUpload = ({
  onFileChange,
  variant = 'square',
  maxSizeMB = 5,
  minWidth,
  minHeight,
  error: externalError,
  file: initialFile,
  label,
  description,
}: ImageUploadProps) => {
  const t = useTranslations("ImageUpload");
  const { isArabic } = useLanguage();

  const [file, setFile] = useState<File | null>(initialFile || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [internalError, setInternalError] = useState<string>("");

  const error = externalError || internalError;

  // Sync internal state with external prop if it changes
  useEffect(() => {
    setFile(initialFile || null);
    if (initialFile) {
      setPreviewUrl(convertFileToUrl(initialFile));
    } else {
      setPreviewUrl(null);
    }
  }, [initialFile]);

  const validateImage = async (imageFile: File): Promise<boolean> => {
    setInternalError("");

    // Check file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(imageFile.type)) {
      setInternalError(t("invalidImageType"));
      return false;
    }

    // Check file size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (imageFile.size > maxBytes) {
      setInternalError(t("imageTooLarge", { size: maxSizeMB.toString() }));
      return false;
    }

    // Check dimensions if specified
    if (minWidth || minHeight) {
      try {
        const img = await loadImage(imageFile);
        const width = minWidth || 0;
        const height = minHeight || 0;

        if (img.width < width || img.height < height) {
          setInternalError(t("imageTooSmall", {
            width: width.toString(),
            height: height.toString()
          }));
          URL.revokeObjectURL(img.src);
          return false;
        }
        URL.revokeObjectURL(img.src);
      } catch (err) {
        setInternalError(t("invalidImageType"));
        return false;
      }
    }

    return true;
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const imageFile = acceptedFiles[0]; // Take only first file
      setIsUploading(true);

      // Validate image
      const isValid = await validateImage(imageFile);

      if (isValid) {
        // Clean up old preview URL
        if (previewUrl && file) {
          URL.revokeObjectURL(previewUrl);
        }

        setFile(imageFile);
        setPreviewUrl(convertFileToUrl(imageFile));
        onFileChange(imageFile);
      }

      setIsUploading(false);
    },
    [file, previewUrl, onFileChange, maxSizeMB, minWidth, minHeight]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleRemove = () => {
    if (previewUrl && file) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setInternalError("");
    onFileChange(null);
  };

  const uploadZoneClasses = cn(
    "relative cursor-pointer flex flex-col items-center justify-center",
    "min-h-[200px] rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out",
    "bg-gray-50/50 hover:bg-orange-50/30",
    isDragActive
      ? "border-orange-500 bg-orange-50 ring-4 ring-orange-100"
      : "border-gray-200 hover:border-orange-300",
    isDragReject && "border-red-500 bg-red-50",
    error && "border-red-500 bg-red-50/10",
    variant === 'circle' && !file && "aspect-square max-w-[200px] mx-auto rounded-full"
  );

  const previewClasses = cn(
    "relative overflow-hidden border-4 border-white shadow-xl",
    variant === 'circle'
      ? "w-32 h-32 rounded-full"
      : "w-32 h-32 rounded-xl"
  );

  return (
    <div className="w-full space-y-3">
      {label && (
        <label className="block text-sm font-din-medium text-gray-800">
          {label}
        </label>
      )}

      {description && (
        <p className="text-xs text-gray-500 font-din-regular">
          {description}
        </p>
      )}

      <AnimatePresence mode="wait">
        {file && previewUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Image Preview */}
            <div className="relative group">
              <div className={previewClasses}>
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Remove button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRemove}
                className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors"
                title={t("removeImage")}
                type="button"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Change button */}
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-din-medium transition-colors shadow-sm"
                type="button"
              >
                <Camera className="w-4 h-4 inline mr-2" />
                {t("changeImage")}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div {...getRootProps()} className={uploadZoneClasses}>
              <input {...getInputProps()} />

              <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
                <div className={cn(
                  "p-4 rounded-full bg-white shadow-sm transition-transform duration-300",
                  isDragActive && "scale-110 shadow-md"
                )}>
                  {isDragActive ? (
                    <UploadCloud className="w-8 h-8 text-orange-500 animate-bounce" />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                <div className="space-y-1">
                  <p className="font-din-bold text-gray-700 text-base">
                    {variant === 'circle'
                      ? t("chooseProfilePicture")
                      : t("chooseLogo")
                    }
                  </p>
                  <p className="text-sm text-gray-500 font-din-regular">
                    {isDragActive
                      ? t("dragImageHere")
                      : (isArabic
                        ? "انقر للاختيار أو اسحب الصورة هنا"
                        : "Click to select or drag image here")
                    }
                  </p>
                  <p className="text-xs text-gray-400 font-din-regular">
                    {isArabic
                      ? `PNG, JPG, WEBP حتى ${maxSizeMB}MB`
                      : `PNG, JPG, WEBP up to ${maxSizeMB}MB`
                    }
                  </p>
                </div>
              </div>

              {/* Loading Overlay */}
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl backdrop-blur-sm z-10">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                    <span className="text-xs font-din-medium text-orange-600">
                      {isArabic ? "جاري التحميل..." : "Loading..."}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-500 text-sm font-din-medium px-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// Export old name for backwards compatibility
export const UploadFiles = ImageUpload;
