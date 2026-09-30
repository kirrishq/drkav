import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@drkav/ui";

import { BlogArticleContent } from "@/components/blog/blog-article-content";
import { getAdjacentArticles } from "@/components/blog/blog-article-content";
import { SiteHeader } from "@/components/site-header/site-header-server";
import { getArticleSupportData } from "@/content/article-support-data";
import { createContentRepository } from "@/content/content-repository";
import { toMetadata } from "@/content/seo";

type BlogEntryPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: BlogEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await createContentRepository().getBlogArticleBySlug(slug);
  return article ? toMetadata(article.seo) : {};
}

export default async function BlogEntryPage({ params }: BlogEntryPageProps) {
  const { slug } = await params;
  const repository = createContentRepository();
  const [article, index, support] = await Promise.all([
    repository.getBlogArticleBySlug(slug),
    repository.getBlogIndex(),
    getArticleSupportData(repository),
  ]);
  if (!article) notFound();

  return <><SiteHeader /><main className="page-intro blog-article-page"><Breadcrumbs items={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { href: "/pacientam/blog", label: "Блог доктора" }, { label: article.title }]} /><div className="page-intro__content"><BlogArticleContent adjacentArticles={getAdjacentArticles(index.articles, article.slug)} article={article} support={support} /></div></main></>;
}
