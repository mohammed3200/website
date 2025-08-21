"use client";

import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Control, FieldValues, ControllerRenderProps } from "react-hook-form";
import Image from "next/image";
import PhoneInput from "react-phone-number-input";
import { E164Number } from "libphonenumber-js/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectValue, SelectTrigger } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkBox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
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
        <div className="flex rounded-md border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)]">
          {iconSrc && (
            <div className="flex border border-gray-200 rounded items-center justify-center px-2">
            <Image
              src={iconSrc}
              height={30}
              width={30}
              alt={iconAlt || "icon"}
              className="object-cover"
            />
            </div>
          )}
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              dir={isEnglish ? "ltr" : "rtl"}
              className="placeholder:text-dark-600 h-12 focus-visible:ring-0 focus-visible:ring-offset-0 border-none shadow-none"
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
            className="placeholder:text-gray-400 font-din-regular focus-visible:ring-0 focus-visible:ring-offset-0 md:text-base text-sm"
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="LY"
            placeholder={placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="input-phone"
            dir="ltr"
          />
        </FormControl>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <Image
            src="/assets/icons/calendar.svg"
            height={24}
            width={24}
            alt="calendar"
            className="ml-2"
          />
          <FormControl>
            <DatePicker
              selected={field.value}
              onChange={(data) => field.onChange(data)}
              dateFormat={dateFormat ?? "dd/MM/yyyy"}
              showTimeSelect={showTimeSelect ?? false}
              timeInputLabel="Time:"
              wrapperClassName="date-picker"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="placeholder:text-gray-600 h-12 focus:ring-0 focus:ring-offset-0 ">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)]">
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
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="cursor-pointer font-din-regular text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 md:leading-none">
              {props.label}
            </label>
          </div>
        </FormControl>
      );
    default:
      break;
  }
};

export const CustomFormField = <T extends FieldValues = FieldValues>(props: CustomProps<T>) => {
  const { control, fieldType, name, label, isEnglish } = props;
  return (
    <FormField
      control={control}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name={name as any}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="font-din-regular base max-md:base-small">
              {label}
            </FormLabel>
          )}

          <RenderField field={field} props={props} isEnglish={isEnglish} />

          <FormMessage className="font-din-regular" />
        </FormItem>
      )}
    />
  );
};
