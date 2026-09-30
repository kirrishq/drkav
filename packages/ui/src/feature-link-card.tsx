import type { ComponentPropsWithoutRef } from "react";

import { cn } from "./lib/cn";
import { ArrowUpRightIcon } from "./record-card";
import { formatRussianText } from "./russian-typography";

export type FeatureLinkCardProps = Omit<ComponentPropsWithoutRef<"a">, "children" | "className" | "href"> & {
  className?: string;
  description?: string;
  href: string;
  imageAlt: string;
  imageSrc: string;
  title: string;
  variant?: "square" | "wide";
};

/** Image-first navigation card with the shared interactive-card arrow. */
export function FeatureLinkCard({ className, description, href, imageAlt, imageSrc, title, variant = "wide", ...props }: FeatureLinkCardProps) {
  return (
    <a className={cn("feature-link-card", `feature-link-card--${variant}`, className)} href={href} {...props}>
      <img alt={imageAlt} className="feature-link-card__image" src={imageSrc} />
      <span className="feature-link-card__overlay" />
      <span className="feature-link-card__content">
      <span className="card-title feature-link-card__title">{formatRussianText(title)}</span>
        {description ? <span className="feature-link-card__description">{formatRussianText(description)}</span> : null}
      </span>
      <span aria-hidden="true" className="record-card__arrow feature-link-card__arrow">
        <ArrowUpRightIcon />
      </span>
    </a>
  );
}
