'use client';

import { forwardRef } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { FormFieldWrapper } from './form-field-wrapper';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Phone } from 'lucide-react';

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

const CustomInput = forwardRef<HTMLInputElement, any>((props, ref) => (
    <Input {...props} ref={ref} />
));
CustomInput.displayName = 'PhoneCustomInput';

export const PhoneNumberInput = forwardRef<any, PhoneNumberInputProps>(
    ({ value, onChange, label, description, error, required, disabled, wrapperClassName, className, id, name, placeholder }, ref) => {
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
                <div className={cn('relative group phone-input-wrapper', className)}>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 group-focus-within:text-primary transition-colors">
                        <Phone className="w-5 h-5" />
                    </div>
                    <PhoneInput
                        international
                        defaultCountry="LY"
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        placeholder={placeholder}
                        inputComponent={CustomInput}
                        numberInputProps={{
                            id: inputId,
                            name: name,
                            ref: ref,
                            className: cn(
                                'h-12 bg-white border-2 border-gray-200 rounded-xl pl-11',
                                'transition-all duration-300',
                                'hover:border-orange-300 hover:shadow-form',
                                'focus:border-primary focus:shadow-form-focus focus:ring-0',
                                error && 'border-destructive',
                                'phone-input-field'
                            )
                        }}
                        className="flex gap-2"
                    />
                    <style jsx global>{`
            .PhoneInputCountry {
              margin-right: 0.5rem;
              margin-left: 0.5rem;
            }
            .PhoneInputCountrySelect {
              background-color: transparent;
              cursor: pointer;
            }
            .PhoneInputCountryIcon {
              border-radius: 4px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
          `}</style>
                </div>
            </FormFieldWrapper>
        );
    }
);

PhoneNumberInput.displayName = 'PhoneNumberInput';
