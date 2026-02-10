'use client';

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';
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
    placeholder = 'Select date',
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
            <div className={cn('relative group', className)}>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Calendar className="w-5 h-5" />
                </div>
                <DatePicker
                    selected={value}
                    onChange={onChange}
                    disabled={disabled}
                    minDate={minDate}
                    maxDate={maxDate}
                    placeholderText={placeholder}
                    className="w-full"
                    customInput={
                        <Button
                            variant="outline"
                            className={cn(
                                'w-full h-12 justify-start text-left font-normal bg-white border-2 border-gray-200 rounded-xl pl-11',
                                'transition-all duration-300',
                                'hover:border-orange-300 hover:shadow-form hover:bg-white',
                                'focus:border-primary focus:shadow-form-focus focus:ring-0',
                                !value && 'text-gray-400',
                                error && 'border-destructive',
                                'relative overflow-hidden'
                            )}
                            id={id}
                        >
                            <span className="relative z-10">{value ? value.toLocaleDateString() : placeholder}</span>
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-brand opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        </Button>
                    }
                />
            </div>
            <style jsx global>{`
        .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker {
          font-family: inherit;
          border-radius: 1rem;
          border: 2px solid #e5e7eb;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }
        .react-datepicker__header {
          background: linear-gradient(135deg, #FE6601 0%, #ed847e 100%);
          border-bottom: none;
          padding-top: 1rem;
        }
        .react-datepicker__current-month,
        .react-datepicker__day-name {
          color: white;
          font-weight: 600;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background: #FE6601 !important;
          color: white !important;
          border-radius: 0.5rem;
        }
        .react-datepicker__day:hover {
          background: #fff7ed;
          color: #FE6601;
          border-radius: 0.5rem;
        }
        .react-datepicker__navigation-icon::before {
          border-color: white;
        }
      `}</style>
        </FormFieldWrapper>
    );
}
