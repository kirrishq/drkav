"use client";

import { buttonVariants, cn, ConsultationTrigger } from "@drkav/ui";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import {
  administratorContact,
  headerMenu,
  headerSubmenuImages,
  type HeaderMenuItem,
} from "@/components/site-header/header-config";
import { SiteLogo } from "@/components/site-header/site-logo";

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
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M8.3 3.5 10 7.4 7.9 9a14 14 0 0 0 7.1 7.1l1.6-2.1 3.9 1.7v3a1.8 1.8 0 0 1-1.8 1.8A15.2 15.2 0 0 1 3.5 5.3 1.8 1.8 0 0 1 5.3 3.5h3Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

type MessengerKind = "telegram" | "max" | "whatsapp";

function MessengerIcon({ kind }: { kind: MessengerKind }) {
  if (kind === "telegram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="m20.7 4.2-2.9 15.1c-.2 1.1-.8 1.4-1.7.9l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.4-.1-.6-.6-.2L5.6 13.1.9 11.6c-1-.3-1-1 .2-1.5L19.4 3c.8-.3 1.5.2 1.3 1.2Z" />
      </svg>
    );
  }

  if (kind === "whatsapp") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.9L3.5 20.5l4.2-1.1A8.5 8.5 0 1 0 12 3.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8.7 8.2c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.7c.1.3.1.5-.1.7l-.5.6c.6 1.1 1.4 1.8 2.5 2.4l.6-.6c.2-.2.4-.2.7-.1l1.6.8c.3.1.4.3.3.6-.2.8-.8 1.4-1.5 1.5-1.1.2-2.8-.5-4.4-2.1-1.5-1.5-2.2-3.2-2-4.3.1-.5.4-.9.9-1.2Z" fill="currentColor" />
      </svg>
    );
  }

  return <span aria-hidden="true" className="site-header__max-mark">M</span>;
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
      className="site-header__messenger"
      href={href}
      rel="noreferrer"
      target="_blank"
      title={labels[kind]}
    >
      <MessengerIcon kind={kind} />
    </a>
  );
}

