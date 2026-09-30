import "server-only";

import { createContentRepository } from "./content-repository";

export async function getPromotionsContent() {
  try {
    return await createContentRepository().getPromotions();
  } catch (error) {
    console.error("Failed to load promotions from CMS; no promotion fallback is available.", error);
    return null;
  }
}
