"use client";

import { useEffect, useId, useState } from "react";

import { cn } from "./lib/cn";

export type SectionNavigationItem = {
  id: string;
  label: string;
};

export type SectionNavigationProps = {
  ariaLabel: string;
  className?: string;
  items: readonly SectionNavigationItem[];
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("section-navigation__chevron", open && "section-navigation__chevron--open")}
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

function SectionLinks({
  activeId,
  availableIds,
  items,
  onNavigate,
}: {
  activeId: string;
  availableIds: ReadonlySet<string>;
  items: readonly SectionNavigationItem[];
  onNavigate?: () => void;
}) {
  return (
    <ul className="section-navigation__list">
      {items.map((item) => {
        const active = item.id === activeId;
        const available = availableIds.has(item.id);

        return (
          <li key={item.id}>
            {available ? (
              <a
                aria-current={active ? "location" : undefined}
                className={cn("section-navigation__link", active && "section-navigation__link--active")}
                href={`#${item.id}`}
                onClick={onNavigate}
              >
                {item.label}
              </a>
            ) : (
              <span
                aria-disabled="true"
                className="section-navigation__link section-navigation__link--disabled"
              >
                {item.label}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function SectionNavigation({ ariaLabel, className, items }: SectionNavigationProps) {
  const mobilePanelId = useId();
  const firstItemId = items[0]?.id ?? "";
  const [activeId, setActiveId] = useState(firstItemId);
  const [availableIds, setAvailableIds] = useState<ReadonlySet<string>>(new Set());
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeLabel = items.find((item) => item.id === activeId)?.label ?? items[0]?.label ?? "Содержание";

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);

    setAvailableIds(new Set(sections.map((section) => section.id)));

    function updateActiveSection() {
      const readingPosition = window.scrollY + window.innerHeight * 0.4;
      const activeSection = sections
        .filter((section) => {
          const sectionTop = section.getBoundingClientRect().top + window.scrollY;
          return sectionTop <= readingPosition;
        })
        .at(-1);

      if (activeSection) {
        setActiveId(activeSection.id);
      }
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [items]);

  return (
    <>
      <aside className={cn("section-navigation__desktop", className)}>
        <nav aria-label={ariaLabel} className="section-navigation__panel">
          <SectionLinks activeId={activeId} availableIds={availableIds} items={items} />
        </nav>
      </aside>

      <div className={cn("section-navigation__mobile", className)}>
        <div
          className={cn("section-navigation__mobile-list", !mobileOpen && "section-navigation__mobile-list--hidden")}
          id={mobilePanelId}
        >
          <nav aria-label={ariaLabel}>
            <SectionLinks
              activeId={activeId}
              availableIds={availableIds}
              items={items}
              onNavigate={() => setMobileOpen(false)}
            />
          </nav>
        </div>
        <button
          aria-controls={mobilePanelId}
          aria-expanded={mobileOpen}
          className="section-navigation__toggle"
          onClick={() => setMobileOpen((open) => !open)}
          type="button"
        >
          <span>{activeLabel}</span>
          <ChevronIcon open={mobileOpen} />
        </button>
      </div>
    </>
  );
}