function isCurrentPath(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
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
          const imageSrc = headerSubmenuImages[link.href] ?? headerSubmenuImages[item.href];

          return (
            <Link
              aria-current={isCurrentPath(pathname, link.href) ? "page" : undefined}
              className={cn("site-header__submenu-card", index === 0 && "site-header__submenu-card--primary", selected && "font-semibold")}
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
  const [openMenuHref, setOpenMenuHref] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileScrollY = useRef(0);
  const headerRef = useRef<HTMLElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const openMenu = headerMenu.find((item) => item.href === openMenuHref);
  const activeStandaloneHref = headerMenu.find(
    (item) => !item.links && isCurrentPath(pathname, item.href),
  )?.href;

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenuHref(null);
  }, [pathname]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setOpenMenuHref(null);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    if (!openMenuHref) {
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
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [openMenuHref]);

  useEffect(() => {
    if (!mobileOpen) {
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
  }, [mobileOpen]);

  function toggleSubmenu(item: HeaderMenuItem) {
    setOpenMenuHref((current) => (current === item.href ? null : item.href));
  }

  function closeMobileMenu() {
    mobileScrollY.current = 0;
    setMobileOpen(false);
    setOpenMenuHref(null);
  }

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          mobileOpen ? "fixed inset-x-0 top-0" : "sticky top-0",
          "z-40 border-b border-border bg-surface",
        )}
      >
        <div className="mx-auto max-w-wide px-4 sm:px-6">
          <div className="flex min-h-16 items-center justify-between gap-3 lg:min-h-20">
            <div className="site-header__brand">
              <SiteLogo onNavigate={closeMobileMenu} />
              <div className="site-header__brand-meta">
                <span className="site-header__descriptor">Пластический хирург, Москва</span>
                <span className="site-header__address">г. Москва, ул. Большая Очаковская, 31</span>
              </div>
            </div>

            <div className="site-header__contacts hidden lg:flex">
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
            <Link
              aria-label="Позвонить: +7 495 151-42-06"
              className={cn(
                buttonVariants({ size: "icon", variant: "secondary" }),
                "sm:hidden",
              )}
              href="tel:+74951514206"
            >
              <PhoneIcon />
            </Link>
            <Link
              className={cn(
                buttonVariants({ size: "sm", variant: "secondary" }),
                "hidden sm:inline-flex",
              )}
              href="tel:+74951514206"
            >
              +7 495 151-42-06
            </Link>
            <ConsultationTrigger
              className={cn(
                buttonVariants({ size: "sm", variant: "primary" }),
                "hidden sm:inline-flex",
              )}
            >
              Консультация
            </ConsultationTrigger>
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

        <nav
          aria-label="Основная навигация"
          className="hidden border-t border-border py-2 lg:block"
        >
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
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
          "fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto border-t border-border bg-surface lg:hidden",
          mobileOpen ? "block" : "hidden",
        )}
        id={mobileMenuId}
      >
        <div className="mx-auto max-w-wide px-4 py-4 sm:px-6">
          <div className="site-header__mobile-identity">
            <span className="site-header__descriptor">Пластический хирург, Москва</span>
            <span className="site-header__address">г. Москва, ул. Большая Очаковская, 31</span>
          </div>
          <div className="site-header__mobile-actions sm:hidden">
            <div className="site-header__mobile-contact">
              <div>
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
            </div>
            <ConsultationTrigger
              className={buttonVariants({ size: "sm", variant: "primary" })}
              onClick={closeMobileMenu}
            >
              Консультация
            </ConsultationTrigger>
          </div>

          <nav aria-label="Мобильная навигация" className="mt-3 sm:mt-0">
            <ul className="space-y-2">
              {headerMenu.map((item) => {
                const hasSubmenu = Boolean(item.links);
                const menuOpen = openMenuHref === item.href;
                const selected = isMenuItemSelected(
                  pathname,
                  item,
                  activeStandaloneHref,
                );
                const itemPanelId = `${submenuId}-mobile-${item.href.replaceAll("/", "-")}`;

                return (
                  <li key={item.href}>
                    {hasSubmenu ? (
                      <>
                        <button
                          aria-controls={itemPanelId}
                          aria-expanded={menuOpen}
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
                          <ChevronIcon open={menuOpen} />
                        </button>
                        {menuOpen && item.links ? (
                          <ul
                            className="mt-2 space-y-1 border-l-2 border-accent-soft pl-3"
                            id={itemPanelId}
                          >
                            {item.links.map((link, index) => {
                              const imageSrc =
                                headerSubmenuImages[link.href] ??
                                headerSubmenuImages[item.href];

                              return (
                                <li key={link.href}>
                                  <Link
                                    aria-current={
                                      isCurrentPath(pathname, link.href)
                                        ? "page"
                                        : undefined
                                    }
                                    className={cn(
                                      "site-header__mobile-submenu-card",
                                      index === 0 &&
                                        "site-header__mobile-submenu-card--primary",
                                    )}
                                    href={link.href}
                                    onClick={closeMobileMenu}
                                  >
                                    {imageSrc ? (
                                      <Image
                                        alt=""
                                        className="site-header__mobile-submenu-card-image"
                                        fill
                                        sizes="96px"
                                        src={imageSrc}
                                      />
                                    ) : null}
                                    <span className="site-header__mobile-submenu-card-overlay" />
                                    <span className="site-header__mobile-submenu-card-label">
                                      {link.label}
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        ) : null}
                      </>
                    ) : (
                      <Link
                        aria-current={
                          isCurrentPath(pathname, item.href) ? "page" : undefined
                        }
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
          </nav>
        </div>
      </div>
    </>
  );
}
