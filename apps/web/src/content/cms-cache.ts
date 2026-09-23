import "server-only";

import { CmsConfigurationError } from "./cms-errors";

export const DEFAULT_CMS_REVALIDATE_SECONDS = 3_600;
export const MIN_PRODUCTION_CMS_REVALIDATE_SECONDS = 60;

type CmsFetchCacheOptions =
  | { cache: "no-store" }
  | {
      next: {
        revalidate: number;
        tags: string[];
      };
    };

export function resolveCmsRevalidateSeconds(): number {
  const configuredValue = process.env.CMS_REVALIDATE_SECONDS;

  if (configuredValue === undefined || configuredValue.trim() === "") {
    return DEFAULT_CMS_REVALIDATE_SECONDS;
  }

  if (!/^\d+$/.test(configuredValue)) {
    throw new CmsConfigurationError(
      "CMS_REVALIDATE_SECONDS must be a positive integer.",
    );
  }

  const seconds = Number(configuredValue);

  if (!Number.isSafeInteger(seconds) || seconds <= 0) {
    throw new CmsConfigurationError(
      "CMS_REVALIDATE_SECONDS must be a positive safe integer.",
    );
  }

  if (
    process.env.NODE_ENV === "production" &&
    seconds < MIN_PRODUCTION_CMS_REVALIDATE_SECONDS
  ) {
    throw new CmsConfigurationError(
      `CMS_REVALIDATE_SECONDS must be at least ${MIN_PRODUCTION_CMS_REVALIDATE_SECONDS} in production.`,
    );
  }

  return seconds;
}

export function normalizeCanonicalPath(path: string): string {
  if (!path.startsWith("/") || path.includes("?") || path.includes("#")) {
    throw new CmsConfigurationError(
      "A CMS cache tag requires an absolute canonical site path.",
    );
  }

  const normalizedPath = `/${path.split("/").filter(Boolean).join("/")}`;
  return normalizedPath === "/" ? normalizedPath : normalizedPath.replace(/\/$/, "");
}

export function getOperationCacheTag(canonicalPath: string): string {
  return `operation:${normalizeCanonicalPath(canonicalPath)}`;
}

export function getOperationCatalogCacheTag(): string {
  return "operation-catalog";
}

export function getBeforeAfterCasesCacheTag(): string {
  return "before-after-cases";
}

export function getReviewsCacheTag(): string {
  return "reviews";
}

export function getFinalResultsCacheTag(): string {
  return "final-results";
}

export function getBlogIndexCacheTag(): string {
  return "blog-index";
}

export function getBlogArticleCacheTag(slug: string): string {
  return `blog:${slug}`;
}

export function getPortfolioIndexCacheTag(): string {
  return "portfolio-index";
}

export function getPortfolioCaseCacheTag(slug: string): string {
  return `portfolio:${slug}`;
}

export function getConditionIndexCacheTag(): string {
  return "condition-index";
}

export function getConditionArticleCacheTag(slug: string): string {
  return `condition:${slug}`;
}

export function getBuilderPageCacheTag(canonicalPath: string): string {
  return `builder-page:${normalizeCanonicalPath(canonicalPath)}`;
}

export function getCmsFetchCacheOptions(
  cacheTag: string,
  options: { noStore?: boolean } = {},
): CmsFetchCacheOptions {
  if (process.env.NODE_ENV === "development" || options.noStore) {
    return { cache: "no-store" };
  }

  return {
    next: {
      revalidate: resolveCmsRevalidateSeconds(),
      tags: [cacheTag],
    },
  };
}
