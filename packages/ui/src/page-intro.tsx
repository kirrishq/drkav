import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "./lib/cn";
import { formatRussianText } from "./russian-typography";

export type BreadcrumbItem = {
  href?: string;
  label: string;
};

export type BreadcrumbsProps = {
  className?: string;
  items: readonly BreadcrumbItem[];
};

export type PageIntroProps = Omit<ComponentPropsWithoutRef<"main">, "title"> & {
  as?: "div" | "main";
  breadcrumbs: readonly BreadcrumbItem[];
  children?: ReactNode;
  description: string;
  title: string;
};

/** Router-agnostic breadcrumb navigation for content pages. */
export function Breadcrumbs({ className, items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Хлебные крошки" className={cn("breadcrumbs", className)}>
      <ol className="breadcrumbs__list">
        {items.map((item, index) => {
          const current = index === items.length - 1;

          return (
            <li className="breadcrumbs__item" key={`${item.href ?? item.label}-${index}`}>
              {index > 0 ? <span aria-hidden="true" className="breadcrumbs__separator">›</span> : null}
              {item.href && !current ? (
                <a
                  className="breadcrumbs__link"
                  href={item.href}
                >
                  {formatRussianText(item.label)}
                </a>
              ) : (
                <span aria-current={current ? "page" : undefined} className="breadcrumbs__current">
                  {formatRussianText(item.label)}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Standard introductory block for content pages.
 *
 * Navigation uses ordinary anchors so the component stays independent from a
 * particular router implementation.
 */
export function PageIntro({
  as = "main",
  breadcrumbs,
  className,
  children,
  description,
  title,
  ...props
}: PageIntroProps) {
  const content = (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <section className="content-card content-card--intro">
        <h1 className="content-card__heading content-card__heading--h1">{formatRussianText(title)}</h1>
        <p className="page-intro__description type-text-base">
          {formatRussianText(description)}
        </p>
      </section>
      {children ? <div className="page-intro__content">{children}</div> : null}
    </>
  );

  const rootClassName = cn(
    "page-intro",
    className,
  );

  if (as === "div") {
    return (
      <div className={rootClassName} {...props}>
        {content}
      </div>
    );
  }

  return (
    <main className={rootClassName} {...props}>
      {content}
    </main>
  );
}
