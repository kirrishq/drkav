import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "./lib/cn";

export type InputStatus = "default" | "error" | "success";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  "data-status"?: InputStatus;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      className={cn(
        "focus-ring type-text-base min-h-11 w-full min-w-0 rounded-md border border-border-strong",
        "bg-surface px-3 py-2 text-primary shadow-subtle outline-none",
        "transition-colors duration-fast ease-standard placeholder:text-muted",
        "hover:border-text-muted focus-visible:border-accent",
        "read-only:bg-surface-muted read-only:text-secondary read-only:hover:border-border-strong",
        "disabled:cursor-not-allowed disabled:border-border disabled:bg-disabled-background",
        "disabled:text-disabled-foreground disabled:shadow-none disabled:hover:border-border",
        "aria-invalid:border-error aria-invalid:focus-visible:border-error",
        "data-[status=success]:border-success data-[status=success]:focus-visible:border-success",
        "motion-reduce:transition-none",
        className,
      )}
      data-slot="input"
      ref={ref}
      type={type}
      {...props}
    />
  ),
);

Input.displayName = "Input";
