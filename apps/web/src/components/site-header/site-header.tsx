"use client";

import { buttonVariants, cn } from "@drkav/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

import {
  headerMenu,
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

function isCurrentPath(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
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
      <div className="mx-auto grid max-w-wide grid-cols-4 gap-2 px-4 py-5 xl:grid-cols-5 xl:px-6">
        {item.links.map((link, index) => {
          const selected = index === 0 || isCurrentPath(pathname, link.href);

          return (
            <Link
              aria-current={isCurrentPath(pathname, link.href) ? "page" : undefined}
              className={cn(
                buttonVariants({
                  selected: index === 0,
                  size: "sm",
                  variant: "outline",
                }),
                "min-h-12 justify-start whitespace-normal px-4 text-left",
                selected && "font-semibold",
              )}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const submenuId = useId();
  const mobileMenuId = useId();
  const [openMenuHref, setOpenMenuHref] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const openMenu = headerMenu.find((item) => item.href === openMenuHref);

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

  function toggleSubmenu(item: HeaderMenuItem) {
    setOpenMenuHref((current) => (current === item.href ? null : item.href));
  }

  function closeMobileMenu() {
    setMobileOpen(false);
    setOpenMenuHref(null);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto max-w-wide px-4 sm:px-6">
        <div className="flex min-h-16 items-center justify-between gap-3 lg:min-h-20">
          <SiteLogo onNavigate={closeMobileMenu} />

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              className={buttonVariants({ size: "sm", variant: "secondary" })}
              href="tel:+74951514206"
            >
              +7 495 151-42-06
            </Link>
            <Link
              className={cn(
                buttonVariants({ size: "sm", variant: "secondary" }),
                "h-10 flex-col items-start gap-0 px-3 text-left leading-none",
              )}
              href="tel:+79256255510"
            >
              <span className="text-[0.625rem] font-normal text-secondary">
                Администратор
              </span>
              <span>+7 925 625-55-10</span>
            </Link>
            <Link
              className={buttonVariants({ size: "sm", variant: "primary" })}
              href="/konsultaciya"
            >
              Консультация
            </Link>
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
            <Link
              className={cn(
                buttonVariants({ size: "sm", variant: "primary" }),
                "hidden sm:inline-flex",
              )}
              href="/konsultaciya"
            >
              Консультация
            </Link>
            <button
              aria-controls={mobileMenuId}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
              className={buttonVariants({ size: "icon", variant: "outline" })}
              onClick={() => {
                setMobileOpen((current) => !current);
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
          <ul className="grid grid-cols-8 gap-2">
            {headerMenu.map((item) => {
              const hasSubmenu = Boolean(item.links);
              const menuOpen = openMenuHref === item.href;
              const selected =
                item.featured || isCurrentPath(pathname, item.href);
              const itemPanelId = `${submenuId}-${item.href.replaceAll("/", "-")}`;

              return (
                <li key={item.href}>
                  {hasSubmenu ? (
                    <button
                      aria-controls={itemPanelId}
                      aria-expanded={menuOpen}
                      className={cn(
                        buttonVariants({
                          selected,
                          size: "sm",
                          variant: "outline",
                        }),
                        "w-full justify-between px-3",
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
                          selected,
                          size: "sm",
                          variant: "outline",
                        }),
                        "w-full",
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

      <div className="hidden lg:block">
        {openMenu ? (
          <DesktopSubmenu
            item={openMenu}
            panelId={`${submenuId}-${openMenu.href.replaceAll("/", "-")}`}
            pathname={pathname}
          />
        ) : null}
      </div>

      <div
        className={cn(
          "border-t border-border bg-surface lg:hidden",
          mobileOpen ? "block" : "hidden",
        )}
        id={mobileMenuId}
      >
        <div className="mx-auto max-w-wide px-4 py-4 sm:px-6">
          <div className="grid grid-cols-2 gap-2 sm:hidden">
            <Link
              className={buttonVariants({ size: "sm", variant: "secondary" })}
              href="tel:+79256255510"
            >
              Администратор
            </Link>
            <Link
              className={buttonVariants({ size: "sm", variant: "primary" })}
              href="/konsultaciya"
              onClick={closeMobileMenu}
            >
              Консультация
            </Link>
          </div>

          <nav aria-label="Мобильная навигация" className="mt-3 sm:mt-0">
            <ul className="space-y-2">
              {headerMenu.map((item) => {
                const hasSubmenu = Boolean(item.links);
                const menuOpen = openMenuHref === item.href;
                const selected =
                  item.featured || isCurrentPath(pathname, item.href);
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
                              selected,
                              size: "md",
                              variant: "outline",
                            }),
                            "w-full justify-between",
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
                            {item.links.map((link, index) => (
                              <li key={link.href}>
                                <Link
                                  aria-current={
                                    isCurrentPath(pathname, link.href)
                                      ? "page"
                                      : undefined
                                  }
                                  className={cn(
                                    buttonVariants({
                                      selected: index === 0,
                                      size: "sm",
                                      variant: "outline",
                                    }),
                                    "h-auto min-h-10 w-full justify-start whitespace-normal py-2 text-left",
                                  )}
                                  href={link.href}
                                  onClick={closeMobileMenu}
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
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
                            selected,
                            size: "md",
                            variant: "outline",
                          }),
                          "w-full justify-start",
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
    </header>
  );
}
