"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

const revealSelector = [
  "main > *",
  ".home-page > *",
  ".about-page__content > *",
  ".page-intro__content > :not(.before-after-modal)",
  ".content-card__grid > *",
  ".about-related-pages__grid > *",
  ".education-formats__grid > *",
  ".operations-catalog__links > *",
  ".doctor-profile__highlights > *",
  ".doctor-profile__links > *",
  ".patient-checklist__item",
  ".blog-index__grid > *",
  ".blog-article__sections > *",
  ".blog-article__related-grid > *",
  ".operations-catalog__group",
  ".promotions-catalog__card",
  ".price-catalog__item",
  ".before-after-gallery__tile",
].join(",");

const maxStaggerIndex = 8;

function isInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();

  return rect.top < window.innerHeight && rect.bottom > 0;
}

function getSiblingIndex(element: HTMLElement) {
  const siblings = element.parentElement
    ? Array.from(element.parentElement.children).filter((sibling) =>
        sibling.matches(revealSelector),
      )
    : [];

  return Math.min(Math.max(siblings.indexOf(element), 0), maxStaggerIndex);
}

function RevealObserver({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealableElements = new Set<HTMLElement>();
    const intersectionObserver =
      !reduceMotion && "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                  return;
                }

                const element = entry.target as HTMLElement;
                element.dataset.reveal = "visible";
                intersectionObserver?.unobserve(element);
              });
            },
            { threshold: 0.01 },
          )
        : null;

    function registerRevealableElements() {
      document.querySelectorAll<HTMLElement>(revealSelector).forEach((element) => {
        if (!revealableElements.has(element)) {
          revealableElements.add(element);
          element.style.setProperty(
            "--reveal-index",
            String(getSiblingIndex(element)),
          );
          element.dataset.reveal =
            reduceMotion || !intersectionObserver || isInViewport(element)
              ? "visible"
              : "pending";
        }

        if (element.dataset.reveal === "pending") {
          intersectionObserver?.observe(element);
        }
      });
    }

    let registrationFrame = 0;
    const mutationObserver = new MutationObserver(() => {
      cancelAnimationFrame(registrationFrame);
      registrationFrame = requestAnimationFrame(registerRevealableElements);
    });

    registerRevealableElements();
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(registrationFrame);
      mutationObserver.disconnect();
      intersectionObserver?.disconnect();
    };
  }, []);

  return <>{children}</>;
}

export { RevealObserver };
