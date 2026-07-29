import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "./lib/cn";

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <span className="relative inline-flex size-5 shrink-0">
      <input
        className={cn(
          "focus-ring peer size-5 appearance-none rounded-sm border border-border-strong",
          "cursor-pointer bg-surface shadow-subtle transition-colors duration-fast ease-standard",
          "hover:border-text-muted checked:border-accent checked:bg-accent",
          "disabled:cursor-not-allowed disabled:border-border disabled:bg-disabled-background",
          "disabled:shadow-none motion-reduce:transition-none",
          className,
        )}
        data-slot="checkbox"
        ref={ref}
        type="checkbox"
        {...props}
      />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-5 scale-75 text-inverse opacity-0 transition-opacity duration-fast peer-checked:opacity-100 peer-disabled:text-muted motion-reduce:transition-none"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          d="m5.5 10 3 3 6-6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </span>
  ),
);

Checkbox.displayName = "Checkbox";
