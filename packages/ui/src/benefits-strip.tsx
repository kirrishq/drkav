import type { ReactNode } from "react";

import { cn } from "./lib/cn";

export type BenefitsStripItem = {
  icon: ReactNode;
  label: string;
};

export type BenefitsStripProps = {
  ariaLabel?: string;
  className?: string;
  items: readonly BenefitsStripItem[];
};

/** Responsive list of short value propositions with supporting icons. */
export function BenefitsStrip({ ariaLabel = "Преимущества", className, items }: BenefitsStripProps) {
  return (
    <section aria-label={ariaLabel} className={cn("benefits-strip", className)}>
      <ul className="benefits-strip__grid">
        {items.map((item) => (
          <li className="benefits-strip__item" key={item.label}>
            <span aria-hidden="true" className="benefits-strip__icon">
              {item.icon}
            </span>
            <p className="type-text-sm benefits-strip__label">{item.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
