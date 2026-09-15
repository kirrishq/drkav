import type { ReactNode } from "react";

export type PromotionBannerProps = {
  description: ReactNode;
  emphasis?: readonly string[];
  href: string;
  label?: string;
  title: string;
};

/** Reusable accent banner for a limited promotion or patient offer. */
export function PromotionBanner({
  description,
  emphasis = [],
  href,
  label = "Акция",
  title,
}: PromotionBannerProps) {
  return (
    <a aria-label={`${label}: ${title}`} className="promotion-banner" href={href}>
      <div className="promotion-banner__copy">
        <p className="type-label promotion-banner__eyebrow">{label}</p>
        <h2 className="type-h3 promotion-banner__title">{title}</h2>
        <p className="type-text-base promotion-banner__description">{renderEmphasis(description, emphasis)}</p>
        <p className="type-text-base promotion-banner__disclaimer">
          Имеются противопоказания. Необходима консультация специалиста.
        </p>
      </div>
    </a>
  );
}

function renderEmphasis(description: ReactNode, emphasis: readonly string[]) {
  if (typeof description !== "string" || emphasis.length === 0) {
    return description;
  }

  const expression = new RegExp(`(${emphasis.map(escapeRegExp).join("|")})`, "g");

  return description.split(expression).map((part, index) =>
    emphasis.includes(part) ? <strong className="promotion-banner__emphasis" key={`${part}-${index}`}>{part}</strong> : part,
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
