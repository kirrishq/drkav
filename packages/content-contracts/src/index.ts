export type ContentStatus = "empty" | "partial" | "ready";

export type ContentReadMode = "published" | "draft";

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

export type BuilderFont = "geist" | "system";

export interface BuilderTheme {
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: BuilderFont;
  bodyFont: BuilderFont;
}

export interface BuilderBlockBase {
  id: string;
  hidden?: boolean;
}

export interface BuilderHeroBlock extends BuilderBlockBase {
  type: "hero";
  eyebrow?: string;
  heading: string;
  description?: string;
  image?: ImageAsset;
  primaryAction?: ContentAction;
  secondaryAction?: ContentAction;
  align: "left" | "center";
}

export interface BuilderRichTextBlock extends BuilderBlockBase {
  type: "rich-text";
  heading?: string;
  body: readonly RichTextBlock[];
}

export interface BuilderCalloutBlock extends BuilderBlockBase {
  type: "callout";
  title?: string;
  body: readonly RichTextBlock[];
  tone: "default" | "accent" | "dark";
}

export interface BuilderFaqBlock extends BuilderBlockBase {
  type: "faq";
  heading?: string;
  items: readonly {
    question: string;
    answer: string;
  }[];
}

export type BuilderBlock =
  | BuilderHeroBlock
  | BuilderRichTextBlock
  | BuilderCalloutBlock
  | BuilderFaqBlock;

export type BuilderBlockType = BuilderBlock["type"];

export interface BuilderBlockDefinition {
  type: BuilderBlockType;
  label: string;
  description: string;
}

/** The first controlled block library for pages created by the editor. */
export const builderBlockDefinitions: readonly BuilderBlockDefinition[] = [
  {
    type: "hero",
    label: "Первый экран",
    description: "Заголовок, описание, изображение и основные действия.",
  },
  {
    type: "rich-text",
    label: "Текстовый блок",
    description: "Заголовки, абзацы, списки, ссылки и изображения.",
  },
  {
    type: "callout",
    label: "Акцентный блок",
    description: "Выделенное пояснение или важное сообщение.",
  },
  {
    type: "faq",
    label: "Вопросы и ответы",
    description: "Раскрывающийся список вопросов и ответов.",
  },
] as const;

export interface BuilderPage {
  pageKey: string;
  canonicalPath: string;
  internalName: string;
  seo: SeoData;
  theme: BuilderTheme;
  blocks: readonly BuilderBlock[];
  contentStatus: ContentStatus;
}

export interface StaticPageContent {
  pageKey: string;
  canonicalPath?: string;
  seo: SeoData;
  heading?: string;
  heroDescription?: string;
  heroImage?: ImageAsset;
  primaryAction?: ContentAction;
  secondaryAction?: ContentAction;
  contentSections: readonly StaticPageContentSection[];
  sharedSections: readonly SharedSection[];
  contentStatus: ContentStatus;
}

export type SharedSectionType =
  | "administrator"
  | "consultation"
  | "doctor-profile"
  | "operations-catalog"
  | "reviews"
  | "rich-text";

export interface SharedSection {
  sectionKey: string;
  internalName: string;
  type: SharedSectionType;
  heading?: string;
  description?: string;
  body?: readonly RichTextBlock[];
  personName?: string;
  personRole?: string;
  ctaLabel?: string;
  ctaHref?: string;
  details?: readonly string[];
  highlights?: readonly { id: string; title: string; href: string }[];
  links?: readonly { label: string; href: string }[];
}

export interface StaticPageTextItem {
  title?: string;
  text: string;
  sortOrder?: number;
}

export interface StaticPageRichTextSection {
  type: "rich-text";
  sectionKey: string;
  heading?: string;
  body: readonly RichTextBlock[];
}

export interface StaticPageChecklistSection {
  type: "checklist";
  sectionKey: string;
  heading?: string;
  intro?: readonly RichTextBlock[];
  items: readonly StaticPageTextItem[];
  outro?: readonly RichTextBlock[];
}

export interface StaticPageTestsSection {
  type: "tests";
  sectionKey: string;
  heading?: string;
  intro?: readonly RichTextBlock[];
  items: readonly StaticPageTextItem[];
  outro?: readonly RichTextBlock[];
}

export interface StaticPageCardItem {
  title: string;
  description?: string;
  href: string;
  sortOrder?: number;
}

export interface StaticPageCardGridSection {
  type: "card-grid";
  sectionKey: string;
  heading?: string;
  cards: readonly StaticPageCardItem[];
}

