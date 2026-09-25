import { RecordCard } from "@drkav/ui";

import { aboutPageLinks } from "@/components/about-page/about-page-links";

export function AboutRelatedPages({ currentHref }: { currentHref: string }) {
  const currentIndex = aboutPageLinks.findIndex((page) => page.href === currentHref);

  if (currentIndex < 0) {
    return null;
  }

  const previousPage = aboutPageLinks.at((currentIndex - 1 + aboutPageLinks.length) % aboutPageLinks.length);
  const nextPage = aboutPageLinks.at((currentIndex + 1) % aboutPageLinks.length);
  const adjacentPages = [previousPage, nextPage].filter((page): page is (typeof aboutPageLinks)[number] => page !== undefined);

  return (
    <section aria-labelledby="about-related-pages-title" className="about-related-pages">
      <h2 className="type-h2 about-related-pages__title" id="about-related-pages-title">Больше о докторе Коробове А.В.</h2>
      <div className="about-related-pages__grid">
        {adjacentPages.map((page) => (
          <RecordCard description={page.description} href={page.href} key={page.href} title={page.title} />
        ))}
      </div>
    </section>
  );
}
