import "server-only";

import { cache } from "react";

import { defaultSiteNavigation } from "@/components/site-header/header-config";

import { createContentRepository } from "./content-repository";
import { logCmsError } from "./cms-logging";

/**
 * Site chrome is allowed to fall back to the versioned navigation so a CMS
 * outage cannot remove the header or footer from every page.
 */
export const getSiteNavigation = cache(async () => {
  try {
    return (await createContentRepository().getSiteNavigation()) ?? defaultSiteNavigation;
  } catch (error) {
    logCmsError("cms_fetch_or_revalidation_failed", error, "site-navigation");
    return defaultSiteNavigation;
  }
});
