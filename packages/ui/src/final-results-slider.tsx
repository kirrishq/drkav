"use client";

/* eslint-disable @next/next/no-img-element -- UI package cannot depend on Next.js Image. */

import { createPortal } from "react-dom";
import { forwardRef, useEffect, useId, useImperativeHandle, useMemo, useRef, useState, type CSSProperties } from "react";

import { Button } from "./button";
import { buttonVariants } from "./button";
import { FilterChip } from "./filter-chip";
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

type FinalResultModalState = {
  item: FinalResultCard;
  origin: DOMRect;
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

const FinalResultCarousel = forwardRef<FinalResultsCarouselHandle, { items: readonly FinalResultCard[]; label: string; onOpen: (item: FinalResultCard, origin: DOMRect) => void }>(function FinalResultCarousel({ items, label, onOpen }, ref) {
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
                <button aria-label={`Открыть результат: ${item.label}`} className="focus-ring final-results-slider__card-link" onClick={(event) => onOpen(item, event.currentTarget.getBoundingClientRect())} type="button">
                  {content}
                </button>
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
  const [modal, setModal] = useState<FinalResultModalState | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [motionStyle, setMotionStyle] = useState<CSSProperties>();
  const [isMounted, setIsMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const activeItems = activeTab ? items.filter((item) => item.tabId === activeTab.id) : [];

  useEffect(() => {
    if (activeTab && activeTab.id !== activeTabId) {
      setActiveTabId(activeTab.id);
    }
  }, [activeTab, activeTabId]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!modal || !panelRef.current || isOpen || isClosing) {
      return;
    }

    const destination = panelRef.current.getBoundingClientRect();
    const scaleX = modal.origin.width / destination.width;
    const scaleY = modal.origin.height / destination.height;
    const translateX = modal.origin.left + modal.origin.width / 2 - (destination.left + destination.width / 2);
    const translateY = modal.origin.top + modal.origin.height / 2 - (destination.top + destination.height / 2);

    setMotionStyle({
      "--final-results-modal-scale-x": String(scaleX),
      "--final-results-modal-scale-y": String(scaleY),
      "--final-results-modal-translate-x": `${translateX}px`,
      "--final-results-modal-translate-y": `${translateY}px`,
    } as CSSProperties);

    const frame = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(frame);
  }, [isClosing, isOpen, modal]);

  useEffect(() => {
    if (!modal) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsClosing(true);
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modal]);

  useEffect(() => {
    if (!modal) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = originalOverflow; };
  }, [modal]);

  useEffect(() => {
    if (!isClosing) {
      return;
    }

    const timer = window.setTimeout(() => {
      setModal(null);
      setMotionStyle(undefined);
      setIsClosing(false);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [isClosing]);

  const closeModal = () => {
    setIsClosing(true);
    setIsOpen(false);
  };

  const openResult = (item: FinalResultCard, origin: DOMRect) => {
    setIsClosing(false);
    setIsOpen(false);
    setModal({ item, origin });
  };

  const navigateResult = (direction: "next" | "previous") => {
    if (!modal) {
      return;
    }

    const currentIndex = activeItems.findIndex((item) => item.id === modal.item.id);
    const nextItem = activeItems[currentIndex + (direction === "next" ? 1 : -1)];

    if (nextItem) {
      setModal({ ...modal, item: nextItem });
    }
  };

  if (!activeTab) {
    return null;
  }

  const panelId = `${instanceId}-${activeTab.id}-panel`;

  return (
    <section aria-label={ariaLabel} className={cn("final-results-slider", className)}>
      <div className="final-results-slider__header">
        <div>
          <h2 className="type-h2 final-results-slider__title">Результаты пластических операций</h2>
          <p className="type-text-base final-results-slider__description">Выберите направление и посмотрите готовые результаты</p>
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
      <div className="final-results-slider__filters">
        <div className="final-results-slider__tabs-wrap">
          <div aria-label="Навигация по направлениям операций" className="final-results-slider__tabs" role="tablist">
            {availableTabs.map((tab) => {
              const selected = tab.id === activeTab.id;
              const tabId = `${instanceId}-${tab.id}-tab`;

              return (
                <FilterChip
                  active={selected}
                  aria-controls={panelId}
                  aria-selected={selected}
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
                >
                  {tab.label}
                </FilterChip>
              );
            })}
          </div>
        </div>
      </div>
      <div aria-labelledby={`${instanceId}-${activeTab.id}-tab`} className="final-results-slider__panel" id={panelId} role="tabpanel">
        <FinalResultCarousel items={activeItems} label={activeTab.label} onOpen={openResult} ref={carouselRef} />
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
      {isMounted && modal ? createPortal(
        <div aria-modal="true" className={cn("final-results-modal", isOpen && "final-results-modal--open")} onClick={(event) => { if (event.target === event.currentTarget) closeModal(); }} role="dialog">
          <div className="final-results-modal__panel" onTransitionEnd={(event) => { if (event.propertyName === "transform" && isClosing) { setModal(null); setMotionStyle(undefined); setIsClosing(false); } }} ref={panelRef} style={motionStyle}>
            <div className="final-results-modal__close">
              <Button aria-label="Закрыть" onClick={closeModal} size="icon" variant="ghost"><CloseIcon /></Button>
            </div>
            <button aria-label="Предыдущий результат" className="final-results-modal__navigation final-results-modal__navigation--previous" disabled={activeItems.findIndex((item) => item.id === modal.item.id) <= 0} onClick={() => navigateResult("previous")} type="button"><ArrowIcon direction="left" /></button>
            <button aria-label="Следующий результат" className="final-results-modal__navigation final-results-modal__navigation--next" disabled={activeItems.findIndex((item) => item.id === modal.item.id) >= activeItems.length - 1} onClick={() => navigateResult("next")} type="button"><ArrowIcon direction="right" /></button>
            <div className="final-results-modal__media">
              <img alt={modal.item.imageAlt} className="final-results-modal__image" src={modal.item.imageSrc} />
            </div>
            <div className="final-results-modal__content">
              <p>Операция</p>
              {modal.item.href ? <a className="text-link" href={modal.item.href}>{modal.item.label}</a> : <span>{modal.item.label}</span>}
            </div>
          </div>
        </div>,
        document.body,
      ) : null}
    </section>
  );
}

function CloseIcon() {
  return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" /></svg>;
}
