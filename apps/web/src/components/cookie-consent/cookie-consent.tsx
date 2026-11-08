"use client";

import { Button } from "@drkav/ui";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  COOKIE_CONSENT_EVENT,
  COOKIE_SETTINGS_EVENT,
  type CookieConsent,
  openCookieSettings,
  readCookieConsent,
  saveCookieConsent,
} from "@/lib/cookie-consent";

function CookieCategory({
  checked,
  description,
  disabled = false,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  disabled?: boolean;
  label: string;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <div className="cookie-consent__category">
      <div className="cookie-consent__category-header">
        <span aria-hidden="true" className="cookie-consent__category-marker">—</span>
        <strong className="cookie-consent__category-label">{label}</strong>
        <span className="cookie-consent__category-status">
          {disabled ? "Всегда включены" : checked ? "Включены" : "Отключены"}
        </span>
        <label className="cookie-consent__switch">
          <input
            aria-label={`${label}: ${checked ? "включены" : "отключены"}`}
            checked={checked}
            disabled={disabled}
            onChange={(event) => onChange?.(event.currentTarget.checked)}
            role="switch"
            type="checkbox"
          />
          <span aria-hidden="true" className="cookie-consent__switch-track" />
        </label>
      </div>
      <p className="cookie-consent__category-description">{description}</p>
    </div>
  );
}

export function CookieSettingsButton() {
  return (
    <button className="text-link site-footer__legal-link site-footer__cookie-settings" onClick={openCookieSettings} type="button">
      Настройки cookies
    </button>
  );
}

export function CookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const storedConsent = readCookieConsent();
    setConsent(storedConsent);
    setAnalytics(storedConsent?.analytics ?? false);
    setMarketing(storedConsent?.marketing ?? false);
    setInitialized(true);

    const handleSettingsOpen = () => {
      const currentConsent = readCookieConsent();
      setConsent(currentConsent);
      setAnalytics(currentConsent?.analytics ?? false);
      setMarketing(currentConsent?.marketing ?? false);
      setSettingsOpen(true);
    };

    const handleConsentChange = (event: Event) => {
      const nextConsent = (event as CustomEvent<CookieConsent>).detail;
      setConsent(nextConsent);
      setAnalytics(nextConsent.analytics);
      setMarketing(nextConsent.marketing);
      setSettingsOpen(false);
    };

    window.addEventListener(COOKIE_SETTINGS_EVENT, handleSettingsOpen);
    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);

    return () => {
      window.removeEventListener(COOKIE_SETTINGS_EVENT, handleSettingsOpen);
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
    };
  }, []);

  if (!initialized || (consent && !settingsOpen)) return null;

  const savePreferences = () => saveCookieConsent({ analytics, marketing });

  return (
    <section aria-label="Настройки cookies" className="cookie-consent" role="dialog">
      <div className="cookie-consent__inner">
        <div className="cookie-consent__content">
          <h2 className="type-h3 cookie-consent__title">Помогите сделать сайт удобнее</h2>
          <p className="type-text-xs cookie-consent__description">
            Мы используем обязательные cookies для работы сайта. С вашего разрешения подключаем Яндекс.Метрику и сохраняем данные рекламных переходов, чтобы анализировать посещаемость и улучшать сайт. Подробности — в <Link href="/cookies" rel="noreferrer" target="_blank">политике cookies</Link>.
          </p>
        </div>

        {settingsOpen ? (
          <div className="cookie-consent__categories">
            <CookieCategory
              checked
              description="Нужны для работы сайта и сохранения выбранных настроек."
              disabled
              label="Обязательные"
            />
            <CookieCategory
              checked={analytics}
              description="Яндекс.Метрика: статистика посещаемости, карта кликов и Вебвизор."
              label="Аналитические"
              onChange={setAnalytics}
            />
            <CookieCategory
              checked={marketing}
              description="Сохранение UTM-меток и источника перехода для оценки обращений."
              label="Маркетинговые"
              onChange={setMarketing}
            />
          </div>
        ) : null}

        <div className="cookie-consent__actions">
          {settingsOpen ? (
            <>
              <Button onClick={() => saveCookieConsent({ analytics: true, marketing: true })} size="sm">
                Принять все
              </Button>
              <Button onClick={savePreferences} size="sm" variant="outline">
                Сохранить выбор
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => saveCookieConsent({ analytics: true, marketing: true })} size="sm">
                Принять все
              </Button>
              <Button onClick={() => setSettingsOpen(true)} size="sm" variant="outline">
                Настроить
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
