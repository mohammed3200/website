
'use client';

import React, { forwardRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { FormFieldWrapper } from '@/lib/forms/components/fields/form-field-wrapper';

export interface TextAreaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    description?: string;
    error?: string;
    wrapperClassName?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        { label, description, error, required, wrapperClassName, className, id, ...props },
        ref
    ) => {
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
                <Textarea
                    id={inputId}
                    ref={ref}
                    className={className}
                    aria-invalid={!!error}
                    {...props}
                />
            </FormFieldWrapper>
        );
    }
);

TextArea.displayName = 'TextArea';
