import type { BlogArticle } from "@drkav/content-contracts";
import Link from "next/link";

import { BlocksRenderer } from "@/components/operation-content/blocks-renderer";

function formatPublishedAt(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

function ArrowIcon() {
  return (
    <span aria-hidden="true" className="blog-related-card__arrow">
      <svg className="blog-related-card__arrow-icon" fill="none" viewBox="0 0 24 24">
        <path d="M7 17 17 7m-7 0h7v7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
      </svg>
    </span>
  );
}

export function BlogArticleContent({ article, showPublishedAt = true }: { article: BlogArticle; showPublishedAt?: boolean }) {
  return (
    <article className="blog-article">
      <header className="blog-article__header">
        <p className="blog-article__meta">{[article.categories.map((category) => category.name).join(" · "), showPublishedAt ? formatPublishedAt(article.publishedAt) : "", `${article.readingTimeMinutes} мин чтения`].filter(Boolean).join(" · ")}</p>
        <h1 className="type-h1 blog-article__title">{article.title}</h1>
        <p className="blog-article__lead">{article.excerpt}</p>
      </header>

      <div className="blog-article__sections">
        {article.contentSections.map((section) => {
          if (section.type === "faq") {
            return <section className="content-card content-card--spacious blog-article__section" key={section.sectionKey}>{section.heading ? <h2 className="content-card__heading content-card__heading--h2">{section.heading}</h2> : null}<dl className="blog-article__faq">{section.items.map((item) => <div key={item.question}><dt>{item.question}</dt><dd>{item.answer}</dd></div>)}</dl></section>;
          }

          return <section className={section.type === "callout" ? "content-card content-card--muted blog-article__callout" : "content-card content-card--spacious blog-article__section"} key={section.sectionKey}>{section.type === "rich-text" && section.heading ? <h2 className="content-card__heading content-card__heading--h2">{section.heading}</h2> : null}{section.type === "callout" && section.title ? <h2 className="content-card__heading content-card__heading--h3">{section.title}</h2> : null}<BlocksRenderer blocks={section.body} className="blog-article__blocks" /></section>;
        })}
      </div>

      <aside className="content-card content-card--muted blog-article__disclaimer">Материал носит информационный характер и не заменяет очную консультацию врача.</aside>

      {article.relatedOperations.length > 0 || article.relatedArticles.length > 0 ? (
        <section className="blog-article__related">
          <h2 className="content-card__heading content-card__heading--h2">Полезные материалы</h2>
          <div className="blog-article__related-grid">
            {article.relatedOperations.map((operation) => (
              <Link className="blog-related-card blog-related-card--operation" href={operation.canonicalPath} key={operation.canonicalPath}>
                <span className="blog-related-card__eyebrow">Операция</span>
                <span className="card-title blog-related-card__title">{operation.heading}</span>
                <ArrowIcon />
              </Link>
            ))}
            {article.relatedArticles.map((related) => (
              <Link className="blog-related-card" href={related.canonicalPath} key={related.slug}>
                <span className="blog-related-card__eyebrow">Статья</span>
                <span className="card-title blog-related-card__title">{related.title}</span>
                <ArrowIcon />
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
