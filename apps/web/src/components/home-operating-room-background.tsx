"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

const DOT_COLUMNS = 16;
const DOT_ROWS = 10;

function createCircleClipPath(centerX: number, centerY: number, radius: number) {
  return `circle(${radius}% at ${centerX}% ${centerY}%)`;
}

export function HomeOperatingRoomBackground() {
  const dotsRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const revealRef = useRef<HTMLImageElement>(null);
  const [backgroundRequested, setBackgroundRequested] = useState(false);

  useEffect(() => {
    let delayId: number | undefined;
    let idleId: number | undefined;
    let cancelled = false;

    const requestBackground = () => {
      if (cancelled) {
        return;
      }

      const loadBackground = () => {
        if (cancelled) {
          return;
        }

        setBackgroundRequested(true);
      };

      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(loadBackground, { timeout: 3500 });
      } else {
        loadBackground();
      }
    };

    const scheduleBackground = () => {
      // Keep the secondary hero layer out of the LCP window. The portrait,
      // text, and primary actions should settle before this decorative image
      // competes for bandwidth and becomes the largest paint candidate.
      const delay = window.matchMedia("(max-width: 39.99rem)").matches ? 5000 : 3000;
      delayId = window.setTimeout(requestBackground, delay);
    };

    if (document.readyState === "complete") {
      scheduleBackground();
    } else {
      window.addEventListener("load", scheduleBackground, { once: true });
    }

    return () => {
      cancelled = true;
      if (delayId !== undefined) {
        window.clearTimeout(delayId);
      }
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      window.removeEventListener("load", scheduleBackground);
    };
  }, []);

  useEffect(() => {
    if (!backgroundRequested) {
      return;
    }

    const dots = dotsRef.current;
    const glow = glowRef.current ?? dots?.closest(".home-hero")?.querySelector<HTMLElement>(".home-hero__operating-room-glow");

    if (!dots || !glow) {
      return;
    }

    const section = glow.closest(".home-hero");
    const reveal = revealRef.current ?? section?.querySelector<HTMLImageElement>(".home-hero__operating-room-reveal");

    const portrait = section?.querySelector<HTMLElement>(".home-hero__portrait");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
    let animationFrame: number | undefined;
    let timer: number | undefined;
    let cancelled = false;
    let pointerActive = false;
    let pageReady = false;
    let spotlightX = 50;
    let spotlightY = 50;
    let spotlightRadius = 0;
    let sectionBounds = section?.getBoundingClientRect();
    let dotsSize = { width: 0, height: 0 };
    let pointerFrame: number | undefined;
    let pendingPointer: { x: number; y: number } | undefined;

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

    const resizeDots = (width: number, height: number) => {
      dotsSize = { width, height };
    };

    const drawDots = (centerX: number, centerY: number, radius: number) => {
      if (!dotsSize.width || !dotsSize.height) {
        return;
      }

      const { width, height } = dotsSize;
      const baseRadiusX = (2 / width) * 100;
      const baseRadiusY = (2 / height) * 100;

      const dotNodes = Array.from(dots.querySelectorAll<SVGEllipseElement>("ellipse"));

      dotNodes.forEach((dot, index) => {
        const column = index % DOT_COLUMNS;
        const row = Math.floor(index / DOT_COLUMNS);
        const dotX = ((column + 0.5) / DOT_COLUMNS) * 100;
        const dotY = ((row + 0.5) / DOT_ROWS) * 100;
        const distance = radius > 0 ? Math.hypot((dotX - centerX) * 0.78, dotY - centerY) : Infinity;
        const influence = radius > 0 ? Math.max(0, 1 - distance / (radius * 1.18)) : 0;
        const scale = 0.42 + influence * 2.55;
        const opacity = 0.18 + influence * 0.7;

        dot.setAttribute("rx", `${baseRadiusX * scale}`);
        dot.setAttribute("ry", `${baseRadiusY * scale}`);
        dot.setAttribute("opacity", `${opacity}`);
        dot.setAttribute("fill", influence > 0.12
          ? `rgba(255, 190, 216, ${0.42 + influence * 0.46})`
          : "rgba(215, 215, 215, 0.42)");
      });
    };

    const initialDotsBounds = dots.getBoundingClientRect();
    resizeDots(initialDotsBounds.width, initialDotsBounds.height);

    const resizeObserver = section ? new ResizeObserver(() => {
      sectionBounds = section.getBoundingClientRect();
      resizeDots(sectionBounds.width, sectionBounds.height);
      drawDots(spotlightX, spotlightY, spotlightRadius);
    }) : undefined;

    if (section && resizeObserver) {
      resizeObserver.observe(section);
    }

    const applySpotlight = (centerX: number, centerY: number, radius: number) => {
      const clipPath = createCircleClipPath(centerX, centerY, radius);

      reveal?.style.setProperty("clip-path", clipPath);
      glow.style.setProperty("--spotlight-x", `${centerX}%`);
      glow.style.setProperty("--spotlight-y", `${centerY}%`);
      glow.style.setProperty("--spotlight-radius", `${radius}%`);
      glow.style.setProperty("--spotlight-soft-radius", `${radius * 0.45}%`);
      glow.style.setProperty("--spotlight-wide-radius", `${radius * 1.55}%`);
      spotlightRadius = radius;
      drawDots(centerX, centerY, radius);
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
      reveal?.style.setProperty("clip-path", "circle(0% at 50% 50%)");
      glow.style.opacity = "0";
      spotlightRadius = 0;
      drawDots(50, 50, 0);
    };

    const startSpotlight = () => {
      if (!pageReady || cancelled || reducedMotion.matches || pointerActive) {
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

      if (!pageReady) {
        hideSpotlight();
        return;
      }

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
      if (!pageReady || !desktopMedia.matches || event.pointerType !== "mouse" || !section) {
        return;
      }

      if (!sectionBounds) {
        return;
      }

      const rawX = Math.max(0, Math.min(100, ((event.clientX - sectionBounds.left) / sectionBounds.width) * 100));
      const y = Math.max(0, Math.min(100, ((event.clientY - sectionBounds.top) / sectionBounds.height) * 100));
      const x = 100 - rawX;

      pointerActive = true;
      clearAnimation();
      clearTimer();
      glow.style.opacity = "0.94";
      pendingPointer = { x, y };

      if (pointerFrame === undefined) {
        pointerFrame = window.requestAnimationFrame(() => {
          pointerFrame = undefined;
          if (pendingPointer) {
            applySpotlight(pendingPointer.x, pendingPointer.y, 14);
            pendingPointer = undefined;
          }
        });
      }
    };

    const handlePointerLeave = () => {
      if (!desktopMedia.matches || !pointerActive) {
        return;
      }

      pointerActive = false;
      pendingPointer = undefined;
      if (pointerFrame !== undefined) {
        window.cancelAnimationFrame(pointerFrame);
        pointerFrame = undefined;
      }
      hideSpotlight();
    };

    const handlePointerMoveEvent = (event: Event) => {
      handlePointerMove(event as PointerEvent);
    };

    hideSpotlight();
    section?.addEventListener("pointermove", handlePointerMoveEvent);
    section?.addEventListener("pointerleave", handlePointerLeave);
    reducedMotion.addEventListener("change", start);
    desktopMedia.addEventListener("change", start);

    const handlePageLoad = () => {
      window.setTimeout(() => {
        if (cancelled) {
          return;
        }

        pageReady = true;
        start();
      }, 250);
    };

    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad, { once: true });
    }

    return () => {
      cancelled = true;
      clearAnimation();
      clearTimer();
      if (pointerFrame !== undefined) {
        window.cancelAnimationFrame(pointerFrame);
      }
      resizeObserver?.disconnect();
      window.removeEventListener("load", handlePageLoad);
      section?.removeEventListener("pointermove", handlePointerMoveEvent);
      section?.removeEventListener("pointerleave", handlePointerLeave);
      reducedMotion.removeEventListener("change", start);
      desktopMedia.removeEventListener("change", start);
    };
  }, [backgroundRequested]);

  return (
    <div aria-hidden="true" className="home-hero__operating-room">
      <svg
        aria-hidden="true"
        className="home-hero__operating-room-dots"
        preserveAspectRatio="none"
        ref={dotsRef}
        viewBox="0 0 100 100"
      >
        {Array.from({ length: DOT_COLUMNS * DOT_ROWS }, (_, index) => {
          const column = index % DOT_COLUMNS;
          const row = Math.floor(index / DOT_COLUMNS);

          return (
            <ellipse
              cx={((column + 0.5) / DOT_COLUMNS) * 100}
              cy={((row + 0.5) / DOT_ROWS) * 100}
              fill="rgba(215, 215, 215, 0.42)"
              key={index}
              opacity="0.2"
              rx="0.2"
              ry="0.2"
            />
          );
        })}
      </svg>
      {backgroundRequested ? (
        <>
          <Image
            alt=""
            className="home-hero__operating-room-base"
            fetchPriority="low"
            fill
            loading="lazy"
            sizes="100vw"
            src="/images/home/operating-room-bw.webp"
          />
          <Image
            alt=""
            className="home-hero__operating-room-reveal"
            fetchPriority="low"
            fill
            loading="lazy"
            sizes="100vw"
            src="/images/home/operating-room-bw.webp"
            ref={revealRef}
          />
        </>
      ) : null}
      <span className="home-hero__operating-room-glow" ref={glowRef} />
    </div>
  );
}
