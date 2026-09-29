"use client";

import { useEffect, useRef } from "react";

type SmartCaptchaWidget = {
  destroy?: (widgetId?: string | number) => void;
  render: (
    container: HTMLElement,
    options: {
      callback?: (token: string) => void;
      hl?: string;
      sitekey: string;
    },
  ) => string | number;
  reset?: (widgetId?: string | number) => void;
};

declare global {
  interface Window {
    smartCaptcha?: SmartCaptchaWidget;
  }
}

export type SmartCaptchaProps = {
  onTokenChange: (token: string | null) => void;
  resetSignal?: number;
  siteKey?: string;
};

export function SmartCaptcha({ onTokenChange, resetSignal = 0, siteKey }: SmartCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (!siteKey || !containerRef.current) {
      onTokenChange(null);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;

    const renderWidget = () => {
      if (disposed || !containerRef.current || !window.smartCaptcha) return;

      widgetIdRef.current = window.smartCaptcha.render(containerRef.current, {
        callback: (token) => onTokenChange(token || null),
        hl: "ru",
        sitekey: siteKey,
      });
    };

    const waitForApi = () => {
      if (window.smartCaptcha) {
        renderWidget();
        return;
      }

      timeoutId = setTimeout(waitForApi, 100);
    };

    waitForApi();

    return () => {
      disposed = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (widgetIdRef.current !== null) {
        window.smartCaptcha?.destroy?.(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [onTokenChange, siteKey]);

  useEffect(() => {
    if (resetSignal === 0 || widgetIdRef.current === null) return;

    onTokenChange(null);
    window.smartCaptcha?.reset?.(widgetIdRef.current);
  }, [onTokenChange, resetSignal]);

  if (!siteKey) return null;

  return <div aria-label="Проверка безопасности формы" className="smart-captcha" ref={containerRef} />;
}
