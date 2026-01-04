
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useLocale } from 'next-intl';

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
    const locale = useLocale();
    const isRtl = locale === 'ar';

    return (
        <div className={cn('space-y-2.5', className)}>
            {label && (
                <Label
                    htmlFor={wrapperId}
                    className={cn(
                        'flex items-center gap-1.5 text-sm font-semibold transition-colors',
                        error
                            ? 'text-destructive'
                            : 'text-slate-700 dark:text-slate-300',
                        isRtl && 'flex-row-reverse justify-end'
                    )}
                >
                    <span>{label}</span>
                    {required && (
                        <span
                            className="text-destructive text-base leading-none"
                            aria-label={isRtl ? 'مطلوب' : 'required'}
                        >
                            *
                        </span>
                    )}
                </Label>
            )}

            <div className="relative">
                {children}
            </div>

            {description && !error && (
                <p className={cn(
                    'text-xs text-muted-foreground leading-relaxed',
                    isRtl && 'text-right'
                )}>
                    {description}
                </p>
            )}

            {error && (
                <div className="flex items-start gap-1.5 animate-in slide-in-from-top-1 fade-in duration-200">
                    <svg
                        className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className={cn(
                        'text-xs font-medium text-destructive leading-relaxed',
                        isRtl && 'text-right flex-1'
                    )}>
                        {error}
                    </p>
                </div>
            )}
        </div>
    );
}
