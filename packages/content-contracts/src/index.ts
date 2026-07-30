export interface ContentPage {
  slug: string;
  title: string;
  description?: string;
}

/**
 * CMS-agnostic boundary for future content sources.
 */
export interface ContentRepository {
  getPageBySlug(slug: string): Promise<ContentPage | null>;
}
