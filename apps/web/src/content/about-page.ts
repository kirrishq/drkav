import "server-only";

import { createContentRepository } from "./content-repository";

export async function getAboutPageContent() {
  try {
    return await createContentRepository().getAboutPage();
  } catch (error) {
    console.error("Failed to load about page content from CMS; using the local fallback.", error);
    return null;
  }
}
