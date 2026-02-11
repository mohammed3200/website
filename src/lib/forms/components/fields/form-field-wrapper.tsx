'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useLocale } from 'next-intl';
import { AlertCircle } from 'lucide-react';

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
        <div className={cn('space-y-2', className)}>
            {label && (
                <div className={cn('flex items-center gap-2')}>
                    <Label
                        htmlFor={wrapperId}
                        className={cn(
                            'text-sm font-bold text-gray-800 transition-colors',
                            error && 'text-destructive',
                            isRtl && 'text-right'
                        )}
                    >
                        {label}
                    </Label>
                    {required && (
                        <span className="text-primary text-sm font-bold" aria-label={isRtl ? 'مطلوب' : 'required'}>
                            *
                        </span>
                    )}
                </div>
            )}

            <div className="relative">
                {children}
            </div>

            {description && !error && (
                <p className={cn('text-xs text-gray-500 font-medium leading-relaxed', isRtl && 'text-right')}>
                    {description}
                </p>
            )}

            {error && (
                <div className={cn(
                    'flex items-start gap-2 animate-in slide-in-from-top-1 fade-in duration-200'
                )}>
                    <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <p className={cn('text-xs font-semibold text-destructive leading-relaxed', isRtl && 'text-right flex-1')}>
                        {error}
                    </p>
                </div>
            )}
        </div>
    );
}
