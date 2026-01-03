
'use client';

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormFieldWrapper } from './form-field-wrapper';
import { Button } from '@/components/ui/button';

export interface DatePickerFieldProps {
    wrapperId?: string;
    value?: Date | null;
    onChange: (date: Date | null) => void;
    label?: string;
    description?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
    placeholder?: string;
    className?: string;
    wrapperClassName?: string;
}

export function DatePickerField({
    wrapperId,
    value,
    onChange,
    label,
    description,
    error,
    required,
    disabled,
    minDate,
    maxDate,
    placeholder = 'Pick a date',
    className,
    wrapperClassName,
}: DatePickerFieldProps) {
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
            <div className={cn('relative', className)}>
                <DatePicker
                    selected={value}
                    onChange={onChange}
                    disabled={disabled}
                    minDate={minDate}
                    maxDate={maxDate}
                    placeholderText={placeholder}
                    customInput={
                        <Button
                            variant={'outline'}
                            className={cn(
                                'w-full justify-start text-left font-normal',
                                !value && 'text-muted-foreground',
                                error && 'border-destructive'
                            )}
                            id={id}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {value ? value.toLocaleDateString() : <span>{placeholder}</span>}
                        </Button>
                    }
                />
            </div>
            {/* Overrides for react-datepicker to match theme */}
            <style jsx global>{`
        .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker {
          font-family: inherit;
          border-radius: var(--radius);
          border-color: hsl(var(--border));
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        .react-datepicker__header {
          background-color: hsl(var(--muted));
          border-bottom-color: hsl(var(--border));
          border-top-left-radius: var(--radius);
          border-top-right-radius: var(--radius);
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
        }
        .react-datepicker__day:hover {
            background-color: hsl(var(--accent));
        }
      `}</style>
        </FormFieldWrapper>
    );
}
