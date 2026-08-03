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

/**
 * CMS-agnostic boundary for future content sources.
 */
export interface ContentRepository {
  getStaticPage(pageKey: string): Promise<StaticPageContent | null>;
  getOperationByPath(path: string): Promise<OperationContent | null>;
}
