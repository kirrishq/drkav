import "server-only";

import { cache } from "react";
import type { Metadata } from "next";

import { createContentRepository } from "./content-repository";
import { logCmsError } from "./cms-logging";
import { toMetadata } from "./seo";

/**
 * Loads the editable page chrome while keeping the versioned frontend copy as
 * a safe fallback when a CMS record is missing or temporarily unavailable.
 */
export const getStaticPageContent = cache(async (pageKey: string) => {
  try {
    return await createContentRepository().getStaticPage(pageKey);
  } catch (error) {
    logCmsError("cms_metadata_fallback_rendered", error, `static-page:${pageKey}`);
    return null;
  }
});

export async function getStaticPageMetadata(pageKey: string, fallback: Metadata): Promise<Metadata> {
  const page = await getStaticPageContent(pageKey);
  return page ? toMetadata(page.seo) : fallback;
}
