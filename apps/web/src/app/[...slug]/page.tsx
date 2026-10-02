import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@drkav/ui";

import { StaticPageSections } from "@/components/patient-content/static-page-sections";
import { SharedSections } from "@/components/shared-sections/shared-sections";
import { SiteHeader } from "@/components/site-header/site-header-server";
import { createContentRepository } from "@/content/content-repository";
import { toMetadata } from "@/content/seo";

export const dynamic = "force-dynamic";

const RESERVED_ROOT_SEGMENTS = new Set([
  "_next",
  "api",
  "admin",
  "favicon.ico",
  "icon.png",
  "robots.txt",
  "sitemap.xml",
]);

function normalizePath(slug: readonly string[]): string | null {
  if (slug.length === 0 || RESERVED_ROOT_SEGMENTS.has(slug[0])) return null;
  const path = `/${slug.join("/")}`;
  return /^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(path) ? path : null;
}

function breadcrumbs(path: string, heading: string) {
  const segments = path.split("/").filter(Boolean);
  return [
    { href: "/", label: "Главная" },
    ...segments.slice(0, -1).map((segment, index) => ({
      href: `/${segments.slice(0, index + 1).join("/")}`,
      label: segment,
    })),
    { label: heading },
  ];
}

type CmsPageProps = { params: Promise<{ slug: string[] }> };

async function loadPage(params: CmsPageProps["params"]) {
  const { slug } = await params;
  const path = normalizePath(slug);
  if (!path) notFound();
  const page = await createContentRepository().getStaticPageByPath(path);
  if (!page) notFound();
  return { page, path };
}

export async function generateMetadata({ params }: CmsPageProps): Promise<Metadata> {
  const { page } = await loadPage(params);
  return toMetadata(page.seo);
}

export default async function CmsPage({ params }: CmsPageProps) {
  const { page, path } = await loadPage(params);
  const title = page.heading ?? page.seo.title;
  const description = page.heroDescription ?? page.seo.description;

  return (
    <>
      <SiteHeader />
      <PageIntro breadcrumbs={breadcrumbs(path, title)} description={description} title={title}>
        <StaticPageSections sections={page.contentSections} />
      </PageIntro>
      <SharedSections sections={page.sharedSections} />
    </>
  );
}
