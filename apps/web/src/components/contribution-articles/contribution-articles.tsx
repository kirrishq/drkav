import { RecordCard } from "@drkav/ui";

const articles = [
  {
    href: "/documents/diastaz.pdf",
    title: "Экспериментальное обоснование оригинального мини-инвазивного доступа для хирургической коррекции диастаза прямых мышц живота",
    year: "2024",
  },
  {
    href: "https://cyberleninka.ru/article/n/postulaty-i-sovremennye-tendentsii-v-hirurgii-gryzh-beloy-linii-zhivota/viewer",
    title: "Постулаты и современные тенденции в хирургии грыж белой линии живота",
    year: "2023",
  },
  {
    href: "https://cyberleninka.ru/article/n/diastaz-pryamyh-myshts-zhivota-istinnye-voprosy-diagnostiki-i-lecheniya-neistinnoy-gryzhi/viewer",
    title: "Диастаз прямых мышц живота: истинные вопросы диагностики и лечения неистинной грыжи",
    year: "2022",
  },
] as const;

type ContributionArticle = {
  href: string;
  title: string;
  year?: string;
};

export function ContributionArticles({ items = articles }: { items?: readonly ContributionArticle[] }) {
  return (
    <section aria-labelledby="contribution-articles-title" className="content-card content-card--muted contribution-articles">
      <h2 className="content-card__heading content-card__heading--h2" id="contribution-articles-title">Научная деятельность</h2>
      <p className="content-card__lead">Научные публикации доктора Коробова А.В.</p>
      <div className="content-card__grid contribution-articles__grid">
        {items.map((article) => (
          <RecordCard
            href={article.href}
            icon={<span aria-hidden="true" className="contribution-articles__icon" />}
            key={`${article.year}-${article.href}`}
            meta={article.year}
            rel="noreferrer"
            target="_blank"
            title={article.title}
          />
        ))}
      </div>
    </section>
  );
}
