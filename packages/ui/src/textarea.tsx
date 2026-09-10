import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "./lib/cn";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  "data-status"?: "default" | "error" | "success";
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "focus-ring type-text-base min-h-32 w-full min-w-0 resize-y rounded-md border border-border-strong",
        "bg-surface px-3 py-2 text-primary shadow-subtle outline-none",
        "transition-colors duration-fast ease-standard placeholder:text-muted",
        "hover:border-text-muted focus-visible:border-accent",
        "disabled:cursor-not-allowed disabled:border-border disabled:bg-disabled-background",
        "disabled:text-disabled-foreground disabled:shadow-none disabled:hover:border-border",
        "aria-invalid:border-error aria-invalid:focus-visible:border-error",
        "data-[status=success]:border-success data-[status=success]:focus-visible:border-success",
        "motion-reduce:transition-none",
        className,
      )}
      data-slot="textarea"
      ref={ref}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";
