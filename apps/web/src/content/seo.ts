import type { Metadata } from "next";

import type { SeoData as RepositorySeoData } from "@drkav/content-contracts";

/** Temporary registry shape; the repository contract always normalizes noIndex. */
export type SeoData = Omit<RepositorySeoData, "noIndex"> & {
  noIndex?: boolean;
};

/** Keeps page content independent from Next.js and the future CMS response shape. */
export function toMetadata(seo: SeoData): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    alternates: seo.canonicalPath ? { canonical: seo.canonicalPath } : undefined,
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
  };
}
