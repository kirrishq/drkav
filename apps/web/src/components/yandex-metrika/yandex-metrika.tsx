"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

import { COOKIE_CONSENT_EVENT, readCookieConsent } from "@/lib/cookie-consent";

const counterId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || "87650551";

function destructCounter() {
  if (typeof window === "undefined") return;

  const yandexMetrika = (window as Window & { ym?: (id: string, action: string) => void }).ym;
  yandexMetrika?.(counterId, "destruct");
}

export function YandexMetrika() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const syncConsent = () => {
      const nextEnabled = readCookieConsent()?.analytics === true;
      setEnabled((currentEnabled) => {
        if (currentEnabled && !nextEnabled) destructCounter();
        return nextEnabled;
      });
    };

    syncConsent();
    window.addEventListener(COOKIE_CONSENT_EVENT, syncConsent);

    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, syncConsent);
  }, []);

  if (!enabled) return null;

  return (
    <Script id="yandex-metrika" strategy="afterInteractive">
      {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${JSON.stringify(counterId)},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`}
    </Script>
  );
}
