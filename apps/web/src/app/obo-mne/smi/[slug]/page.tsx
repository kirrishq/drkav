import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { Breadcrumbs } from "@drkav/ui";

import { BlogArticleContent } from "@/components/blog/blog-article-content";
import { SiteHeader } from "@/components/site-header/site-header-server";
import { getArticleSupportData } from "@/content/article-support-data";
import { createContentRepository } from "@/content/content-repository";
import { toMetadata } from "@/content/seo";
import type { BlogArticle } from "@drkav/content-contracts";

type MediaPublicationPageProps = { params: Promise<{ slug: string }> };

function toPublicationDate(sourceDateLabel?: string): string {
  const monthNumbers: Record<string, string> = {
    январь: "01",
    февраль: "02",
    март: "03",
    апрель: "04",
    май: "05",
    июнь: "06",
    июль: "07",
    август: "08",
    сентябрь: "09",
    октябрь: "10",
    ноябрь: "11",
    декабрь: "12",
  };
  const match = sourceDateLabel?.toLowerCase().match(/([а-яё]+)\s*,?\s*(\d{4})/);
  if (!match) return "2024-01-01T00:00:00.000Z";
  return `${match[2]}-${monthNumbers[match[1]] ?? "01"}-01T00:00:00.000Z`;
}

export async function generateMetadata({ params }: MediaPublicationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const publication = await createContentRepository().getMediaPublicationBySlug(slug);
  return publication?.seo ? toMetadata(publication.seo) : {};
}

export default async function MediaPublicationPage({ params }: MediaPublicationPageProps) {
  const { slug } = await params;
  const repository = createContentRepository();
  const [publication, support] = await Promise.all([
    repository.getMediaPublicationBySlug(slug),
    getArticleSupportData(repository),
  ]);

  if (!publication) notFound();
  if (publication.isExternal && publication.externalUrl) permanentRedirect(publication.externalUrl);
  if (!publication.canonicalPath || !publication.seo) notFound();

  const article: BlogArticle = {
    slug: publication.slug,
    canonicalPath: publication.canonicalPath,
    title: publication.title,
    excerpt: publication.excerpt,
    categories: [{ key: "media", name: publication.sourceName }],
    publishedAt: toPublicationDate(publication.sourceDateLabel),
    readingTimeMinutes: publication.readingTimeMinutes ?? 1,
    isFeatured: false,
    seo: publication.seo,
    contentSections: publication.contentSections,
    relatedOperations: [],
    relatedArticles: [],
  };

  return <><SiteHeader /><main className="page-intro blog-article-page"><Breadcrumbs items={[{ href: "/", label: "Главная" }, { href: "/obo-mne", label: "Обо мне" }, { href: "/obo-mne/smi", label: "СМИ" }, { label: publication.title }]} /><div className="page-intro__content"><BlogArticleContent article={article} showPublishedAt={false} source={{ href: publication.sourceUrl, label: publication.sourceName }} support={support} /></div></main></>;
}
