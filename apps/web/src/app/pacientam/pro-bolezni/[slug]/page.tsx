import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Breadcrumbs } from "@drkav/ui";
import { BlogArticleContent, getAdjacentArticles } from "@/components/blog/blog-article-content";
import { SiteHeader } from "@/components/site-header/site-header";
import { getArticleSupportData } from "@/content/article-support-data";
import { createContentRepository } from "@/content/content-repository";
import { toMetadata } from "@/content/seo";

type ConditionEntryPageProps = { params: Promise<{ slug: string }> };

function normalizeSlug(slug: string): string {
  return slug.replace(/\.html$/, "");
}

export async function generateMetadata({ params }: ConditionEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await createContentRepository().getConditionArticleBySlug(normalizeSlug(slug));
  return article ? toMetadata(article.seo) : {};
}

export default async function ConditionEntryPage({ params }: ConditionEntryPageProps) {
  const { slug: rawSlug } = await params;
  const slug = normalizeSlug(rawSlug);
  if (rawSlug !== slug) permanentRedirect(`/pacientam/pro-bolezni/${slug}`);
  const repository = createContentRepository();
  const [article, index, support] = await Promise.all([
    repository.getConditionArticleBySlug(slug),
    repository.getConditionIndex(),
    getArticleSupportData(repository),
  ]);
  if (!article) notFound();
  return <><SiteHeader /><main className="page-intro blog-article-page"><Breadcrumbs items={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { href: "/pacientam/pro-bolezni", label: "Про болезни" }, { label: article.title }]} /><div className="page-intro__content"><BlogArticleContent adjacentArticles={getAdjacentArticles(index.articles, article.slug)} article={article} articleKind="condition" showPublishedAt={false} support={support} /></div></main></>;
}
