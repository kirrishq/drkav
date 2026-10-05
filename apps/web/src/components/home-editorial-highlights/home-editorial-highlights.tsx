import Image from "next/image";
import Link from "next/link";

import { VideoCard } from "@drkav/ui";

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
    description: "Интервью Ксении Собчак о липосакции, опыте звёзд и безопасности пластической хирургии.",
    imageAlt: "Интервью доктора Коробова у Ксении Собчак",
    imageSrc: "/images/media-videos/sobchak.jpg",
    linkLabel: "Смотреть интервью",
    title: "Интервью Ксении Собчак",
    videoSrc: "https://s3.ru1.storage.beget.cloud/39799ed5839c-drkav-media/sobchak.mp4",
  },
] as const;

export function HomeEditorialHighlights({ copy }: { copy?: readonly { description?: string; title: string }[] }) {
  const resolvedHighlights = highlights.map((highlight, index) => ({
    ...highlight,
    description: copy?.[index]?.description ?? highlight.description,
    title: copy?.[index]?.title ?? highlight.title,
  }));

  return (
    <section aria-labelledby="home-editorial-highlights-title" className="home-editorial-highlights">
      <div className="home-editorial-highlights__heading">
        <h2 className="type-h2 home-editorial-highlights__title" id="home-editorial-highlights-title">Ещё о докторе и его проектах</h2>
      </div>
      <div className="home-editorial-highlights__grid">
        {resolvedHighlights.map((highlight) => {
          if ("videoSrc" in highlight) {
            return (
              <article className="home-editorial-highlights__card" key={highlight.title}>
                <VideoCard
                  className="home-editorial-highlights__video"
                  description={highlight.description}
                  fullCard
                  location="Интервью Ксении Собчак"
                  posterAlt={highlight.imageAlt}
                  posterSrc={highlight.imageSrc}
                  title={highlight.title}
                  videoSrc={highlight.videoSrc}
                  year=""
                />
              </article>
            );
          }

          return (
            <Link className="home-editorial-highlights__card focus-ring" href={highlight.href} key={highlight.title}>
              <figure className="home-editorial-highlights__image">
                <Image alt={highlight.imageAlt} fill loading="lazy" sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw" src={highlight.imageSrc} />
              </figure>
              <div className="home-editorial-highlights__content">
                <h3 className="type-h3 home-editorial-highlights__card-title">{highlight.title}</h3>
                <p className="home-editorial-highlights__description">{highlight.description}</p>
                <span className="home-editorial-highlights__read-more">{highlight.linkLabel}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
