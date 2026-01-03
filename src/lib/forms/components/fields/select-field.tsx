
'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FormFieldWrapper } from '@/lib/forms/components/fields/form-field-wrapper';

export interface SelectOption {
    value: string;
    label: string | { ar: string; en: string };
}

export interface SelectFieldProps {
    wrapperId?: string;
    value?: string;
    onValueChange: (value: string) => void;
    options: SelectOption[];
    label?: string;
    placeholder?: string;
    description?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    wrapperClassName?: string;
    className?: string; // For the trigger
    locale?: 'ar' | 'en';
}

export function SelectField({
    wrapperId,
    value,
    onValueChange,
    options,
    label,
    placeholder = 'Select an option',
    description,
    error,
    required,
    disabled,
    wrapperClassName,
    className,
    locale = 'en',
}: SelectFieldProps) {
    const id = wrapperId || crypto.randomUUID();

    return (
        <FormFieldWrapper
            wrapperId={id}
            label={label}
            description={description}
            error={error}
            required={required}
            className={wrapperClassName}
        >
            <Select
                value={value}
                onValueChange={onValueChange}
                disabled={disabled}
            >
                <SelectTrigger
                    id={id}
                    className={className}
                    aria-invalid={!!error}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => {
                        const labelText = typeof option.label === 'object'
                            ? option.label[locale]
                            : option.label;

                        return (
                            <SelectItem key={option.value} value={option.value}>
                                {labelText}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </FormFieldWrapper>
    );
}
