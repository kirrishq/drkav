import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "./lib/cn";

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, ...props }, ref) => (
    <span className="relative inline-flex size-5 shrink-0">
      <input
        className={cn(
          "focus-ring peer size-5 appearance-none rounded-full border border-border-strong",
          "cursor-pointer bg-surface shadow-subtle transition-colors duration-fast ease-standard",
          "hover:border-text-muted checked:border-accent",
          "disabled:cursor-not-allowed disabled:border-border disabled:bg-disabled-background",
          "disabled:shadow-none motion-reduce:transition-none",
          className,
        )}
        data-slot="radio"
        ref={ref}
        type="radio"
        {...props}
      />
      <span className="pointer-events-none absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-accent transition-transform duration-fast peer-checked:scale-100 peer-disabled:bg-muted motion-reduce:transition-none" />
    </span>
  ),
);

Radio.displayName = "Radio";
