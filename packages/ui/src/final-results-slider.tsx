"use client";

/* eslint-disable @next/next/no-img-element -- UI package cannot depend on Next.js Image. */

import { forwardRef, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from "react";

import { Button } from "./button";
import { buttonVariants } from "./button";
import { cn } from "./lib/cn";

export type FinalResultsTab = {
  id: string;
  label: string;
};

export type FinalResultCard = {
  href?: string;
  id: string;
  imageAlt: string;
  imageSrc: string;
  label: string;
  tabId: string;
};

export type FinalResultsLink = {
  href: string;
  label: string;
};

export type FinalResultsSliderProps = {
  ariaLabel?: string;
  className?: string;
  items: readonly FinalResultCard[];
  links?: readonly FinalResultsLink[];
  summaryLabel?: string;
  summaryValue?: string;
  tabs: readonly FinalResultsTab[];
};

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden="true" className="final-results-slider__arrow-icon" fill="none" viewBox="0 0 20 20">
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

export type FinalResultsCarouselHandle = {
  scroll: (direction: "left" | "right") => void;
};

const FinalResultCarousel = forwardRef<FinalResultsCarouselHandle, { items: readonly FinalResultCard[]; label: string }>(function FinalResultCarousel({ items, label }, ref) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    viewport.scrollTo({ behavior: "auto", left: 0 });
    setActiveIndex(0);

    const updateActiveIndex = () => {
      const cards = Array.from(viewport.querySelectorAll<HTMLElement>(".final-results-slider__card"));

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
  }, [items, label]);

  const scroll = (direction: "left" | "right") => {
    viewportRef.current?.scrollBy({
      behavior: "smooth",
      left: direction === "left" ? -viewportRef.current.clientWidth * 0.82 : viewportRef.current.clientWidth * 0.82,
    });
  };

  useImperativeHandle(ref, () => ({ scroll }), []);

  const scrollToCard = (index: number) => {
    const viewport = viewportRef.current;
    const card = viewport?.querySelectorAll<HTMLElement>(".final-results-slider__card")[index];

    if (!viewport || !card) {
      return;
    }

    viewport.scrollTo({ behavior: "smooth", left: card.offsetLeft });
    setActiveIndex(index);
  };

  return (
    <div aria-label={`Результаты: ${label}`} className="final-results-slider__carousel" role="region">
      <div className="final-results-slider__viewport" ref={viewportRef}>
        <ul className="final-results-slider__track">
          {items.map((item) => {
            const content = (
              <>
                <img alt={item.imageAlt} className="final-results-slider__image" loading="lazy" src={item.imageSrc} />
                <span className="final-results-slider__card-label">{item.label}</span>
              </>
            );

            return (
              <li className="final-results-slider__card" key={item.id}>
                {item.href ? (
                  <a aria-label={`Открыть результат: ${item.label}`} className="focus-ring final-results-slider__card-link" href={item.href}>
                    {content}
                  </a>
                ) : (
                  <div className="final-results-slider__card-link">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div aria-label="Навигация по слайдам" className="final-results-slider__dots">
        {items.map((item, index) => (
          <button
            aria-current={activeIndex === index ? "true" : undefined}
            aria-label={`Перейти к результату ${index + 1}: ${item.label}`}
            className={cn("final-results-slider__dot", activeIndex === index && "final-results-slider__dot--active")}
            key={item.id}
            onClick={() => scrollToCard(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
});

/** Reusable category tabs and horizontal carousel for curated final results. */
export function FinalResultsSlider({
  ariaLabel = "Результаты пластических операций",
  className,
  items,
  links = [],
  summaryLabel = "подробных примеров:",
  summaryValue = "1000+",
  tabs,
}: FinalResultsSliderProps) {
  const instanceId = useId();
  const carouselRef = useRef<FinalResultsCarouselHandle>(null);
  const availableTabs = useMemo(
    () => tabs.filter((tab) => items.some((item) => item.tabId === tab.id)),
    [items, tabs],
  );
  const [activeTabId, setActiveTabId] = useState(availableTabs[0]?.id);
  const activeTab = availableTabs.find((tab) => tab.id === activeTabId) ?? availableTabs[0];

  useEffect(() => {
    if (activeTab && activeTab.id !== activeTabId) {
      setActiveTabId(activeTab.id);
    }
  }, [activeTab, activeTabId]);

  if (!activeTab) {
    return null;
  }

  const activeItems = items.filter((item) => item.tabId === activeTab.id);
  const panelId = `${instanceId}-${activeTab.id}-panel`;

  return (
    <section aria-label={ariaLabel} className={cn("final-results-slider", className)}>
      <div className="final-results-slider__header">
        <div>
          <h2 className="type-h2 final-results-slider__title">Результаты пластических операций</h2>
          <p className="type-text-base final-results-slider__description">Выберите направление и посмотрите готовые результаты</p>
        </div>
        <div className="final-results-slider__filters">
          <div className="final-results-slider__tabs-wrap">
            <div aria-label="Навигация по направлениям операций" className="final-results-slider__tabs" role="tablist">
              {availableTabs.map((tab) => {
                const selected = tab.id === activeTab.id;
                const tabId = `${instanceId}-${tab.id}-tab`;

                return (
                  <button
                    aria-controls={panelId}
                    aria-selected={selected}
                    className={cn("final-results-slider__tab", selected && "final-results-slider__tab--active")}
                    id={tabId}
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    onKeyDown={(event) => {
                      const currentIndex = availableTabs.findIndex((candidate) => candidate.id === tab.id);
                      const nextIndex = event.key === "ArrowRight"
                        ? (currentIndex + 1) % availableTabs.length
                        : event.key === "ArrowLeft"
                          ? (currentIndex - 1 + availableTabs.length) % availableTabs.length
                          : event.key === "Home"
                            ? 0
                            : event.key === "End"
                              ? availableTabs.length - 1
                              : currentIndex;

                      if (nextIndex !== currentIndex) {
                        event.preventDefault();
                        setActiveTabId(availableTabs[nextIndex].id);
                        document.getElementById(`${instanceId}-${availableTabs[nextIndex].id}-tab`)?.focus();
                      }
                    }}
                    role="tab"
                    tabIndex={selected ? 0 : -1}
                    type="button"
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="final-results-slider__carousel-controls">
            <Button aria-label="Предыдущие результаты" className="final-results-slider__arrow" onClick={() => carouselRef.current?.scroll("left")} size="icon" variant="outline">
              <ArrowIcon direction="left" />
            </Button>
            <Button aria-label="Следующие результаты" className="final-results-slider__arrow" onClick={() => carouselRef.current?.scroll("right")} size="icon" variant="outline">
              <ArrowIcon direction="right" />
            </Button>
          </div>
        </div>
      </div>
      <div aria-labelledby={`${instanceId}-${activeTab.id}-tab`} className="final-results-slider__panel" id={panelId} role="tabpanel">
        <FinalResultCarousel items={activeItems} label={activeTab.label} ref={carouselRef} />
      </div>
      <div className="final-results-slider__summary">
        <span className="type-display final-results-slider__summary-value">{summaryValue}</span>
        <p className="type-text-base final-results-slider__summary-label">{summaryLabel}</p>
        {links.length > 0 ? (
          <div className="final-results-slider__links">
            {links.map((link) => (
              <a className={buttonVariants({ size: "sm", variant: "outline" })} href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
