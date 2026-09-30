import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@drkav/ui";

import { PortfolioCaseContent } from "@/components/portfolio/portfolio-case-content";
import { SiteHeader } from "@/components/site-header/site-header-server";
import { createContentRepository } from "@/content/content-repository";
import { toMetadata } from "@/content/seo";

type PortfolioEntryPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PortfolioEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const portfolioCase = await createContentRepository().getPortfolioCaseBySlug(slug);
  return portfolioCase ? toMetadata(portfolioCase.seo) : {};
}

export default async function PortfolioEntryPage({ params }: PortfolioEntryPageProps) {
  const { slug } = await params;
  const repository = createContentRepository();
  const [portfolioCase, portfolioIndex] = await Promise.all([
    repository.getPortfolioCaseBySlug(slug),
    repository.getPortfolioIndex(),
  ]);
  if (!portfolioCase) notFound();

  const relatedCases = portfolioIndex.cases.filter((item) => item.slug !== portfolioCase.slug);

  return <><SiteHeader /><main className="portfolio-case-page"><Breadcrumbs items={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { href: "/pacientam/portfolio", label: "Портфолио" }, { label: portfolioCase.caseLabel }]} /><PortfolioCaseContent portfolioCase={portfolioCase} relatedCases={relatedCases} /></main></>;
}
