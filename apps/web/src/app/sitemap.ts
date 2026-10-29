import type { MetadataRoute } from "next";

import { createContentRepository } from "@/content/content-repository";
import { allPageRegistryItems } from "@/content/page-registry";
import { getSiteUrl } from "@/content/seo";

export const revalidate = 3_600;

function toAbsoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}

function isLocalPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}

const excludedStaticRoutes = new Set([
  "/konsultaciya",
  "/policy",
  "/consent",
  "/consent-marketing",
  "/cookies",
  "/oferta",
]);

function getStaticEntries(): MetadataRoute.Sitemap {
  const paths = new Set(
    allPageRegistryItems
      .filter(
        (item) =>
          isLocalPath(item.route) &&
          !item.route.includes("[") &&
          !item.route.startsWith("/design-system/") &&
          !excludedStaticRoutes.has(item.route) &&
          !item.seo?.noIndex,
      )
      .map((item) => item.route),
  );

  return [...paths].map((path) => ({ url: toAbsoluteUrl(path) }));
}

async function getCmsEntries(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.STRAPI_API_URL || !process.env.STRAPI_API_TOKEN) return [];

  try {
    const repository = createContentRepository();
    const [blog, conditions, portfolio, operations, mediaPublications] = await Promise.all([
      repository.getBlogIndex(),
      repository.getConditionIndex(),
      repository.getPortfolioIndex(),
      repository.getOperationPaths(),
      repository.getMediaPublicationIndex(),
    ]);

    return [
      ...operations.map((canonicalPath) => ({ canonicalPath })),
      ...blog.articles,
      ...conditions.articles,
      ...portfolio.cases,
      ...mediaPublications.publications
        .filter((publication) => !publication.isExternal && publication.canonicalPath)
        .map((publication) => ({ canonicalPath: publication.canonicalPath as string })),
    ]
      .filter((item) => isLocalPath(item.canonicalPath))
      .map((item) => ({ url: toAbsoluteUrl(item.canonicalPath) }));
  } catch {
    // Keep static registry URLs available if CMS is temporarily unavailable.
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = [...getStaticEntries(), ...(await getCmsEntries())];
  const uniqueEntries = new Map(entries.map((entry) => [entry.url, entry]));

  return [...uniqueEntries.values()];
}
