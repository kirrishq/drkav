"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { patientNavigationPages } from "@/components/patient-related-pages/patient-related-pages";

export function PatientPagesNavigation() {
  const pathname = usePathname();

  return (
    <aside className="patient-pages-navigation">
      <nav aria-label="Страницы раздела «Пациентам»" className="patient-pages-navigation__panel">
        <Link className="type-overline patient-pages-navigation__eyebrow" href="/pacientam">
          <span aria-hidden="true" className="patient-pages-navigation__back-icon">←</span>
          <span>Пациентам</span>
        </Link>
        <ul className="patient-pages-navigation__list">
          {patientNavigationPages.map((page) => {
            const active = page.href === pathname;

            return (
              <li key={page.href}>
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`patient-pages-navigation__link${active ? " patient-pages-navigation__link--active" : ""}`}
                  href={page.href}
                >
                  {page.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
