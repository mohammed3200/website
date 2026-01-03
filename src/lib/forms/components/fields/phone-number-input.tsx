
'use client';

import { forwardRef } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { FormFieldWrapper } from './form-field-wrapper';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export interface PhoneNumberInputProps {
    value?: string;
    onChange: (value?: string) => void;
    label?: string;
    description?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    wrapperClassName?: string;
    className?: string;
    id?: string;
    name?: string;
    placeholder?: string;
}

// Custom input component to leverage shadcn Input styles
const CustomInput = forwardRef<HTMLInputElement, any>((props, ref) => (
    <Input {...props} ref={ref} />
));
CustomInput.displayName = 'PhoneCustomInput';

export const PhoneNumberInput = forwardRef<any, PhoneNumberInputProps>(
    (
        {
            value,
            onChange,
            label,
            description,
            error,
            required,
            disabled,
            wrapperClassName,
            className,
            id,
            name,
            placeholder,
        },
        ref
    ) => {
        const inputId = id || name || crypto.randomUUID();

        return (
            <FormFieldWrapper
                wrapperId={inputId}
                label={label}
                description={description}
                error={error}
                required={required}
                className={wrapperClassName}
            >
                <div className={cn('phone-input-container', className)}>
                    <PhoneInput
                        international
                        defaultCountry="LY" // Default to Libya
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        placeholder={placeholder}
                        inputComponent={CustomInput}
                        numberInputProps={{
                            id: inputId,
                            name: name,
                            ref: ref
                        } as any}
                        className={cn(
                            "flex gap-2",
                            error && "[&_input]:border-destructive"
                        )}
                    />
                </div>
                <style jsx global>{`
          .PhoneInputCountry {
            margin-right: 0.5rem;
          }
          .PhoneInputCountrySelect {
            background-color: transparent;
          }
        `}</style>
            </FormFieldWrapper>
        );
    }
);

PhoneNumberInput.displayName = 'PhoneNumberInput';
