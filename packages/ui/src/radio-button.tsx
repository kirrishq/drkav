import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "./lib/cn";

export type RadioButtonProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "children" | "type"
> & {
  children: ReactNode;
  icon?: ReactNode;
};

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ children, className, icon, ...props }, ref) => (
    <label
      className={cn(
        "relative inline-flex min-w-36 cursor-pointer select-none",
        className,
      )}
      data-slot="radio-button"
    >
      <input className="peer sr-only" ref={ref} type="radio" {...props} />
      <span
        className={cn(
          "type-label flex min-h-11 w-full items-center justify-center gap-2 rounded-md",
          "border border-border-strong bg-surface px-4 text-primary shadow-subtle",
          "transition-colors duration-fast ease-standard hover:border-text-muted hover:bg-surface-muted",
          "peer-checked:border-accent peer-checked:bg-accent-soft",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-accent",
          "peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
          "peer-disabled:cursor-not-allowed peer-disabled:border-border",
          "peer-disabled:bg-disabled-background peer-disabled:text-disabled-foreground peer-disabled:shadow-none",
          "motion-reduce:transition-none",
        )}
        data-slot="radio-button-content"
      >
        {icon ? (
          <span
            aria-hidden="true"
            className="inline-flex size-5 items-center justify-center text-accent"
          >
            {icon}
          </span>
        ) : null}
        <span>{children}</span>
      </span>
    </label>
  ),
);

RadioButton.displayName = "RadioButton";
