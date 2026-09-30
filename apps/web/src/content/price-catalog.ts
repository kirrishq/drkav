import "server-only";

import { createContentRepository } from "./content-repository";

export async function getPriceCatalogContent() {
  try {
    return await createContentRepository().getPriceCatalog();
  } catch (error) {
    console.error("Failed to load price catalog from CMS; development fallback may be used.", error);
    return null;
  }
}
