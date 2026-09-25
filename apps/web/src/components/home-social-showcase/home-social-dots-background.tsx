"use client";

import { useEffect, useRef } from "react";

const DOT_COLUMNS = 18;
const DOT_ROWS = 10;
const WAVE_DIRECTIONS = ["left-to-right", "bottom-to-top", "right-to-left", "top-to-bottom"] as const;

type WaveDirection = (typeof WAVE_DIRECTIONS)[number];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function HomeSocialDotsBackground() {
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dotsRoot = dotsRef.current;

    if (!dotsRoot) {
      return;
    }

    const dotNodes = Array.from(dotsRoot.querySelectorAll<HTMLElement>(".home-social-showcase__dot")).map((node) => ({
      column: Number(node.dataset.column),
      node,
      row: Number(node.dataset.row),
    }));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame: number | undefined;
    let timer: number | undefined;
    let directionIndex = 0;
    let cancelled = false;

    const clearScheduledWork = () => {
      if (animationFrame !== undefined) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = undefined;
      }
      if (timer !== undefined) {
        window.clearTimeout(timer);
        timer = undefined;
      }
    };

    const resetDots = () => {
      dotNodes.forEach(({ node }) => {
        node.style.opacity = "0.16";
        node.style.transform = "scale(0.72)";
        node.style.backgroundColor = "rgba(195, 198, 207, 0.42)";
      });
    };

    const updateWave = (direction: WaveDirection, progress: number) => {
      const center = progress * 1.28 - 0.14;
      const width = 0.075;

      dotNodes.forEach(({ column, node, row }) => {
        const x = (column + 0.5) / DOT_COLUMNS;
        const y = (row + 0.5) / DOT_ROWS;
        const coordinate = direction === "left-to-right" || direction === "right-to-left" ? x : 1 - y;
        const normalizedCoordinate = direction === "right-to-left" || direction === "top-to-bottom" ? 1 - coordinate : coordinate;
        const distance = Math.abs(normalizedCoordinate - center);
        const influence = Math.exp(-(distance * distance) / (2 * width * width));
        const scale = 0.72 + influence * 1.38;
        const opacity = 0.16 + influence * 0.68;

        node.style.opacity = `${opacity}`;
        node.style.transform = `scale(${scale})`;
        node.style.backgroundColor = influence > 0.08
          ? `rgba(236, 57, 157, ${0.35 + influence * 0.55})`
          : "rgba(195, 198, 207, 0.42)";
      });
    };

    const startWave = () => {
      if (cancelled || reducedMotion.matches) {
        return;
      }

      const direction = WAVE_DIRECTIONS[directionIndex % WAVE_DIRECTIONS.length];
      directionIndex += 1;
      const duration = randomBetween(6200, 8500);
      const pause = randomBetween(1200, 2400);
      const startedAt = performance.now();

      const animate = (time: number) => {
        if (cancelled || reducedMotion.matches) {
          return;
        }

        const progress = Math.min(1, (time - startedAt) / duration);
        const easedProgress = progress * progress * (3 - 2 * progress);
        updateWave(direction, easedProgress);

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(animate);
        } else {
          timer = window.setTimeout(startWave, pause);
        }
      };

      animationFrame = window.requestAnimationFrame(animate);
    };

    const handleMotionPreferenceChange = () => {
      clearScheduledWork();
      resetDots();
      if (!reducedMotion.matches) {
        timer = window.setTimeout(startWave, 600);
      }
    };

    resetDots();
    if (!reducedMotion.matches) {
      timer = window.setTimeout(startWave, 900);
    }
    reducedMotion.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      cancelled = true;
      clearScheduledWork();
      reducedMotion.removeEventListener("change", handleMotionPreferenceChange);
    };
  }, []);

  return (
    <div aria-hidden="true" className="home-social-showcase__dots" ref={dotsRef}>
      {Array.from({ length: DOT_COLUMNS * DOT_ROWS }, (_, index) => {
        const column = index % DOT_COLUMNS;
        const row = Math.floor(index / DOT_COLUMNS);

        return <span className="home-social-showcase__dot" data-column={column} data-row={row} key={index} />;
      })}
    </div>
  );
}