export interface StaticPageFaqSection {
  type: "faq";
  sectionKey: string;
  heading?: string;
  items: readonly {
    question: string;
    answer: string;
  }[];
}

export type StaticPageContentSection =
  | StaticPageRichTextSection
  | StaticPageChecklistSection
  | StaticPageTestsSection
  | StaticPageCardGridSection
  | StaticPageFaqSection;

export interface SiteNavigationLink {
  href: string;
  label: string;
  links?: readonly SiteNavigationLink[];
}

export interface SiteNavigationItem extends SiteNavigationLink {
  featured?: boolean;
}

export interface SiteFooterColumn {
  heading: string;
  links: readonly SiteNavigationLink[];
}

export type SiteSocialLinkKind = "telegram" | "youtube" | "instagram" | "vk";

export interface SiteSocialLink {
  href: string;
  kind: SiteSocialLinkKind;
  label: string;
}

export interface SiteContactSettings {
  clinicPhone: string;
  clinicPhoneHref: string;
  clinicAddress: string;
  clinicDescriptor: string;
  administratorPhone: string;
  administratorPhoneHref: string;
  telegramHref: string;
  maxHref: string;
  whatsappHref: string;
  emailHref: string;
  emailLabel: string;
  footerEmailHref: string;
  footerEmailLabel: string;
  footerWhatsappHref: string;
  footerWhatsappLabel: string;
  administratorHours: string;
}

export interface SiteNavigation {
  headerMenu: readonly SiteNavigationItem[];
  footerColumns: readonly SiteFooterColumn[];
  socialLinks: readonly SiteSocialLink[];
  contact: SiteContactSettings;
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
  image: ImageAsset;
  operation: OperationCatalogLink;
  date?: string;
  isFeatured: boolean;
}

export type ReviewKind = "patient" | "prodoctorov" | "social" | "video";

