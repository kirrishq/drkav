"use client";

import { useEffect, useState } from "react";

import { cn } from "@drkav/ui";

const navigation = [
  {
    label: "Overview",
    items: [{ id: "overview", label: "Overview" }],
  },
  {
    label: "Foundations",
    items: [
      { id: "colors", label: "Colors" },
      { id: "typography", label: "Typography" },
      { id: "heading-system", label: "Heading system" },
      { id: "spacing", label: "Spacing" },
      { id: "radii", label: "Radii" },
      { id: "shadows", label: "Shadows" },
      { id: "motion", label: "Motion" },
      { id: "focus", label: "Focus" },
    ],
  },
  {
    label: "Components",
    items: [
      { id: "button", label: "Button" },
      { id: "text-link", label: "Text Link" },
      { id: "page-intro", label: "Page Intro" },
      { id: "record-card", label: "Record Card" },
      { id: "video-highlights", label: "Video Highlights" },
      { id: "feature-link-card", label: "Feature Link Card" },
      { id: "video-card", label: "Video Card" },
      { id: "stats-strip", label: "Stats Strip" },
      { id: "final-results-slider", label: "Final Results Slider" },
      { id: "operations-cards", label: "Operations Cards" },
      { id: "administrator-cta", label: "Administrator CTA" },
      { id: "operation-hero", label: "Operation Hero" },
      { id: "promotion-banner", label: "Promotion Banner" },
      { id: "input", label: "Input" },
      { id: "checkbox", label: "Checkbox" },
      { id: "radio", label: "Radio" },
      { id: "radio-button", label: "Radio Button" },
      { id: "accordion", label: "Accordion" },
      { id: "before-after-comparison", label: "Before / After Comparison" },
      { id: "tabs", label: "Tabs" },
    ],
  },
] as const;

const sectionIds = navigation.flatMap((group) =>
  group.items.map((item) => item.id),
);

function NavigationLinks({ activeId }: { activeId: string }) {
  return (
    <nav aria-label="Design System sections">
      <ul className="space-y-6">
        {navigation.map((group) => (
          <li key={group.label}>
            <p className="type-overline mb-2 text-secondary">
              {group.label}
            </p>
            <ul className="space-y-1 border-l border-border">
              {group.items.map((item) => {
                const isActive = activeId === item.id;

                return (
                  <li key={item.id}>
                    <a
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "focus-ring type-text-sm -ml-px block rounded-r-md border-l px-3 py-1.5 transition-colors duration-fast",
                        isActive
                          ? "border-accent font-semibold text-primary"
                          : "border-transparent text-secondary hover:text-primary",
                      )}
                      href={`#${item.id}`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function DesignSystemNav() {
  const [activeId, setActiveId] = useState<string>("overview");

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visibleEntry?.target.id) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-15% 0px -70% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="mb-8 lg:hidden">
        <details className="rounded-lg border border-border bg-surface shadow-subtle">
          <summary className="focus-ring type-label cursor-pointer rounded-lg px-4 py-3 text-primary">
            Navigate design system
          </summary>
          <div className="border-t border-border px-4 py-4">
            <NavigationLinks activeId={activeId} />
          </div>
        </details>
      </div>

      <aside className="hidden lg:col-span-1 lg:block">
        <div className="sticky top-8">
          <NavigationLinks activeId={activeId} />
        </div>
      </aside>
    </>
  );
}
