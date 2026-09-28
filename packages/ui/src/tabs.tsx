"use client";

import type { ReactNode } from "react";
import { useId, useState } from "react";

import { cn } from "./lib/cn";

export type TabItem = {
  content: ReactNode;
  id: string;
  label: string;
};

export type TabsProps = {
  ariaLabel: string;
  className?: string;
  defaultTabId?: string;
  items: readonly TabItem[];
};

/** Accessible, uncontrolled tabs for switching between related compact panels. */
export function Tabs({ ariaLabel, className, defaultTabId, items }: TabsProps) {
  const instanceId = useId();
  const initialTab = items.find((item) => item.id === defaultTabId) ?? items[0];
  const [activeTabId, setActiveTabId] = useState(initialTab?.id);

  if (items.length === 0 || !activeTabId) {
    return null;
  }

  const activeItem = items.find((item) => item.id === activeTabId) ?? items[0];

  return (
    <div className={cn("tabs", className)}>
      <div aria-label={ariaLabel} className="tabs__list" role="tablist">
        {items.map((item) => {
          const selected = item.id === activeItem.id;
          const tabId = `${instanceId}-${item.id}-tab`;
          const panelId = `${instanceId}-${item.id}-panel`;

          return (
            <button
              aria-controls={panelId}
              aria-selected={selected}
              className={cn("filter-control", "tabs__tab", selected && "tabs__tab--active")}
              id={tabId}
              key={item.id}
              onClick={() => setActiveTabId(item.id)}
              onKeyDown={(event) => {
                const currentIndex = items.findIndex((candidate) => candidate.id === item.id);
                const nextIndex = event.key === "ArrowRight" ? (currentIndex + 1) % items.length : event.key === "ArrowLeft" ? (currentIndex - 1 + items.length) % items.length : event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : currentIndex;
                if (nextIndex !== currentIndex) {
                  event.preventDefault();
                  setActiveTabId(items[nextIndex].id);
                  document.getElementById(`${instanceId}-${items[nextIndex].id}-tab`)?.focus();
                }
              }}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div
        aria-labelledby={`${instanceId}-${activeItem.id}-tab`}
        className="tabs__panel"
        id={`${instanceId}-${activeItem.id}-panel`}
        role="tabpanel"
      >
        {activeItem.content}
      </div>
    </div>
  );
}
