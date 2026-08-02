import type { Metadata } from "next";

import type { SeoData as RepositorySeoData } from "@drkav/content-contracts";

/** Temporary registry shape; the repository contract always normalizes noIndex. */
export type SeoData = Omit<RepositorySeoData, "noIndex"> & {
  noIndex?: boolean;
};

export function getSiteUrl(): URL {
  const value =
    process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";
  const siteUrl = new URL(value);

  if (siteUrl.protocol !== "http:" && siteUrl.protocol !== "https:") {
    throw new Error("SITE_URL must use HTTP or HTTPS.");
  }

  return siteUrl;
}

/** Keeps page content independent from Next.js and the future CMS response shape. */
export function toMetadata(seo: SeoData): Metadata {
  const canonical = seo.canonicalPath
    ? new URL(seo.canonicalPath, getSiteUrl()).toString()
    : undefined;

  return {
    title: seo.title,
    description: seo.description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonical,
      images: seo.shareImage
        ? [
            {
              url: seo.shareImage.url,
              alt: seo.shareImage.alternativeText,
              width: seo.shareImage.width,
              height: seo.shareImage.height,
            },
          ]
        : undefined,
    },
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
  };
}

export function toUnavailableMetadata(routePath: string): Metadata {
  return {
    title: "Информация временно недоступна",
    alternates: {
      canonical: new URL(routePath, getSiteUrl()).toString(),
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}
