"use client";

/* eslint-disable @next/next/no-img-element -- UI package cannot depend on Next.js Image. */

import { useEffect, useId, useRef, useState } from "react";

import { buttonVariants } from "./button";
import { cn } from "./lib/cn";
import { ArrowUpRightIcon } from "./record-card";

export type OperationsCardLink = {
  href: string;
  label: string;
};

export type OperationsCardItem = {
  id: string;
  imageAlt: string;
  imageSrc?: string;
  links: readonly OperationsCardLink[];
  title: string;
};

export type OperationsCardsProps = {
  ariaLabel?: string;
  className?: string;
  consultationHref?: string;
  items: readonly OperationsCardItem[];
};

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="operations-cards__close-icon" fill="none" viewBox="0 0 24 24">
      <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
    </svg>
  );
}

function OperationsDialog({
  consultationHref,
  item,
  onClose,
}: {
  consultationHref: string;
  item: OperationsCardItem;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    dialog.showModal();

    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, []);

  return (
    <dialog
      aria-labelledby={titleId}
      className="operations-cards__dialog"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      ref={dialogRef}
    >
      <div className="operations-cards__dialog-content">
        <div className="operations-cards__dialog-header">
          <h2 className="type-h3 operations-cards__dialog-title" id={titleId}>{item.title}</h2>
          <button aria-label="Закрыть список операций" className="operations-cards__close focus-ring" onClick={onClose} type="button">
            <CloseIcon />
          </button>
        </div>
        <div className="operations-cards__dialog-links">
          {item.links.map((link) => (
            <a className="operations-cards__dialog-link" href={link.href} key={link.href}>
              <span>{link.label}</span>
              <span aria-hidden="true" className="operations-cards__arrow">
                <ArrowUpRightIcon />
              </span>
            </a>
          ))}
        </div>
        <a className={buttonVariants({ size: "md", variant: "primary" })} href={consultationHref}>
          Консультация
        </a>
      </div>
    </dialog>
  );
}

/** Responsive operation category cards with an accessible operation-list dialog. */
export function OperationsCards({
  ariaLabel = "Операции",
  className,
  consultationHref = "/konsultaciya",
  items,
}: OperationsCardsProps) {
  const [activeItem, setActiveItem] = useState<OperationsCardItem | null>(null);

  return (
    <section aria-label={ariaLabel} className={cn("operations-cards", className)}>
      <div className="operations-cards__intro">
        <h2 className="type-h2 operations-cards__title">Операции</h2>
        <p className="type-text-base operations-cards__description">Операции любой сложности</p>
      </div>
      <div className="operations-cards__grid">
        {items.map((item) => (
          <button
            aria-haspopup="dialog"
            className="focus-ring operations-cards__card"
            key={item.id}
            onClick={() => setActiveItem(item)}
            type="button"
          >
            {item.imageSrc ? <img alt="" className="operations-cards__image" src={item.imageSrc} /> : null}
            <span aria-hidden="true" className="operations-cards__scrim" />
            <span className="operations-cards__card-title">{item.title}</span>
            <span aria-hidden="true" className="operations-cards__arrow operations-cards__card-arrow">
              <ArrowUpRightIcon />
            </span>
          </button>
        ))}
      </div>
      {activeItem ? <OperationsDialog consultationHref={consultationHref} item={activeItem} onClose={() => setActiveItem(null)} /> : null}
    </section>
  );
}
