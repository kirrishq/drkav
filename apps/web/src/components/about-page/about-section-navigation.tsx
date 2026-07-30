"use client";

import { cn } from "@drkav/ui";
import { useEffect, useId, useState } from "react";

const aboutSections = [
  { id: "about-doctor", label: "О докторе" },
  { id: "education", label: "Образование" },
  { id: "qualifications", label: "Квалификации" },
  { id: "certificates", label: "Сертификаты и дипломы" },
  { id: "awards", label: "Награды" },
  { id: "associations", label: "Ассоциации" },
  { id: "patents", label: "Патенты" },
  { id: "journal-articles", label: "Статьи в журнале" },
  { id: "theses", label: "Тезисы" },
  { id: "rating", label: "Рейтинг" },
] as const;

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("about-navigation__chevron", open && "about-navigation__chevron--open")}
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
  onNavigate,
}: {
  activeId: string;
  availableIds: ReadonlySet<string>;
  onNavigate?: () => void;
}) {
  return (
    <ul className="about-navigation__list">
      {aboutSections.map((section) => {
        const active = section.id === activeId;
        const available = availableIds.has(section.id);

        return (
          <li key={section.id}>
            {available ? (
              <a
                aria-current={active ? "location" : undefined}
                className={cn("about-navigation__link", active && "about-navigation__link--active")}
                href={`#${section.id}`}
                onClick={onNavigate}
              >
                {section.label}
              </a>
            ) : (
              <span
                aria-disabled="true"
                className="about-navigation__link about-navigation__link--disabled"
              >
                {section.label}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function AboutSectionNavigation() {
  const mobilePanelId = useId();
  const [activeId, setActiveId] = useState("about-doctor");
  const [availableIds, setAvailableIds] = useState<ReadonlySet<string>>(
    new Set(["about-doctor"]),
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeLabel = aboutSections.find((section) => section.id === activeId)?.label;

  useEffect(() => {
    const sections = aboutSections
      .map((section) => document.getElementById(section.id))
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
  }, []);

  return (
    <>
      <aside className="about-navigation__desktop">
        <nav
          aria-label="Разделы страницы «Обо мне»"
          className="about-navigation__panel"
        >
          <SectionLinks activeId={activeId} availableIds={availableIds} />
        </nav>
      </aside>

      <div className="about-navigation__mobile">
        <div
          className={cn("about-navigation__mobile-list", !mobileOpen && "about-navigation__mobile-list--hidden")}
          id={mobilePanelId}
        >
          <nav aria-label="Разделы страницы «Обо мне»">
            <SectionLinks
              activeId={activeId}
              availableIds={availableIds}
              onNavigate={() => setMobileOpen(false)}
            />
          </nav>
        </div>
        <button
          aria-controls={mobilePanelId}
          aria-expanded={mobileOpen}
          className="about-navigation__toggle"
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
