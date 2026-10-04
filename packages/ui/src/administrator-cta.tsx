import { useId, type ReactNode } from "react";
/* eslint-disable @next/next/no-img-element -- UI package cannot depend on Next.js Image. */

import { buttonVariants } from "./button";
import { cn } from "./lib/cn";

export type AdministratorCtaProps = {
  avatarSrc?: string;
  backgroundSrc: string;
  ctaHref: string;
  ctaLabel?: string;
  description: ReactNode;
  external?: boolean;
  title?: ReactNode;
  name: string;
  role?: string;
};

/** Wide glassmorphism contact CTA for questions and help with arranging a visit. */
export function AdministratorCta({
  avatarSrc,
  backgroundSrc,
  ctaHref,
  ctaLabel = "Написать Ольге",
  description,
  external = true,
  name,
  role = "Личный администратор",
  title = "Есть вопрос или нужна помощь с записью?",
}: AdministratorCtaProps) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="administrator-cta">
      {/* The background URL is runtime content, so it cannot be represented by a shared CSS token. */}
      <div
        aria-hidden="true"
        className="administrator-cta__background"
        style={{ backgroundImage: `url("${backgroundSrc}")` }}
      />
      <span aria-hidden="true" className="administrator-cta__scrim" />
      <div className="administrator-cta__glass">
        <div className="administrator-cta__identity">
          <span className="administrator-cta__avatar">
            {avatarSrc ? <img alt={`${name}, ${role}`} className="administrator-cta__avatar-image" src={avatarSrc} /> : "О"}
          </span>
          <div>
            <p className="type-text-base administrator-cta__name">{name}</p>
            <p className="type-text-base administrator-cta__role">{role}</p>
          </div>
        </div>
        <div className="administrator-cta__copy">
          <h2 className="type-h3 administrator-cta__title" id={titleId}>{title}</h2>
          <p className="type-text-base administrator-cta__description">{description}</p>
        </div>
        <a
          className={cn(buttonVariants({ size: "md", variant: "primary" }), "administrator-cta__action")}
          href={ctaHref}
          rel={external ? "noreferrer" : undefined}
          target={external ? "_blank" : undefined}
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}
