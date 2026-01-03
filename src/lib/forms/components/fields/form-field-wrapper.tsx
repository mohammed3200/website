
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface FormFieldWrapperProps {
    wrapperId: string;
    label?: string;
    description?: string;
    error?: string;
    required?: boolean;
    className?: string;
    children: React.ReactNode;
}

export function FormFieldWrapper({
    wrapperId,
    label,
    description,
    error,
    required,
    className,
    children,
}: FormFieldWrapperProps) {
    return (
        <div className={cn('space-y-2', className)}>
            {label && (
                <Label
                    htmlFor={wrapperId}
                    className={cn(
                        'flex gap-1',
                        error ? 'text-destructive' : 'text-foreground'
                    )}
                >
                    {label}
                    {required && <span className="text-destructive">*</span>}
                </Label>
            )}

            {children}

            {description && !error && (
                <p className="text-[0.8rem] text-muted-foreground">{description}</p>
            )}

            {error && (
                <p className="text-[0.8rem] font-medium text-destructive animate-in slide-in-from-top-1 fade-in">
                    {error}
                </p>
            )}
        </div>
    );
}
