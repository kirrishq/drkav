import {
  cloneElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type SVGAttributes,
} from "react";

import type { InputProps, InputStatus } from "./input";
import { Label } from "./label";
import { cn } from "./lib/cn";

export type FormFieldStatus = InputStatus;

export type FormDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export function FormDescription({
  className,
  ...props
}: FormDescriptionProps) {
  return (
    <p
      className={cn(
        "type-text-sm text-secondary",
        "group-data-[disabled=true]/field:text-muted",
        className,
      )}
      data-slot="form-description"
      {...props}
    />
  );
}

export type FormMessageProps = HTMLAttributes<HTMLParagraphElement> & {
  status?: FormFieldStatus;
};

function ErrorIcon(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20" {...props}>
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 6.25v4.5m0 2.75h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function SuccessIcon(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20" {...props}>
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m6.75 10 2.1 2.1 4.4-4.45"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

export function FormMessage({
  children,
  className,
  status = "default",
  ...props
}: FormMessageProps) {
  return (
    <p
      className={cn(
        "type-text-sm flex items-start gap-1.5 text-secondary",
        status === "error" && "text-error",
        status === "success" && "text-success",
        "group-data-[disabled=true]/field:text-muted",
        className,
      )}
      data-slot="form-message"
      data-status={status}
      {...props}
    >
      {status === "error" ? (
        <>
          <ErrorIcon className="mt-0.5 size-4 shrink-0" />
          <span className="sr-only">Ошибка: </span>
        </>
      ) : status === "success" ? (
        <>
          <SuccessIcon className="mt-0.5 size-4 shrink-0" />
          <span className="sr-only">Успешно: </span>
        </>
      ) : null}
      <span>{children}</span>
    </p>
  );
}

function joinIds(...values: Array<string | undefined>) {
  return Array.from(
    new Set(values.flatMap((value) => value?.split(/\s+/).filter(Boolean) ?? [])),
  ).join(" ");
}

export type FormFieldProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: ReactElement<InputProps>;
  description?: ReactNode;
  disabled?: boolean;
  id: string;
  label: ReactNode;
  message?: ReactNode;
  optional?: boolean;
  required?: boolean;
  status?: FormFieldStatus;
};

export function FormField({
  children,
  className,
  description,
  disabled = false,
  id,
  label,
  message,
  optional = false,
  required = false,
  status = "default",
  ...props
}: FormFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const messageId = message ? `${id}-message` : undefined;
  const describedBy = joinIds(
    children.props["aria-describedby"],
    descriptionId,
    messageId,
  );

  const input = cloneElement(children, {
    "aria-describedby": describedBy || undefined,
    "aria-invalid":
      status === "error" ? true : children.props["aria-invalid"],
    "data-status": status,
    disabled: disabled || children.props.disabled,
    id,
    required: required || children.props.required,
  });

  return (
    <div
      className={cn("group/field grid w-full gap-2", className)}
      data-disabled={disabled || undefined}
      data-slot="form-field"
      data-status={status}
      {...props}
    >
      <Label
        disabled={disabled}
        htmlFor={id}
        optional={optional && !required}
        required={required}
      >
        {label}
      </Label>
      {input}
      {description ? (
        <FormDescription id={descriptionId}>{description}</FormDescription>
      ) : null}
      {message ? (
        <FormMessage id={messageId} status={status}>
          {message}
        </FormMessage>
      ) : null}
    </div>
  );
}
