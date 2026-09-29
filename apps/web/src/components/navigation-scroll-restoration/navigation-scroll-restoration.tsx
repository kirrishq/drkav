"use client";

import { useEffect, useRef } from "react";

const STORAGE_KEY = "drkav-scroll-positions";
const NAVIGATION_EVENT = "drkav:navigation";

type ScrollPositions = Record<string, number>;

function readPositions(): ScrollPositions {
  try {
    const value = window.sessionStorage.getItem(STORAGE_KEY);
    if (!value) return {};

    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed as ScrollPositions : {};
  } catch {
    return {};
  }
}

function savePosition(url: string, position: number) {
  try {
    const positions = readPositions();
    positions[url] = position;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {
    // Scroll restoration should never interfere with navigation when storage is unavailable.
  }
}

function getPosition(url: string): number {
  const position = readPositions()[url];
  return typeof position === "number" && Number.isFinite(position) ? position : 0;
}

function restorePosition(position: number) {
  let attempts = 0;

  const apply = () => {
    window.scrollTo({ behavior: "auto", left: 0, top: position });
    attempts += 1;

    if (attempts < 10) {
      window.requestAnimationFrame(apply);
    }
  };

  window.requestAnimationFrame(apply);
}

export function NavigationScrollRestoration() {
  const currentUrlRef = useRef("");
  const isHistoryNavigationRef = useRef(false);

  useEffect(() => {
    const { history } = window;
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    let saveFrame: number | undefined;

    history.scrollRestoration = "manual";

    const saveCurrentPosition = () => {
      if (saveFrame !== undefined) return;

      saveFrame = window.requestAnimationFrame(() => {
        saveFrame = undefined;
        savePosition(window.location.href, window.scrollY);
      });
    };

    const handleNavigation = () => {
      const nextUrl = window.location.href;

      if (nextUrl === currentUrlRef.current) return;

      const position = isHistoryNavigationRef.current ? getPosition(nextUrl) : 0;
      currentUrlRef.current = nextUrl;
      isHistoryNavigationRef.current = false;

      if (window.location.hash) return;
      restorePosition(position);
    };

    const notifyNavigation = () => {
      window.dispatchEvent(new Event(NAVIGATION_EVENT));
    };

    history.pushState = function pushState(...args) {
      originalPushState.apply(history, args);
      notifyNavigation();
    };

    history.replaceState = function replaceState(...args) {
      originalReplaceState.apply(history, args);
      notifyNavigation();
    };

    currentUrlRef.current = window.location.href;
    window.addEventListener("scroll", saveCurrentPosition, { passive: true });
    window.addEventListener("popstate", () => {
      isHistoryNavigationRef.current = true;
      handleNavigation();
    });
    window.addEventListener(NAVIGATION_EVENT, handleNavigation);

    return () => {
      if (saveFrame !== undefined) window.cancelAnimationFrame(saveFrame);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      history.scrollRestoration = "auto";
      window.removeEventListener("scroll", saveCurrentPosition);
      window.removeEventListener(NAVIGATION_EVENT, handleNavigation);
    };
  }, []);

  return null;
}
