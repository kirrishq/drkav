import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "./lib/cn";
import { formatRussianText } from "./russian-typography";

export type RecordCardDetail = {
  tone?: "primary" | "secondary";
  value: string;
};

type RecordCardBaseProps = {
  className?: string;
  details?: readonly RecordCardDetail[];
  description?: string;
  icon?: ReactNode;
  meta?: string;
  title: ReactNode;
};

type RecordCardLinkProps = RecordCardBaseProps &
  Omit<ComponentPropsWithoutRef<"a">, "children" | "className" | "href" | "title"> & {
    href: string;
  };

type RecordCardButtonProps = RecordCardBaseProps &
  Omit<ComponentPropsWithoutRef<"button">, "children" | "className" | "title" | "type"> & {
    onClick: NonNullable<ComponentPropsWithoutRef<"button">["onClick"]>;
  };

type RecordCardStaticProps = RecordCardBaseProps & {
  href?: undefined;
};

export type RecordCardProps = RecordCardLinkProps | RecordCardButtonProps | RecordCardStaticProps;

function isButtonRecordCard(props: RecordCardProps): props is RecordCardButtonProps {
  return "onClick" in props && !("href" in props);
}

export function ArrowUpRightIcon() {
  return (
    <svg aria-hidden="true" className="record-card__arrow-icon" fill="none" viewBox="0 0 24 24">
      <path
        d="M7 17 17 7m-7 0h7v7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function RecordCardContent({ description, details = [], icon, meta, title }: RecordCardBaseProps) {
  const visibleDetails = details.filter((detail) => detail.value.trim().length > 0);

  return (
    <>
      {icon || meta ? (
        <div className="record-card__header">
          {icon ? <span className="record-card__icon">{icon}</span> : <span />}
          {meta ? <span className="record-card__meta">{formatRussianText(meta)}</span> : null}
        </div>
      ) : null}
      <h3 className="card-title record-card__title">{typeof title === "string" ? formatRussianText(title) : title}</h3>
      {description ? <p className="record-card__description">{formatRussianText(description)}</p> : null}
      {visibleDetails.length > 0 ? (
        <ul className="record-card__details">
          {visibleDetails.map((detail) => (
            <li
              className={cn("record-card__detail", detail.tone === "secondary" && "record-card__detail--secondary")}
              key={`${detail.tone ?? "primary"}-${detail.value}`}
            >
              {formatRussianText(detail.value)}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

/**
 * Compact card for a structured record. Empty detail values are omitted.
 * Passing href makes the card an interactive link with a directional affordance.
 */
export function RecordCard(props: RecordCardProps) {
  if ("href" in props && props.href) {
    const { className, description, details, href, icon, meta, title, ...linkProps } = props;

    return (
      <a
        className={cn("record-card", "record-card--interactive", className)}
        href={href}
        {...linkProps}
      >
        <RecordCardContent description={description} details={details} icon={icon} meta={meta} title={title} />
        <span
          aria-hidden="true"
          className="record-card__arrow"
        >
          <ArrowUpRightIcon />
        </span>
      </a>
    );
  }

  if (isButtonRecordCard(props)) {
    const { className, description, details, icon, meta, onClick, title, ...buttonProps } = props;

    return (
      <button
        className={cn("record-card", "record-card--interactive", className)}
        onClick={onClick}
        type="button"
        {...buttonProps}
      >
        <RecordCardContent description={description} details={details} icon={icon} meta={meta} title={title} />
        <span aria-hidden="true" className="record-card__arrow">
          <ArrowUpRightIcon />
        </span>
      </button>
    );
  }

  const { className, description, details, icon, meta, title } = props;

  return (
    <article className={cn("record-card", className)}>
      <RecordCardContent description={description} details={details} icon={icon} meta={meta} title={title} />
    </article>
  );
}
