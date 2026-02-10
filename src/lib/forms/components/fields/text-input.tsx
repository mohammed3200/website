'use client';

import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { FormFieldWrapper } from './form-field-wrapper';
import { cn } from '@/lib/utils';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    description?: string;
    error?: string;
    wrapperClassName?: string;
    icon?: React.ReactNode;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    ({ label, description, error, required, wrapperClassName, className, id, icon, ...props }, ref) => {
        const inputId = id || props.name || crypto.randomUUID();

        return (
            <FormFieldWrapper
                wrapperId={inputId}
                label={label}
                description={description}
                error={error}
                required={required}
                className={wrapperClassName}
            >
                <div className="relative group">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors duration-300">
                            {icon}
                        </div>
                    )}
                    <Input
                        id={inputId}
                        ref={ref}
                        className={cn(
                            'h-12 bg-white border-2 border-gray-200 rounded-xl',
                            'transition-all duration-300 ease-out',
                            'placeholder:text-gray-400 placeholder:font-din-regular',
                            'hover:border-orange-300 hover:shadow-form',
                            'focus:border-primary focus:shadow-form-focus focus:ring-0',
                            'disabled:bg-gray-50 disabled:cursor-not-allowed',
                            icon ? 'pl-11' : 'px-4',
                            error && 'border-destructive focus:border-destructive focus:shadow-[0_0_0_4px_rgba(184,0,0,0.1)]',
                            className
                        )}
                        aria-invalid={!!error}
                        {...props}
                    />
                    {/* Animated bottom border gradient on focus */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-brand rounded-b-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
            </FormFieldWrapper>
        );
    }
);

TextInput.displayName = 'TextInput';
