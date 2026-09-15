import { useId, type ReactNode } from "react";

import { ConsultationTrigger } from "./consultation-form";
import { buttonVariants } from "./button";
import { cn } from "./lib/cn";
import { Breadcrumbs, type BreadcrumbItem } from "./page-intro";

export type OperationHeroLink = {
  href: string;
  label: string;
};

export type OperationHeroProps = {
  backgroundSrc: string;
  breadcrumbs?: readonly BreadcrumbItem[];
  ctaLabel?: string;
  description?: ReactNode;
  links: readonly OperationHeroLink[];
  title: string;
};

/** Full-bleed operation hero with anchor navigation and consultation CTA. */
export function OperationHero({
  backgroundSrc,
  breadcrumbs,
  ctaLabel = "Индивидуальный расчёт стоимости",
  description,
  links,
  title,
}: OperationHeroProps) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="operation-hero">
      {/* The background URL is runtime content, so it cannot be represented by a shared CSS token. */}
      <div
        aria-hidden="true"
        className="operation-hero__background"
        style={{ backgroundImage: `url("${backgroundSrc}")` }}
      />
      <div aria-hidden="true" className="operation-hero__scrim" />
      <div className="operation-hero__content">
        {breadcrumbs ? <Breadcrumbs className="operation-hero__breadcrumbs" items={breadcrumbs} /> : null}
        <h1 className="type-h1 operation-hero__title" id={titleId}>{title}</h1>
        {description ? <p className="type-text-xl operation-hero__description">{description}</p> : null}
        {links.length > 0 ? (
          <nav aria-label="Разделы операции" className="operation-hero__navigation">
            {links.map((link) => (
              <a className="operation-hero__link" href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        ) : null}
        <ConsultationTrigger className={cn(buttonVariants({ size: "lg", variant: "primary" }), "operation-hero__action")}>
          {ctaLabel}
        </ConsultationTrigger>
      </div>
    </section>
  );
}
