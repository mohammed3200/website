'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormFieldWrapper } from './form-field-wrapper';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { SelectOption } from '@/lib/forms/types';

export interface RadioGroupFieldProps {
    wrapperId?: string;
    value?: string;
    onValueChange: (value: string) => void;
    options: SelectOption[];
    label?: string;
    description?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    wrapperClassName?: string;
    className?: string;
    orientation?: 'horizontal' | 'vertical';
    locale?: 'ar' | 'en';
}

export function RadioGroupField({
    wrapperId,
    value,
    onValueChange,
    options,
    label,
    description,
    error,
    required,
    disabled,
    wrapperClassName,
    className,
    orientation = 'vertical',
    locale = 'en',
}: RadioGroupFieldProps) {
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
            <RadioGroup
                value={value}
                onValueChange={onValueChange}
                disabled={disabled}
                className={cn(
                    'flex gap-3',
                    orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
                    className
                )}
            >
                {options.map((option) => {
                    const optionId = `${id}-${option.value}`;
                    const labelText = typeof option.label === 'object' ? option.label[locale] : option.label;
                    const isSelected = value === option.value;

                    return (
                        <div
                            key={option.value}
                            className={cn(
                                'flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer flex-1 min-w-[200px]',
                                'hover:border-orange-200 hover:bg-orange-50/30',
                                isSelected ? 'border-primary bg-orange-50/50' : 'border-gray-200 bg-white',
                                disabled && 'opacity-50 cursor-not-allowed'
                            )}
                            onClick={() => !disabled && onValueChange(option.value)}
                        >
                            <div className="relative flex items-center justify-center">
                                <RadioGroupItem
                                    value={option.value}
                                    id={optionId}
                                    className={cn(
                                        'w-5 h-5 border-2 transition-all duration-300',
                                        isSelected ? 'border-primary text-primary' : 'border-gray-300'
                                    )}
                                />
                                {isSelected && (
                                    <div className="absolute w-2.5 h-2.5 rounded-full bg-primary pointer-events-none" />
                                )}
                            </div>
                            <Label
                                htmlFor={optionId}
                                className={cn(
                                    'text-sm font-medium cursor-pointer select-none flex-1',
                                    isSelected ? 'text-primary' : 'text-gray-700'
                                )}
                            >
                                {labelText}
                            </Label>
                        </div>
                    );
                })}
            </RadioGroup>
        </FormFieldWrapper>
    );
}
