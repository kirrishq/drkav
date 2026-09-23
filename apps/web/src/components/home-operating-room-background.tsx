"use client";

import { useEffect, useRef } from "react";

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

const DOT_COLUMNS = 16;
const DOT_ROWS = 10;

function createCircleClipPath(centerX: number, centerY: number, radius: number) {
  return `circle(${radius}% at ${centerX}% ${centerY}%)`;
}

export function HomeOperatingRoomBackground() {
  const dotsRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const revealRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dots = dotsRef.current;
    const glow = glowRef.current;
    const reveal = revealRef.current;

    if (!dots || !glow || !reveal) {
      return;
    }

    const section = glow.closest(".home-hero");
    const portrait = section?.querySelector<HTMLElement>(".home-hero__portrait");
    const dotNodes = Array.from(dots.querySelectorAll<HTMLElement>(".home-hero__operating-room-dot"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
    let animationFrame: number | undefined;
    let timer: number | undefined;
    let cancelled = false;
    let pointerActive = false;
    let spotlightX = 50;
    let spotlightY = 50;

    const clearAnimation = () => {
      if (animationFrame !== undefined) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = undefined;
      }
    };

    const clearTimer = () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
        timer = undefined;
      }
    };

    const updateDots = (centerX: number, centerY: number, radius: number) => {
      dotNodes.forEach((dot, index) => {
        const column = index % DOT_COLUMNS;
        const row = Math.floor(index / DOT_COLUMNS);
        const dotX = ((column + 0.5) / DOT_COLUMNS) * 100;
        const dotY = ((row + 0.5) / DOT_ROWS) * 100;
        const distance = Math.hypot((dotX - centerX) * 0.78, dotY - centerY);
        const influence = Math.max(0, 1 - distance / (radius * 1.18));
        const scale = 0.42 + influence * 2.55;
        const opacity = 0.18 + influence * 0.7;

        dot.style.transform = `scale(${scale})`;
        dot.style.opacity = `${opacity}`;
        dot.style.backgroundColor = influence > 0.12
          ? `rgba(255, 190, 216, ${0.42 + influence * 0.46})`
          : "rgba(215, 215, 215, 0.42)";
      });
    };

    const resetDots = () => {
      dotNodes.forEach((dot) => {
        dot.style.transform = "scale(0.5)";
        dot.style.opacity = "0.2";
        dot.style.backgroundColor = "rgba(215, 215, 215, 0.42)";
      });
    };

    const applySpotlight = (centerX: number, centerY: number, radius: number) => {
      const clipPath = createCircleClipPath(centerX, centerY, radius);

      reveal.style.clipPath = clipPath;
      glow.style.setProperty("--spotlight-x", `${centerX}%`);
      glow.style.setProperty("--spotlight-y", `${centerY}%`);
      glow.style.setProperty("--spotlight-radius", `${radius}%`);
      glow.style.setProperty("--spotlight-soft-radius", `${radius * 0.45}%`);
      glow.style.setProperty("--spotlight-wide-radius", `${radius * 1.55}%`);
      updateDots(centerX, centerY, radius);
    };

    const getMobilePhotoBounds = (radius: number) => {
      if (!section || !portrait) {
        return { minX: radius, maxX: 100 - radius, minY: 58, maxY: 88 };
      }

      const sectionBounds = section.getBoundingClientRect();
      const portraitBounds = portrait.getBoundingClientRect();
      const xStart = ((portraitBounds.left - sectionBounds.left) / sectionBounds.width) * 100;
      const xEnd = ((portraitBounds.right - sectionBounds.left) / sectionBounds.width) * 100;
      const yStart = ((portraitBounds.top - sectionBounds.top) / sectionBounds.height) * 100;
      const yEnd = ((portraitBounds.bottom - sectionBounds.top) / sectionBounds.height) * 100;
      const padding = radius * 0.72;

      return {
        minX: Math.max(radius, xStart + padding),
        maxX: Math.min(100 - radius, xEnd - padding),
        minY: Math.max(radius, yStart + padding),
        maxY: Math.min(100 - radius, yEnd - padding),
      };
    };

    const hideSpotlight = () => {
      reveal.style.clipPath = "circle(0% at 50% 50%)";
      glow.style.opacity = "0";
      resetDots();
    };

    const startSpotlight = () => {
      if (cancelled || reducedMotion.matches || pointerActive) {
        return;
      }

      const radius = randomBetween(12, 17);
      const mobilePhotoBounds = getMobilePhotoBounds(radius);
      const startX = spotlightX;
      const startY = spotlightY;
      const endX = randomBetween(mobilePhotoBounds.minX, mobilePhotoBounds.maxX);
      const endY = randomBetween(mobilePhotoBounds.minY, mobilePhotoBounds.maxY);
      const duration = randomBetween(6200, 9800);
      const pause = randomBetween(1600, 3400);
      const startedAt = performance.now();

      const animate = (time: number) => {
        if (cancelled || reducedMotion.matches || pointerActive) {
          return;
        }

        const progress = Math.min(1, (time - startedAt) / duration);
        const easedProgress = progress * progress * (3 - 2 * progress);
        const centerX = startX + (endX - startX) * easedProgress;
        const centerY = startY + (endY - startY) * easedProgress;

        spotlightX = centerX;
        spotlightY = centerY;
        applySpotlight(centerX, centerY, radius);

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(animate);
        } else {
          timer = window.setTimeout(startSpotlight, pause);
        }
      };

      animationFrame = window.requestAnimationFrame(animate);
    };

    const start = () => {
      clearAnimation();
      clearTimer();
      pointerActive = false;
      if (desktopMedia.matches) {
        spotlightX = 50;
        spotlightY = 50;
      } else {
        const mobilePhotoBounds = getMobilePhotoBounds(14);
        spotlightX = (mobilePhotoBounds.minX + mobilePhotoBounds.maxX) / 2;
        spotlightY = (mobilePhotoBounds.minY + mobilePhotoBounds.maxY) / 2;
      }

      if (reducedMotion.matches) {
        glow.style.opacity = "0.18";
        applySpotlight(spotlightX, spotlightY, 14);
        return;
      }

      if (desktopMedia.matches) {
        hideSpotlight();
        return;
      }

      glow.style.opacity = "0.78";
      timer = window.setTimeout(startSpotlight, randomBetween(700, 1800));
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!desktopMedia.matches || event.pointerType !== "mouse" || !section) {
        return;
      }

      const bounds = section.getBoundingClientRect();
      const rawX = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100));
      const y = Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100));
      const x = 100 - rawX;

      pointerActive = true;
      clearAnimation();
      clearTimer();
      glow.style.opacity = "0.94";
      applySpotlight(x, y, 14);
    };

    const handlePointerLeave = () => {
      if (!desktopMedia.matches || !pointerActive) {
        return;
      }

      pointerActive = false;
      hideSpotlight();
    };

    const handlePointerMoveEvent = (event: Event) => {
      handlePointerMove(event as PointerEvent);
    };

    start();
    section?.addEventListener("pointermove", handlePointerMoveEvent);
    section?.addEventListener("pointerleave", handlePointerLeave);
    reducedMotion.addEventListener("change", start);
    desktopMedia.addEventListener("change", start);

    return () => {
      cancelled = true;
      clearAnimation();
      clearTimer();
      section?.removeEventListener("pointermove", handlePointerMoveEvent);
      section?.removeEventListener("pointerleave", handlePointerLeave);
      reducedMotion.removeEventListener("change", start);
      desktopMedia.removeEventListener("change", start);
    };
  }, []);

  return (
    <div aria-hidden="true" className="home-hero__operating-room">
      <span className="home-hero__operating-room-base" />
      <span className="home-hero__operating-room-dots" ref={dotsRef}>
        {Array.from({ length: DOT_COLUMNS * DOT_ROWS }, (_, index) => <span className="home-hero__operating-room-dot" key={index} />)}
      </span>
      <span className="home-hero__operating-room-reveal" ref={revealRef} />
      <span className="home-hero__operating-room-glow" ref={glowRef} />
    </div>
  );
}
