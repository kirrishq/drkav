import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@drkav/ui";

import { BlogArticleContent } from "@/components/blog/blog-article-content";
import { SiteHeader } from "@/components/site-header/site-header";
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
  const article = await createContentRepository().getBlogArticleBySlug(slug);
  if (!article) notFound();

  return <><SiteHeader /><main className="page-intro"><Breadcrumbs items={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { href: "/pacientam/blog", label: "Блог доктора" }, { label: article.title }]} /><div className="page-intro__content"><BlogArticleContent article={article} /></div></main></>;
}
