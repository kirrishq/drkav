import Link from "next/link";

import { aboutPageLinks } from "./about-page-links";

export function AboutPagesNavigation({ currentHref }: { currentHref: string }) {
  return (
    <aside className="about-pages-navigation">
      <nav aria-label="Страницы раздела «Обо мне»" className="about-pages-navigation__panel">
        <Link className="type-overline about-pages-navigation__eyebrow" href="/obo-mne">
          <span aria-hidden="true" className="about-pages-navigation__back-icon">←</span>
          <span>Обо мне</span>
        </Link>
        <ul className="about-pages-navigation__list">
          {aboutPageLinks.map((page) => {
            const active = page.href === currentHref;

            return (
              <li key={page.href}>
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`about-pages-navigation__link${active ? " about-pages-navigation__link--active" : ""}`}
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
