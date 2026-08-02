import { FeatureLinkCard } from "@drkav/ui";

const aboutPages = [
  {
    href: "/obo-mne/book",
    imageSrc: "/images/about-pages/book.png",
    title: "Книга «Боль двенадцати женщин»",
  },
  {
    href: "/obo-mne/publikacii",
    imageSrc: "/images/about-pages/vistupleniya.png",
    title: "Вклад в медицину",
  },
  {
    href: "/obo-mne/vystupleniya",
    imageSrc: "/images/about-pages/vistupleniya.png",
    title: "Выступления",
  },
  {
    href: "/obo-mne/diplomy-i-licenzii",
    imageSrc: "/images/about-pages/book.png",
    title: "Дипломы и лицензии",
  },
  {
    href: "/obo-mne/smi",
    imageSrc: "/images/about-pages/vistupleniya.png",
    title: "СМИ и проекты",
  },
  {
    href: "/obo-mne/neshkola",
    imageSrc: "/images/about-pages/book.png",
    title: "Обучение",
  },
] as const;

export function AboutRelatedPages({ currentHref }: { currentHref: string }) {
  const currentIndex = aboutPages.findIndex((page) => page.href === currentHref);

  if (currentIndex < 0) {
    return null;
  }

  const previousPage = aboutPages.at((currentIndex - 1 + aboutPages.length) % aboutPages.length);
  const nextPage = aboutPages.at((currentIndex + 1) % aboutPages.length);
  const adjacentPages = [previousPage, nextPage].filter((page): page is (typeof aboutPages)[number] => page !== undefined);

  return (
    <section aria-labelledby="about-related-pages-title" className="about-related-pages">
      <h2 className="about-related-pages__title" id="about-related-pages-title">Больше о докторе Коробове А.В.</h2>
      <div className="about-related-pages__grid">
        {adjacentPages.map((page) => (
          <FeatureLinkCard imageAlt="" imageSrc={page.imageSrc} key={page.href} href={page.href} title={page.title} variant="square" />
        ))}
      </div>
    </section>
  );
}
