"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export function UltrakorZoneOverlay({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const savedScroll = sessionStorage.getItem("ultrakor-model-return");
    const scrollY = savedScroll === null ? window.scrollY : Number(savedScroll);
    const previousOverflow = document.body.style.overflow;
    document.body.dataset.ultrakorDetail = "true";
    element.showModal();
    element.scrollTop = 0;
    document.body.style.overflow = "hidden";
    // Native dialog focus can scroll the document; keep the existing scene in view.
    window.scrollTo({ top: scrollY, behavior: "instant" });
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      window.scrollTo({ top: scrollY, behavior: "instant" });
      delete document.body.dataset.ultrakorDetail;
      requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: "instant" }));
      // Browser history restoration runs after dialog focus restoration.
      window.setTimeout(() => window.scrollTo({ top: scrollY, behavior: "instant" }), 150);
    };
  }, []);
  return <dialog className="ultrakor-zone-overlay" aria-label="Подробнее о зоне Ультракора" ref={dialog} onCancel={event => { event.preventDefault(); router.back(); }}>
    <button type="button" className="ultrakor-zone-overlay__back" onClick={() => router.back()}>← К модели</button>
    {children}
  </dialog>;
}
