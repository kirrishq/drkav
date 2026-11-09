"use client";

import {
  forwardRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  useState,
} from "react";

import { Input } from "./input";
import { cn } from "./lib/cn";

const PHONE_PATTERN =
  "\\+7 \\([0-9]{3}\\) [0-9]{3}-[0-9]{2}-[0-9]{2}";
const RUSSIAN_LOCAL_PATTERN =
  "\\([0-9]{3}\\) [0-9]{3}-[0-9]{2}-[0-9]{2}";
const INTERNATIONAL_PHONE_PATTERN = "[0-9]{8,15}";

type PhoneCountry = "ru" | "other";

export function formatRussianPhone(value: string, includeCountryCode = true) {
  const sourceDigits = value.replace(/\D/g, "");

  if (!sourceDigits) {
    return "";
  }

  const nationalDigits =
    sourceDigits.startsWith("7") || sourceDigits.startsWith("8")
      ? sourceDigits.slice(1, 11)
      : sourceDigits.slice(0, 10);

  let formatted = includeCountryCode ? "+7" : "";

  if (nationalDigits.length > 0) {
    formatted += includeCountryCode
      ? ` (${nationalDigits.slice(0, 3)}`
      : `(${nationalDigits.slice(0, 3)}`;
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
> & {
  countrySelector?: boolean;
};

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      autoComplete = "tel",
      countrySelector = false,
      defaultValue,
      name,
      onChange,
      onKeyDown: onKeyDownProp,
      placeholder = "+7 (900) 000-00-00",
      value,
      ...props
    },
    ref,
  ) => {
    const [country, setCountry] = useState<PhoneCountry>("ru");
    const [uncontrolledValue, setUncontrolledValue] = useState(() =>
      defaultValue === undefined ? "" : String(defaultValue),
    );
    const isControlled = value !== undefined;
    const sourceValue = isControlled ? String(value) : uncontrolledValue;
    const isInternational = country === "other";
    const displayedValue = isInternational
      ? sourceValue.replace(/\D/g, "").slice(0, 15)
      : formatRussianPhone(sourceValue, !countrySelector);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = isInternational
        ? event.currentTarget.value.replace(/\D/g, "").slice(0, 15)
        : formatRussianPhone(event.currentTarget.value, !countrySelector);

      event.currentTarget.value = nextValue;
      if (!isControlled) setUncontrolledValue(nextValue);
      onChange?.(event);
    };

    const handleMaskedKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (!countrySelector || isInternational || (event.key !== "Backspace" && event.key !== "Delete")) {
        onKeyDownProp?.(event);
        return;
      }

      const input = event.currentTarget;
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? start;

      if (start !== end || event.altKey || event.ctrlKey || event.metaKey) {
        onKeyDownProp?.(event);
        return;
      }

      const step = event.key === "Backspace" ? -1 : 1;
      const adjacentIndex = step < 0 ? start - 1 : start;
      const adjacentCharacter = input.value[adjacentIndex];

      if (adjacentIndex < 0 || adjacentIndex >= input.value.length || /\d/.test(adjacentCharacter ?? "")) {
        onKeyDownProp?.(event);
        return;
      }

      let digitIndex = adjacentIndex;
      while (digitIndex >= 0 && digitIndex < input.value.length && !/\d/.test(input.value[digitIndex] ?? "")) {
        digitIndex += step;
      }

      if (digitIndex < 0 || digitIndex >= input.value.length) {
        onKeyDownProp?.(event);
        return;
      }

      event.preventDefault();
      const digits = input.value.replace(/\D/g, "");
      const removedDigit = input.value.slice(0, digitIndex).replace(/\D/g, "").length;
      const nextDigits = digits.slice(0, removedDigit) + digits.slice(removedDigit + 1);
      const nextValue = formatRussianPhone(nextDigits, false);
      const digitsBeforeCaret = input.value.slice(0, start).replace(/\D/g, "").length;
      const nextDigitsBeforeCaret = Math.max(0, digitsBeforeCaret + (step < 0 ? -1 : 0));

      input.value = nextValue;
      if (!isControlled) setUncontrolledValue(nextDigits);
      requestAnimationFrame(() => {
        let caret = 0;
        let seenDigits = 0;
        while (caret < nextValue.length && seenDigits < nextDigitsBeforeCaret) {
          if (/\d/.test(nextValue[caret] ?? "")) seenDigits += 1;
          caret += 1;
        }
        input.setSelectionRange(caret, caret);
      });

      onKeyDownProp?.(event);
    };

    const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
      const nextCountry = event.currentTarget.value as PhoneCountry;
      setCountry(nextCountry);
      if (!isControlled) setUncontrolledValue("");
    };

    if (!countrySelector) {
      return (
        <Input
          {...props}
          autoComplete={autoComplete}
          name={name}
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
    }

    return (
      <div className="phone-input" data-country={country} data-disabled={props.disabled || undefined}>
        <label className="sr-only" htmlFor={props.id ? `${props.id}-country` : undefined}>
          Страна телефона
        </label>
        <div className="phone-input__country-control" data-country={country}>
          <select
            aria-label="Страна телефона"
            className="phone-input__country"
            disabled={props.disabled}
            id={props.id ? `${props.id}-country` : undefined}
            onChange={handleCountryChange}
            value={country}
          >
            <option value="ru">+7</option>
            <option value="other">Другая страна</option>
          </select>
          <span aria-hidden="true" className="phone-input__country-arrow" />
        </div>
        <Input
          {...props}
          autoComplete={autoComplete}
          className={cn("phone-input__input", props.className)}
          inputMode={isInternational ? "numeric" : "tel"}
          maxLength={isInternational ? 15 : 15}
          minLength={isInternational ? 8 : 15}
          name={undefined}
          onChange={handleChange}
          onKeyDown={handleMaskedKeyDown}
          pattern={isInternational ? INTERNATIONAL_PHONE_PATTERN : RUSSIAN_LOCAL_PATTERN}
          placeholder={isInternational ? "Код страны и номер" : "(900) 000-00-00"}
          ref={ref}
          type="tel"
          value={displayedValue}
        />
        {name ? (
          <input
            name={name}
            type="hidden"
            value={isInternational ? displayedValue : formatRussianPhone(sourceValue)}
          />
        ) : null}
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";
