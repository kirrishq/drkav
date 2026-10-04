import type { BlogArticle, BlogArticleSummary } from "@drkav/content-contracts";
import { FeatureLinkCard, OperationsCards, RecordCard, ReviewsSlider, SectionNavigation } from "@drkav/ui";

import { DoctorProfile } from "@/components/doctor-profile/doctor-profile";
import { BlogArticleCard } from "@/components/blog/blog-index";
import { getHeadingAnchorId, BlocksRenderer } from "@/components/operation-content/blocks-renderer";
import type { ArticleSupportData } from "@/content/article-support-data";

function formatPublishedAt(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

function getLeadParagraphs(excerpt: string): readonly string[] {
  return excerpt.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

function getInlineText(children: readonly { type: "text" | "link"; text?: string; children?: readonly { text: string }[] }[]): string {
  return children.map((node) => node.type === "text" ? node.text ?? "" : node.children?.map((child) => child.text).join("") ?? "").join("");
}

function getSectionHeadingId(sectionKey: string, heading: string): string {
  return getHeadingAnchorId(`article-${sectionKey}`, 0, [{ type: "text", text: heading }]);
}

function getTableOfContents(article: BlogArticle) {
  return article.contentSections.flatMap((section) => {
    if (section.type === "faq") return [];

    const sectionHeading = section.type === "rich-text" ? section.heading : section.type === "callout" ? section.title : undefined;
    const sectionItems = sectionHeading ? [{
      id: getSectionHeadingId(section.sectionKey, sectionHeading),
      label: sectionHeading,
    }] : [];
    const bodyItems = section.body.flatMap((block, index) => block.type === "heading" ? [{
      id: getHeadingAnchorId(`article-${section.sectionKey}`, index + 1, block.children),
      label: getInlineText(block.children),
    }] : []);

    return [...sectionItems, ...bodyItems];
  });
}

function ArticleTableOfContents({ article }: { article: BlogArticle }) {
  const items = getTableOfContents(article);

  if (items.length === 0) return null;

  return <SectionNavigation ariaLabel="Содержание статьи" items={items} title="Содержание" />;
}

function ArticleNeighborNavigation({ articles, cardVariant }: { articles: readonly BlogArticleSummary[]; cardVariant: "default" | "compact" }) {
  if (articles.length === 0) return null;

  return (
    <nav aria-labelledby="article-neighbors-title" className="blog-article__neighbors">
      <h2 className="content-card__heading content-card__heading--h2" id="article-neighbors-title">Читайте еще</h2>
      <div className="blog-article__neighbors-grid">
        {articles.map((article) => <BlogArticleCard article={article} cardVariant={cardVariant} key={article.slug} showCover={cardVariant === "default"} showReadingTime={cardVariant === "default"} />)}
      </div>
    </nav>
  );
}

function getArticleOperationLinks(article: BlogArticle, operationItems: ArticleSupportData["operationItems"]) {
  if (article.relatedOperations.length > 0) return article.relatedOperations;

  const articleOperationPaths = new Set(
    article.contentSections.flatMap((section) => section.type === "faq" ? [] : section.body.flatMap((block) => block.type === "image" ? [] : block.children.flatMap((child) => child.type === "link" ? [child.url] : []))),
  );

  return operationItems.flatMap((item) => item.links)
    .filter((operation) => articleOperationPaths.has(operation.href))
    .map((operation) => ({ canonicalPath: operation.href, heading: operation.label }));
}

function getOperationCardItem(canonicalPath: string, operationItems: ArticleSupportData["operationItems"]) {
  return operationItems.find((item) => item.links.some((link) => link.href === canonicalPath));
}

function ArticleRelatedOperations({ article, operationItems }: { article: BlogArticle; operationItems: ArticleSupportData["operationItems"] }) {
  const operations = getArticleOperationLinks(article, operationItems);

  if (operations.length === 0) return null;

  return (
    <section aria-labelledby="article-related-operations-title" className="blog-article__related-operations">
      <h2 className="content-card__heading content-card__heading--h2" id="article-related-operations-title">Связанные операции</h2>
      <div className="blog-article__related-operations-grid">
        {operations.map((operation) => {
          const cardItem = getOperationCardItem(operation.canonicalPath, operationItems);

          return cardItem?.imageSrc ? (
            <FeatureLinkCard
              href={operation.canonicalPath}
              imageAlt={cardItem.imageAlt}
              imageSrc={cardItem.imageSrc}
              key={operation.canonicalPath}
              title={operation.heading}
            />
          ) : <RecordCard href={operation.canonicalPath} key={operation.canonicalPath} title={operation.heading} />;
        })}
      </div>
    </section>
  );
}

function ArticleCrossSections({ support }: { support: ArticleSupportData }) {
  return (
    <>
      <DoctorProfile />
      <OperationsCards items={support.operationItems} />
      <ReviewsSlider ctaHref="/pacientam/otzyvy" filterGroups={support.reviewFilterGroups} items={support.reviewItems} />
    </>
  );
}

export function getAdjacentArticles(articles: readonly BlogArticleSummary[], currentSlug: string): readonly BlogArticleSummary[] {
  const currentIndex = articles.findIndex((article) => article.slug === currentSlug);
  if (currentIndex < 0 || articles.length < 2) return [];

  return [
    articles[(currentIndex - 1 + articles.length) % articles.length],
    articles[(currentIndex + 1) % articles.length],
  ].filter((article): article is BlogArticleSummary => article !== undefined);
}

export function BlogArticleContent({
  adjacentArticles = [],
  article,
  articleKind = "blog",
  showPublishedAt = true,
  source,
  support,
}: {
  adjacentArticles?: readonly BlogArticleSummary[];
  article: BlogArticle;
  articleKind?: "blog" | "condition";
  showPublishedAt?: boolean;
  source?: { href: string; label: string };
  support: ArticleSupportData;
}) {
  return (
    <article className="blog-article">
      <header className="content-card content-card--intro blog-article__header">
        <p className="blog-article__meta">{[article.categories.map((category) => category.name).join(" · "), showPublishedAt ? formatPublishedAt(article.publishedAt) : "", `${article.readingTimeMinutes} мин чтения`].filter(Boolean).join(" · ")}</p>
        <h1 className="type-h1 blog-article__title">{article.title}</h1>
        {source ? <p className="blog-article__source">Источник: <a className="text-link" href={source.href} rel="noreferrer" target="_blank">{source.label}</a></p> : null}
        <div className="blog-article__lead">
          {getLeadParagraphs(article.excerpt).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </header>

      <div className="blog-article__body-layout">
        <div className="content-card content-card--muted content-card--spacious blog-article__body">
          <div className="blog-article__sections">
            {article.contentSections.map((section) => {
              if (section.type === "faq") {
                return <section className="blog-article__section" key={section.sectionKey}>{section.heading ? <h2 className="content-card__heading content-card__heading--h2" id={getSectionHeadingId(section.sectionKey, section.heading)}>{section.heading}</h2> : null}<dl className="blog-article__faq">{section.items.map((item) => <div key={item.question}><dt>{item.question}</dt><dd>{item.answer}</dd></div>)}</dl></section>;
              }

              return <section className={section.type === "callout" ? "content-card content-card--muted blog-article__callout" : "blog-article__section"} key={section.sectionKey}>{section.type === "rich-text" && section.heading ? <h2 className="content-card__heading content-card__heading--h2" id={getSectionHeadingId(section.sectionKey, section.heading)}>{section.heading}</h2> : null}{section.type === "callout" && section.title ? <h2 className="content-card__heading content-card__heading--h3" id={getSectionHeadingId(section.sectionKey, section.title)}>{section.title}</h2> : null}<BlocksRenderer blocks={section.body} className="blog-article__blocks" headingIdPrefix={`article-${section.sectionKey}`} listVariant="accent" /></section>;
            })}
          </div>
        </div>
        <ArticleTableOfContents article={article} />
      </div>

      <aside className="content-card content-card--muted blog-article__disclaimer">Материал носит информационный характер и не заменяет очную консультацию врача.</aside>
      <ArticleRelatedOperations article={article} operationItems={support.operationItems} />
      <ArticleNeighborNavigation articles={adjacentArticles} cardVariant={articleKind === "condition" ? "compact" : "default"} />
      <ArticleCrossSections support={support} />
    </article>
  );
}
