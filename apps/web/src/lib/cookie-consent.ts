export const COOKIE_CONSENT_COOKIE = "drkav_cookie_consent";
export const COOKIE_CONSENT_EVENT = "drkav:cookie-consent";
export const COOKIE_SETTINGS_EVENT = "drkav:cookie-settings";
export const COOKIE_CONSENT_VERSION = "1";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

export type CookieConsent = {
  analytics: boolean;
  marketing: boolean;
  necessary: true;
  updatedAt: string;
  version: string;
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const prefix = `${name}=`;
  const value = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(prefix))
    ?.slice(prefix.length);

  if (!value) return null;

  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

export function readCookieConsent(): CookieConsent | null {
  const rawValue = getCookie(COOKIE_CONSENT_COOKIE);
  if (!rawValue) return null;

  try {
    const value = JSON.parse(rawValue) as Partial<CookieConsent>;

    if (
      value.version !== COOKIE_CONSENT_VERSION ||
      value.necessary !== true ||
      typeof value.analytics !== "boolean" ||
      typeof value.marketing !== "boolean" ||
      typeof value.updatedAt !== "string"
    ) {
      return null;
    }

    return value as CookieConsent;
  } catch {
    return null;
  }
}

export function saveCookieConsent({ analytics, marketing }: Pick<CookieConsent, "analytics" | "marketing">): CookieConsent {
  const consent: CookieConsent = {
    analytics,
    marketing,
    necessary: true,
    updatedAt: new Date().toISOString(),
    version: COOKIE_CONSENT_VERSION,
  };
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${COOKIE_CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(consent))}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent<CookieConsent>(COOKIE_CONSENT_EVENT, { detail: consent }));

  return consent;
}

export function openCookieSettings(): void {
  window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
}
