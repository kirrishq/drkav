import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "./lib/cn";

export type FilterChipProps = Omit<ComponentPropsWithoutRef<"button">, "children" | "className" | "type"> & {
  active?: boolean;
  children: ReactNode;
  className?: string;
};

/** Shared pill-shaped filter/tab control with an explicit active state. */
export function FilterChip({ active = false, children, className, ...buttonProps }: FilterChipProps) {
  return (
    <button
      className={cn("filter-chip", active && "filter-chip--active", className)}
      type="button"
      {...buttonProps}
    >
      {children}
    </button>
  );
}
