import "server-only";

import type { ContentRepository } from "@drkav/content-contracts";

import { StrapiContentRepository } from "./strapi-content-repository";

export function createContentRepository(): ContentRepository {
  const baseUrl = process.env.STRAPI_API_URL;
  const apiToken = process.env.STRAPI_API_TOKEN;

  if (!baseUrl) {
    throw new Error("STRAPI_API_URL is required for CMS-migrated content.");
  }

  if (!apiToken) {
    throw new Error("STRAPI_API_TOKEN is required for CMS-migrated content.");
  }

  return new StrapiContentRepository({ baseUrl, apiToken });
}