export interface Review {
  slug: string;
  title: string;
  text: string;
  source: string;
  kind: ReviewKind;
  image: ImageAsset;
  externalUrl?: string;
  operation?: OperationCatalogLink;
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

export type RichTextImage = {
  type: "image";
  image: ImageAsset;
};

export type RichTextBlock =
  | RichTextParagraph
  | RichTextHeading
  | RichTextList
  | RichTextImage;

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

export type PriceCatalogSectionKind = "standalone" | "women-tab";

export interface PriceCatalogEntry {
  name: string;
  description?: string;
  price?: string;
}

export interface PriceCatalogSection {
  key: string;
  title: string;
  accent?: string;
  note?: string;
  kind: PriceCatalogSectionKind;
  sortOrder?: number;
  entries: readonly PriceCatalogEntry[];
}

export interface PriceCatalogContent {
  womenNote?: string;
  sections: readonly PriceCatalogSection[];
}

export interface Promotion {
  key: string;
  title: string;
  subtitle?: string;
  description: readonly string[];
  href: string;
  validUntil?: string;
  sortOrder?: number;
}

export interface AboutEducationRecord {
  title: string;
  year: string;
  field: string;
  typeLabel: string;
}

export interface AboutRecord {
  title: string;
  year: string;
}

export interface AboutPublicationRecord extends AboutRecord {
  href: string;
  source?: string;
}

export interface AboutRatingRecord {
  label: string;
  value: string;
}

export interface AboutPageContent {
  profileHeading: string;
  profileLead: string;
  profileHighlights: readonly string[];
  educationRecords: readonly AboutEducationRecord[];
  qualifications: readonly AboutRecord[];
  awards: readonly AboutRecord[];
  associations: readonly string[];
  journalArticles: readonly AboutPublicationRecord[];
  theses: readonly AboutPublicationRecord[];
  ratings: readonly AboutRatingRecord[];
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
  breadcrumbLabel?: string;
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
  sharedSections?: readonly SharedSection[];
}

export interface BlogIndexContent {
  articles: readonly BlogArticleSummary[];
  categories: readonly BlogCategorySummary[];
}

export interface MediaPublicationSummary {
  slug: string;
  canonicalPath?: string;
  title: string;
  excerpt: string;
  sourceName: string;
  sourceDateLabel?: string;
  sourceUrl: string;
  externalUrl?: string;
  isExternal: boolean;
  layoutVariant: "primary" | "featured";
  imagePath?: string;
  imageAlt?: string;
  sortOrder: number;
  readingTimeMinutes?: number;
}

export interface MediaPublication extends MediaPublicationSummary {
  seo?: SeoData;
  contentSections: readonly BlogContentSection[];
}

export interface MediaPublicationIndexContent {
  publications: readonly MediaPublicationSummary[];
}

export interface VideoCase {
  slug: string;
  title: string;
  location: string;
  year: string;
  poster: ImageAsset;
  mp4: string;
  webm?: string;
}

export interface PortfolioCaseSummary {
  slug: string;
  canonicalPath: string;
  title: string;
  excerpt: string;
  caseLabel: string;
  resultTerm: string;
  procedureSummary: string;
  tags: readonly string[];
  cover: ImageAsset;
  operations: readonly OperationCatalogLink[];
  date?: string;
  isFeatured: boolean;
}

export interface PortfolioMediaAsset extends ImageAsset {
  mediaType: "image" | "video";
  mime?: string;
}

export interface PortfolioRichTextSection {
  type: "rich-text";
  sectionKey: string;
  eyebrow?: string;
  heading?: string;
  body: readonly RichTextBlock[];
}

export interface PortfolioStatementSection {
  type: "statement";
  sectionKey: string;
  text: string;
  tone: "dark" | "accent";
}

export interface PortfolioComparisonSection {
  type: "comparison";
  sectionKey: string;
  heading?: string;
  beforeImage: ImageAsset;
  afterImage: ImageAsset;
  beforeAlt: string;
  afterAlt: string;
  caption?: string;
}

export interface PortfolioTimelineStageSection {
  type: "timeline-stage";
  sectionKey: string;
  term: string;
  heading?: string;
  body: readonly RichTextBlock[];
  media: readonly PortfolioMediaAsset[];
}

export interface PortfolioGallerySection {
  type: "gallery";
  sectionKey: string;
  heading?: string;
  caption?: string;
  images: readonly ImageAsset[];
  presentation: "clinical" | "lifestyle";
}

export interface PortfolioQuoteSection {
  type: "quote";
  sectionKey: string;
  text: string;
  attribution?: string;
  note?: string;
}

export interface PortfolioVideoSection {
  type: "video";
  sectionKey: string;
  heading?: string;
  poster: ImageAsset;
  mp4: PortfolioMediaAsset;
  webm?: PortfolioMediaAsset;
  caption?: string;
}

export type PortfolioContentSection =
  | PortfolioRichTextSection
  | PortfolioStatementSection
  | PortfolioComparisonSection
  | PortfolioTimelineStageSection
  | PortfolioGallerySection
  | PortfolioQuoteSection
  | PortfolioVideoSection;

export interface PortfolioCase extends PortfolioCaseSummary {
  seo: SeoData;
  contentSections: readonly PortfolioContentSection[];
}

export interface PortfolioIndexContent {
  cases: readonly PortfolioCaseSummary[];
}

export type ConditionArticle = BlogArticle;
export type ConditionIndexContent = BlogIndexContent;

/**
 * CMS-agnostic boundary for future content sources.
 */
export interface ContentRepository {
  getSiteNavigation(): Promise<SiteNavigation | null>;
  getStaticPage(pageKey: string): Promise<StaticPageContent | null>;
  getStaticPageByPath(path: string): Promise<StaticPageContent | null>;
  getBuilderPageByPath(
    path: string,
    mode?: ContentReadMode,
  ): Promise<BuilderPage | null>;
  getOperationPaths(): Promise<readonly string[]>;
  getOperationByPath(path: string): Promise<OperationContent | null>;
  getOperationCatalog(): Promise<readonly OperationCatalogGroup[]>;
  getBeforeAfterCases(): Promise<readonly BeforeAfterCase[]>;
  getBeforeAfterCaseBySlug(slug: string): Promise<BeforeAfterCase | null>;
  getReviews(): Promise<readonly Review[]>;
  getPriceCatalog(): Promise<PriceCatalogContent | null>;
  getPromotions(): Promise<readonly Promotion[]>;
  getAboutPage(): Promise<AboutPageContent | null>;
  getFinalResults(): Promise<readonly FinalResult[]>;
  getBlogIndex(): Promise<BlogIndexContent>;
  getBlogArticleBySlug(slug: string): Promise<BlogArticle | null>;
  getMediaPublicationIndex(): Promise<MediaPublicationIndexContent>;
  getMediaPublicationBySlug(slug: string): Promise<MediaPublication | null>;
  getPortfolioIndex(): Promise<PortfolioIndexContent>;
  getVideoCases(): Promise<readonly VideoCase[]>;
  getPortfolioCaseBySlug(slug: string): Promise<PortfolioCase | null>;
  getConditionIndex(): Promise<ConditionIndexContent>;
  getConditionArticleBySlug(slug: string): Promise<ConditionArticle | null>;
}
