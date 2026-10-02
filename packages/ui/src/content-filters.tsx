import type { ComponentPropsWithoutRef } from "react";

import { FilterChip } from "./filter-chip";
import { cn } from "./lib/cn";

export type ContentFilterOption = {
  id: string;
  label: string;
};

export type ContentFiltersProps = Omit<ComponentPropsWithoutRef<"div">, "children" | "aria-label" | "onChange"> & {
  activeId: string;
  allLabel?: string;
  ariaLabel: string;
  options: readonly ContentFilterOption[];
  onChange: (id: string) => void;
};

/** Shared category filter controls for patient-facing content collections. */
export function ContentFilters({
  activeId,
  allLabel = "Все части тела",
  ariaLabel,
  className,
  onChange,
  options,
  ...props
}: ContentFiltersProps) {
  return (
    <div aria-label={ariaLabel} className={cn("content-filters", className)} {...props}>
      <FilterChip active={activeId === "all"} aria-pressed={activeId === "all"} onClick={() => onChange("all")}>
        {allLabel}
      </FilterChip>
      {options.map((option) => (
        <FilterChip active={activeId === option.id} aria-pressed={activeId === option.id} key={option.id} onClick={() => onChange(option.id)}>
          {option.label}
        </FilterChip>
      ))}
    </div>
  );
}
