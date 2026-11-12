"use client";

import { useEffect, useState } from "react";

export function UltrakorBackToTop() {
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motionMedia.matches);
    let frame = 0;
    const updateVisibility = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setVisible(window.scrollY > window.innerHeight * 0.9);
      });
    };

    updateMotion();
    updateVisibility();
    motionMedia.addEventListener("change", updateMotion);
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      motionMedia.removeEventListener("change", updateMotion);
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      aria-label="Вернуться наверх"
      className="ultrakor-back-to-top"
      onClick={() => window.scrollTo({ top: 0, left: 0, behavior: reducedMotion ? "auto" : "smooth" })}
      type="button"
    >
      <svg aria-hidden="true" fill="none" viewBox="0 0 16 16">
        <path d="M3 9.5 8 4.5l5 5M8 5v6.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    </button>
  );
}
