"use client";

/* eslint-disable @next/next/no-img-element -- UI package cannot depend on Next.js Image. */

import { useEffect, useId, useRef, useState } from "react";

import { Button, buttonVariants } from "./button";
import { cn } from "./lib/cn";

export type ReviewSliderItem = {
  id: string;
  imageAlt: string;
  imageSrc: string;
  label: string;
  source: string;
  text: string;
};

export type ReviewsSliderProps = {
  ariaLabel?: string;
  className?: string;
  ctaHref?: string;
  ctaLabel?: string;
  description?: string;
  items: readonly ReviewSliderItem[];
  title?: string;
};

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden="true" className="reviews-slider__arrow-icon" fill="none" viewBox="0 0 20 20">
      <path
        d={direction === "left" ? "m11.75 5-5 5 5 5" : "m8.25 5 5 5-5 5"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function DialogArrowIcon({ direction }: { direction: "next" | "previous" }) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d={direction === "next" ? "m9 5 7 7-7 7" : "m15 5-7 7 7 7"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="reviews-slider__close-icon" fill="none" viewBox="0 0 24 24">
      <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
    </svg>
  );
}

function ReviewDialog({
  item,
  initialScrollY,
  items,
  onClose,
  onSelect,
}: {
  item: ReviewSliderItem;
  initialScrollY: number;
  items: readonly ReviewSliderItem[];
  onClose: () => void;
  onSelect: (item: ReviewSliderItem) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const currentIndex = Math.max(0, items.findIndex((candidate) => candidate.id === item.id));

  const selectRelativeReview = (direction: "next" | "previous") => {
    if (items.length < 2) {
      return;
    }

    const offset = direction === "next" ? 1 : -1;
    const nextIndex = (currentIndex + offset + items.length) % items.length;
    onSelect(items[nextIndex]);
  };

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    const scrollY = initialScrollY;
    const body = document.body;
    const html = document.documentElement;
    const previousBodyStyles = {
      left: body.style.left,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
      position: body.style.position,
      right: body.style.right,
      top: body.style.top,
      width: body.style.width,
    };
    const previousHtmlStyles = {
      overflow: html.style.overflow,
      scrollBehavior: html.style.scrollBehavior,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    html.style.scrollBehavior = "auto";
    dialog.showModal();
    window.scrollTo(0, scrollY);

    return () => {
      if (dialog.open) {
        dialog.close();
      }

      body.style.left = previousBodyStyles.left;
      body.style.overflow = previousBodyStyles.overflow;
      body.style.paddingRight = previousBodyStyles.paddingRight;
      body.style.position = previousBodyStyles.position;
      body.style.right = previousBodyStyles.right;
      body.style.top = previousBodyStyles.top;
      body.style.width = previousBodyStyles.width;
      html.style.overflow = previousHtmlStyles.overflow;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      html.style.scrollBehavior = previousHtmlStyles.scrollBehavior;
    };
  }, [initialScrollY]);

  return (
    <dialog
      aria-labelledby={`${titleId}-title`}
      className="reviews-slider__dialog"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          selectRelativeReview("previous");
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          selectRelativeReview("next");
        }
      }}
      ref={dialogRef}
    >
      <div className="reviews-slider__dialog-content">
        <div className="reviews-slider__dialog-header">
          <div>
            <p className="type-text-xs reviews-slider__dialog-source">{item.source}</p>
            <h2 className="type-h3 reviews-slider__dialog-title" id={`${titleId}-title`}>{item.label}</h2>
          </div>
          <button aria-label="Закрыть отзыв" className="reviews-slider__close focus-ring" onClick={onClose} type="button">
            <CloseIcon />
          </button>
        </div>
        <button aria-label="Предыдущий отзыв" className="reviews-slider__navigation reviews-slider__navigation--previous focus-ring" onClick={() => selectRelativeReview("previous")} type="button">
          <DialogArrowIcon direction="previous" />
        </button>
        <button aria-label="Следующий отзыв" className="reviews-slider__navigation reviews-slider__navigation--next focus-ring" onClick={() => selectRelativeReview("next")} type="button">
          <DialogArrowIcon direction="next" />
        </button>
        <img alt={item.imageAlt} className="reviews-slider__dialog-image" src={item.imageSrc} />
        <p className="type-text-sm reviews-slider__dialog-counter">{currentIndex + 1} из {items.length}</p>
        <p className="type-text-base reviews-slider__dialog-text">{item.text}</p>
      </div>
    </dialog>
  );
}

