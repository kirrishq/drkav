"use client";
/* eslint-disable @next/next/no-img-element -- UI package cannot depend on Next.js Image. */

import { useState } from "react";

import { cn } from "./lib/cn";

export type BeforeAfterComparisonProps = {
  afterAlt: string;
  afterImage: string;
  beforeAlt: string;
  beforeImage: string;
  className?: string;
};

/** Touch-friendly image comparison control for paired before/after images. */
export function BeforeAfterComparison({ afterAlt, afterImage, beforeAlt, beforeImage, className }: BeforeAfterComparisonProps) {
  const [position, setPosition] = useState(50);

  return (
    <div className={cn("before-after-comparison", className)}>
      <img alt={afterAlt} className="before-after-comparison__image" src={afterImage} />
      <div className="before-after-comparison__before" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <img alt={beforeAlt} className="before-after-comparison__image" src={beforeImage} />
      </div>
      <span aria-hidden="true" className="before-after-comparison__divider" style={{ left: `${position}%` }}>
        <span className="before-after-comparison__handle">↔</span>
      </span>
      <input aria-label="Сравнить изображения до и после" className="before-after-comparison__range" max="100" min="0" onChange={(event) => setPosition(Number(event.target.value))} type="range" value={position} />
    </div>
  );
}
