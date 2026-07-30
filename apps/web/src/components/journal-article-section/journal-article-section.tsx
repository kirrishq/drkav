import { buttonVariants, cn, RecordCard } from "@drkav/ui";
import Link from "next/link";

const articles = [
  {
    href: "/obo-mne/publikacii",
    source: "Сб. материалов XXIX пленума хирургов",
    title: "Экспериментальное обоснование оригинального мини-инвазивного доступа для хирургической коррекции диастаза прямых мышц живота",
    year: "2024",
  },
  {
    href: "/obo-mne/publikacii",
    source: "ВАК, Доказательная герниология 2024",
    title: "Одномоментная аутопластика грыжевого дефекта и ликвидация диастаза прямых мышц живота у пациентов с первичными грыжами белой линии",
    year: "2024",
  },
  {
    href: "/obo-mne/publikacii",
    source: "ВАК, Пластическая хирургия и эстетическая медицина 2024, №3, с. 99-104",
    title: "Экспериментальное обоснование оригинального мини-инвазивного доступа для хирургической коррекции диастаза прямых мышц живота",
    year: "2024",
  },
  {
    href: "/obo-mne/publikacii",
    source: "Ульяновский медико-биологический журнал, №2",
    title: "Постулаты и современные тенденции в хирургии грыж белой линии живота",
    year: "2023",
  },
  {
    href: "/obo-mne/publikacii",
    source: "Ульяновский медико-биологический журнал, №2",
    title: "Диастаз прямых мышц живота: истинные вопросы диагностики и лечения неистинной грыжи",
    year: "2022",
  },
] as const;

export function JournalArticleSection() {
  return (
    <section className="content-card content-card--muted content-section journal-article-section" id="journal-articles">
      <h2 className="content-card__heading content-card__heading--h2">Статьи в журнале</h2>
      <div className="content-card__grid journal-article-section__grid">
        {articles.map((article) => (
          <RecordCard
            details={[{ tone: "secondary", value: article.source }]}
            href={article.href}
            icon={<span aria-hidden="true" className="journal-article-section__icon" />}
            key={`${article.year}-${article.title}-${article.source}`}
            meta={article.year}
            title={article.title}
          />
        ))}
      </div>
      <Link className={cn(buttonVariants({ size: "md", variant: "outline" }), "journal-article-section__action")} href="/obo-mne/publikacii">
        Смотреть все
      </Link>
    </section>
  );
}
