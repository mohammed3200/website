
'use client';

import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { FormFieldWrapper } from '@/lib/forms/components/fields/form-field-wrapper';

export interface TextInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    description?: string;
    error?: string;
    wrapperClassName?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    (
        { label, description, error, required, wrapperClassName, className, id, ...props },
        ref
    ) => {
        // Generate a safe ID if none is provided
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
                <Input
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

TextInput.displayName = 'TextInput';
