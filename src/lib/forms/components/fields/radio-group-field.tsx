
'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormFieldWrapper } from './form-field-wrapper';
import { cn } from '@/lib/utils';
import { SelectOption } from './select-field';

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
    className?: string; // For the group container
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
                    'flex gap-4',
                    orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
                    className
                )}
            >
                {options.map((option) => {
                    const optionId = `${id}-${option.value}`;
                    const labelText = typeof option.label === 'object'
                        ? option.label[locale]
                        : option.label;

                    return (
                        <div key={option.value} className="flex items-center space-x-2 space-y-0 rtl:space-x-reverse">
                            <RadioGroupItem value={option.value} id={optionId} />
                            <Label htmlFor={optionId} className="font-normal cursor-pointer">
                                {labelText}
                            </Label>
                        </div>
                    );
                })}
            </RadioGroup>
        </FormFieldWrapper>
    );
}
