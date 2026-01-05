'use client';

import React from 'react';
import Image from 'next/image';
import { CalendarIcon } from 'lucide-react';

import DatePicker from 'react-datepicker';
import PhoneInput from 'react-phone-number-input';
import { E164Number } from 'libphonenumber-js/core';
import { Control, FieldValues, ControllerRenderProps } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from './ui/input';
import 'react-datepicker/dist/react-datepicker.css';
import { Select, SelectContent, SelectValue, SelectTrigger } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { cn } from '@/lib/utils';

export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkBox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton',
}

interface CustomProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  fieldType: FormFieldType;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: ControllerRenderProps<T>) => React.ReactNode;
  isEnglish?: boolean;
  className?: string; // For wrapper or specific field overrides
  description?: string;
}

const RenderField = <T extends FieldValues = FieldValues>({
  field,
  props,
  isEnglish,
}: {
  field: ControllerRenderProps<T>;
  props: CustomProps<T>;
  isEnglish?: boolean;
}) => {
  const {
    fieldType,
    placeholder,
    iconSrc,
    iconAlt,
    showTimeSelect,
    dateFormat,
    renderSkeleton,
  } = props;

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="relative flex items-center group">
          {iconSrc && (
            <div className="absolute left-3 z-10 p-1.5 rounded-full bg-gray-50 group-hover:bg-orange-50 transition-colors">
              <Image
                src={iconSrc}
                height={20}
                width={20}
                alt={iconAlt || 'icon'}
                className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </div>
          )}
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              dir={isEnglish ? 'ltr' : 'rtl'}
              className={cn(
                'h-12 bg-white border-gray-200 shadow-sm transition-all duration-300 placeholder:text-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 hover:border-orange-300',
                iconSrc ? 'pl-12' : '',
                props.className,
              )}
            />
          </FormControl>
        </div>
      );

    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            {...field}
            placeholder={placeholder}
            disabled={props.disabled}
            className={cn(
              'min-h-[120px] bg-white border-gray-200 shadow-sm transition-all duration-300 placeholder:text-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 hover:border-orange-300 font-din-regular md:text-base text-sm resize-none p-4',
              props.className,
            )}
          />
        </FormControl>
      );

    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <div className="relative group">
            <PhoneInput
              defaultCountry="LY"
              placeholder={placeholder}
              international
              withCountryCallingCode
              value={field.value as E164Number | undefined}
              onChange={field.onChange}
              className={cn(
                'flex h-12 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-all duration-300 placeholder:text-gray-400 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 hover:border-orange-300',
                props.className,
              )}
              numberInputProps={{
                className:
                  'flex-1 bg-transparent border-none outline-none placeholder:text-gray-400 h-full text-base font-din-regular',
              }}
              // Style the flag dropdown if needed via global CSS or className
              aria-label="Phone number"
            />
          </div>
        </FormControl>
      );

    case FormFieldType.DATE_PICKER:
      return (
        <div className="relative flex items-center group">
          <div className="absolute left-3 z-10 text-gray-400 group-hover:text-orange-500 transition-colors">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <FormControl>
            <div className="flex w-full">
              <DatePicker
                selected={field.value}
                onChange={(data: Date | null) => field.onChange(data)}
                dateFormat={dateFormat ?? 'dd/MM/yyyy'}
                showTimeSelect={showTimeSelect ?? false}
                timeInputLabel="Time:"
                wrapperClassName="w-full"
                className={cn(
                  'flex w-full h-12 rounded-md border border-gray-200 bg-white pl-10 pr-3 py-2 text-sm shadow-sm transition-all duration-300 placeholder:text-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 hover:border-orange-300 font-din-regular',
                  props.className,
                )}
                placeholderText={placeholder}
              />
            </div>
          </FormControl>
        </div>
      );

    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger
                className={cn(
                  'h-12 w-full bg-white border-gray-200 shadow-sm transition-all duration-300 text-gray-700 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 hover:border-orange-300',
                  props.className,
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white border-gray-200 shadow-xl rounded-lg animate-in fade-in-0 zoom-in-95">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );

    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;

    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-orange-50/50 hover:border-orange-100 transition-all cursor-pointer group">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              className="border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 w-5 h-5 rounded-md transition-all"
            />
            <label
              htmlFor={props.name}
              className="cursor-pointer font-din-regular text-sm font-medium text-gray-700 group-hover:text-gray-900 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {props.label}
            </label>
          </div>
        </FormControl>
      );

    default:
      return null;
  }
};

export const CustomFormField = <T extends FieldValues = FieldValues>(
  props: CustomProps<T>,
) => {
  const { control, fieldType, name, label, isEnglish, description } = props;
  return (
    <FormField
      control={control}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name={name as any}
      render={({ field }) => (
        <FormItem className="flex-1 space-y-2">
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="font-din-medium text-gray-800 text-sm md:text-base">
              {label}
            </FormLabel>
          )}

          <RenderField field={field} props={props} isEnglish={isEnglish} />

          {description && (
            <FormDescription className="font-din-regular text-xs text-gray-500">
              {description}
            </FormDescription>
          )}

          <FormMessage className="font-din-regular text-xs text-red-500 animate-in slide-in-from-top-1" />
        </FormItem>
      )}
    />
  );
};
