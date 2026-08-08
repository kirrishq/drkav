import "server-only";

import type { ContentRepository } from "@drkav/content-contracts";

import { CmsConfigurationError } from "./cms-errors";
import { StrapiContentRepository } from "./strapi-content-repository";

const DEFAULT_CMS_REQUEST_TIMEOUT_MS = 30_000;

function resolveCmsRequestTimeoutMs(): number {
  const configuredValue = process.env.CMS_REQUEST_TIMEOUT_MS;

  if (configuredValue === undefined || configuredValue.trim() === "") {
    return DEFAULT_CMS_REQUEST_TIMEOUT_MS;
  }

  if (!/^\d+$/.test(configuredValue)) {
    throw new CmsConfigurationError(
      "CMS_REQUEST_TIMEOUT_MS must be a positive integer.",
    );
  }

  const timeoutMs = Number(configuredValue);

  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0) {
    throw new CmsConfigurationError(
      "CMS_REQUEST_TIMEOUT_MS must be a positive safe integer.",
    );
  }

  return timeoutMs;
}

export function createContentRepository(): ContentRepository {
  const baseUrl = process.env.STRAPI_API_URL;
  const apiToken = process.env.STRAPI_API_TOKEN;

  if (!baseUrl) {
    throw new CmsConfigurationError(
      "STRAPI_API_URL is required for CMS-migrated content.",
    );
  }

  if (!apiToken) {
    throw new CmsConfigurationError(
      "STRAPI_API_TOKEN is required for CMS-migrated content.",
    );
  }

  return new StrapiContentRepository({
    baseUrl,
    apiToken,
    timeoutMs: resolveCmsRequestTimeoutMs(),
  });
}
