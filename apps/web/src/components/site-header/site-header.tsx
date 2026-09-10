"use client";

import { buttonVariants, cn, ConsultationTrigger } from "@drkav/ui";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from "react";

import {
  administratorContact,
  headerMenu,
  headerSubmenuImages,
  type HeaderMenuItem,
} from "@/components/site-header/header-config";
import { SiteLogo } from "@/components/site-header/site-logo";
import {
  getSearchResultDescription,
  getSearchResultTitle,
  searchPages,
} from "@/components/site-search/search-index";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "size-4 shrink-0 transition-transform duration-normal motion-reduce:transition-none",
        open && "rotate-180",
      )}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m7 9.5 5 5 5-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      viewBox="0 0 24 24"
    >
      {open ? (
        <path
          d="m6 6 12 12M18 6 6 18"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.75"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.75"
        />
      )}
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      viewBox="0 0 287.32 287.32"
    >
      <path
        d="M267.749,191.076c-14.595-11.729-27.983-17.431-40.93-17.431c-18.729,0-32.214,11.914-44.423,24.119c-1.404,1.405-3.104,2.06-5.349,2.06c-10.288,0.001-28.387-12.883-53.794-38.293c-29.89-29.892-41.191-48.904-33.592-56.506c20.6-20.593,27.031-41.237-4.509-80.462C73.861,10.51,62.814,3.68,51.38,3.68c-15.42,0-27.142,12.326-37.484,23.202c-1.788,1.88-3.477,3.656-5.133,5.312c-11.689,11.688-11.683,37.182,0.017,68.2c12.837,34.033,38.183,71.055,71.37,104.247c25.665,25.663,53.59,46.403,80.758,60.328c23.719,12.158,46.726,18.672,64.783,18.672c0.002,0,0.004,0,0.007,0c11.3,0,20.479-2.465,26.541-7.478c12.314-10.181,35.234-29.039,35.081-51.439C287.236,212.71,280.653,201.451,267.749,191.076z"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.7" />
      <path d="m15.5 15.5 4.2 4.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

type Theme = "light" | "dark";

