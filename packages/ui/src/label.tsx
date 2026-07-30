import type { LabelHTMLAttributes } from "react";

import { cn } from "./lib/cn";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  disabled?: boolean;
  optional?: boolean;
  required?: boolean;
};

export function Label({
  children,
  className,
  disabled = false,
  optional = false,
  required = false,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        "type-label inline-flex items-baseline gap-1.5 text-primary",
        "group-data-[status=error]/field:text-error",
        "group-data-[status=success]/field:text-success",
        "group-data-[disabled=true]/field:cursor-not-allowed group-data-[disabled=true]/field:text-muted",
        disabled && "cursor-not-allowed text-muted",
        className,
      )}
      data-disabled={disabled || undefined}
      data-slot="label"
      {...props}
    >
      <span>{children}</span>
      {required ? (
        <>
          <span aria-hidden="true" className="text-error">
            *
          </span>
          <span className="sr-only">Обязательное поле</span>
        </>
      ) : optional ? (
        <span className="type-text-sm font-normal text-muted">Необязательно</span>
      ) : null}
    </label>
  );
}
