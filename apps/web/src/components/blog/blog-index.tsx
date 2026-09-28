import type { BlogIndexContent } from "@drkav/content-contracts";
import Image from "next/image";
import Link from "next/link";

type BlogIndexProps = BlogIndexContent & {
  activeCategory?: string;
  basePath?: string;
  cardVariant?: "default" | "compact";
  gridColumns?: "two" | "three";
  showCover?: boolean;
  showCategories?: boolean;
  showPublishedAt?: boolean;
  showReadingTime?: boolean;
};

function formatPublishedAt(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function ArrowIcon() {
  return (
    <span aria-hidden="true" className="blog-card__arrow">
      <svg className="blog-card__arrow-icon" fill="none" viewBox="0 0 24 24">
        <path d="M7 17 17 7m-7 0h7v7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
      </svg>
    </span>
  );
}

export function BlogIndex({ activeCategory, articles, basePath = "/pacientam/blog", cardVariant = "default", categories, gridColumns = "two", showCategories = true, showCover = true, showPublishedAt = true, showReadingTime = true }: BlogIndexProps) {
  const visibleArticles = activeCategory
    ? articles.filter((article) => article.categories.some((category) => category.key === activeCategory))
    : articles;

  return (
    <div className="blog-index">
      {showCategories ? <nav aria-label="Категории блога" className="blog-index__filters">
        <Link aria-current={activeCategory ? undefined : "page"} className="filter-control blog-index__filter" href={basePath}>Все статьи</Link>
        {categories.map((category) => (
          <Link aria-current={activeCategory === category.key ? "page" : undefined} className="filter-control blog-index__filter" href={`${basePath}?category=${category.key}`} key={category.key}>
            {category.name}
          </Link>
        ))}
      </nav> : null}

      {visibleArticles.length > 0 ? (
        <div className={`blog-index__grid${gridColumns === "three" ? " blog-index__grid--three" : ""}`}>
          {visibleArticles.map((article) => (
            <Link className={`blog-card${cardVariant === "compact" ? " blog-card--compact" : ""}`} href={article.canonicalPath} key={article.slug}>
              {showCover ? (article.cover ? <Image alt={article.cover.alternativeText ?? ""} className="blog-card__cover" height={article.cover.height ?? 480} src={article.cover.url} unoptimized width={article.cover.width ?? 720} /> : <div aria-hidden="true" className="blog-card__cover blog-card__cover--placeholder" />) : null}
              <div className="blog-card__content">
                {cardVariant === "compact" ? <><h2 className="card-title card-title--prominent blog-card__title">{article.title}</h2>{showReadingTime ? <p className="blog-card__meta">{article.readingTimeMinutes} мин чтения</p> : null}</> : <><p className="blog-card__meta">{[article.categories.map((category) => category.name).join(" · "), showPublishedAt ? formatPublishedAt(article.publishedAt) : "", showReadingTime ? `${article.readingTimeMinutes} мин чтения` : ""].filter(Boolean).join(" · ")}</p><h2 className="card-title card-title--prominent blog-card__title">{article.title}</h2><p className="blog-card__excerpt">{article.excerpt}</p></>}
                <ArrowIcon />
              </div>
            </Link>
          ))}
        </div>
      ) : <p className="blog-index__empty">В этой категории пока нет опубликованных статей.</p>}
    </div>
  );
}
