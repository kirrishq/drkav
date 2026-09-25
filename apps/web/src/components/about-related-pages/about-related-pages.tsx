import { RecordCard } from "@drkav/ui";

const aboutPages = [
  {
    href: "/obo-mne/book",
    description: "Истории о людях и работе пластического хирурга.",
    title: "Книга «Боль двенадцати женщин»",
  },
  {
    href: "/obo-mne/publikacii",
    description: "Публикации и вклад в развитие пластической хирургии.",
    title: "Вклад в медицину",
  },
  {
    href: "/obo-mne/vystupleniya",
    description: "Доклады, конференции и образовательные события.",
    title: "Выступления",
  },
  {
    href: "/obo-mne/diplomy-i-licenzii",
    description: "Образование, квалификация и лицензии врача.",
    title: "Дипломы и лицензии",
  },
  {
    href: "/obo-mne/smi",
    description: "Интервью, съёмки и экспертные комментарии.",
    title: "СМИ и проекты",
  },
  {
    href: "/obo-mne/neshkola",
    description: "Обучение и наставничество для пластических хирургов.",
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
      <h2 className="type-h2 about-related-pages__title" id="about-related-pages-title">Больше о докторе Коробове А.В.</h2>
      <div className="about-related-pages__grid">
        {adjacentPages.map((page) => (
          <RecordCard description={page.description} href={page.href} key={page.href} title={page.title} />
        ))}
      </div>
    </section>
  );
}
