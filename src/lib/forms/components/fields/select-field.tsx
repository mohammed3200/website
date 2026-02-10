'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FormFieldWrapper } from './form-field-wrapper';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { SelectOption } from '@/lib/forms/types';

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
    className?: string;
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
            <Select value={value} onValueChange={onValueChange} disabled={disabled}>
                <SelectTrigger
                    id={id}
                    className={cn(
                        'h-12 bg-white border-2 border-gray-200 rounded-xl',
                        'transition-all duration-300 ease-out',
                        'hover:border-orange-300 hover:shadow-form',
                        'focus:border-primary focus:shadow-form-focus focus:ring-0',
                        'data-[state=open]:border-primary data-[state=open]:shadow-form-focus',
                        error && 'border-destructive focus:border-destructive',
                        className
                    )}
                    aria-invalid={!!error}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-100 rounded-xl shadow-card max-h-60">
                    {options.map((option) => {
                        const labelText = typeof option.label === 'object' ? option.label[locale] : option.label;
                        return (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                                className="cursor-pointer rounded-lg mx-1 my-0.5 focus:bg-orange-50 focus:text-primary data-[state=checked]:bg-orange-50 data-[state=checked]:text-primary"
                            >
                                {labelText}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </FormFieldWrapper>
    );
}
