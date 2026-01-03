
'use client';

import { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface EnhancedFileUploadProps {
    files: File[];
    onFilesChange: (files: File[]) => void;
    maxFiles?: number;
    maxSize?: number; // bytes
    accept?: Record<string, string[]>;
    label?: string;
    description?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
}

export function EnhancedFileUpload({
    files = [],
    onFilesChange,
    maxFiles = 5,
    maxSize = 5 * 1024 * 1024, // 5MB default
    accept = {
        'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
        'application/pdf': ['.pdf'],
    },
    label,
    description,
    error,
    disabled = false,
    className,
}: EnhancedFileUploadProps) {
    const [localError, setLocalError] = useState<string | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            setLocalError(null);

            if (fileRejections.length > 0) {
                const rejectionErrors = fileRejections
                    .map((rejection) => {
                        const errorMsg = rejection.errors[0].message;
                        if (rejection.errors[0].code === 'file-too-large') {
                            return `File ${rejection.file.name} is too large. Max size is ${formatBytes(maxSize)}.`;
                        }
                        if (rejection.errors[0].code === 'file-invalid-type') {
                            return `File ${rejection.file.name} has an invalid format.`;
                        }
                        return errorMsg;
                    })
                    .join(', ');
                setLocalError(rejectionErrors);
            }

            const newFiles = [...files, ...acceptedFiles];
            if (newFiles.length > maxFiles) {
                setLocalError(`You can only upload a maximum of ${maxFiles} files.`);
                // Trim to max
                onFilesChange(newFiles.slice(0, maxFiles));
            } else {
                onFilesChange(newFiles);
            }
        },
        [files, maxFiles, maxSize, onFilesChange]
    );

    const removeFile = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        onFilesChange(newFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles,
        maxSize,
        accept,
        disabled: disabled || files.length >= maxFiles,
    });

    return (
        <div className={cn('w-full space-y-3', className)}>
            {(label || description) && (
                <div className="space-y-1">
                    {label && <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">{label}</label>}
                    {description && <p className="text-[0.8rem] text-muted-foreground">{description}</p>}
                </div>
            )}

            {/* Dropzone Area */}
            <div
                {...getRootProps()}
                className={cn(
                    'relative flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg p-6 transition-all duration-300 ease-in-out',
                    isDragActive
                        ? 'border-primary bg-primary/10 scale-[1.02] ring-4 ring-primary/10'
                        : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20',
                    (disabled || files.length >= maxFiles) && 'opacity-60 cursor-not-allowed bg-muted',
                    error || localError ? 'border-destructive/50 bg-destructive/5' : ''
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <div className="p-3 rounded-full bg-background shadow-sm border">
                        <UploadCloud className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium">
                            {isDragActive ? 'Drop files here' : 'Click or drag files to upload'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Max {maxFiles} files, up to {formatBytes(maxSize)} each
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {(error || localError) && (
                <div className="flex items-center gap-2 text-sm text-destructive animate-in slide-in-from-top-1 fade-in">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error || localError}</span>
                </div>
            )}

            {/* File List */}
            {files.length > 0 && (
                <div className="grid gap-2 mt-4">
                    {files.map((file, index) => (
                        <div
                            key={`${file.name}-${index}`}
                            className="flex items-center justify-between p-3 border rounded-lg bg-card group hover:border-primary/50 transition-colors"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                {file.type.startsWith('image/') ? (
                                    <div className="relative w-10 h-10 rounded overflow-hidden shrink-0 border">
                                        <Image
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            fill
                                            className="object-cover"
                                            onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center w-10 h-10 rounded bg-muted shrink-0 text-muted-foreground">
                                        <FileIcon className="w-5 h-5" />
                                    </div>
                                )}

                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium truncate max-w-[200px] md:max-w-xs block" title={file.name}>
                                        {file.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatBytes(file.size)}
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive shrink-0"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent parent click if inside clickable area (though it's outside dropzone)
                                    removeFile(index);
                                }}
                                disabled={disabled}
                                type="button"
                            >
                                <X className="w-4 h-4" />
                                <span className="sr-only">Remove file</span>
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function formatBytes(bytes: number, decimals = 1) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
