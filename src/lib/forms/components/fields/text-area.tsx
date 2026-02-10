'use client';

import React, { forwardRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { FormFieldWrapper } from './form-field-wrapper';
import { cn } from '@/lib/utils';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    description?: string;
    error?: string;
    wrapperClassName?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ label, description, error, required, wrapperClassName, className, id, ...props }, ref) => {
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
                    <Textarea
                        id={inputId}
                        ref={ref}
                        className={cn(
                            'min-h-[140px] bg-white border-2 border-gray-200 rounded-xl',
                            'transition-all duration-300 ease-out',
                            'placeholder:text-gray-400 placeholder:font-din-regular',
                            'hover:border-orange-300 hover:shadow-form',
                            'focus:border-primary focus:shadow-form-focus focus:ring-0',
                            'resize-none p-4 font-din-regular text-base leading-relaxed',
                            error && 'border-destructive focus:border-destructive',
                            className
                        )}
                        aria-invalid={!!error}
                        {...props}
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-brand rounded-b-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
            </FormFieldWrapper>
        );
    }
);

TextArea.displayName = 'TextArea';
