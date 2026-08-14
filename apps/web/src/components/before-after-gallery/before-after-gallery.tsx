"use client";

import type { BeforeAfterCase } from "@drkav/content-contracts";
import { BeforeAfterComparison, Button } from "@drkav/ui";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

type ModalState = { item: BeforeAfterCase; origin: DOMRect };

function CloseIcon() {
  return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" /></svg>;
}

function ArrowIcon({ direction }: { direction: "next" | "previous" }) {
  return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><path d={direction === "next" ? "m9 5 7 7-7 7" : "m15 5-7 7 7 7"} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" /></svg>;
}

export function BeforeAfterGallery({ items }: { items: readonly BeforeAfterCase[] }) {
  const [modal, setModal] = useState<ModalState | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [motionStyle, setMotionStyle] = useState<CSSProperties>();
  const [viewedSlugs, setViewedSlugs] = useState<ReadonlySet<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(12);
  const [isMounted, setIsMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const markViewed = useCallback((slug: string) => {
    setViewedSlugs((current) => {
      const next = new Set(current).add(slug);
      window.sessionStorage.setItem("before-after-viewed", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const navigateCase = useCallback((direction: "next" | "previous") => {
    if (!modal) return;
    const currentIndex = items.findIndex((item) => item.slug === modal.item.slug);
    const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    const nextItem = items[nextIndex];
    if (!nextItem) return;
    markViewed(nextItem.slug);
    setModal({ ...modal, item: nextItem });
  }, [items, markViewed, modal]);

  const closeModal = useCallback(() => {
    setIsClosing(true);
    setIsOpen(false);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!modal || !panelRef.current || isOpen || isClosing) return;
    setIsClosing(false);
    const destination = panelRef.current.getBoundingClientRect();
    const scaleX = modal.origin.width / destination.width;
    const scaleY = modal.origin.height / destination.height;
    const translateX = modal.origin.left + modal.origin.width / 2 - (destination.left + destination.width / 2);
    const translateY = modal.origin.top + modal.origin.height / 2 - (destination.top + destination.height / 2);
    setMotionStyle({ "--before-after-scale-x": String(scaleX), "--before-after-scale-y": String(scaleY), "--before-after-translate-x": `${translateX}px`, "--before-after-translate-y": `${translateY}px` } as CSSProperties);
    const frame = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(frame);
  }, [isClosing, isOpen, modal]);

  useEffect(() => {
    if (!modal) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
        return;
      }

      if (event.target instanceof HTMLInputElement && event.target.type === "range") return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigateCase("previous");
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        navigateCase("next");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modal, navigateCase, closeModal]);

  useEffect(() => {
    if (!modal) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = originalOverflow; };
  }, [modal]);

  useEffect(() => {
    if (!isClosing) return;
    const timer = window.setTimeout(() => {
      setModal(null);
      setMotionStyle(undefined);
      setIsClosing(false);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [isClosing]);

  useEffect(() => {
    const stored = window.sessionStorage.getItem("before-after-viewed");
    if (stored) setViewedSlugs(new Set(JSON.parse(stored) as string[]));
  }, []);

  function openCase(item: BeforeAfterCase, origin: DOMRect) {
    markViewed(item.slug);
    setIsOpen(false);
    setModal({ item, origin });
  }

  function finishClosing() {
    if (!isClosing) return;
    setModal(null);
    setMotionStyle(undefined);
    setIsClosing(false);
  }

  const currentIndex = modal ? items.findIndex((item) => item.slug === modal.item.slug) : -1;
  const visibleItems = items.slice(0, visibleCount);

  return <>
    <div className="before-after-gallery">{visibleItems.map((item) => <button aria-label={`Открыть сравнение: ${item.title}`} className={`before-after-gallery__tile${viewedSlugs.has(item.slug) ? " before-after-gallery__tile--viewed" : ""}`} key={item.slug} onClick={(event) => openCase(item, event.currentTarget.getBoundingClientRect())} type="button"><Image alt="" className="before-after-gallery__after" fill sizes="(min-width: 64rem) 25vw, (min-width: 48rem) 33vw, 50vw" src={item.afterImage.url} /><span className="before-after-gallery__before"><Image alt="" className="before-after-gallery__after" fill sizes="(min-width: 64rem) 25vw, (min-width: 48rem) 33vw, 50vw" src={item.beforeImage.url} /></span><span className="before-after-gallery__label">{item.operation.heading}</span>{viewedSlugs.has(item.slug) ? <span className="before-after-gallery__viewed">Просмотрено</span> : null}</button>)}</div>
    {visibleCount < items.length ? <div className="before-after-gallery__more"><Button onClick={() => setVisibleCount((count) => count + 12)} variant="outline">Показать ещё</Button></div> : null}
    {isMounted && modal ? createPortal(<div aria-modal="true" className={`before-after-modal${isOpen ? " before-after-modal--open" : ""}`} onClick={(event) => { if (event.target === event.currentTarget) closeModal(); }} role="dialog">
      <div className="before-after-modal__panel" onTransitionEnd={(event) => { if (event.propertyName === "transform") finishClosing(); }} ref={panelRef} style={motionStyle}>
        <div className="before-after-modal__close">
          <Button aria-label="Закрыть" onClick={closeModal} size="icon" variant="ghost"><CloseIcon /></Button>
        </div>
        <button aria-label="Предыдущий кейс" className="before-after-modal__navigation before-after-modal__navigation--previous" disabled={currentIndex <= 0} onClick={() => navigateCase("previous")} type="button"><ArrowIcon direction="previous" /></button>
        <button aria-label="Следующий кейс" className="before-after-modal__navigation before-after-modal__navigation--next" disabled={currentIndex >= items.length - 1} onClick={() => navigateCase("next")} type="button"><ArrowIcon direction="next" /></button>
        <BeforeAfterComparison afterAlt={`После: ${modal.item.title}`} afterImage={modal.item.afterImage.url} beforeAlt={`До: ${modal.item.title}`} beforeImage={modal.item.beforeImage.url} key={modal.item.slug} />
        <div className="before-after-modal__content"><p>Операция</p><Link className="text-link" href={modal.item.operation.canonicalPath}>{modal.item.operation.heading}</Link></div>
      </div>
    </div>, document.body) : null}
  </>;
}
