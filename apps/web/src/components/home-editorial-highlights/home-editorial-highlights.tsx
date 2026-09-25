import Image from "next/image";
import Link from "next/link";

import { buttonVariants, cn } from "@drkav/ui";

const highlights = [
  {
    description: "Практическое обучение для пластических хирургов: мастер-классы, стажировки, менторство и работа в операционной.",
    href: "/obo-mne/neshkola",
    imageAlt: "Пластический хирург во время операции",
    imageSrc: "/images/education/neschool.png",
    linkLabel: "Подробнее о НеШколе",
    title: "Обучение для пластических хирургов",
  },
  {
    description: "Роман о жизни и работе пластического хирурга — о человеческих историях, которые остаются за пределами операционной.",
    href: "/obo-mne/book",
    imageAlt: "Книга «Боль двенадцати женщин» в руках",
    imageSrc: "/images/book/book-mockup.png",
    linkLabel: "Подробнее о книге",
    title: "«Боль двенадцати женщин» — роман о жизни и работе пластического хирурга",
  },
  {
    description: "Экспертное участие в шоу «Большие девочки» на телеканале «Пятница». Смотрите полный выпуск.",
    href: "/obo-mne/smi",
    imageAlt: "Доктор Коробов — эксперт телевизионного шоу",
    imageSrc: "/images/media-videos/sobchak.jpg",
    linkLabel: "Подробнее о проектах",
    title: "Эксперт в шоу «Большие девочки» на телеканале «Пятница»",
  },
] as const;

export function HomeEditorialHighlights() {
  return (
    <section aria-labelledby="home-editorial-highlights-title" className="home-editorial-highlights">
      <div className="home-editorial-highlights__heading">
        <p className="type-label home-editorial-highlights__eyebrow">ПРОЕКТЫ И МАТЕРИАЛЫ</p>
        <h2 className="type-h2 home-editorial-highlights__title" id="home-editorial-highlights-title">Ещё о докторе и его проектах</h2>
      </div>
      <div className="home-editorial-highlights__grid">
        {highlights.map((highlight) => (
          <article className="home-editorial-highlights__card" key={highlight.title}>
            <figure className="home-editorial-highlights__image">
              <Image alt={highlight.imageAlt} fill loading="lazy" sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw" src={highlight.imageSrc} />
            </figure>
            <div className="home-editorial-highlights__content">
              <h3 className="type-h3 home-editorial-highlights__card-title">{highlight.title}</h3>
              <p className="home-editorial-highlights__description">{highlight.description}</p>
              <Link className={cn(buttonVariants({ size: "sm", variant: "outline" }), "home-editorial-highlights__link")} href={highlight.href}>
                {highlight.linkLabel}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