function ThemeIcon({ theme }: { theme: Theme }) {
  if (theme === "dark") {
    return (
      <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
        <path
          d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 2.5v2M12 19.5v2M4.58 4.58l1.42 1.42M18 18l1.42 1.42M2.5 12h2M19.5 12h2M4.58 19.42 6 18M18 6l1.42-1.42"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function VisionIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M2.5 12s3.3-5 9.5-5 9.5 5 9.5 5-3.3 5-9.5 5-9.5-5-9.5-5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="2.25" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path d="m14.5 5-7 7 7 7M8 12h12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M7 17 17 7m-7 0h7v7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

type MessengerKind = "telegram" | "max" | "whatsapp";

const themeStorageKey = "drkav-theme";
const visionStorageKey = "drkav-low-vision";
const visionSettingsStorageKey = "drkav-low-vision-settings";

type VisionFontSize = "standard" | "large" | "extra-large";
type VisionPalette = "black-on-white" | "white-on-black" | "yellow-on-black";
type VisionLineHeight = "standard" | "large";
type VisionLetterSpacing = "standard" | "large";

type VisionSettings = {
  fontSize: VisionFontSize;
  palette: VisionPalette;
  lineHeight: VisionLineHeight;
  letterSpacing: VisionLetterSpacing;
};

const defaultVisionSettings: VisionSettings = {
  fontSize: "large",
  palette: "black-on-white",
  lineHeight: "large",
  letterSpacing: "standard",
};

function isVisionFontSize(value: string | undefined): value is VisionFontSize {
  return value === "standard" || value === "large" || value === "extra-large";
}

function isVisionPalette(value: string | undefined): value is VisionPalette {
  return value === "black-on-white" || value === "white-on-black" || value === "yellow-on-black";
}

function isVisionLineHeight(value: string | undefined): value is VisionLineHeight {
  return value === "standard" || value === "large";
}

function isVisionLetterSpacing(value: string | undefined): value is VisionLetterSpacing {
  return value === "standard" || value === "large";
}

function readVisionSettings() {
  const root = document.documentElement;

  return {
    fontSize: isVisionFontSize(root.dataset.visionFontSize)
      ? root.dataset.visionFontSize
      : defaultVisionSettings.fontSize,
    palette: isVisionPalette(root.dataset.visionPalette)
      ? root.dataset.visionPalette
      : defaultVisionSettings.palette,
    lineHeight: isVisionLineHeight(root.dataset.visionLineHeight)
      ? root.dataset.visionLineHeight
      : defaultVisionSettings.lineHeight,
    letterSpacing: isVisionLetterSpacing(root.dataset.visionLetterSpacing)
      ? root.dataset.visionLetterSpacing
      : defaultVisionSettings.letterSpacing,
  } satisfies VisionSettings;
}

function applyVisionSettings(settings: VisionSettings) {
  const root = document.documentElement;

  root.dataset.visionFontSize = settings.fontSize;
  root.dataset.visionPalette = settings.palette;
  root.dataset.visionLineHeight = settings.lineHeight;
  root.dataset.visionLetterSpacing = settings.letterSpacing;
}

function persistVisionSettings(settings: VisionSettings) {
  try {
    window.localStorage.setItem(visionSettingsStorageKey, JSON.stringify(settings));
  } catch {
    // The settings remain active for the current session when storage is unavailable.
  }
}

function ThemeToggle({ onToggle, theme }: { onToggle: () => void; theme: Theme }) {
  const nextThemeLabel = theme === "dark" ? "светлую" : "тёмную";

  return (
    <button
      aria-label={`Переключить на ${nextThemeLabel} тему`}
      aria-pressed={theme === "dark"}
      className={cn(
        buttonVariants({ size: "icon", variant: "ghost" }),
        "site-header__theme-toggle",
      )}
      onClick={onToggle}
      title={`Переключить на ${nextThemeLabel} тему`}
      type="button"
    >
      <ThemeIcon theme={theme} />
    </button>
  );
}

function VisionToggle({
  onToggle,
  enabled,
  controlsId,
  mobile = false,
  panelOpen,
}: {
  onToggle: () => void;
  enabled: boolean;
  controlsId: string;
  mobile?: boolean;
  panelOpen: boolean;
}) {
  const label = !enabled
    ? "Включить версию для слабовидящих"
    : panelOpen
      ? "Скрыть настройки версии для слабовидящих"
      : "Открыть настройки версии для слабовидящих";

  return (
    <button
      aria-label={label}
      aria-controls={enabled ? controlsId : undefined}
      aria-expanded={enabled ? panelOpen : undefined}
      aria-pressed={enabled}
      className={cn(
        buttonVariants({ size: mobile ? "sm" : "icon", variant: "ghost" }),
        "site-header__vision-toggle",
        mobile && "site-header__vision-toggle--mobile",
      )}
      onClick={onToggle}
      title={label}
      type="button"
    >
      <VisionIcon />
      {mobile ? <span>Версия для слабовидящих</span> : null}
    </button>
  );
}

function VisionSettingsPanel({
  id,
  mobile = false,
  onChange,
  onClose,
  onDisable,
  onReset,
  settings,
}: {
  id: string;
  mobile?: boolean;
  onChange: (settings: VisionSettings) => void;
  onClose: () => void;
  onDisable: () => void;
  onReset: () => void;
  settings: VisionSettings;
}) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className={cn(
        "site-header__vision-panel",
        mobile
          ? "site-header__vision-panel--mobile"
          : "site-header__vision-panel--desktop",
      )}
      id={id}
    >
      <div className="site-header__vision-panel-header">
        <div>
          <h2 className="site-header__vision-panel-title" id={`${id}-title`}>
            Настройки версии для слабовидящих
          </h2>
          <p className="site-header__vision-panel-description">
            Настройте отображение сайта под себя.
          </p>
        </div>
        <button
          aria-label="Скрыть настройки версии для слабовидящих"
          className={buttonVariants({ size: "sm", variant: "ghost" })}
          onClick={onClose}
          type="button"
        >
          Скрыть
        </button>
      </div>

      <div className="site-header__vision-controls">
        <label className="site-header__vision-control">
          <span>Размер шрифта</span>
          <select
            value={settings.fontSize}
            onChange={(event) => {
              onChange({
                ...settings,
                fontSize: event.target.value as VisionFontSize,
              });
            }}
          >
            <option value="standard">Обычный</option>
            <option value="large">Увеличенный</option>
            <option value="extra-large">Очень крупный</option>
          </select>
        </label>

        <label className="site-header__vision-control">
          <span>Цветовая схема</span>
          <select
            value={settings.palette}
            onChange={(event) => {
              onChange({
                ...settings,
                palette: event.target.value as VisionPalette,
              });
            }}
          >
            <option value="black-on-white">Чёрный текст на белом</option>
            <option value="white-on-black">Белый текст на чёрном</option>
            <option value="yellow-on-black">Жёлтый текст на чёрном</option>
          </select>
        </label>

        <label className="site-header__vision-control">
          <span>Межстрочный интервал</span>
          <select
            value={settings.lineHeight}
            onChange={(event) => {
              onChange({
                ...settings,
                lineHeight: event.target.value as VisionLineHeight,
              });
            }}
          >
            <option value="standard">Обычный</option>
            <option value="large">Увеличенный</option>
          </select>
        </label>

        <label className="site-header__vision-control">
          <span>Интервал между буквами</span>
          <select
            value={settings.letterSpacing}
            onChange={(event) => {
              onChange({
                ...settings,
                letterSpacing: event.target.value as VisionLetterSpacing,
              });
            }}
          >
            <option value="standard">Обычный</option>
            <option value="large">Увеличенный</option>
          </select>
        </label>
      </div>

      <div className="site-header__vision-panel-actions">
        <button
          className={buttonVariants({ size: "sm", variant: "outline" })}
          onClick={onReset}
          type="button"
        >
          Сбросить настройки
        </button>
        <button
          className={buttonVariants({ size: "sm", variant: "ghost" })}
          onClick={onDisable}
          type="button"
        >
          Выключить режим
        </button>
      </div>
    </section>
  );
}

function MessengerIcon({ kind }: { kind: MessengerKind }) {
  const iconId = useId().replaceAll(":", "");

  if (kind === "telegram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 240.1 240.1">
        <defs>
          <linearGradient id={`${iconId}-telegram`} x1="-838.041" x2="-838.041" y1="660.581" y2="660.3427" gradientTransform="matrix(1000 0 0 -1000 838161 660581)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2AABEE" />
            <stop offset="1" stopColor="#229ED9" />
          </linearGradient>
        </defs>
        <circle cx="120.1" cy="120.1" r="120.1" fill={`url(#${iconId}-telegram)`} />
        <path fill="#fff" d="M54.3 118.8c35-15.2 58.3-25.3 70-30.2 33.3-13.9 40.3-16.3 44.8-16.4 1 0 3.2.2 4.7 1.4 1.2 1 1.5 2.3 1.7 3.3s.4 3.1.2 4.7c-1.8 19-9.6 65.1-13.6 86.3-1.7 9-5 12-8.2 12.3-7 .6-12.3-4.6-19-9-10.6-6.9-16.5-11.2-26.8-18-11.9-7.8-4.2-12.1 2.6-19.1 1.8-1.8 32.5-29.8 33.1-32.3.1-.3.1-1.5-.6-2.1-.7-.6-1.7-.4-2.5-.2-1.1.2-17.9 11.4-50.6 33.5-4.8 3.3-9.1 4.9-13 4.8-4.3-.1-12.5-2.4-18.7-4.4-7.5-2.4-13.5-3.7-13-7.9.2-2.2 3.2-4.4 8.9-6.7Z" />
      </svg>
    );
  }

  if (kind === "whatsapp") {
    return (
      <svg aria-hidden="true" viewBox="0 0 175.216 175.552">
        <defs>
          <linearGradient id={`${iconId}-whatsapp`} x1="85.915" x2="86.535" y1="32.567" y2="137.092" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#57d163" />
            <stop offset="1" stopColor="#23b33a" />
          </linearGradient>
        </defs>
        <path fill="#b3b3b3" d="m54.532 138.45 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.523h.023c33.707 0 61.139-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.94 25.983c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.558z" />
        <path fill="#fff" d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z" />
        <path fill={`url(#${iconId}-whatsapp)`} d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929z" />
        <path fill="#fff" fillRule="evenodd" d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 1000 1000">
      <defs>
        <linearGradient id={`${iconId}-max-a`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#4cf" />
          <stop offset="0.662" stopColor="#53e" />
          <stop offset="1" stopColor="#93d" />
        </linearGradient>
        <linearGradient id={`${iconId}-max-b`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#00f" />
          <stop offset="1" stopColor="#00f" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${iconId}-max-c`} cx="0" cy="1" r="0.8">
          <stop offset="0" stopColor="#4cf" stopOpacity="0.8" />
          <stop offset="1" stopColor="#93d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="1000" fill={`url(#${iconId}-max-a)`} ry="249.681" />
      <rect width="1000" height="1000" fill={`url(#${iconId}-max-c)`} ry="249.681" />
      <path fill="#fff" fillRule="evenodd" d="M508.211 878.328c-75.007 0-109.864-10.95-170.453-54.75-38.325 49.275-159.686 87.783-164.979 21.9 0-49.456-10.95-91.248-23.36-136.873-14.782-56.21-31.572-118.807-31.572-209.508 0-216.626 177.754-379.597 388.357-379.597 210.785 0 375.947 171.001 375.947 381.604.707 207.346-166.595 376.118-373.94 377.224m3.103-571.585c-102.564-5.292-182.499 65.7-200.201 177.024-14.6 92.162 11.315 204.398 33.397 210.238 10.585 2.555 37.23-18.98 53.837-35.587a189.8 189.8 0 0 0 92.71 33.032c106.273 5.112 197.08-75.794 204.215-181.95 4.154-106.382-77.67-196.486-183.958-202.574Z" clipRule="evenodd" />
    </svg>
  );
}

function MessengerLink({
  href,
  kind,
}: {
  href: string;
  kind: MessengerKind;
}) {
  const labels: Record<MessengerKind, string> = {
    max: "Написать администратору в MAX",
    telegram: "Написать администратору в Telegram",
    whatsapp: "Написать администратору в WhatsApp",
  };

  return (
    <a
      aria-label={labels[kind]}
      className={cn(
        "site-header__messenger",
        kind === "max" && "site-header__messenger--max",
      )}
      href={href}
      rel="noreferrer"
      target="_blank"
      title={labels[kind]}
    >
      <MessengerIcon kind={kind} />
    </a>
  );
}

function SearchSuggestions({
  onNavigate,
  query,
}: {
  onNavigate: () => void;
  query: string;
}) {
  const results = searchPages(query, 6);

  if (!query.trim()) {
    return <p className="site-header__search-hint">Начните вводить запрос — результаты появятся здесь.</p>;
  }

  if (results.length === 0) {
    return <p className="site-header__search-hint">По запросу ничего не найдено.</p>;
  }

  return (
    <ul className="site-header__search-results">
      {results.map((item) => (
        <li className="site-header__search-result" key={item.route}>
          <Link className="site-header__search-result-link" href={item.route} onClick={onNavigate}>
            <span className="site-header__search-result-section">{item.section}</span>
            <span className="site-header__search-result-title">{getSearchResultTitle(item)}</span>
            <span className="site-header__search-result-description">{getSearchResultDescription(item)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function SearchPanel({
  inputId,
  mobile = false,
  onNavigate,
  onFocus,
  onQueryChange,
  query,
  showSuggestions = true,
}: {
  inputId: string;
  mobile?: boolean;
  onNavigate: () => void;
  onFocus?: () => void;
  onQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  query: string;
  showSuggestions?: boolean;
}) {
  return (
    <div className={cn("site-header__search-panel", mobile && "site-header__search-panel--mobile")}>
      <form action="/poisk" className="site-header__search-form" method="get" role="search">
        <label className="sr-only" htmlFor={inputId}>Поиск по сайту</label>
        <div className="site-header__search-input-wrap">
          <span aria-hidden="true" className="site-header__search-input-icon">
            <SearchIcon />
          </span>
          <input
            autoComplete="off"
            className="site-header__search-input"
            id={inputId}
            name="q"
            onFocus={onFocus}
            onChange={onQueryChange}
            placeholder="Например, пластика груди"
            type="search"
            value={query}
          />
        </div>
        <button
          className={buttonVariants({ size: "sm", variant: "primary" })}
          disabled={!query.trim()}
          type="submit"
        >
          Найти
        </button>
      </form>
      {showSuggestions ? <SearchSuggestions onNavigate={onNavigate} query={query} /> : null}
    </div>
  );
}

function isCurrentPath(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

function isActivePage(pathname: string, href: string) {
  return pathname.replace(/\/$/, "") === href.replace(/\/$/, "");
}

function isMenuItemSelected(
  pathname: string,
  item: HeaderMenuItem,
  activeStandaloneHref?: string,
) {
  if (item.featured) {
    return true;
  }

  if (!isCurrentPath(pathname, item.href)) {
    return false;
  }

  return !item.links || !activeStandaloneHref;
}

function DesktopSubmenu({
  item,
  pathname,
  panelId,
}: {
  item: HeaderMenuItem;
  pathname: string;
  panelId: string;
}) {
  if (!item.links) {
    return null;
  }

  return (
    <div
      aria-label={`Раздел «${item.label}»`}
      className="border-t border-border bg-surface"
      id={panelId}
    >
      <div className="site-header__submenu-grid mx-auto max-w-wide px-4 py-5 xl:px-6">
        {item.links.map((link, index) => {
          const selected = index === 0 || isCurrentPath(pathname, link.href);
          const active = isActivePage(pathname, link.href);
          const imageSrc = headerSubmenuImages[link.href] ?? headerSubmenuImages[item.href];

          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={cn(
                "site-header__submenu-card",
                !imageSrc && "site-header__submenu-card--gradient",
                index === 0 && "site-header__submenu-card--primary",
                active && "site-header__submenu-card--active",
                selected && "font-semibold",
              )}
              href={link.href}
              key={link.href}
            >
              {imageSrc ? (
                <Image
                  alt=""
                  className="site-header__submenu-card-image"
                  fill
                  sizes="(min-width: 1280px) 18vw, 24vw"
                  src={imageSrc}
                />
              ) : null}
              <span className="site-header__submenu-card-overlay" />
              <span className="site-header__submenu-card-label">{link.label}</span>
              <span aria-hidden="true" className="site-header__submenu-card-arrow">
                <ArrowIcon />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname() ?? "";
  const submenuId = useId();
  const mobileMenuId = useId();
  const searchInputId = useId();
  const mobileSearchInputId = useId();
  const desktopVisionPanelId = useId();
  const mobileVisionPanelId = useId();
  const [openMenuHref, setOpenMenuHref] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<Theme>("light");
  const [lowVision, setLowVision] = useState(false);
  const [visionPanelOpen, setVisionPanelOpen] = useState(false);
  const [visionSettings, setVisionSettings] = useState<VisionSettings>(
    defaultVisionSettings,
  );
  const mobileScrollY = useRef(0);
  const headerRef = useRef<HTMLElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const openMenu = headerMenu.find((item) => item.href === openMenuHref);
  const mobilePanelOpen = mobileOpen || searchOpen;
  const activeStandaloneHref = headerMenu.find(
    (item) => !item.links && isCurrentPath(pathname, item.href),
  )?.href;

  useEffect(() => {
    const currentTheme = document.documentElement.dataset.theme;
    const currentVision = document.documentElement.dataset.vision;

    if (currentTheme === "dark" || currentTheme === "light") {
      setTheme(currentTheme);
    }

    setVisionSettings(readVisionSettings());
    setLowVision(currentVision === "low-vision");
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenuHref(null);
    setSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setOpenMenuHref(null);
        setSearchOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    if (!openMenuHref && !searchOpen) {
      return;
    }

    function closeOnOutsidePointer(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        !headerRef.current?.contains(target) &&
        !mobileMenuRef.current?.contains(target)
      ) {
        setOpenMenuHref(null);
        setSearchOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [openMenuHref, searchOpen]);

  useEffect(() => {
    const mobilePanelOpen = mobileOpen || searchOpen;

    if (!mobilePanelOpen || !window.matchMedia("(max-width: 63.99rem)").matches) {
      return;
    }

    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyWidth = document.body.style.width;
    const originalDocumentOverflow = document.documentElement.style.overflow;
    const scrollY = mobileScrollY.current;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = originalBodyWidth;
      document.documentElement.style.overflow = originalDocumentOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [mobileOpen, searchOpen]);

  function toggleSubmenu(item: HeaderMenuItem) {
    setSearchOpen(false);
    setOpenMenuHref((current) => (current === item.href ? null : item.href));
  }

  function closeMobileMenu() {
    mobileScrollY.current = 0;
    setMobileOpen(false);
    setOpenMenuHref(null);
    setSearchOpen(false);
  }

  function toggleSearch() {
    setSearchOpen((current) => {
      const next = !current;

      if (next) {
        if (!mobilePanelOpen) {
          mobileScrollY.current = window.scrollY;
        }
        setMobileOpen(false);
        setOpenMenuHref(null);
      } else {
        mobileScrollY.current = 0;
      }

      return next;
    });
  }

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);

    try {
      window.localStorage.setItem(themeStorageKey, nextTheme);
    } catch {
      // Theme remains active for the current session when storage is unavailable.
    }
  }

  function toggleVisionPanel() {
    const root = document.documentElement;

    if (!lowVision) {
      root.dataset.vision = "low-vision";
      applyVisionSettings(visionSettings);
      setLowVision(true);
      setVisionPanelOpen(true);

      try {
        window.localStorage.setItem(visionStorageKey, "true");
      } catch {
        // The mode remains active for the current session when storage is unavailable.
      }

      persistVisionSettings(visionSettings);
      return;
    }

    setVisionPanelOpen((current) => !current);
  }

  function changeVisionSettings(nextSettings: VisionSettings) {
    setVisionSettings(nextSettings);
    applyVisionSettings(nextSettings);
    persistVisionSettings(nextSettings);
  }

  function resetVisionSettings() {
    changeVisionSettings(defaultVisionSettings);
  }

  function disableLowVision() {
    document.documentElement.removeAttribute("data-vision");
    setLowVision(false);
    setVisionPanelOpen(false);

    try {
      window.localStorage.removeItem(visionStorageKey);
    } catch {
      // The mode remains active for the current session when storage is unavailable.
    }
  }

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          mobileOpen ? "fixed inset-x-0 top-0" : "sticky top-0",
          "site-header z-40 border-b border-border bg-surface",
        )}
      >
        <div className="mx-auto max-w-wide px-4 sm:px-6">
          <div className="flex min-h-20 items-center justify-between gap-3 lg:min-h-20">
            <div className="site-header__brand">
              <SiteLogo onNavigate={closeMobileMenu} />
              <div className="site-header__brand-meta">
                <span className="site-header__descriptor">Пластический хирург, Москва</span>
                <span className="site-header__address">г. Москва, ул. Большая Очаковская, 31, этаж 1, кабинет 12</span>
              </div>
            </div>

            <div className="site-header__contacts hidden lg:flex">
              <ThemeToggle onToggle={toggleTheme} theme={theme} />
              <VisionToggle
                controlsId={desktopVisionPanelId}
                enabled={lowVision}
                onToggle={toggleVisionPanel}
                panelOpen={visionPanelOpen}
              />
              <div className="site-header__contact">
                <span className="site-header__contact-label">Клиника</span>
                <a className="site-header__contact-phone" href="tel:+74951514206">
                  +7 495 151-42-06
                </a>
              </div>
              <div className="site-header__contact">
                <span className="site-header__contact-label">Администратор</span>
                <div className="site-header__contact-row">
                  <a
                    aria-label={`Позвонить администратору: ${administratorContact.phone}`}
                    className="site-header__contact-icon"
                    href={administratorContact.telHref}
                    title={`Позвонить администратору: ${administratorContact.phone}`}
                  >
                    <PhoneIcon />
                  </a>
                  <div className="site-header__messengers">
                    <MessengerLink href={administratorContact.telegramHref} kind="telegram" />
                    <MessengerLink href={administratorContact.maxHref} kind="max" />
                    <MessengerLink href={administratorContact.whatsappHref} kind="whatsapp" />
                  </div>
                </div>
              </div>
              <ConsultationTrigger
                className={buttonVariants({ size: "sm", variant: "primary" })}
              >
                Консультация
              </ConsultationTrigger>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ConsultationTrigger
              className={cn(
                buttonVariants({ size: "sm", variant: "primary" }),
                "hidden sm:inline-flex",
              )}
            >
              Консультация
            </ConsultationTrigger>
            <ThemeToggle onToggle={toggleTheme} theme={theme} />
            <button
              aria-label="Поиск по сайту"
              aria-expanded={searchOpen}
              className={buttonVariants({ size: "icon", variant: "ghost" })}
              onClick={toggleSearch}
              title="Поиск по сайту"
              type="button"
            >
              <SearchIcon />
            </button>
            <button
              aria-controls={mobileMenuId}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
              className={buttonVariants({ size: "icon", variant: "outline" })}
              onClick={() => {
                if (!mobileOpen) {
                  mobileScrollY.current = window.scrollY;
                }

                setMobileOpen(!mobileOpen);
                setOpenMenuHref(null);
              }}
              type="button"
            >
              <MenuIcon open={mobileOpen} />
            </button>
          </div>
        </div>

        {lowVision && visionPanelOpen ? (
          <VisionSettingsPanel
            id={desktopVisionPanelId}
            onChange={changeVisionSettings}
            onClose={() => setVisionPanelOpen(false)}
            onDisable={disableLowVision}
            onReset={resetVisionSettings}
            settings={visionSettings}
          />
        ) : null}

        <nav
          aria-label="Основная навигация"
          className="hidden border-t border-border py-2 lg:block"
        >
          <div className="site-header__desktop-nav">
            <ul className="flex min-w-0 flex-1 flex-wrap items-center gap-x-5 gap-y-1">
              {headerMenu.map((item) => {
              const hasSubmenu = Boolean(item.links);
              const menuOpen = openMenuHref === item.href;
              const selected = isMenuItemSelected(
                pathname,
                item,
                activeStandaloneHref,
              );
              const itemPanelId = `${submenuId}-${item.href.replaceAll("/", "-")}`;

              return (
                <li key={item.href}>
                  {hasSubmenu ? (
                    <button
                      aria-controls={itemPanelId}
                      aria-expanded={menuOpen}
                      className={cn(
                        buttonVariants({
                          selected: !item.featured && selected,
                          size: "sm",
                          variant: "ghost",
                        }),
                        "w-fit cursor-pointer justify-start",
                        selected && !item.featured && "bg-surface-muted font-semibold",
                        item.featured && "text-accent hover:text-accent-hover",
                      )}
                      onClick={() => toggleSubmenu(item)}
                      type="button"
                    >
                      <span>{item.label}</span>
                      <ChevronIcon open={menuOpen} />
                    </button>
                  ) : (
                    <Link
                      aria-current={
                        isCurrentPath(pathname, item.href) ? "page" : undefined
                      }
                      className={cn(
                        buttonVariants({
                          selected: !item.featured && selected,
                          size: "sm",
                          variant: "ghost",
                        }),
                        "w-fit justify-start",
                        selected && !item.featured && "bg-surface-muted font-semibold",
                        item.featured && "text-accent hover:text-accent-hover",
                      )}
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
              })}
            </ul>
            <div className="site-header__desktop-search">
              <SearchPanel
                inputId={searchInputId}
                onFocus={() => setSearchOpen(true)}
                onNavigate={closeMobileMenu}
                onQueryChange={(event) => {
                  setSearchQuery(event.target.value);
                  setSearchOpen(true);
                }}
                query={searchQuery}
                showSuggestions={searchOpen}
              />
            </div>
          </div>
          </nav>
        </div>

        <div className="absolute inset-x-0 top-full z-50 hidden shadow-subtle lg:block">
          {openMenu ? (
            <DesktopSubmenu
              item={openMenu}
              panelId={`${submenuId}-${openMenu.href.replaceAll("/", "-")}`}
              pathname={pathname}
            />
          ) : null}
        </div>
      </header>

      <div
        ref={mobileMenuRef}
        className={cn(
          "fixed inset-x-0 bottom-0 top-20 z-50 overflow-y-auto border-t border-border bg-surface lg:hidden",
          mobilePanelOpen ? "block" : "hidden",
        )}
        id={mobileMenuId}
      >
        <div className="mx-auto max-w-wide px-4 py-4 sm:px-6">
          {searchOpen ? (
            <SearchPanel
              inputId={mobileSearchInputId}
              mobile
              onNavigate={closeMobileMenu}
              onQueryChange={(event) => setSearchQuery(event.target.value)}
              query={searchQuery}
            />
          ) : (
            <>
              <div className="site-header__mobile-identity">
                <span className="site-header__address">г. Москва, ул. Большая Очаковская, 31, этаж 1, кабинет 12</span>
              </div>
              <div className="site-header__mobile-actions sm:hidden">
            <div className="site-header__mobile-contact">
              <div>
                <span className="site-header__contact-label">Администратор</span>
                <div className="site-header__contact-row">
                  <div className="site-header__messengers">
                    <MessengerLink href={administratorContact.telegramHref} kind="telegram" />
                    <MessengerLink href={administratorContact.maxHref} kind="max" />
                    <MessengerLink href={administratorContact.whatsappHref} kind="whatsapp" />
                  </div>
                </div>
              </div>
            </div>
            <ConsultationTrigger
              className={buttonVariants({ size: "sm", variant: "primary" })}
              onClick={closeMobileMenu}
            >
              Консультация
            </ConsultationTrigger>
              </div>

              <div className="site-header__mobile-vision">
                <VisionToggle
                  controlsId={mobileVisionPanelId}
                  enabled={lowVision}
                  mobile
                  onToggle={toggleVisionPanel}
                  panelOpen={visionPanelOpen}
                />
              </div>
              {lowVision && visionPanelOpen ? (
                <VisionSettingsPanel
                  id={mobileVisionPanelId}
                  mobile
                  onChange={changeVisionSettings}
                  onClose={() => setVisionPanelOpen(false)}
                  onDisable={disableLowVision}
                  onReset={resetVisionSettings}
                  settings={visionSettings}
                />
              ) : null}

              <nav aria-label="Мобильная навигация" className="mt-3 sm:mt-0">
            {openMenu?.links ? (
              <div className="site-header__mobile-submenu-page" id={`${submenuId}-mobile-submenu`}>
                <button
                  aria-label="Вернуться к разделам меню"
                  className={cn(buttonVariants({ size: "sm", variant: "ghost" }), "w-fit justify-start")}
                  onClick={() => setOpenMenuHref(null)}
                  type="button"
                >
                  <BackIcon />
                  <span>Назад</span>
                </button>
                <h2 className="site-header__mobile-submenu-title">{openMenu.label}</h2>
                <ul className="site-header__mobile-submenu-grid" aria-label={`Подразделы: ${openMenu.label}`}>
                  {openMenu.links.map((link, index) => {
                    const active = isActivePage(pathname, link.href);
                    const imageSrc = headerSubmenuImages[link.href] ?? headerSubmenuImages[openMenu.href];

                    return (
                      <li
                        className={cn(
                          "site-header__mobile-menu-item",
                          index === 0 && "site-header__mobile-submenu-item--primary",
                        )}
                        key={link.href}
                        style={{ "--menu-index": index } as CSSProperties}
                      >
                        <Link
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "site-header__mobile-submenu-card",
                            !imageSrc && "site-header__mobile-submenu-card--gradient",
                            index === 0 && "site-header__mobile-submenu-card--primary",
                            active && "site-header__mobile-submenu-card--active",
                          )}
                          href={link.href}
                          onClick={closeMobileMenu}
                        >
                          {imageSrc ? (
                            <Image
                              alt=""
                              className="site-header__mobile-submenu-card-image"
                              fill
                              sizes="(min-width: 40rem) 180px, 45vw"
                              src={imageSrc}
                            />
                          ) : null}
                          <span className="site-header__mobile-submenu-card-overlay" />
                          <span className="site-header__mobile-submenu-card-label">{link.label}</span>
                          <span aria-hidden="true" className="site-header__mobile-submenu-card-arrow">
                            <ArrowIcon />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <ul className="space-y-2">
                {headerMenu.map((item, index) => {
                  const hasSubmenu = Boolean(item.links);
                  const selected = isMenuItemSelected(pathname, item, activeStandaloneHref);
                  const itemPanelId = `${submenuId}-mobile-${item.href.replaceAll("/", "-")}`;
                  const itemStyle = { "--menu-index": index } as CSSProperties;

                  return (
                    <li className="site-header__mobile-menu-item" key={item.href} style={itemStyle}>
                      {hasSubmenu ? (
                        <button
                          aria-controls={itemPanelId}
                          aria-expanded={false}
                          className={cn(
                            buttonVariants({
                              selected: !item.featured && selected,
                              size: "md",
                              variant: "ghost",
                            }),
                            "w-fit cursor-pointer justify-start",
                            selected && !item.featured && "bg-surface-muted font-semibold",
                            item.featured && "text-accent hover:text-accent-hover",
                          )}
                          onClick={() => toggleSubmenu(item)}
                          type="button"
                        >
                          <span>{item.label}</span>
                          <ChevronIcon open={false} />
                        </button>
                      ) : (
                        <Link
                          aria-current={isCurrentPath(pathname, item.href) ? "page" : undefined}
                          className={cn(
                            buttonVariants({
                              selected: !item.featured && selected,
                              size: "md",
                              variant: "ghost",
                            }),
                            "w-fit justify-start",
                            selected && !item.featured && "bg-surface-muted font-semibold",
                            item.featured && "text-accent hover:text-accent-hover",
                          )}
                          href={item.href}
                          onClick={closeMobileMenu}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
              </nav>
            </>
          )}
        </div>
      </div>
    </>
  );
}
