"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "./lib/cn";
import { formatRussianText } from "./russian-typography";

export type StatsStripItem = {
  label: string;
  prefix?: string;
  suffix?: string;
  value: number;
};

export type StatsStripProps = {
  ariaLabel?: string;
  className?: string;
  items: readonly StatsStripItem[];
};

const countAnimationDuration = 1200;

function AnimatedStatValue({ item }: { item: StatsStripItem }) {
  const [currentValue, setCurrentValue] = useState(0);
  const valueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = valueRef.current;

    if (!element) {
      return;
    }

    let animationFrame = 0;
    let intersectionObserver: IntersectionObserver | null = null;
    let hasStarted = false;

    const animate = () => {
      if (hasStarted) {
        return;
      }

      hasStarted = true;
      const startedAt = performance.now();

      const tick = (timestamp: number) => {
        const progress = Math.min((timestamp - startedAt) / countAnimationDuration, 1);
        const easedProgress = 1 - (1 - progress) ** 3;

        setCurrentValue(Math.round(item.value * easedProgress));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(tick);
        } else {
          setCurrentValue(item.value);
        }
      };

      animationFrame = requestAnimationFrame(tick);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCurrentValue(item.value);
    } else if ("IntersectionObserver" in window) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            animate();
            intersectionObserver?.disconnect();
          }
        },
        { threshold: 0.35 },
      );
      intersectionObserver.observe(element);
    } else {
      animate();
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      intersectionObserver?.disconnect();
    };
  }, [item.value]);

  const accessibleValue = `${item.prefix ?? ""}${item.value}${item.suffix ?? ""}`;

  return (
    <span
      aria-label={accessibleValue}
      className="type-h2 stats-strip__value"
      ref={valueRef}
    >
      {item.prefix}
      {currentValue}
      {item.suffix}
    </span>
  );
}

/** Responsive statistics strip with viewport-triggered count-up animation. */
export function StatsStrip({ ariaLabel = "Ключевые показатели", className, items }: StatsStripProps) {
  return (
    <section aria-label={ariaLabel} className={cn("stats-strip", className)}>
      <div className="stats-strip__grid">
        {items.map((item) => (
          <div className="stats-strip__item" key={`${item.label}-${item.value}`}>
            <AnimatedStatValue item={item} />
            <p className="type-text-sm stats-strip__label">{formatRussianText(item.label)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
