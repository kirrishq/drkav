export type ContentStatus = "empty" | "partial" | "ready";

export type ActionVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link";

export interface ImageAsset {
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

export interface SeoData {
  title: string;
  description: string;
  shareImage?: ImageAsset;
  canonicalPath?: string;
  noIndex: boolean;
}

export interface ContentAction {
  label: string;
  href: string;
  variant: ActionVariant;
  openInNewTab: boolean;
}

export interface StaticPageContent {
  pageKey: string;
  seo: SeoData;
  heading?: string;
  heroDescription?: string;
  heroImage?: ImageAsset;
  primaryAction?: ContentAction;
  secondaryAction?: ContentAction;
  contentStatus: ContentStatus;
}

export interface OperationCategorySummary {
  key: string;
  name: string;
  description?: string;
  hasLandingPage: boolean;
  landingPageKey?: string;
}

export interface OperationContent {
  slug: string;
  canonicalPath: string;
  heading: string;
  heroDescription?: string;
  heroImage?: ImageAsset;
  primaryAction?: ContentAction;
  secondaryAction?: ContentAction;
  seo: SeoData;
  categories: readonly OperationCategorySummary[];
  contentStatus: ContentStatus;
}

/**
 * CMS-agnostic boundary for future content sources.
 */
export interface ContentRepository {
  getStaticPage(pageKey: string): Promise<StaticPageContent | null>;
  getOperationByPath(path: string): Promise<OperationContent | null>;
}
