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

export interface OperationCatalogLink {
  canonicalPath: string;
  heading: string;
}

export interface OperationCatalogGroup {
  key: string;
  name: string;
  image?: ImageAsset;
  featuredOperation: OperationCatalogLink;
  operations: readonly OperationCatalogLink[];
}

export interface BeforeAfterCase {
  slug: string;
  title: string;
  beforeImage: ImageAsset;
  afterImage: ImageAsset;
  operation: OperationCatalogLink;
}

export interface FinalResult {
  slug: string;
  title: string;
  image: ImageAsset;
  categoryKey: string;
  operation: OperationCatalogLink;
}

export type RichTextText = {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

export type RichTextLink = {
  type: "link";
  url: string;
  children: readonly RichTextText[];
};

export type RichTextInline = RichTextText | RichTextLink;

export type RichTextParagraph = {
  type: "paragraph";
  children: readonly RichTextInline[];
};

export type RichTextHeading = {
  type: "heading";
  level: 2 | 3 | 4 | 5 | 6;
  children: readonly RichTextInline[];
};

export type RichTextListItem = {
  type: "list-item";
  children: readonly RichTextInline[];
};

export type RichTextList = {
  type: "list";
  format: "ordered" | "unordered";
  children: readonly RichTextListItem[];
};

export type RichTextBlock =
  | RichTextParagraph
  | RichTextHeading
  | RichTextList;

export interface OperationSectionBase {
  sectionKey: string;
  anchor?: string;
  heading?: string;
  showInPageNavigation: boolean;
}

export interface OperationTextItem {
  title?: string;
  text: string;
  sortOrder?: number;
}

export interface OperationStep {
  title: string;
  description?: string;
  sortOrder?: number;
}

export interface OperationRichTextSection extends OperationSectionBase {
  type: "rich-text";
  body: readonly RichTextBlock[];
}

export interface OperationListSection extends OperationSectionBase {
  type: "list";
  intro?: readonly RichTextBlock[];
  items: readonly OperationTextItem[];
  outro?: readonly RichTextBlock[];
}

export interface OperationStepsSection extends OperationSectionBase {
  type: "steps";
  intro?: readonly RichTextBlock[];
  steps: readonly OperationStep[];
  outro?: readonly RichTextBlock[];
}

export interface OperationChecklistSection extends OperationSectionBase {
  type: "checklist";
  intro?: readonly RichTextBlock[];
  items: readonly OperationTextItem[];
  outro?: readonly RichTextBlock[];
}

export interface OperationPriceSection extends OperationSectionBase {
  type: "price";
  heading: string;
  intro?: readonly RichTextBlock[];
  disclaimer?: readonly RichTextBlock[];
}

export type OperationContentSection =
  | OperationRichTextSection
  | OperationListSection
  | OperationStepsSection
  | OperationChecklistSection
  | OperationPriceSection;

export type PriceType =
  | "fixed"
  | "from"
  | "range"
  | "on-request"
  | "included";

export interface PriceItem {
  key: string;
  name: string;
  type: PriceType;
  priceLabel?: string;
  amount?: number;
  minAmount?: number;
  maxAmount?: number;
  currency: "RUB";
  unitLabel?: string;
  description?: string;
  note?: string;
}

const priceNumberFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0,
});

function formatRubles(value: number): string {
  return `${priceNumberFormatter.format(value).replaceAll(/\u00a0|\u202f/g, " ")} ₽`;
}

export function formatPriceItem(price: PriceItem): string {
  if (price.priceLabel) {
    return price.priceLabel;
  }

  const suffix = price.unitLabel ? ` ${price.unitLabel}` : "";

  switch (price.type) {
    case "fixed":
      if (price.amount === undefined) {
        throw new Error(`Fixed price ${price.key} has no amount.`);
      }
      return `${formatRubles(price.amount)}${suffix}`;
    case "from":
      if (price.amount === undefined) {
        throw new Error(`From price ${price.key} has no amount.`);
      }
      return `от ${formatRubles(price.amount)}${suffix}`;
    case "range":
      if (price.minAmount === undefined || price.maxAmount === undefined) {
        throw new Error(`Range price ${price.key} is incomplete.`);
      }
      return `${formatRubles(price.minAmount).replace(/ ₽$/, "")}–${formatRubles(price.maxAmount)}${suffix}`;
    case "on-request":
      return "Цена по запросу";
    case "included":
      return "Включено в стоимость";
  }
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
  prices: readonly PriceItem[];
  contentSections: readonly OperationContentSection[];
  contentStatus: ContentStatus;
}

export interface BlogCategorySummary {
  key: string;
  name: string;
}

export interface BlogArticleSummary {
  slug: string;
  canonicalPath: string;
  title: string;
  excerpt: string;
  cover?: ImageAsset;
  categories: readonly BlogCategorySummary[];
  publishedAt: string;
  readingTimeMinutes: number;
  isFeatured: boolean;
}

export interface BlogRichTextSection {
  type: "rich-text";
  sectionKey: string;
  heading?: string;
  body: readonly RichTextBlock[];
}

export interface BlogCalloutSection {
  type: "callout";
  sectionKey: string;
  title?: string;
  body: readonly RichTextBlock[];
}

export interface BlogFaqSection {
  type: "faq";
  sectionKey: string;
  heading?: string;
  items: readonly { question: string; answer: string }[];
}

export type BlogContentSection =
  | BlogRichTextSection
  | BlogCalloutSection
  | BlogFaqSection;

export interface BlogArticle extends BlogArticleSummary {
  seo: SeoData;
  contentSections: readonly BlogContentSection[];
  relatedOperations: readonly OperationCatalogLink[];
  relatedArticles: readonly BlogArticleSummary[];
}

export interface BlogIndexContent {
  articles: readonly BlogArticleSummary[];
  categories: readonly BlogCategorySummary[];
}

export type ConditionArticle = BlogArticle;
export type ConditionIndexContent = BlogIndexContent;

/**
 * CMS-agnostic boundary for future content sources.
 */
export interface ContentRepository {
  getStaticPage(pageKey: string): Promise<StaticPageContent | null>;
  getOperationByPath(path: string): Promise<OperationContent | null>;
  getOperationCatalog(): Promise<readonly OperationCatalogGroup[]>;
  getBeforeAfterCases(): Promise<readonly BeforeAfterCase[]>;
  getFinalResults(): Promise<readonly FinalResult[]>;
  getBlogIndex(): Promise<BlogIndexContent>;
  getBlogArticleBySlug(slug: string): Promise<BlogArticle | null>;
  getConditionIndex(): Promise<ConditionIndexContent>;
  getConditionArticleBySlug(slug: string): Promise<ConditionArticle | null>;
}
