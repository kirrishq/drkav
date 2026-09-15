"use client";

import type { ReactNode } from "react";
import { useState } from "react";

function EyeIcon() {
  return (
    <svg aria-hidden="true" className="portfolio-reveal__icon" fill="none" viewBox="0 0 24 24">
      <path d="M3.5 12s3.25-5 8.5-5 8.5 5 8.5 5-3.25 5-8.5 5-8.5-5-8.5-5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function PortfolioReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className={`portfolio-reveal${className ? ` ${className}` : ""}${revealed ? " portfolio-reveal--revealed" : ""}`}>
      <div className="portfolio-reveal__content">{children}</div>
      <button
        aria-label={revealed ? "Скрыть фото" : "Нажмите, чтобы увидеть фото"}
        aria-pressed={revealed}
        className="portfolio-reveal__button focus-ring"
        onClick={() => setRevealed((current) => !current)}
        type="button"
      >
        <EyeIcon />
        <span>{revealed ? "Скрыть фото" : "Нажмите, чтобы увидеть"}</span>
      </button>
    </div>
  );
}
