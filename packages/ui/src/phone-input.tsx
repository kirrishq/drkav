"use client";

import {
  forwardRef,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";

import { Input } from "./input";

const PHONE_PATTERN =
  "\\+7 \\([0-9]{3}\\) [0-9]{3}-[0-9]{2}-[0-9]{2}";

export function formatRussianPhone(value: string) {
  const sourceDigits = value.replace(/\D/g, "");

  if (!sourceDigits) {
    return "";
  }

  const nationalDigits =
    sourceDigits.startsWith("7") || sourceDigits.startsWith("8")
      ? sourceDigits.slice(1, 11)
      : sourceDigits.slice(0, 10);

  let formatted = "+7";

  if (nationalDigits.length > 0) {
    formatted += ` (${nationalDigits.slice(0, 3)}`;
  }

  if (nationalDigits.length >= 3) {
    formatted += ")";
  }

  if (nationalDigits.length > 3) {
    formatted += ` ${nationalDigits.slice(3, 6)}`;
  }

  if (nationalDigits.length > 6) {
    formatted += `-${nationalDigits.slice(6, 8)}`;
  }

  if (nationalDigits.length > 8) {
    formatted += `-${nationalDigits.slice(8, 10)}`;
  }

  return formatted;
}

export type PhoneInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "inputMode" | "maxLength" | "minLength" | "pattern" | "type"
>;

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      autoComplete = "tel",
      defaultValue,
      onChange,
      placeholder = "+7 (900) 000-00-00",
      value,
      ...props
    },
    ref,
  ) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      event.currentTarget.value = formatRussianPhone(event.currentTarget.value);
      onChange?.(event);
    };

    return (
      <Input
        {...props}
        autoComplete={autoComplete}
        defaultValue={
          defaultValue === undefined
            ? undefined
            : formatRussianPhone(String(defaultValue))
        }
        inputMode="tel"
        maxLength={18}
        minLength={18}
        onChange={handleChange}
        pattern={PHONE_PATTERN}
        placeholder={placeholder}
        ref={ref}
        type="tel"
        value={value === undefined ? undefined : formatRussianPhone(String(value))}
      />
    );
  },
);

PhoneInput.displayName = "PhoneInput";