/** A compact homepage review carousel with full review dialogs. */
export function ReviewsSlider({
  ariaLabel = "Отзывы пациентов",
  className,
  ctaHref,
  ctaLabel = "Все отзывы",
  description = "Реальные впечатления пациентов о результате и сопровождении после операции.",
  items,
  title = "Отзывы пациентов",
}: ReviewsSliderProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const selectedScrollYRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<ReviewSliderItem | null>(null);

  const openReview = (item: ReviewSliderItem) => {
    selectedScrollYRef.current = window.scrollY;
    setSelectedItem(item);
  };

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const updateActiveIndex = () => {
      const cards = Array.from(viewport.querySelectorAll<HTMLElement>(".reviews-slider__card"));

      if (cards.length === 0) {
        return;
      }

      const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
      const closestIndex = cards.reduce((closest, card, index) => {
        const closestDistance = Math.abs(cards[closest].offsetLeft + cards[closest].offsetWidth / 2 - viewportCenter);
        const cardDistance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - viewportCenter);

        return cardDistance < closestDistance ? index : closest;
      }, 0);

      setActiveIndex(closestIndex);
    };

    viewport.addEventListener("scroll", updateActiveIndex, { passive: true });

    return () => viewport.removeEventListener("scroll", updateActiveIndex);
  }, [items]);

  const scroll = (direction: "left" | "right") => {
    viewportRef.current?.scrollBy({
      behavior: "smooth",
      left: direction === "left" ? -viewportRef.current.clientWidth * 0.82 : viewportRef.current.clientWidth * 0.82,
    });
  };

  const scrollToCard = (index: number) => {
    const viewport = viewportRef.current;
    const card = viewport?.querySelectorAll<HTMLElement>(".reviews-slider__card")[index];

    if (!viewport || !card) {
      return;
    }

    viewport.scrollTo({ behavior: "smooth", left: card.offsetLeft });
    setActiveIndex(index);
  };

  return (
    <section aria-label={ariaLabel} className={cn("reviews-slider", className)}>
      <div className="reviews-slider__header">
        <div>
          <h2 className="type-h2 reviews-slider__title">{title}</h2>
          <p className="type-text-base reviews-slider__description">{description}</p>
        </div>
        <div className="reviews-slider__controls">
          <Button aria-label="Предыдущие отзывы" className="reviews-slider__arrow" onClick={() => scroll("left")} size="icon" variant="outline">
            <ArrowIcon direction="left" />
          </Button>
          <Button aria-label="Следующие отзывы" className="reviews-slider__arrow" onClick={() => scroll("right")} size="icon" variant="outline">
            <ArrowIcon direction="right" />
          </Button>
        </div>
      </div>
      <div className="reviews-slider__viewport" ref={viewportRef}>
        <ul className="reviews-slider__track">
          {items.map((item) => (
            <li className="reviews-slider__card" key={item.id}>
              <button
                aria-haspopup="dialog"
                aria-label={`Открыть отзыв: ${item.label}`}
                className="reviews-slider__card-button focus-ring"
                onClick={() => openReview(item)}
                type="button"
              >
                <img alt={item.imageAlt} className="reviews-slider__image" loading="lazy" src={item.imageSrc} />
                <span className="reviews-slider__card-content">
                  <span className="type-text-xs reviews-slider__source">{item.source}</span>
                  <span className="type-h4 reviews-slider__card-label">{item.label}</span>
                  <span className="type-text-sm reviews-slider__excerpt">{item.text}</span>
                  <span className="reviews-slider__read-more">Читать полностью</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div aria-label="Навигация по отзывам" className="reviews-slider__dots">
        {items.map((item, index) => (
          <button
            aria-current={activeIndex === index ? "true" : undefined}
            aria-label={`Перейти к отзыву ${index + 1}: ${item.label}`}
            className={cn("reviews-slider__dot", activeIndex === index && "reviews-slider__dot--active")}
            key={item.id}
            onClick={() => scrollToCard(index)}
            type="button"
          />
        ))}
      </div>
      <div className="reviews-slider__footer">
        <span className="type-display reviews-slider__summary">{items.length}+</span>
        <p className="type-text-base reviews-slider__summary-label">историй пациентов</p>
        {ctaHref ? <a className={buttonVariants({ size: "sm", variant: "outline" })} href={ctaHref}>{ctaLabel}</a> : null}
      </div>
      {selectedItem ? <ReviewDialog initialScrollY={selectedScrollYRef.current} item={selectedItem} items={items} onClose={() => setSelectedItem(null)} onSelect={setSelectedItem} /> : null}
    </section>
  );
}
