"use client";

import { useEffect } from "react";

import { COOKIE_CONSENT_EVENT, readCookieConsent } from "@/lib/cookie-consent";

const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const cookieMaxAge = 60 * 60 * 24 * 90;

function setAttributionCookie(name: string, value: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${cookieMaxAge}; Path=/; SameSite=Lax${secure}`;
}

function removeAttributionCookies() {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  for (const key of [...attributionKeys, "referrer"]) {
    document.cookie = `${key}=; Max-Age=0; Path=/; SameSite=Lax${secure}`;
  }
}

function captureAttribution() {
  const params = new URLSearchParams(window.location.search);

  for (const key of attributionKeys) {
    const value = params.get(key)?.trim();
    if (value) setAttributionCookie(key, value);
  }

  if (document.referrer) setAttributionCookie("referrer", document.referrer);
}

/** Stores non-sensitive campaign attribution for the server-side CRM adapter. */
export function MarketingAttribution() {
  useEffect(() => {
    const syncConsent = () => {
      if (readCookieConsent()?.marketing === true) captureAttribution();
      else removeAttributionCookies();
    };

    syncConsent();
    window.addEventListener(COOKIE_CONSENT_EVENT, syncConsent);

    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, syncConsent);
  }, []);

  return null;
}
