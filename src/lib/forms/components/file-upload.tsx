'use client';

import { cn } from '@/lib/utils';
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { useTranslations } from 'next-intl';

interface FileUploadProps {
    onChange?: (files: File[]) => void;
    onFilesChange?: (files: File[]) => void;
    files?: File[];
    label?: string;
    error?: string;
    maxFiles?: number;
    description?: string;
    accept?: Record<string, string[]>;
    maxSize?: number;
}

export function FileUpload({
    onChange,
    onFilesChange,
    files: controlledFiles,
    label,
    error,
    maxFiles = 5,
    description,
    accept,
    maxSize = 10 * 1024 * 1024, // 10MB default
}: FileUploadProps) {
    const t = useTranslations('FileUpload');
    const [internalFiles, setInternalFiles] = useState<File[]>([]);
    const files = controlledFiles ?? internalFiles;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (newFiles: File[]) => {
        const validFiles = newFiles.filter(file => file.size <= maxSize);
        const updatedFiles = [...files, ...validFiles].slice(0, maxFiles);

        if (onFilesChange) onFilesChange(updatedFiles);
        if (onChange) onChange(updatedFiles);
        if (!controlledFiles) setInternalFiles(updatedFiles);
    };

    const removeFile = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        if (onFilesChange) onFilesChange(updatedFiles);
        if (onChange) onChange(updatedFiles);
        if (!controlledFiles) setInternalFiles(updatedFiles);
    };

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-orange-500" />;
        if (file.type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
        return <File className="w-5 h-5 text-blue-500" />;
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        multiple: maxFiles > 1,
        noClick: true,
        onDrop: handleFileChange,
        onDropRejected: (rejections: FileRejection[]) => {
            console.log('Rejected files:', rejections);
        },
        accept,
        maxFiles: maxFiles - files.length,
        maxSize,
    });

    return (
        <div className="w-full space-y-3" {...getRootProps()}>
            {(label || description) && (
                <div className="space-y-1">
                    {label && (
                        <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            {label}
                            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                {files.length}/{maxFiles}
                            </span>
                        </label>
                    )}
                    {description && <p className="text-xs text-gray-500">{description}</p>}
                </div>
            )}

            <motion.div
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={cn(
                    'relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden',
                    'bg-gradient-to-b from-gray-50 to-white',
                    isDragActive
                        ? 'border-primary bg-orange-50/50 shadow-form'
                        : 'border-gray-300 hover:border-orange-300 hover:shadow-form',
                    error && 'border-destructive bg-red-50/30'
                )}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
                    className="hidden"
                    multiple={maxFiles > 1}
                    accept={accept ? Object.keys(accept).join(',') : undefined}
                />

                <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                    <motion.div
                        animate={isDragActive ? { y: [0, -5, 0] } : {}}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className={cn(
                            'w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300',
                            isDragActive
                                ? 'bg-primary text-white shadow-lg shadow-orange-500/30'
                                : 'bg-gray-100 text-gray-400 group-hover:bg-orange-100 group-hover:text-primary'
                        )}
                    >
                        <Upload className="w-8 h-8" />
                    </motion.div>

                    <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-700">
                            {isDragActive ? t('dropHere') || 'Drop files here' : t('clickOrDrag') || 'Click or drag files to upload'}
                        </p>
                        <p className="text-xs text-gray-400">
                            Max {maxFiles} files, up to {(maxSize / (1024 * 1024)).toFixed(0)}MB each
                        </p>
                    </div>
                </div>

                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>

            {/* File List */}
            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                    >
                        {files.map((file, idx) => (
                            <motion.div
                                key={`${file.name}-${idx}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className={cn(
                                    'flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 group',
                                    'bg-white border-gray-200 hover:border-orange-200 hover:shadow-sm'
                                )}
                            >
                                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                                    {getFileIcon(file)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                                    <p className="text-xs text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(idx);
                                    }}
                                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    type="button"
                                >
                                    <X className="w-4 h-4" />
                                </motion.button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <p className="text-sm font-medium text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </p>
            )}
        </div>
    );
}
