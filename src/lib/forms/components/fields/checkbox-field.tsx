'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxFieldProps {
    id?: string;
    checked?: boolean;
    onCheckedChange: (checked: boolean) => void;
    label: React.ReactNode;
    description?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export function CheckboxField({
    id,
    checked,
    onCheckedChange,
    label,
    description,
    error,
    required,
    disabled,
    className,
}: CheckboxFieldProps) {
    const inputId = id || crypto.randomUUID();

    return (
        <div className={cn('space-y-3', className)}>
            <div
                className={cn(
                    'flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer',
                    'hover:border-orange-200 hover:bg-orange-50/30',
                    checked ? 'border-primary bg-orange-50/50' : 'border-gray-200 bg-white',
                    error && 'border-destructive bg-red-50/30',
                    disabled && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => !disabled && onCheckedChange(!checked)}
            >
                <div className="relative flex items-center justify-center mt-0.5">
                    <Checkbox
                        id={inputId}
                        checked={checked}
                        onCheckedChange={onCheckedChange}
                        disabled={disabled}
                        className={cn(
                            'w-5 h-5 rounded-md border-2 transition-all duration-300',
                            'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
                            'data-[state=unchecked]:border-gray-300 data-[state=unchecked]:bg-white',
                            error && 'data-[state=unchecked]:border-destructive'
                        )}
                    />
                    {checked && (
                        <Check className="w-3 h-3 text-white absolute pointer-events-none" />
                    )}
                </div>
                <div className="grid gap-1.5 leading-none flex-1">
                    <Label
                        htmlFor={inputId}
                        className={cn(
                            'text-sm font-medium leading-none cursor-pointer select-none',
                            checked ? 'text-primary' : 'text-gray-700',
                            error && 'text-destructive'
                        )}
                    >
                        {label}
                        {required && <span className="text-destructive ms-1">*</span>}
                    </Label>
                    {description && (
                        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
                    )}
                </div>
            </div>
            {error && (
                <p className="text-sm font-medium text-destructive animate-in slide-in-from-top-1 fade-in flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                    {error}
                </p>
            )}
        </div>
    );
}
