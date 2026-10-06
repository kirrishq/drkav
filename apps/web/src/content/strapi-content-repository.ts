import "server-only";

import type {
  AboutPageContent,
  BlogArticle,
  BlogArticleSummary,
  BlogCategorySummary,
  BlogContentSection,
  BlogIndexContent,
  MediaPublication,
  MediaPublicationIndexContent,
  MediaPublicationSummary,
  BeforeAfterCase,
  BuilderBlock,
  BuilderFont,
  BuilderPage,
  BuilderTheme,
  ContentReadMode,
  ContentAction,
  ContentRepository,
  FinalResult,
  ImageAsset,
  OperationCatalogGroup,
  OperationCatalogLink,
  OperationCategorySummary,
  OperationContent,
  OperationContentSection,
  OperationStep,
  OperationTextItem,
  PortfolioCase,
  PortfolioCaseSummary,
  PortfolioContentSection,
  PortfolioIndexContent,
  PortfolioMediaAsset,
  Promotion,
  Review,
  PriceCatalogContent,
  PriceCatalogSection,
  PriceItem,
  RichTextBlock,
  RichTextInline,
  RichTextImage,
  RichTextListItem,
  RichTextText,
  SeoData,
  SiteContactSettings,
  SiteFooterColumn,
  SiteNavigation,
  SiteNavigationItem,
  SiteNavigationLink,
  SiteSocialLink,
  SharedSection,
  SharedSectionType,
  StaticPageContent,
  StaticPageContentSection,
  VideoCase,
} from "@drkav/content-contracts";
import { formatPriceItem } from "@drkav/content-contracts";
import type { ReviewKind } from "@drkav/content-contracts";
import { getPageByRoute } from "./page-registry";

import {
  getBlogArticleCacheTag,
  getBlogIndexCacheTag,
  getCmsFetchCacheOptions,
  getBeforeAfterCasesCacheTag,
  getBuilderPageCacheTag,
  getConditionArticleCacheTag,
  getConditionIndexCacheTag,
  getMediaPublicationCacheTag,
  getMediaPublicationIndexCacheTag,
  getOperationCatalogCacheTag,
  getOperationCacheTag,
  getOperationPathsCacheTag,
  getPriceCatalogCacheTag,
  getPromotionsCacheTag,
  getAboutPageCacheTag,
  getFinalResultsCacheTag,
  getReviewsCacheTag,
  getPortfolioCaseCacheTag,
  getPortfolioIndexCacheTag,
  getSiteNavigationCacheTag,
} from "./cms-cache";
import {
  CmsConfigurationError,
  CmsInvalidResponseError,
  CmsUnauthorizedError,
  CmsUnavailableError,
} from "./cms-errors";

export type StrapiContentRepositoryOptions = {
  baseUrl: string;
  apiToken: string;
  fetchImplementation?: typeof fetch;
  timeoutMs?: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new CmsInvalidResponseError(`Invalid Strapi response: ${label} must be an object.`);
  }

  return value;
}

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new CmsInvalidResponseError(`Invalid Strapi response: ${label} must be a non-empty string.`);
  }

  return value;
}

function getTodayInMoscow(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Europe/Moscow",
    year: "numeric",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function optionalString(value: unknown, label: string): string | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  return requireString(value, label);
}

function optionalHttpUrl(value: unknown, label: string): string | undefined {
  const url = optionalString(value, label);

  if (!url) {
    return undefined;
  }

  try {
    const parsed = new URL(url);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("Unsupported protocol");
    }

    return parsed.toString();
  } catch {
    throw new CmsInvalidResponseError(`Invalid Strapi response: ${label} must be an absolute HTTP(S) URL.`);
  }
}

function requireHttpUrl(value: unknown, label: string): string {
  const url = optionalHttpUrl(value, label);

  if (!url) {
    throw new CmsInvalidResponseError(`Invalid Strapi response: ${label} must be an absolute HTTP(S) URL.`);
  }

  return url;
}

function requireBoolean(value: unknown, label: string): boolean {
  if (typeof value !== "boolean") {
    throw new CmsInvalidResponseError(`Invalid Strapi response: ${label} must be a boolean.`);
  }

  return value;
}

function optionalBoolean(value: unknown, label: string): boolean | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return requireBoolean(value, label);
}

function optionalNumber(value: unknown, label: string): number | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new CmsInvalidResponseError(`Invalid Strapi response: ${label} must be a number.`);
  }

  return value;
}

function optionalInteger(value: unknown, label: string): number | undefined {
  const number = optionalNumber(value, label);

  if (number !== undefined && !Number.isInteger(number)) {
    throw new CmsInvalidResponseError(`Invalid Strapi response: ${label} must be an integer.`);
  }

  return number;
}

function requireArray(value: unknown, label: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new CmsInvalidResponseError(`Invalid Strapi response: ${label} must be an array.`);
  }

  return value;
}

function requireNavigationHref(value: unknown, label: string): string {
  const href = requireString(value, label);

  if (href.startsWith("/") && !href.startsWith("//")) {
    return href;
  }

  if (href.startsWith("tel:") || href.startsWith("mailto:")) {
    return href;
  }

  try {
    const parsed = new URL(href);

    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    // Fall through to the shared validation error.
  }

  throw new CmsInvalidResponseError(
    `Invalid Strapi response: ${label} must be a site path or safe HTTP(S), mailto, or tel URL.`,
  );
}

function mapNavigationLink(
  value: unknown,
  label: string,
): SiteNavigationLink {
  const link = requireRecord(value, label);

  return {
    href: requireNavigationHref(link.href, `${label}.href`),
    label: requireString(link.label, `${label}.label`),
  };
}

function mapNavigationChild(
  value: unknown,
  label: string,
): SiteNavigationLink {
  const child = requireRecord(value, label);
  const links = child.links;

  return {
    href: requireNavigationHref(child.href, `${label}.href`),
    label: requireString(child.label, `${label}.label`),
    ...(links === undefined || links === null
      ? {}
      : {
          links: requireArray(links, `${label}.links`).map((link, index) =>
            mapNavigationLink(link, `${label}.links[${index}]`),
          ),
        }),
  };
}

function mapNavigationItem(
  value: unknown,
  label: string,
): SiteNavigationItem {
  const item = requireRecord(value, label);
  const featured = item.featured;
  const links = requireArray(item.links, `${label}.links`).map((child, index) =>
    mapNavigationChild(child, `${label}.links[${index}]`),
  );

  return {
    href: requireNavigationHref(item.href, `${label}.href`),
    label: requireString(item.label, `${label}.label`),
    ...(featured === undefined
      ? {}
      : { featured: requireBoolean(featured, `${label}.featured`) }),
    links,
  };
}

function mapFooterColumn(value: unknown, label: string): SiteFooterColumn {
  const column = requireRecord(value, label);

  return {
    heading: requireString(column.heading, `${label}.heading`),
    links: requireArray(column.links, `${label}.links`).map((link, index) =>
      mapNavigationLink(link, `${label}.links[${index}]`),
    ),
  };
}

function mapSocialLink(value: unknown, label: string): SiteSocialLink {
  const link = requireRecord(value, label);
  const kind = requireString(link.kind, `${label}.kind`);

  if (kind !== "telegram" && kind !== "youtube" && kind !== "instagram" && kind !== "vk") {
    throw new CmsInvalidResponseError(`Invalid Strapi response: ${label}.kind is unsupported.`);
  }

  return {
    href: requireNavigationHref(link.href, `${label}.href`),
    kind,
    label: requireString(link.label, `${label}.label`),
  };
}

function mapContactSettings(value: unknown, label: string): SiteContactSettings {
  const contact = requireRecord(value, label);
  const stringFields = [
    "clinicPhone",
    "clinicPhoneHref",
    "clinicAddress",
    "clinicDescriptor",
    "administratorPhone",
    "administratorPhoneHref",
    "telegramHref",
    "maxHref",
    "whatsappHref",
    "emailHref",
    "emailLabel",
    "footerEmailHref",
    "footerEmailLabel",
    "footerWhatsappHref",
    "footerWhatsappLabel",
    "administratorHours",
  ] as const;

  const mapped = Object.fromEntries(
    stringFields.map((field) => [
      field,
      field.endsWith("Href")
        ? requireNavigationHref(contact[field], `${label}.${field}`)
        : requireString(contact[field], `${label}.${field}`),
    ]),
  );

  return mapped as unknown as SiteContactSettings;
}

function mapSiteNavigation(value: Record<string, unknown>): SiteNavigation {
  return {
    headerMenu: requireArray(value.headerMenu, "siteSetting.headerMenu").map(
      (item, index) => mapNavigationItem(item, `siteSetting.headerMenu[${index}]`),
    ),
    footerColumns: requireArray(value.footerColumns, "siteSetting.footerColumns").map(
      (column, index) => mapFooterColumn(column, `siteSetting.footerColumns[${index}]`),
    ),
    socialLinks: requireArray(value.socialLinks, "siteSetting.socialLinks").map(
      (link, index) => mapSocialLink(link, `siteSetting.socialLinks[${index}]`),
    ),
    contact: mapContactSettings(value.contact, "siteSetting.contact"),
  };
}

function mapTextInline(value: unknown, label: string): RichTextInline {
  const node = requireRecord(value, label);
  const type = requireString(node.type, `${label}.type`);

  if (type === "text") {
    const mapped: RichTextText = {
      type: "text",
      text: typeof node.text === "string" ? node.text : requireString(node.text, `${label}.text`),
    };

    for (const mark of ["bold", "italic", "underline", "code"] as const) {
      if (node[mark] !== undefined) {
        mapped[mark] = requireBoolean(node[mark], `${label}.${mark}`);
      }
    }

    return mapped;
  }

  if (type === "link") {
    const url = requireString(node.url, `${label}.url`);

    if (
      !url.startsWith("/") &&
      !url.startsWith("#") &&
      !url.startsWith("mailto:") &&
      !url.startsWith("tel:") &&
      !url.startsWith("https://") &&
      !url.startsWith("http://")
    ) {
      throw new CmsInvalidResponseError(`Invalid Strapi response: ${label}.url is unsafe.`);
    }

    return {
      type: "link",
      url,
      children: requireArray(node.children, `${label}.children`).map(
        (child, index) => {
          const inline = mapTextInline(child, `${label}.children[${index}]`);

          if (inline.type !== "text") {
            throw new CmsInvalidResponseError(
              `Invalid Strapi response: ${label} cannot contain a nested link.`,
            );
          }

          return inline;
        },
      ),
    };
  }

  throw new CmsInvalidResponseError(
    `Invalid Strapi response: ${label}.type ${type} is unsupported.`,
  );
}

function mapListItem(value: unknown, label: string): RichTextListItem {
  const node = requireRecord(value, label);

  if (node.type !== "list-item") {
    throw new CmsInvalidResponseError(
      `Invalid Strapi response: ${label}.type must be list-item.`,
    );
  }

  return {
    type: "list-item",
    children: requireArray(node.children, `${label}.children`).map(
      (child, index) => mapTextInline(child, `${label}.children[${index}]`),
    ),
  };
}

function mapBlocks(value: unknown, label: string, baseUrl: string): readonly RichTextBlock[] {
  return requireArray(value, label).map((blockValue, index) => {
    const blockLabel = `${label}[${index}]`;
    const block = requireRecord(blockValue, blockLabel);
    const type = requireString(block.type, `${blockLabel}.type`);

    if (type === "paragraph") {
      return {
        type,
        children: requireArray(block.children, `${blockLabel}.children`).map(
          (child, childIndex) =>
            mapTextInline(child, `${blockLabel}.children[${childIndex}]`),
        ),
      };
    }

    if (type === "heading") {
      const level = optionalInteger(block.level, `${blockLabel}.level`);

      if (level === undefined || level < 2 || level > 6) {
        throw new CmsInvalidResponseError(
          `Invalid Strapi response: ${blockLabel}.level must be from 2 to 6.`,
        );
      }

      return {
        type,
        level: level as 2 | 3 | 4 | 5 | 6,
        children: requireArray(block.children, `${blockLabel}.children`).map(
          (child, childIndex) =>
            mapTextInline(child, `${blockLabel}.children[${childIndex}]`),
        ),
      };
    }

    if (type === "list") {
      const format = requireString(block.format, `${blockLabel}.format`);

      if (format !== "ordered" && format !== "unordered") {
        throw new CmsInvalidResponseError(
          `Invalid Strapi response: ${blockLabel}.format is unsupported.`,
        );
      }

      return {
        type,
        format,
        children: requireArray(block.children, `${blockLabel}.children`).map(
          (child, childIndex) =>
            mapListItem(child, `${blockLabel}.children[${childIndex}]`),
        ),
      };
    }

    if (type === "image") {
      const image: RichTextImage = {
        type: "image",
        image: requireImage(block.image, baseUrl, `${blockLabel}.image`),
      };

      return image;
    }

    throw new CmsInvalidResponseError(
      `Invalid Strapi response: ${blockLabel}.type ${type} is unsupported.`,
    );
  });
}

function optionalBlocks(
  value: unknown,
  label: string,
  baseUrl: string,
): readonly RichTextBlock[] | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return mapBlocks(value, label, baseUrl);
}

function requireAnchor(value: unknown, label: string): string | undefined {
  const anchor = optionalString(value, label);

  if (anchor && !/^[a-z][a-z0-9-]*$/.test(anchor)) {
    throw new CmsInvalidResponseError(
      `Invalid Strapi response: ${label} must be a lowercase HTML anchor.`,
    );
  }

  return anchor;
}

function mapTextItem(value: unknown, label: string): OperationTextItem {
  const item = requireRecord(value, label);
  const sortOrder = optionalInteger(item.sortOrder, `${label}.sortOrder`);

  if (sortOrder !== undefined && sortOrder < 0) {
    throw new CmsInvalidResponseError(
      `Invalid Strapi response: ${label}.sortOrder must not be negative.`,
    );
  }

  return {
    title: optionalString(item.title, `${label}.title`),
    text: requireString(item.text, `${label}.text`),
    sortOrder,
  };
}

function mapStep(value: unknown, label: string): OperationStep {
  const step = requireRecord(value, label);
  const sortOrder = optionalInteger(step.sortOrder, `${label}.sortOrder`);

  if (sortOrder !== undefined && sortOrder < 0) {
    throw new CmsInvalidResponseError(
      `Invalid Strapi response: ${label}.sortOrder must not be negative.`,
    );
  }

  return {
    title: requireString(step.title, `${label}.title`),
    description: optionalString(step.description, `${label}.description`),
    sortOrder,
  };
}

function sortEditorialItems<T extends { sortOrder?: number }>(items: T[]): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort(
      (left, right) =>
        (left.item.sortOrder ?? left.index) -
        (right.item.sortOrder ?? right.index),
    )
    .map(({ item }) => item);
}

function mapContentSection(
  value: unknown,
  index: number,
  baseUrl: string,
): OperationContentSection {
  const label = `operation.contentSections[${index}]`;
  const section = requireRecord(value, label);
  const component = requireString(section.__component, `${label}.__component`);
  const base = {
    sectionKey: optionalString(section.sectionKey, `${label}.sectionKey`) ?? `section-${index + 1}`,
    anchor: optionalString(section.sectionKey, `${label}.sectionKey`) ?? `section-${index + 1}`,
    heading: optionalString(section.heading, `${label}.heading`),
    showInPageNavigation: requireBoolean(
      section.showInPageNavigation,
      `${label}.showInPageNavigation`,
    ),
  };

  if (component === "operation.rich-text-section") {
    return {
      ...base,
      type: "rich-text",
      body: mapBlocks(section.body, `${label}.body`, baseUrl),
    };
  }

  if (
    component === "operation.list-section" ||
    component === "operation.checklist-section"
  ) {
    const items = sortEditorialItems(
      requireArray(section.items, `${label}.items`).map((item, itemIndex) =>
        mapTextItem(item, `${label}.items[${itemIndex}]`),
      ),
    );
    const shared = {
      ...base,
      intro: optionalBlocks(section.intro, `${label}.intro`, baseUrl),
      items,
      outro: optionalBlocks(section.outro, `${label}.outro`, baseUrl),
    };

    return component === "operation.list-section"
      ? { ...shared, type: "list" }
      : { ...shared, type: "checklist" };
  }

  if (component === "operation.steps-section") {
    return {
      ...base,
      type: "steps",
      intro: optionalBlocks(section.intro, `${label}.intro`, baseUrl),
      steps: sortEditorialItems(
        requireArray(section.steps, `${label}.steps`).map((step, stepIndex) =>
          mapStep(step, `${label}.steps[${stepIndex}]`),
        ),
      ),
      outro: optionalBlocks(section.outro, `${label}.outro`, baseUrl),
    };
  }

  if (component === "operation.price-section") {
    return {
      ...base,
      type: "price",
      heading: requireString(section.heading, `${label}.heading`),
      intro: optionalBlocks(section.intro, `${label}.intro`, baseUrl),
      disclaimer: optionalBlocks(section.disclaimer, `${label}.disclaimer`, baseUrl),
    };
  }

  if (component === "operation.video") {
    return {
      ...base,
      type: "video",
      poster: requireImage(section.poster, baseUrl, `${label}.poster`),
      mp4: mapPortfolioMedia(section.mp4, baseUrl, `${label}.mp4`),
      webm: section.webm ? mapPortfolioMedia(section.webm, baseUrl, `${label}.webm`) : undefined,
    };
  }

  throw new CmsInvalidResponseError(
    `Invalid Strapi response: unsupported operation section ${component}.`,
  );
}

function validateUniqueSectionIdentifiers(
  sections: readonly OperationContentSection[],
): void {
  const sectionKeys = new Set<string>();
  const anchors = new Set<string>();

  for (const section of sections) {
    if (sectionKeys.has(section.sectionKey)) {
      throw new CmsInvalidResponseError(
        `Invalid Strapi response: duplicate sectionKey ${section.sectionKey}.`,
      );
    }
    sectionKeys.add(section.sectionKey);

    if (section.anchor) {
      if (anchors.has(section.anchor)) {
        throw new CmsInvalidResponseError(
          `Invalid Strapi response: duplicate anchor ${section.anchor}.`,
        );
      }
      anchors.add(section.anchor);
    }
  }
}

function mapStaticPageContentSection(
  value: unknown,
  index: number,
  baseUrl: string,
): StaticPageContentSection {
  const label = `staticPage.contentSections[${index}]`;
  const section = requireRecord(value, label);
  const component = requireString(section.__component, `${label}.__component`);
  const base = {
    sectionKey: requireString(section.sectionKey, `${label}.sectionKey`),
    heading: optionalString(section.heading, `${label}.heading`),
  };

  if (component === "static-page.rich-text-section") {
    return {
      ...base,
      type: "rich-text",
      body: mapBlocks(section.body, `${label}.body`, baseUrl),
    };
  }

  if (component === "static-page.checklist-section") {
    return {
      ...base,
      type: "checklist",
      intro: optionalBlocks(section.intro, `${label}.intro`, baseUrl),
      items: sortEditorialItems(
        requireArray(section.items, `${label}.items`).map((item, itemIndex) =>
          mapTextItem(item, `${label}.items[${itemIndex}]`),
        ),
      ),
      outro: optionalBlocks(section.outro, `${label}.outro`, baseUrl),
    };
  }

  if (component === "static-page.tests-section") {
    return {
      ...base,
      type: "tests",
      intro: optionalBlocks(section.intro, `${label}.intro`, baseUrl),
      items: sortEditorialItems(
        requireArray(section.items, `${label}.items`).map((item, itemIndex) =>
          mapTextItem(item, `${label}.items[${itemIndex}]`),
        ),
      ),
      outro: optionalBlocks(section.outro, `${label}.outro`, baseUrl),
    };
  }

  if (component === "static-page.card-grid-section") {
    return {
      ...base,
      type: "card-grid",
      cards: sortEditorialItems(
        requireArray(section.cards, `${label}.cards`).map((card, cardIndex) => {
          const cardLabel = `${label}.cards[${cardIndex}]`;
          const value = requireRecord(card, cardLabel);

          return {
            title: requireString(value.title, `${cardLabel}.title`),
            description: optionalString(value.description, `${cardLabel}.description`),
            href: requireNavigationHref(value.href, `${cardLabel}.href`),
            sortOrder: optionalInteger(value.sortOrder, `${cardLabel}.sortOrder`),
          };
        }),
      ),
    };
  }

  if (component === "static-page.faq-section") {
    return {
      ...base,
      type: "faq",
      items: requireArray(section.items, `${label}.items`).map((item, itemIndex) => {
        const itemLabel = `${label}.items[${itemIndex}]`;
        const value = requireRecord(item, itemLabel);

        return {
          question: requireString(value.question, `${itemLabel}.question`),
          answer: requireString(value.answer, `${itemLabel}.answer`),
        };
      }),
    };
  }

  throw new CmsInvalidResponseError(
    `Invalid Strapi response: unsupported static page section ${component}.`,
  );
}

function validateUniqueStaticPageSectionKeys(
  sections: readonly StaticPageContentSection[],
): void {
  const sectionKeys = new Set<string>();

  for (const section of sections) {
    if (sectionKeys.has(section.sectionKey)) {
      throw new CmsInvalidResponseError(
        `Invalid Strapi response: duplicate static page sectionKey ${section.sectionKey}.`,
      );
    }
    sectionKeys.add(section.sectionKey);
  }
}

function requireSharedSectionType(value: unknown, label: string): SharedSectionType {
  if (
    value !== "administrator" &&
    value !== "consultation" &&
    value !== "doctor-profile" &&
    value !== "operations-catalog" &&
    value !== "reviews" &&
    value !== "rich-text"
  ) {
    throw new CmsInvalidResponseError(`Invalid Strapi response: ${label} is unsupported.`);
  }

  return value;
}

function mapSharedSection(
  value: unknown,
  index: number,
  baseUrl: string,
  ownerLabel = "staticPage",
): SharedSection {
  const label = `${ownerLabel}.sharedSections[${index}]`;
  const section = requireRecord(value, label);
  const details = Array.isArray(section.details)
    ? section.details.map((detail, detailIndex) => requireString(detail, `${label}.details[${detailIndex}]`))
    : undefined;
  const highlights = Array.isArray(section.highlights)
    ? section.highlights.map((highlight, highlightIndex) => {
      const item = requireRecord(highlight, `${label}.highlights[${highlightIndex}]`);
      return {
        href: requireNavigationHref(item.href, `${label}.highlights[${highlightIndex}].href`),
        id: requireString(item.id, `${label}.highlights[${highlightIndex}].id`),
        title: requireString(item.title, `${label}.highlights[${highlightIndex}].title`),
      };
    })
    : undefined;
  const links = Array.isArray(section.links)
    ? section.links.map((link, linkIndex) => {
      const item = requireRecord(link, `${label}.links[${linkIndex}]`);
      return {
        href: requireNavigationHref(item.href, `${label}.links[${linkIndex}].href`),
        label: requireString(item.label, `${label}.links[${linkIndex}].label`),
      };
    })
    : undefined;

  return {
    sectionKey: requireString(section.sectionKey, `${label}.sectionKey`),
    internalName: requireString(section.internalName, `${label}.internalName`),
    type: requireSharedSectionType(section.type, `${label}.type`),
    heading: optionalString(section.heading, `${label}.heading`),
    description: optionalString(section.description, `${label}.description`),
    body: optionalBlocks(section.body, `${label}.body`, baseUrl),
    personName: optionalString(section.personName, `${label}.personName`),
    personRole: optionalString(section.personRole, `${label}.personRole`),
    ctaLabel: optionalString(section.ctaLabel, `${label}.ctaLabel`),
    ctaHref: section.ctaHref === undefined || section.ctaHref === null
      ? undefined
      : requireNavigationHref(section.ctaHref, `${label}.ctaHref`),
    details,
    highlights,
    links,
  };
}

function mapPrice(value: unknown, index: number): PriceItem | null {
  const label = `operation.prices[${index}]`;
  const price = requireRecord(value, label);
  const isActive = requireBoolean(price.isActive, `${label}.isActive`);
  const publishedAt = optionalString(price.publishedAt, `${label}.publishedAt`);

  if (!isActive || !publishedAt) {
    return null;
  }

  const type = requireString(price.priceType, `${label}.priceType`);

  if (
    type !== "fixed" &&
    type !== "from" &&
    type !== "range" &&
    type !== "on-request" &&
    type !== "included"
  ) {
    throw new CmsInvalidResponseError(
      `Invalid Strapi response: ${label}.priceType is unsupported.`,
    );
  }

  const amount = optionalInteger(price.amount, `${label}.amount`);
  const minAmount = optionalInteger(price.minAmount, `${label}.minAmount`);
  const maxAmount = optionalInteger(price.maxAmount, `${label}.maxAmount`);
  const amounts = [amount, minAmount, maxAmount];

  if (amounts.some((candidate) => candidate !== undefined && candidate <= 0)) {
    throw new CmsInvalidResponseError(
      `Invalid Strapi response: ${label} contains a non-positive amount.`,
    );
  }

  if (
    ((type === "fixed" || type === "from") &&
      (amount === undefined || minAmount !== undefined || maxAmount !== undefined)) ||
    (type === "range" &&
      (amount !== undefined ||
        minAmount === undefined ||
        maxAmount === undefined ||
        minAmount > maxAmount)) ||
    ((type === "on-request" || type === "included") &&
      amounts.some((candidate) => candidate !== undefined))
  ) {
    throw new CmsInvalidResponseError(
      `Invalid Strapi response: ${label} has inconsistent amounts.`,
    );
  }

  if (price.currency !== "RUB") {
    throw new CmsInvalidResponseError(
      `Invalid Strapi response: ${label}.currency is unsupported.`,
    );
  }

  for (const field of ["validFrom", "validUntil"] as const) {
    const date = optionalString(price[field], `${label}.${field}`);

    if (date && Number.isNaN(Date.parse(date))) {
      throw new CmsInvalidResponseError(
        `Invalid Strapi response: ${label}.${field} must be a date.`,
      );
    }
  }

  return {
    key: requireString(price.key, `${label}.key`),
    name: requireString(price.publicName, `${label}.publicName`),
    type,
    priceLabel: optionalString(price.priceLabel, `${label}.priceLabel`),
    amount,
    minAmount,
    maxAmount,
    currency: "RUB",
    unitLabel: optionalString(price.unitLabel, `${label}.unitLabel`),
    description: optionalString(price.description, `${label}.description`),
    note: optionalString(price.note, `${label}.note`),
  };
}

function requireContentStatus(
  value: unknown,
  label: string,
): OperationContent["contentStatus"] {
  if (value !== "empty" && value !== "partial" && value !== "ready") {
    throw new CmsInvalidResponseError(`Invalid Strapi response: ${label} is unsupported.`);
  }

  return value;
}

function mapImage(
  value: unknown,
  baseUrl: string,
  label: string,
): ImageAsset | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  const image = requireRecord(value, label);
  const path = requireString(image.url, `${label}.url`);
  const publicMediaUrl = process.env.MEDIA_PUBLIC_URL?.trim().replace(/\/$/, "");
  const isLegacyLocalUpload =
    path.startsWith("/uploads/")
    || path.startsWith("http://cms:1337/uploads/")
    || path.startsWith("http://localhost:1337/uploads/")
    || path.startsWith("http://127.0.0.1:1337/uploads/");
  const normalizedPath = isLegacyLocalUpload && publicMediaUrl
    ? `${publicMediaUrl}${path.replace(/^https?:\/\/[^/]+/, "").replace(/^\/uploads(?=\/)/, "")}`
    : path;
  const url = new URL(normalizedPath, `${baseUrl}/`);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new CmsInvalidResponseError(
      `Invalid Strapi response: ${label}.url must use HTTP or HTTPS.`,
    );
  }

  return {
    url: url.toString(),
    alternativeText: optionalString(
      image.alternativeText,
      `${label}.alternativeText`,
    ),
    width: optionalNumber(image.width, `${label}.width`),
    height: optionalNumber(image.height, `${label}.height`),
  };
}

function requireImage(value: unknown, baseUrl: string, label: string): ImageAsset {
  const image = mapImage(value, baseUrl, label);

  if (!image) {
    throw new CmsInvalidResponseError(
      `Invalid Strapi response: ${label} is required.`,
    );
  }

  return image;
}

function mapPortfolioMedia(
  value: unknown,
  baseUrl: string,
  label: string,
): PortfolioMediaAsset {
  const media = requireRecord(value, label);
  const mime = requireString(media.mime, `${label}.mime`);
  const mediaType = mime.startsWith("image/")
    ? "image"
    : mime.startsWith("video/")
      ? "video"
      : undefined;

  if (!mediaType) {
    throw new CmsInvalidResponseError(
      `Invalid Strapi response: ${label}.mime is unsupported.`,
    );
  }

  return {
    ...requireImage(value, baseUrl, label),
    mediaType,
    mime,
  };
}

function mapSiteImagePath(value: unknown, label: string): ImageAsset {
  const path = requireString(value, label);
  const publicMediaUrl = process.env.MEDIA_PUBLIC_URL?.trim().replace(/\/$/, "");
  const isLegacyLocalUpload =
    path.startsWith("/uploads/")
    || path.startsWith("http://cms:1337/uploads/")
    || path.startsWith("http://localhost:1337/uploads/")
    || path.startsWith("http://127.0.0.1:1337/uploads/");

  if (isLegacyLocalUpload && publicMediaUrl) {
    return {
      url: `${publicMediaUrl}${path.replace(/^https?:\/\/[^/]+/, "").replace(/^\/uploads(?=\/)/, "")}`,
    };
  }

  return { url: requireCanonicalPath(path, label) };
}

function requireCanonicalPath(value: unknown, label: string): string {
  const path = requireString(value, label);

  if (!path.startsWith("/") || path.includes("?") || path.includes("#")) {
    throw new CmsInvalidResponseError(
      `Invalid Strapi response: ${label} must be an absolute site path.`,
    );
  }

  return path;
}

function optionalCanonicalPath(
  value: unknown,
  label: string,
): string | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  return requireCanonicalPath(value, label);
}

function mapAction(value: unknown, label: string): ContentAction | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  const action = requireRecord(value, label);
  const variant = action.variant;

  if (
    variant !== "primary" &&
    variant !== "secondary" &&
    variant !== "outline" &&
    variant !== "ghost" &&
    variant !== "link"
  ) {
    throw new CmsInvalidResponseError(`Invalid Strapi response: ${label}.variant is unsupported.`);
  }

  return {
    label: requireString(action.label, `${label}.label`),
    href: requireString(action.href, `${label}.href`),
    variant,
    openInNewTab: requireBoolean(
      action.openInNewTab,
      `${label}.openInNewTab`,
    ),
  };
}

function mapSeo(value: unknown, baseUrl: string, label: string): SeoData {
  const seo = requireRecord(value, label);

  return {
    title: requireString(seo.metaTitle, `${label}.metaTitle`),
    description: requireString(
      seo.metaDescription,
      `${label}.metaDescription`,
    ),
    shareImage: mapImage(seo.shareImage, baseUrl, `${label}.shareImage`),
    canonicalPath: optionalCanonicalPath(
      seo.canonicalPath,
      `${label}.canonicalPath`,
    ),
    noIndex: requireBoolean(seo.noIndex, `${label}.noIndex`),
  };
}

function requireHexColor(value: unknown, label: string): string {
  const color = requireString(value, label);

  if (!/^#[0-9a-f]{6}$/i.test(color)) {
    throw new CmsInvalidResponseError(
      `Invalid Strapi response: ${label} must be a six-digit hexadecimal color.`,
    );
  }

  return color;
}

function requireBuilderFont(value: unknown, label: string): BuilderFont {
  if (value !== "geist" && value !== "system") {
    throw new CmsInvalidResponseError(
      `Invalid Strapi response: ${label} is unsupported.`,
    );
  }

  return value;
}

function mapBuilderTheme(value: unknown, label: string): BuilderTheme {
  const theme = requireRecord(value, label);

  return {
    accentColor: requireHexColor(theme.accentColor, `${label}.accentColor`),
    backgroundColor: requireHexColor(
      theme.backgroundColor,
      `${label}.backgroundColor`,
    ),
    textColor: requireHexColor(theme.textColor, `${label}.textColor`),
    headingFont: requireBuilderFont(theme.headingFont, `${label}.headingFont`),
    bodyFont: requireBuilderFont(theme.bodyFont, `${label}.bodyFont`),
  };
}

function mapBuilderBlock(
  value: unknown,
  index: number,
  baseUrl: string,
): BuilderBlock {
  const label = `builderPage.blocks[${index}]`;
  const block = requireRecord(value, label);
  const component = requireString(block.__component, `${label}.__component`);
  const base = {
    id: requireString(block.blockKey, `${label}.blockKey`),
    hidden:
      block.hidden === undefined
        ? undefined
        : requireBoolean(block.hidden, `${label}.hidden`),
  };

  if (component === "builder.hero") {
    const align = requireString(block.align, `${label}.align`);

    if (align !== "left" && align !== "center") {
      throw new CmsInvalidResponseError(
        `Invalid Strapi response: ${label}.align is unsupported.`,
      );
    }

    return {
      ...base,
      type: "hero",
      eyebrow: optionalString(block.eyebrow, `${label}.eyebrow`),
      heading: requireString(block.heading, `${label}.heading`),
      description: optionalString(block.description, `${label}.description`),
      image: mapImage(block.image, baseUrl, `${label}.image`),
      primaryAction: mapAction(block.primaryAction, `${label}.primaryAction`),
      secondaryAction: mapAction(
        block.secondaryAction,
        `${label}.secondaryAction`,
      ),
      align,
    };
  }

  if (component === "builder.rich-text") {
    return {
      ...base,
      type: "rich-text",
      heading: optionalString(block.heading, `${label}.heading`),
      body: mapBlocks(block.body, `${label}.body`, baseUrl),
    };
  }

  if (component === "builder.callout") {
    const tone = requireString(block.tone, `${label}.tone`);

    if (tone !== "default" && tone !== "accent" && tone !== "dark") {
      throw new CmsInvalidResponseError(
        `Invalid Strapi response: ${label}.tone is unsupported.`,
      );
    }

    return {
      ...base,
      type: "callout",
      title: optionalString(block.title, `${label}.title`),
      body: mapBlocks(block.body, `${label}.body`, baseUrl),
      tone,
    };
  }

  if (component === "builder.faq") {
    return {
      ...base,
      type: "faq",
      heading: optionalString(block.heading, `${label}.heading`),
      items: requireArray(block.items, `${label}.items`).map((item, itemIndex) => {
        const itemLabel = `${label}.items[${itemIndex}]`;
        const faqItem = requireRecord(item, itemLabel);

        return {
          question: requireString(faqItem.question, `${itemLabel}.question`),
          answer: requireString(faqItem.answer, `${itemLabel}.answer`),
        };
      }),
    };
  }

  throw new CmsInvalidResponseError(
    `Invalid Strapi response: unsupported builder block ${component}.`,
  );
}

function mapBuilderPage(
  value: Record<string, unknown>,
  baseUrl: string,
): BuilderPage {
  const blocks = requireArray(value.blocks, "builderPage.blocks").map(
    (block, index) => mapBuilderBlock(block, index, baseUrl),
  );
  const blockIds = new Set<string>();

  for (const block of blocks) {
    if (blockIds.has(block.id)) {
      throw new CmsInvalidResponseError(
        `Invalid Strapi response: duplicate builder block id ${block.id}.`,
      );
    }
    blockIds.add(block.id);
  }

  return {
    pageKey: requireString(value.pageKey, "builderPage.pageKey"),
    canonicalPath: requireCanonicalPath(
      value.canonicalPath,
      "builderPage.canonicalPath",
    ),
    internalName: requireString(value.internalName, "builderPage.internalName"),
    seo: mapSeo(value.seo, baseUrl, "builderPage.seo"),
    theme: mapBuilderTheme(value.theme, "builderPage.theme"),
    blocks,
    contentStatus: requireContentStatus(
      value.contentStatus,
      "builderPage.contentStatus",
    ),
  };
}

function mapCategory(value: unknown, index: number): OperationCategorySummary {
  const label = `operation.categories[${index}]`;
  const category = requireRecord(value, label);

  return {
    key: requireString(category.key, `${label}.key`),
    name: requireString(category.name, `${label}.name`),
    description: optionalString(category.description, `${label}.description`),
    hasLandingPage: requireBoolean(
      category.hasLandingPage,
      `${label}.hasLandingPage`,
    ),
    landingPageKey: optionalString(
      category.landingPageKey,
      `${label}.landingPageKey`,
    ),
  };
}

function mapCatalogLink(value: unknown, label: string): OperationCatalogLink {
  const operation = requireRecord(value, label);

  return {
    canonicalPath: requireCanonicalPath(
      operation.canonicalPath,
      `${label}.canonicalPath`,
    ),
    heading: requireString(operation.heading, `${label}.heading`),
  };
}

function mapCatalogGroup(
  value: unknown,
  index: number,
  baseUrl: string,
): OperationCatalogGroup {
  const label = `operationCatalog[${index}]`;
  const category = requireRecord(value, label);
  const operations = requireArray(category.operations, `${label}.operations`)
    .map((operation, operationIndex) =>
      mapCatalogLink(operation, `${label}.operations[${operationIndex}]`),
    );
  const featuredOperation = mapCatalogLink(
    category.featuredOperation,
    `${label}.featuredOperation`,
  );

  return {
    key: requireString(category.key, `${label}.key`),
    name: requireString(category.name, `${label}.name`),
    image: mapImage(category.catalogImage, baseUrl, `${label}.catalogImage`),
    featuredOperation,
    operations: [
      featuredOperation,
      ...operations.filter(
        (operation) => operation.canonicalPath !== featuredOperation.canonicalPath,
      ),
    ],
  };
}

function mapBlogCategory(value: unknown, index: number): BlogCategorySummary {
  const label = `blog.categories[${index}]`;
  const category = requireRecord(value, label);

  return {
    key: requireString(category.key, `${label}.key`),
    name: requireString(category.name, `${label}.name`),
  };
}

const READING_TIME_WORDS_PER_MINUTE = 180;

function collectArticleText(value: unknown, key?: string): string {
  if (typeof value === "string") {
    return key === "__component" || key === "sectionKey" ? "" : value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => collectArticleText(item)).join(" ");
  }
  if (!isRecord(value)) return "";

  return Object.entries(value)
    .filter(([entryKey]) => !["id", "documentId", "createdAt", "updatedAt", "publishedAt", "__component", "sectionKey"].includes(entryKey))
    .map(([entryKey, entryValue]) => collectArticleText(entryValue, entryKey))
    .join(" ");
}

function calculateArticleReadingTime(contentSections: unknown): number {
  const wordCount = collectArticleText(contentSections).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / READING_TIME_WORDS_PER_MINUTE));
}

function mapMediaPublicationSummary(
  value: unknown,
  index: number,
  baseUrl: string,
): MediaPublicationSummary {
  const label = `mediaPublications[${index}]`;
  const publication = requireRecord(value, label);
  const externalUrl = optionalString(
    publication.externalUrl,
    `${label}.externalUrl`,
  );
  const layoutVariant = requireString(
    publication.layoutVariant,
    `${label}.layoutVariant`,
  );
  if (layoutVariant !== "primary" && layoutVariant !== "featured") {
    throw new CmsInvalidResponseError(
      `Invalid Strapi response: ${label}.layoutVariant must be primary or featured.`,
    );
  }
  const sortOrder = optionalInteger(publication.sortOrder, `${label}.sortOrder`);
  if (sortOrder === undefined || sortOrder < 0) {
    throw new CmsInvalidResponseError(
      `Invalid Strapi response: ${label}.sortOrder must be a non-negative integer.`,
    );
  }

  return {
    slug: requireString(publication.slug, `${label}.slug`),
    canonicalPath: `/obo-mne/smi/${requireString(publication.slug, `${label}.slug`)}`,
    title: requireString(publication.title, `${label}.title`),
    excerpt: requireString(publication.excerpt, `${label}.excerpt`),
    sourceName: requireString(publication.sourceName, `${label}.sourceName`),
    ...(optionalString(publication.sourceDateLabel, `${label}.sourceDateLabel`)
      ? { sourceDateLabel: optionalString(publication.sourceDateLabel, `${label}.sourceDateLabel`) }
      : {}),
    sourceUrl: requireString(publication.sourceUrl, `${label}.sourceUrl`),
    ...(externalUrl ? { externalUrl } : {}),
    isExternal: requireBoolean(publication.isExternal, `${label}.isExternal`),
    layoutVariant,
    image: mapImage(publication.image, baseUrl, `${label}.image`),
    sortOrder,
    readingTimeMinutes: calculateArticleReadingTime(publication.contentSections),
  };
}

function mapBlogArticleSummary(
  value: unknown,
  index: number,
  baseUrl: string,
  pathPrefix = "/pacientam/blog",
): BlogArticleSummary {
  const label = `blog.articles[${index}]`;
  const article = requireRecord(value, label);
  const slug = requireString(article.slug, `${label}.slug`);
  return {
    slug,
    canonicalPath: `${pathPrefix}/${slug}`,
    title: requireString(article.title, `${label}.title`),
    excerpt: requireString(article.excerpt, `${label}.excerpt`),
    cover: mapImage(article.cover, baseUrl, `${label}.cover`),
    categories: article.categories === undefined
      ? []
      : requireArray(article.categories, `${label}.categories`).map(mapBlogCategory),
    publishedAt: requireString(article.publishedAt, `${label}.publishedAt`),
    readingTimeMinutes: calculateArticleReadingTime(article.contentSections),
    isFeatured: requireBoolean(article.isFeatured, `${label}.isFeatured`),
  };
}

function mapBlogContentSection(value: unknown, index: number, baseUrl: string): BlogContentSection {
  const label = `blog.contentSections[${index}]`;
  const section = requireRecord(value, label);
  const component = requireString(section.__component, `${label}.__component`);
  const sectionKey = requireString(section.sectionKey, `${label}.sectionKey`);

  if (component === "blog.rich-text-section") {
    return {
      type: "rich-text",
      sectionKey,
      heading: optionalString(section.heading, `${label}.heading`),
      body: mapBlocks(section.body, `${label}.body`, baseUrl),
    };
  }

  if (component === "blog.callout") {
    return {
      type: "callout",
      sectionKey,
      title: optionalString(section.title, `${label}.title`),
      body: mapBlocks(section.body, `${label}.body`, baseUrl),
    };
  }

  if (component === "blog.faq") {
    return {
      type: "faq",
      sectionKey,
      heading: optionalString(section.heading, `${label}.heading`),
      items: requireArray(section.items, `${label}.items`).map((item, itemIndex) => {
        const itemLabel = `${label}.items[${itemIndex}]`;
        const faqItem = requireRecord(item, itemLabel);
        return {
          question: requireString(faqItem.question, `${itemLabel}.question`),
          answer: requireString(faqItem.answer, `${itemLabel}.answer`),
        };
      }),
    };
  }

  throw new CmsInvalidResponseError(
    `Invalid Strapi response: unsupported blog section ${component}.`,
  );
}

function mapPortfolioCaseSummary(
  value: unknown,
  index: number,
  baseUrl: string,
): PortfolioCaseSummary {
  const label = `portfolio.cases[${index}]`;
  const portfolioCase = requireRecord(value, label);
  const tags = requireArray(portfolioCase.tags, `${label}.tags`).map(
    (tag, tagIndex) => requireString(tag, `${label}.tags[${tagIndex}]`),
  );

  return {
    slug: requireString(portfolioCase.slug, `${label}.slug`),
    canonicalPath: `/pacientam/portfolio/${requireString(portfolioCase.slug, `${label}.slug`)}`,
    title: requireString(portfolioCase.title, `${label}.title`),
    excerpt: optionalString(portfolioCase.excerpt, `${label}.excerpt`) ?? "",
    caseLabel: requireString(portfolioCase.caseLabel, `${label}.caseLabel`),
    resultTerm: requireString(portfolioCase.resultTerm, `${label}.resultTerm`),
    procedureSummary: requireString(
      portfolioCase.procedureSummary,
      `${label}.procedureSummary`,
    ),
    tags,
    cover: requireImage(portfolioCase.cover, baseUrl, `${label}.cover`),
    operations: requireArray(
      portfolioCase.operations,
      `${label}.operations`,
    ).map((operation, operationIndex) =>
      mapCatalogLink(operation, `${label}.operations[${operationIndex}]`),
    ),
    date: optionalString(portfolioCase.date, `${label}.date`),
    isFeatured: requireBoolean(
      portfolioCase.isFeatured,
      `${label}.isFeatured`,
    ),
  };
}

function mapPortfolioContentSection(
  value: unknown,
  index: number,
  baseUrl: string,
): PortfolioContentSection {
  const label = `portfolio.contentSections[${index}]`;
  const section = requireRecord(value, label);
  const component = requireString(section.__component, `${label}.__component`);
  const sectionKey = requireString(section.sectionKey, `${label}.sectionKey`);

  if (component === "portfolio.rich-text-section") {
    return {
      type: "rich-text",
      sectionKey,
      eyebrow: optionalString(section.eyebrow, `${label}.eyebrow`),
      heading: optionalString(section.heading, `${label}.heading`),
      body: mapBlocks(section.body, `${label}.body`, baseUrl),
    };
  }

  if (component === "portfolio.statement") {
    const tone = requireString(section.tone, `${label}.tone`);
    if (tone !== "dark" && tone !== "accent") {
      throw new CmsInvalidResponseError(
        `Invalid Strapi response: ${label}.tone is unsupported.`,
      );
    }
    return {
      type: "statement",
      sectionKey,
      text: requireString(section.text, `${label}.text`),
      tone,
    };
  }

  if (component === "portfolio.comparison") {
    return {
      type: "comparison",
      sectionKey,
      heading: optionalString(section.heading, `${label}.heading`),
      beforeImage: requireImage(
        section.beforeImage,
        baseUrl,
        `${label}.beforeImage`,
      ),
      afterImage: requireImage(
        section.afterImage,
        baseUrl,
        `${label}.afterImage`,
      ),
      beforeAlt: requireString(section.beforeAlt, `${label}.beforeAlt`),
      afterAlt: requireString(section.afterAlt, `${label}.afterAlt`),
      caption: optionalString(section.caption, `${label}.caption`),
    };
  }

  if (component === "portfolio.timeline-stage") {
    return {
      type: "timeline-stage",
      sectionKey,
      term: requireString(section.term, `${label}.term`),
      heading: optionalString(section.heading, `${label}.heading`),
      body: mapBlocks(section.body, `${label}.body`, baseUrl),
      media: requireArray(section.media, `${label}.media`).map(
        (item, itemIndex) =>
          mapPortfolioMedia(item, baseUrl, `${label}.media[${itemIndex}]`),
      ),
    };
  }

  if (component === "portfolio.gallery") {
    const presentation = requireString(
      section.presentation,
      `${label}.presentation`,
    );
    if (presentation !== "clinical" && presentation !== "lifestyle") {
      throw new CmsInvalidResponseError(
        `Invalid Strapi response: ${label}.presentation is unsupported.`,
      );
    }
    return {
      type: "gallery",
      sectionKey,
      heading: optionalString(section.heading, `${label}.heading`),
      caption: optionalString(section.caption, `${label}.caption`),
      images: requireArray(section.images, `${label}.images`).map(
        (image, imageIndex) =>
          requireImage(image, baseUrl, `${label}.images[${imageIndex}]`),
      ),
      presentation,
    };
  }

  if (component === "portfolio.quote") {
    return {
      type: "quote",
      sectionKey,
      text: requireString(section.text, `${label}.text`),
      attribution: optionalString(section.attribution, `${label}.attribution`),
      note: optionalString(section.note, `${label}.note`),
    };
  }

  if (component === "portfolio.video") {
    return {
      type: "video",
      sectionKey,
      heading: optionalString(section.heading, `${label}.heading`),
      poster: requireImage(section.poster, baseUrl, `${label}.poster`),
      mp4: mapPortfolioMedia(section.mp4, baseUrl, `${label}.mp4`),
      webm: section.webm ? mapPortfolioMedia(section.webm, baseUrl, `${label}.webm`) : undefined,
      caption: optionalString(section.caption, `${label}.caption`),
    };
  }

  throw new CmsInvalidResponseError(
    `Invalid Strapi response: unsupported portfolio section ${component}.`,
  );
}

function validateUniquePortfolioSectionKeys(
  sections: readonly PortfolioContentSection[],
): void {
  const sectionKeys = new Set<string>();

  for (const section of sections) {
    if (sectionKeys.has(section.sectionKey)) {
      throw new CmsInvalidResponseError(
        `Invalid Strapi response: duplicate portfolio sectionKey ${section.sectionKey}.`,
      );
    }
    sectionKeys.add(section.sectionKey);
  }
}

export class StrapiContentRepository implements ContentRepository {
  private readonly baseUrl: string;
  private readonly apiToken: string;
  private readonly fetchImplementation: typeof fetch;
  private readonly timeoutMs: number;

  constructor({
    baseUrl,
    apiToken,
    fetchImplementation = fetch,
    timeoutMs = 5_000,
  }: StrapiContentRepositoryOptions) {
    let parsedBaseUrl: URL;

    try {
      parsedBaseUrl = new URL(baseUrl);
    } catch {
      throw new CmsConfigurationError(
        "STRAPI_API_URL must be a valid absolute URL.",
      );
    }

    if (parsedBaseUrl.protocol !== "http:" && parsedBaseUrl.protocol !== "https:") {
      throw new CmsConfigurationError("STRAPI_API_URL must use HTTP or HTTPS.");
    }

    if (!apiToken) {
      throw new CmsConfigurationError(
        "STRAPI_API_TOKEN is required for the closed CMS API.",
      );
    }

    if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
      throw new CmsConfigurationError("CMS timeout must be a positive number.");
    }

    this.baseUrl = parsedBaseUrl.toString().replace(/\/$/, "");
    this.apiToken = apiToken;
    this.fetchImplementation = fetchImplementation;
    this.timeoutMs = timeoutMs;
  }

  async getSiteNavigation(): Promise<SiteNavigation | null> {
    const params = new URLSearchParams();
    params.set("populate[headerMenu][populate][links][populate][links]", "*");
    params.set("populate[footerColumns][populate][links]", "*");
    params.set("populate[socialLinks]", "*");
    params.set("populate[contact]", "*");

    const settings = await this.getSingle(
      "/api/site-setting",
      params,
      getSiteNavigationCacheTag(),
    );

    return settings ? mapSiteNavigation(settings) : null;
  }

  async getStaticPage(pageKey: string, canonicalPath?: string): Promise<StaticPageContent | null> {
    const params = this.createPublishedParams([
      "pageKey",
      "heading",
      "heroDescription",
    ]);
    const resolvedPageKey = canonicalPath ? getPageByRoute(canonicalPath)?.key : pageKey;
    if (!resolvedPageKey) return null;
    params.set("filters[pageKey][$eq]", resolvedPageKey);
    this.populatePageFields(params);
    params.delete("populate[primaryAction]");
    params.delete("populate[secondaryAction]");
    this.populateStaticPageContent(params);
    const page = await this.getFirst(
      "/api/static-pages",
      params,
      `static-page:${encodeURIComponent(canonicalPath ?? pageKey)}`,
      { noStore: Boolean(canonicalPath) },
    );

    if (!page) {
      return null;
    }

    const contentSections = Array.isArray(page.contentSections)
      ? requireArray(page.contentSections, "staticPage.contentSections").map(
        (section, index) => mapStaticPageContentSection(section, index, this.baseUrl),
      )
      : [];
    validateUniqueStaticPageSectionKeys(contentSections);

    return {
      pageKey: requireString(page.pageKey, "staticPage.pageKey"),
      canonicalPath: canonicalPath ?? undefined,
      seo: mapSeo(page.seo, this.baseUrl, "staticPage.seo"),
      heading: optionalString(page.heading, "staticPage.heading"),
      heroDescription: optionalString(
        page.heroDescription,
        "staticPage.heroDescription",
      ),
      heroImage: mapImage(
        page.heroImage,
        this.baseUrl,
        "staticPage.heroImage",
      ),
      contentSections,
      sharedSections: Array.isArray(page.sharedSections)
        ? requireArray(page.sharedSections, "staticPage.sharedSections").map(
          (section, index) => mapSharedSection(section, index, this.baseUrl),
        )
        : [],
    };
  }

  async getStaticPageByPath(path: string): Promise<StaticPageContent | null> {
    return this.getStaticPage("", path);
  }

  async getBuilderPageByPath(
    path: string,
    mode: ContentReadMode = "published",
  ): Promise<BuilderPage | null> {
    const params = this.createBuilderPageParams(mode);
    params.set("filters[canonicalPath][$eq]", path);
    this.populateBuilderPage(params);
    const page = await this.getFirst(
      "/api/builder-pages",
      params,
      getBuilderPageCacheTag(path),
      { noStore: mode === "draft" },
    );

    return page ? mapBuilderPage(page, this.baseUrl) : null;
  }

  async getOperationByPath(path: string): Promise<OperationContent | null> {
    const params = this.createPublishedParams([
      "slug",
      "canonicalPath",
      "heading",
      "breadcrumbLabel",
      "heroDescription",
    ]);
    params.set("filters[canonicalPath][$eq]", path);
    this.populatePageFields(params);
    params.delete("populate[primaryAction]");
    params.delete("populate[secondaryAction]");
    params.set("populate[categories][fields][0]", "key");
    params.set("populate[categories][fields][1]", "name");
    params.set("populate[categories][fields][2]", "description");
    params.set("populate[categories][fields][3]", "hasLandingPage");
    params.set("populate[categories][fields][4]", "landingPageKey");
    this.populateOperationContent(params);
    const operation = await this.getFirst(
      "/api/operations",
      params,
      getOperationCacheTag(path),
    );

    if (!operation) {
      return null;
    }

    const categories = requireArray(
      operation.categories,
      "operation.categories",
    ).map(mapCategory);
    const contentSections = requireArray(
      operation.contentSections,
      "operation.contentSections",
    ).map((section, index) => mapContentSection(section, index, this.baseUrl));
    const prices = requireArray(operation.prices, "operation.prices")
      .map(mapPrice)
      .filter((price): price is PriceItem => price !== null);

    validateUniqueSectionIdentifiers(contentSections);

    const canonicalPath = requireCanonicalPath(
      operation.canonicalPath,
      "operation.canonicalPath",
    );

    if (canonicalPath !== path) {
      throw new CmsInvalidResponseError(
        "CMS returned an operation with an unexpected canonical path.",
      );
    }

    return {
      slug: requireString(operation.slug, "operation.slug"),
      canonicalPath,
      heading: requireString(operation.heading, "operation.heading"),
      breadcrumbLabel: optionalString(
        operation.breadcrumbLabel,
        "operation.breadcrumbLabel",
      ),
      heroDescription: optionalString(
        operation.heroDescription,
        "operation.heroDescription",
      ),
      heroImage: mapImage(
        operation.heroImage,
        this.baseUrl,
        "operation.heroImage",
      ),
      seo: mapSeo(operation.seo, this.baseUrl, "operation.seo"),
      categories,
      prices,
      contentSections,
    };
  }

  async getOperationPaths(): Promise<readonly string[]> {
    const params = this.createPublishedParams(["canonicalPath"]);
    params.set("pagination[pageSize]", "100");
    params.set("sort[0]", "canonicalPath:asc");

    const operations = await this.getMany(
      "/api/operations",
      params,
      getOperationPathsCacheTag(),
    );

    return operations.map((value, index) => {
      const operation = requireRecord(value, `operations[${index}]`);
      return requireCanonicalPath(
        operation.canonicalPath,
        `operations[${index}].canonicalPath`,
      );
    });
  }

  async getOperationCatalog(): Promise<readonly OperationCatalogGroup[]> {
    const params = this.createPublishedParams([
      "key",
      "name",
      "catalogOrder",
    ]);
    params.set("pagination[pageSize]", "20");
    params.set("filters[showInCatalog][$eq]", "true");
    params.set("sort[0]", "catalogOrder:asc");
    params.set("populate[catalogImage][fields][0]", "url");
    params.set("populate[catalogImage][fields][1]", "alternativeText");
    params.set("populate[catalogImage][fields][2]", "width");
    params.set("populate[catalogImage][fields][3]", "height");
    ["canonicalPath", "heading", "catalogOrder"].forEach((field, index) => {
      params.set(`populate[featuredOperation][fields][${index}]`, field);
      params.set(`populate[operations][fields][${index}]`, field);
    });

    const categories = await this.getMany(
      "/api/operation-categories",
      params,
      getOperationCatalogCacheTag(),
    );

    return categories.map((category, index) =>
      mapCatalogGroup(category, index, this.baseUrl),
    );
  }

  async getPriceCatalog(): Promise<PriceCatalogContent | null> {
    const params = this.createPublishedParams([
      "sectionKey",
      "title",
      "accent",
      "note",
      "kind",
    ]);
    params.set("pagination[pageSize]", "100");
    params.set("sort[0]", "sortOrder:asc");
    [
      "key",
      "internalName",
      "publicName",
      "priceType",
      "priceLabel",
      "amount",
      "minAmount",
      "maxAmount",
      "currency",
      "unitLabel",
      "description",
      "note",
      "isActive",
      "validFrom",
      "validUntil",
      "publishedAt",
    ].forEach((field, index) => {
      params.set(`populate[entries][fields][${index}]`, field);
    });
    params.set("populate[entries][sort][0]", "sortOrder:asc");
    params.set("populate[entries][filters][publishedAt][$notNull]", "true");

    const sections = await this.getMany(
      "/api/price-sections",
      params,
      getPriceCatalogCacheTag(),
    );

    if (sections.length === 0) {
      return null;
    }

    const mappedSections = sections.map((value, index) => {
      const label = `priceCatalog.sections[${index}]`;
      const section = requireRecord(value, label);
      const kind = requireString(section.kind, `${label}.kind`);

      if (kind !== "standalone" && kind !== "women-tab") {
        throw new CmsInvalidResponseError(
          `Invalid Strapi response: ${label}.kind is unsupported.`,
        );
      }

      const entries = requireArray(section.entries, `${label}.entries`)
        .map((entry, entryIndex) => mapPrice(entry, entryIndex))
        .filter((entry): entry is PriceItem => entry !== null)
        .map((entry) => ({
          name: entry.name,
          description: entry.description,
          price: formatPriceItem(entry),
        }));

      return {
        key: requireString(section.sectionKey, `${label}.sectionKey`),
        title: requireString(section.title, `${label}.title`),
        accent: optionalString(section.accent, `${label}.accent`),
        note: optionalString(section.note, `${label}.note`),
        kind: kind as PriceCatalogSection["kind"],
        sortOrder: optionalInteger(section.sortOrder, `${label}.sortOrder`),
        entries,
      };
    });

    return {
      womenNote: mappedSections.find((section) => section.kind === "women-tab" && section.note)?.note,
      sections: mappedSections,
    };
  }

  async getPromotions(): Promise<readonly Promotion[]> {
    const params = this.createPublishedParams([
      "title",
      "subtitle",
      "href",
      "validUntil",
      "sortOrder",
      "isActive",
    ]);
    params.set("pagination[pageSize]", "100");
    params.set("sort[0]", "sortOrder:asc");
    params.set("filters[isActive][$eq]", "true");
    params.set("populate[description][fields][0]", "text");
    params.set("populate[description][fields][1]", "sortOrder");
    params.set("populate[description][sort][0]", "sortOrder:asc");

    const promotions = await this.getMany(
      "/api/promotions",
      params,
      getPromotionsCacheTag(),
    );

    const today = getTodayInMoscow();

    return promotions.map((value, index) => {
      const label = `promotions[${index}]`;
      const promotion = requireRecord(value, label);
      const description = requireArray(promotion.description, `${label}.description`)
        .map((item, itemIndex) => {
          const paragraph = requireRecord(item, `${label}.description[${itemIndex}]`);
          return {
            text: requireString(paragraph.text, `${label}.description[${itemIndex}].text`),
            sortOrder: optionalInteger(paragraph.sortOrder, `${label}.description[${itemIndex}].sortOrder`),
          };
        })
        .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0))
        .map((paragraph) => paragraph.text);

      return {
        key: `promotion-${index + 1}`,
        title: requireString(promotion.title, `${label}.title`),
        subtitle: optionalString(promotion.subtitle, `${label}.subtitle`),
        description,
        href: requireString(promotion.href, `${label}.href`),
        validUntil: optionalString(promotion.validUntil, `${label}.validUntil`),
        sortOrder: optionalInteger(promotion.sortOrder, `${label}.sortOrder`),
      };
    }).filter((promotion) => !promotion.validUntil || promotion.validUntil.slice(0, 10) >= today);
  }

  async getAboutPage(): Promise<AboutPageContent | null> {
    const params = new URLSearchParams({ status: "published" });
    ["profileHeading", "profileLead", "profileHighlights", "educationRecords", "qualifications", "awards", "associations", "journalArticles", "theses", "ratings"].forEach((field, index) => {
      params.set(`fields[${index}]`, field);
    });

    params.set("filters[pageKey][$eq]", "about");
    const page = await this.getFirst("/api/about-pages", params, getAboutPageCacheTag());

    if (!page) {
      return null;
    }

    const highlights = requireArray(page.profileHighlights, "aboutPage.profileHighlights").map((value, index) =>
      requireString(value, `aboutPage.profileHighlights[${index}]`),
    );
    const educationRecords = requireArray(page.educationRecords, "aboutPage.educationRecords").map((value, index) => {
      const label = `aboutPage.educationRecords[${index}]`;
      const record = requireRecord(value, label);
      return {
        title: requireString(record.title, `${label}.title`),
        year: requireString(record.year, `${label}.year`),
        field: requireString(record.field, `${label}.field`),
        typeLabel: requireString(record.typeLabel, `${label}.typeLabel`),
      };
    });

    const records = (field: string) => requireArray(page[field], `aboutPage.${field}`).map((value, index) => {
      const label = `aboutPage.${field}[${index}]`;
      const record = requireRecord(value, label);
      return {
        title: requireString(record.title, `${label}.title`),
        year: requireString(record.year, `${label}.year`),
      };
    });
    const publicationRecords = (field: string) => requireArray(page[field], `aboutPage.${field}`).map((value, index) => {
      const label = `aboutPage.${field}[${index}]`;
      const record = requireRecord(value, label);
      return {
        href: requireString(record.href, `${label}.href`),
        source: optionalString(record.source, `${label}.source`),
        title: requireString(record.title, `${label}.title`),
        year: requireString(record.year, `${label}.year`),
      };
    });
    const ratings = requireArray(page.ratings, "aboutPage.ratings").map((value, index) => {
      const label = `aboutPage.ratings[${index}]`;
      const record = requireRecord(value, label);
      return {
        label: requireString(record.label, `${label}.label`),
        value: requireString(record.value, `${label}.value`),
      };
    });

    return {
      profileHeading: requireString(page.profileHeading, "aboutPage.profileHeading"),
      profileLead: requireString(page.profileLead, "aboutPage.profileLead"),
      profileHighlights: highlights,
      educationRecords,
      qualifications: records("qualifications"),
      awards: records("awards"),
      associations: requireArray(page.associations, "aboutPage.associations").map((value, index) => requireString(value, `aboutPage.associations[${index}]`)),
      journalArticles: publicationRecords("journalArticles"),
      theses: publicationRecords("theses"),
      ratings,
    };
  }

  async getBeforeAfterCases(): Promise<readonly BeforeAfterCase[]> {
    const params = this.createPublishedParams([
      "slug",
      "title",
      "date",
      "isFeatured",
    ]);
    params.set("pagination[pageSize]", "100");
    params.set("sort[0]", "isFeatured:desc");
    params.set("sort[1]", "date:desc");
    ["url", "alternativeText", "width", "height"].forEach((field, index) => {
      params.set(`populate[image][fields][${index}]`, field);
    });
    params.set("populate[operation][fields][0]", "canonicalPath");
    params.set("populate[operation][fields][1]", "heading");

    const cases = await this.getMany(
      "/api/before-after-cases",
      params,
      getBeforeAfterCasesCacheTag(),
    );

    return cases.map((entry, index) => {
      const label = `beforeAfterCases[${index}]`;
      const item = requireRecord(entry, label);
      const image = mapImage(item.image, this.baseUrl, `${label}.image`);

      if (!image) {
        return null;
      }

      return {
        slug: requireString(item.slug, `${label}.slug`),
        title: requireString(item.title, `${label}.title`),
        image,
        operation: mapCatalogLink(item.operation, `${label}.operation`),
        date: optionalString(item.date, `${label}.date`),
        isFeatured: optionalBoolean(item.isFeatured, `${label}.isFeatured`) ?? false,
      };
    }).filter((item): item is BeforeAfterCase => item !== null);
  }

  async getBeforeAfterCaseBySlug(slug: string): Promise<BeforeAfterCase | null> {
    const params = this.createPublishedParams([
      "slug",
      "title",
      "date",
      "isFeatured",
    ]);
    params.set("filters[slug][$eq]", slug);
    ["url", "alternativeText", "width", "height"].forEach((field, index) => {
      params.set(`populate[image][fields][${index}]`, field);
    });
    params.set("populate[operation][fields][0]", "canonicalPath");
    params.set("populate[operation][fields][1]", "heading");

    const entry = await this.getFirst(
      "/api/before-after-cases",
      params,
      `before-after-case:${encodeURIComponent(slug)}`,
    );

    if (!entry) {
      return null;
    }

    const item = requireRecord(entry, `beforeAfterCase:${slug}`);

    return {
      slug: requireString(item.slug, `beforeAfterCase:${slug}.slug`),
      title: requireString(item.title, `beforeAfterCase:${slug}.title`),
      image: requireImage(item.image, this.baseUrl, `beforeAfterCase:${slug}.image`),
      operation: mapCatalogLink(item.operation, `beforeAfterCase:${slug}.operation`),
      date: optionalString(item.date, `beforeAfterCase:${slug}.date`),
      isFeatured: optionalBoolean(item.isFeatured, `beforeAfterCase:${slug}.isFeatured`) ?? false,
    };
  }

  async getReviews(): Promise<readonly Review[]> {
    const params = this.createPublishedParams([
      "slug",
      "title",
      "text",
      "source",
      "kind",
      "imageUrl",
      "imageAlt",
      "externalUrl",
      "sortOrder",
    ]);
    params.set("pagination[pageSize]", "100");
    params.set("sort[0]", "sortOrder:asc");
    params.set("populate[operation][fields][0]", "canonicalPath");
    params.set("populate[operation][fields][1]", "heading");

    const reviews = await this.getMany(
      "/api/reviews",
      params,
      getReviewsCacheTag(),
    );

    return reviews.map((entry, index) => {
      const label = `reviews[${index}]`;
      const item = requireRecord(entry, label);

      const kind = requireString(item.kind, `${label}.kind`);

      if (kind !== "patient" && kind !== "prodoctorov" && kind !== "social" && kind !== "video") {
        throw new CmsInvalidResponseError(`Invalid Strapi response: ${label}.kind is unsupported.`);
      }

      const operation = item.operation === null || item.operation === undefined
        ? undefined
        : mapCatalogLink(item.operation, `${label}.operation`);

      return {
        slug: requireString(item.slug, `${label}.slug`),
        title: requireString(item.title, `${label}.title`),
        text: requireString(item.text, `${label}.text`),
        source: requireString(item.source, `${label}.source`),
        kind: kind as ReviewKind,
        image: {
          url: requireHttpUrl(item.imageUrl, `${label}.imageUrl`),
          alternativeText: optionalString(item.imageAlt, `${label}.imageAlt`),
        },
        externalUrl: optionalHttpUrl(item.externalUrl, `${label}.externalUrl`),
        operation,
      };
    });
  }

  async getFinalResults(): Promise<readonly FinalResult[]> {
    const params = this.createPublishedParams([
      "slug",
      "title",
      "date",
    ]);
    params.set("pagination[pageSize]", "100");
    params.set("sort[0]", "date:desc");
    ["url", "alternativeText", "width", "height"].forEach((field, index) => {
      params.set(`populate[image][fields][${index}]`, field);
    });
    params.set("populate[operation][fields][0]", "canonicalPath");
    params.set("populate[operation][fields][1]", "heading");
    params.set("populate[operationCategory][fields][0]", "key");

    const results = await this.getMany(
      "/api/final-results",
      params,
      getFinalResultsCacheTag(),
    );

    return results.map((entry, index) => {
      const label = `finalResults[${index}]`;
      const item = requireRecord(entry, label);
      const category = requireRecord(item.operationCategory, `${label}.operationCategory`);

      return {
        slug: requireString(item.slug, `${label}.slug`),
        title: requireString(item.title, `${label}.title`),
        image: {
          ...requireImage(item.image, this.baseUrl, `${label}.image`),
          alternativeText: requireString(item.title, `${label}.title`),
        },
        categoryKey: requireString(category.key, `${label}.operationCategory.key`),
        operation: mapCatalogLink(item.operation, `${label}.operation`),
      };
    });
  }

  async getBlogIndex(): Promise<BlogIndexContent> {
    const categoryParams = this.createPublishedParams(["key", "name", "order"]);
    categoryParams.set("pagination[pageSize]", "100");
    categoryParams.set("sort[0]", "order:asc");
    const articleParams = this.createArticleSummaryParams();
    this.populateBlogSummaryFields(articleParams, true);

    const [categories, articles] = await Promise.all([
      this.getMany("/api/blog-categories", categoryParams, getBlogIndexCacheTag()),
      this.getMany("/api/blog-articles", articleParams, getBlogIndexCacheTag()),
    ]);

    return {
      categories: categories.map(mapBlogCategory),
      articles: articles.map((article, index) =>
        mapBlogArticleSummary(article, index, this.baseUrl, "/pacientam/blog"),
      ),
    };
  }

  async getPortfolioIndex(): Promise<PortfolioIndexContent> {
    const params = this.createPortfolioSummaryParams();
    this.populatePortfolioSummaryFields(params);
    const cases = await this.getMany(
      "/api/portfolio-cases",
      params,
      getPortfolioIndexCacheTag(),
    );

    return {
      cases: cases.map((portfolioCase, index) =>
        mapPortfolioCaseSummary(portfolioCase, index, this.baseUrl),
      ),
    };
  }

  async getVideoCases(): Promise<readonly VideoCase[]> {
    const params = this.createPublishedParams(["slug", "title", "location", "year", "sortOrder"]);
    params.set("pagination[pageSize]", "100");
    params.set("sort[0]", "sortOrder:asc");
    ["poster", "mp4", "webm"].forEach((relation) => {
      ["url", "alternativeText", "width", "height", "mime"].forEach((field, index) => {
        params.set(`populate[${relation}][fields][${index}]`, field);
      });
    });

    const entries = await this.getMany("/api/video-cases", params, "video-cases");
    return entries.map((value, index) => {
      const label = `videoCases[${index}]`;
      const item = requireRecord(value, label);
      return {
        slug: requireString(item.slug, `${label}.slug`),
        title: requireString(item.title, `${label}.title`),
        location: requireString(item.location, `${label}.location`),
        year: optionalString(item.year, `${label}.year`) ?? "",
        poster: requireImage(item.poster, this.baseUrl, `${label}.poster`),
        mp4: requireImage(item.mp4, this.baseUrl, `${label}.mp4`).url,
        webm: item.webm ? requireImage(item.webm, this.baseUrl, `${label}.webm`).url : undefined,
      };
    });
  }

  async getPortfolioCaseBySlug(slug: string): Promise<PortfolioCase | null> {
    const params = this.createPublishedParams([
      "slug",
      "title",
      "excerpt",
      "caseLabel",
      "resultTerm",
      "procedureSummary",
      "tags",
      "date",
      "isFeatured",
    ]);
    params.set("filters[slug][$eq]", slug);
    this.populatePortfolioSummaryFields(params);
    params.set("populate[seo][fields][0]", "metaTitle");
    params.set("populate[seo][fields][1]", "metaDescription");
    params.set("populate[seo][fields][2]", "canonicalPath");
    params.set("populate[seo][fields][3]", "noIndex");
    ["url", "alternativeText", "width", "height"].forEach((field, index) => {
      params.set(`populate[seo][populate][shareImage][fields][${index}]`, field);
    });
    this.populatePortfolioContent(params);

    const portfolioCase = await this.getFirst(
      "/api/portfolio-cases",
      params,
      getPortfolioCaseCacheTag(slug),
    );
    if (!portfolioCase) return null;

    const contentSections = requireArray(
      portfolioCase.contentSections,
      "portfolio.contentSections",
    ).map((section, index) =>
      mapPortfolioContentSection(section, index, this.baseUrl),
    );
    validateUniquePortfolioSectionKeys(contentSections);

    return {
      ...mapPortfolioCaseSummary(portfolioCase, 0, this.baseUrl),
      seo: mapSeo(portfolioCase.seo, this.baseUrl, "portfolio.seo"),
      contentSections,
    };
  }

  async getConditionIndex(): Promise<BlogIndexContent> {
    const articleParams = this.createArticleSummaryParams();
    articleParams.set("sort[0]", "publishedAt:desc");
    this.populateBlogSummaryFields(articleParams, false);
    const articles = await this.getMany(
      "/api/condition-articles",
      articleParams,
      getConditionIndexCacheTag(),
    );

    return {
      categories: [],
      articles: articles.map((article, index) =>
        mapBlogArticleSummary(article, index, this.baseUrl, "/pacientam/pro-bolezni"),
      ),
    };
  }

  async getBlogArticleBySlug(slug: string): Promise<BlogArticle | null> {
    return this.getArticleBySlug(slug, {
      endpoint: "/api/blog-articles",
      cacheTag: getBlogArticleCacheTag(slug),
      includeCategories: true,
      pathPrefix: "/pacientam/blog",
    });
  }

  async getMediaPublicationIndex(): Promise<MediaPublicationIndexContent> {
    const params = this.createPublishedParams([
      "slug",
      "title",
      "excerpt",
      "sourceName",
      "sourceDateLabel",
      "sourceUrl",
      "externalUrl",
      "isExternal",
      "layoutVariant",
    ]);
    params.set("pagination[pageSize]", "100");
    params.set("sort[0]", "sortOrder:asc");
    ["url", "alternativeText", "width", "height"].forEach((field, index) => {
      params.set(`populate[image][fields][${index}]`, field);
    });
    params.set("populate[contentSections][populate]", "*");

    const publications = await this.getMany(
      "/api/media-publications",
      params,
      getMediaPublicationIndexCacheTag(),
    );

    return {
      publications: publications.map((publication, index) =>
        mapMediaPublicationSummary(publication, index, this.baseUrl),
      ),
    };
  }

  async getMediaPublicationBySlug(
    slug: string,
  ): Promise<MediaPublication | null> {
    const params = this.createPublishedParams([
      "slug",
      "title",
      "excerpt",
      "sourceName",
      "sourceDateLabel",
      "sourceUrl",
      "externalUrl",
      "isExternal",
      "layoutVariant",
      "sortOrder",
    ]);
    params.set("filters[slug][$eq]", slug);
    ["url", "alternativeText", "width", "height"].forEach((field, index) => {
      params.set(`populate[image][fields][${index}]`, field);
    });
    params.set("populate[seo][fields][0]", "metaTitle");
    params.set("populate[seo][fields][1]", "metaDescription");
    params.set("populate[seo][fields][2]", "canonicalPath");
    params.set("populate[seo][fields][3]", "noIndex");
    params.set(
      "populate[contentSections][on][blog.rich-text-section][fields][0]",
      "sectionKey",
    );
    params.set(
      "populate[contentSections][on][blog.rich-text-section][fields][1]",
      "heading",
    );
    params.set(
      "populate[contentSections][on][blog.rich-text-section][fields][2]",
      "body",
    );

    const publication = await this.getFirst(
      "/api/media-publications",
      params,
      getMediaPublicationCacheTag(slug),
    );
    if (!publication) return null;

    const contentSections = requireArray(
      publication.contentSections,
      "mediaPublication.contentSections",
    ).map((section, index) =>
      mapBlogContentSection(section, index, this.baseUrl),
    );

    return {
      ...mapMediaPublicationSummary(publication, 0, this.baseUrl),
      seo: publication.seo
        ? mapSeo(publication.seo, this.baseUrl, "mediaPublication.seo")
        : undefined,
      contentSections,
    };
  }

  async getConditionArticleBySlug(slug: string): Promise<BlogArticle | null> {
    return this.getArticleBySlug(slug, {
      endpoint: "/api/condition-articles",
      cacheTag: getConditionArticleCacheTag(slug),
      includeCategories: false,
      pathPrefix: "/pacientam/pro-bolezni",
    });
  }

  private async getArticleBySlug(
    slug: string,
    source: { endpoint: string; cacheTag: string; includeCategories: boolean; pathPrefix: string },
  ): Promise<BlogArticle | null> {
    const params = this.createPublishedParams([
      "slug", "title", "excerpt", "isFeatured", "publishedAt",
    ]);
    params.set("filters[slug][$eq]", slug);
    this.populateBlogSummaryFields(params, source.includeCategories);
    params.set("populate[seo][fields][0]", "metaTitle");
    params.set("populate[seo][fields][1]", "metaDescription");
    params.set("populate[seo][fields][2]", "canonicalPath");
    params.set("populate[seo][fields][3]", "noIndex");
    params.set("populate[seo][populate][shareImage][fields][0]", "url");
    params.set("populate[contentSections][on][blog.rich-text-section][fields][0]", "sectionKey");
    params.set("populate[contentSections][on][blog.rich-text-section][fields][1]", "heading");
    params.set("populate[contentSections][on][blog.rich-text-section][fields][2]", "body");
    params.set("populate[contentSections][on][blog.callout][fields][0]", "sectionKey");
    params.set("populate[contentSections][on][blog.callout][fields][1]", "title");
    params.set("populate[contentSections][on][blog.callout][fields][2]", "body");
    params.set("populate[contentSections][on][blog.faq][fields][0]", "sectionKey");
    params.set("populate[contentSections][on][blog.faq][fields][1]", "heading");
    params.set("populate[contentSections][on][blog.faq][populate][items][fields][0]", "question");
    params.set("populate[contentSections][on][blog.faq][populate][items][fields][1]", "answer");
    params.set("populate[relatedOperations][fields][0]", "canonicalPath");
    params.set("populate[relatedOperations][fields][1]", "heading");

    const article = await this.getFirst(
      source.endpoint,
      params,
      source.cacheTag,
    );
    if (!article) return null;

    return {
      ...mapBlogArticleSummary(article, 0, this.baseUrl, source.pathPrefix),
      seo: mapSeo(article.seo, this.baseUrl, "blog.seo"),
      contentSections: requireArray(article.contentSections, "blog.contentSections").map((section, index) => mapBlogContentSection(section, index, this.baseUrl)),
      relatedOperations: requireArray(article.relatedOperations, "blog.relatedOperations").map((operation, index) =>
        mapCatalogLink(operation, `blog.relatedOperations[${index}]`),
      ),
    };
  }

  private createPublishedParams(fields: readonly string[]): URLSearchParams {
    const params = new URLSearchParams({
      "pagination[pageSize]": "2",
      status: "published",
    });

    fields.forEach((field, index) => {
      params.set(`fields[${index}]`, field);
    });

    return params;
  }

  private createBuilderPageParams(mode: ContentReadMode): URLSearchParams {
    const params = new URLSearchParams({
      "pagination[pageSize]": "2",
      status: mode,
    });

    ["internalName", "pageKey", "canonicalPath", "contentStatus"].forEach(
      (field, index) => {
        params.set(`fields[${index}]`, field);
      },
    );

    return params;
  }

  private createArticleSummaryParams(): URLSearchParams {
    const params = this.createPublishedParams([
      "slug", "title", "excerpt", "isFeatured", "publishedAt",
    ]);
    params.set("pagination[pageSize]", "100");
    params.set("sort[0]", "isFeatured:desc");
    params.set("sort[1]", "publishedAt:desc");
    return params;
  }

  private createPortfolioSummaryParams(): URLSearchParams {
    const params = this.createPublishedParams([
      "slug",
      "title",
      "excerpt",
      "caseLabel",
      "resultTerm",
      "procedureSummary",
      "tags",
      "date",
      "isFeatured",
    ]);
    params.set("pagination[pageSize]", "100");
    params.set("sort[0]", "isFeatured:desc");
    params.set("sort[1]", "date:desc");
    return params;
  }

  private populatePageFields(params: URLSearchParams): void {
    params.set("populate[seo][populate][shareImage][fields][0]", "url");
    params.set(
      "populate[seo][populate][shareImage][fields][1]",
      "alternativeText",
    );
    params.set("populate[seo][populate][shareImage][fields][2]", "width");
    params.set("populate[seo][populate][shareImage][fields][3]", "height");
    params.set("populate[heroImage][fields][0]", "url");
    params.set("populate[heroImage][fields][1]", "alternativeText");
    params.set("populate[heroImage][fields][2]", "width");
    params.set("populate[heroImage][fields][3]", "height");
    params.set("populate[primaryAction]", "true");
    params.set("populate[secondaryAction]", "true");
  }

  private populateStaticPageContent(params: URLSearchParams): void {
    const sectionComponents = [
      "static-page.rich-text-section",
      "static-page.checklist-section",
      "static-page.tests-section",
      "static-page.card-grid-section",
      "static-page.faq-section",
    ];

    sectionComponents.forEach((component) => {
      params.set(
        `populate[contentSections][on][${component}][fields][0]`,
        "sectionKey",
      );
      params.set(
        `populate[contentSections][on][${component}][fields][1]`,
        "heading",
      );
    });

    params.set(
      "populate[contentSections][on][static-page.rich-text-section][fields][2]",
      "body",
    );
    params.set(
      "populate[contentSections][on][static-page.checklist-section][fields][2]",
      "intro",
    );
    params.set(
      "populate[contentSections][on][static-page.checklist-section][fields][3]",
      "outro",
    );
    params.set(
      "populate[contentSections][on][static-page.tests-section][fields][2]",
      "intro",
    );
    params.set(
      "populate[contentSections][on][static-page.tests-section][fields][3]",
      "outro",
    );
    ["title", "text", "sortOrder"].forEach((field, index) => {
      params.set(
        `populate[contentSections][on][static-page.checklist-section][populate][items][fields][${index}]`,
        field,
      );
    });
    ["title", "description", "href", "sortOrder"].forEach((field, index) => {
      params.set(
        `populate[contentSections][on][static-page.card-grid-section][populate][cards][fields][${index}]`,
        field,
      );
    });
    ["question", "answer"].forEach((field, index) => {
      params.set(
        `populate[contentSections][on][static-page.faq-section][populate][items][fields][${index}]`,
        field,
      );
    });
    ["title", "text", "sortOrder"].forEach((field, index) => {
      params.set(
        `populate[contentSections][on][static-page.tests-section][populate][items][fields][${index}]`,
        field,
      );
    });

    ["sectionKey", "internalName", "type", "heading", "description", "body", "personName", "personRole", "ctaLabel", "ctaHref", "details", "highlights", "links"].forEach((field, index) => {
      params.set(`populate[sharedSections][fields][${index}]`, field);
    });
  }

  private populateBuilderPage(params: URLSearchParams): void {
    params.set("populate[seo][populate][shareImage][fields][0]", "url");
    params.set(
      "populate[seo][populate][shareImage][fields][1]",
      "alternativeText",
    );
    params.set("populate[seo][populate][shareImage][fields][2]", "width");
    params.set("populate[seo][populate][shareImage][fields][3]", "height");
    params.set("populate[theme]", "true");

    const commonFields = ["blockKey", "hidden"];
    const components = [
      "builder.hero",
      "builder.rich-text",
      "builder.callout",
      "builder.faq",
    ];

    for (const component of components) {
      commonFields.forEach((field, index) => {
        params.set(
          `populate[blocks][on][${component}][fields][${index}]`,
          field,
        );
      });
    }

    ["eyebrow", "heading", "description", "align"].forEach((field, index) => {
      params.set(
        `populate[blocks][on][builder.hero][fields][${index + commonFields.length}]`,
        field,
      );
    });
    params.set("populate[blocks][on][builder.hero][populate][image]", "true");
    params.set(
      "populate[blocks][on][builder.hero][populate][primaryAction]",
      "true",
    );
    params.set(
      "populate[blocks][on][builder.hero][populate][secondaryAction]",
      "true",
    );

    ["heading", "body"].forEach((field, index) => {
      params.set(
        `populate[blocks][on][builder.rich-text][fields][${index + commonFields.length}]`,
        field,
      );
      params.set(
        `populate[blocks][on][builder.callout][fields][${index + commonFields.length}]`,
        field,
      );
    });
    params.set(
      "populate[blocks][on][builder.callout][fields][4]",
      "tone",
    );

    params.set(
      "populate[blocks][on][builder.faq][fields][2]",
      "heading",
    );
    params.set(
      "populate[blocks][on][builder.faq][populate][items][fields][0]",
      "question",
    );
    params.set(
      "populate[blocks][on][builder.faq][populate][items][fields][1]",
      "answer",
    );
  }

  private populateOperationContent(params: URLSearchParams): void {
    const sectionFields = [
      "sectionKey",
      "heading",
      "showInPageNavigation",
    ];
    const sectionComponents = [
      "operation.rich-text-section",
      "operation.list-section",
      "operation.steps-section",
      "operation.checklist-section",
      "operation.price-section",
      "operation.video",
    ];

    for (const component of sectionComponents) {
      const fields = component === "operation.video"
        ? ["sectionKey", "showInPageNavigation"]
        : sectionFields;

      fields.forEach((field, index) => {
        params.set(
          `populate[contentSections][on][${component}][fields][${index}]`,
          field,
        );
      });
    }

    params.set(
      "populate[contentSections][on][operation.rich-text-section][fields][5]",
      "body",
    );

    for (const component of [
      "operation.list-section",
      "operation.checklist-section",
    ]) {
      params.set(
        `populate[contentSections][on][${component}][fields][5]`,
        "intro",
      );
      params.set(
        `populate[contentSections][on][${component}][fields][6]`,
        "outro",
      );
      ["title", "text", "sortOrder"].forEach((field, index) => {
        params.set(
          `populate[contentSections][on][${component}][populate][items][fields][${index}]`,
          field,
        );
      });
    }

    params.set(
      "populate[contentSections][on][operation.steps-section][fields][5]",
      "intro",
    );
    params.set(
      "populate[contentSections][on][operation.steps-section][fields][6]",
      "outro",
    );
    ["title", "description", "sortOrder"].forEach((field, index) => {
      params.set(
        `populate[contentSections][on][operation.steps-section][populate][steps][fields][${index}]`,
        field,
      );
    });

    params.set(
      "populate[contentSections][on][operation.price-section][fields][5]",
      "intro",
    );
    params.set(
      "populate[contentSections][on][operation.price-section][fields][6]",
      "disclaimer",
    );

    for (const field of ["sectionKey", "showInPageNavigation"]) {
      params.set(`populate[contentSections][on][operation.video][fields][${["sectionKey", "showInPageNavigation"].indexOf(field)}]`, field);
    }
    for (const relation of ["poster", "mp4", "webm"]) {
      ["url", "alternativeText", "width", "height", "mime"].forEach((field, index) => {
        params.set(`populate[contentSections][on][operation.video][populate][${relation}][fields][${index}]`, field);
      });
    }

    const priceFields = [
      "key",
      "publicName",
      "priceType",
      "priceLabel",
      "amount",
      "minAmount",
      "maxAmount",
      "currency",
      "unitLabel",
      "description",
      "note",
      "isActive",
      "validFrom",
      "validUntil",
      "publishedAt",
    ];

    priceFields.forEach((field, index) => {
      params.set(`populate[prices][fields][${index}]`, field);
    });
    params.set("populate[prices][filters][isActive][$eq]", "true");
  }

  private populateBlogSummaryFields(params: URLSearchParams, includeCategories: boolean): void {
    params.set("populate[contentSections][populate]", "*");
    ["url", "alternativeText", "width", "height"].forEach((field, index) => {
      params.set(`populate[cover][fields][${index}]`, field);
    });
    if (includeCategories) {
      params.set("populate[categories][fields][0]", "key");
      params.set("populate[categories][fields][1]", "name");
    }
  }

  private populatePortfolioSummaryFields(params: URLSearchParams): void {
    ["url", "alternativeText", "width", "height"].forEach((field, index) => {
      params.set(`populate[cover][fields][${index}]`, field);
    });
    params.set("populate[operations][fields][0]", "canonicalPath");
    params.set("populate[operations][fields][1]", "heading");
  }

  private populatePortfolioContent(params: URLSearchParams): void {
    ["sectionKey", "eyebrow", "heading", "body"].forEach((field, index) => {
      params.set(
        `populate[contentSections][on][portfolio.rich-text-section][fields][${index}]`,
        field,
      );
    });
    ["sectionKey", "text", "tone"].forEach((field, index) => {
      params.set(
        `populate[contentSections][on][portfolio.statement][fields][${index}]`,
        field,
      );
    });
    ["sectionKey", "heading", "beforeAlt", "afterAlt", "caption"].forEach(
      (field, index) => {
        params.set(
          `populate[contentSections][on][portfolio.comparison][fields][${index}]`,
          field,
        );
      },
    );
    ["beforeImage", "afterImage"].forEach((relation) => {
      ["url", "alternativeText", "width", "height"].forEach((field, index) => {
        params.set(
          `populate[contentSections][on][portfolio.comparison][populate][${relation}][fields][${index}]`,
          field,
        );
      });
    });
    ["sectionKey", "term", "heading", "body"].forEach((field, index) => {
      params.set(
        `populate[contentSections][on][portfolio.timeline-stage][fields][${index}]`,
        field,
      );
    });
    ["url", "alternativeText", "width", "height", "mime"].forEach(
      (field, index) => {
        params.set(
          `populate[contentSections][on][portfolio.timeline-stage][populate][media][fields][${index}]`,
          field,
        );
      },
    );
    ["sectionKey", "heading", "caption", "presentation"].forEach(
      (field, index) => {
        params.set(
          `populate[contentSections][on][portfolio.gallery][fields][${index}]`,
          field,
        );
      },
    );
    ["url", "alternativeText", "width", "height"].forEach((field, index) => {
      params.set(
        `populate[contentSections][on][portfolio.gallery][populate][images][fields][${index}]`,
        field,
      );
    });
    ["sectionKey", "text", "attribution", "note"].forEach((field, index) => {
      params.set(
        `populate[contentSections][on][portfolio.quote][fields][${index}]`,
        field,
      );
    });
    ["sectionKey", "heading", "caption"].forEach((field, index) => {
      params.set(
        `populate[contentSections][on][portfolio.video][fields][${index}]`,
        field,
      );
    });
    ["poster", "mp4", "webm"].forEach((relation) => {
      ["url", "alternativeText", "width", "height", "mime"].forEach((field, index) => {
        params.set(
          `populate[contentSections][on][portfolio.video][populate][${relation}][fields][${index}]`,
          field,
        );
      });
    });
  }

  private async getFirst(
    endpoint: string,
    params: URLSearchParams,
    cacheTag: string,
    options: { noStore?: boolean } = {},
  ): Promise<Record<string, unknown> | null> {
    const records = await this.getMany(endpoint, params, cacheTag, options);

    if (records.length === 0) {
      return null;
    }

    if (records.length > 1) {
      throw new CmsInvalidResponseError(
        "Strapi returned several records for a unique content path.",
      );
    }

    return records[0];
  }

  private async getMany(
    endpoint: string,
    params: URLSearchParams,
    cacheTag: string,
    options: { noStore?: boolean } = {},
  ): Promise<Record<string, unknown>[]> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    const headers = new Headers({
      Accept: "application/json",
      Authorization: `Bearer ${this.apiToken}`,
    });
    const cacheOptions = getCmsFetchCacheOptions(cacheTag, options);
    let response: Response;

    try {
      response = await this.fetchImplementation(
        `${this.baseUrl}${endpoint}?${params.toString()}`,
        {
          ...cacheOptions,
          headers,
          signal: controller.signal,
        },
      );
    } catch {
      if (controller.signal.aborted) {
        throw new CmsUnavailableError("CMS request timed out.", {
          timedOut: true,
        });
      }

      throw new CmsUnavailableError(
        "CMS request failed before receiving a response.",
      );
    } finally {
      clearTimeout(timeout);
    }

    if (response.status === 401 || response.status === 403) {
      throw new CmsUnauthorizedError();
    }

    if (response.status >= 500) {
      throw new CmsUnavailableError();
    }

    if (!response.ok) {
      throw new CmsInvalidResponseError(
        `CMS returned HTTP ${response.status} for ${endpoint}.`,
      );
    }

    let payload: unknown;

    try {
      payload = await response.json();
    } catch {
      throw new CmsInvalidResponseError("CMS returned invalid JSON.");
    }

    const responseObject = requireRecord(payload, "response");

    if (!Array.isArray(responseObject.data)) {
      throw new CmsInvalidResponseError(
        "Invalid Strapi response: data must be an array.",
      );
    }

    return responseObject.data.map((item, index) =>
      requireRecord(item, `data[${index}]`),
    );
  }

  private async getSingle(
    endpoint: string,
    params: URLSearchParams,
    cacheTag: string,
  ): Promise<Record<string, unknown> | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    const headers = new Headers({
      Accept: "application/json",
      Authorization: `Bearer ${this.apiToken}`,
    });
    let response: Response;

    try {
      response = await this.fetchImplementation(
        `${this.baseUrl}${endpoint}?${params.toString()}`,
        {
          ...getCmsFetchCacheOptions(cacheTag),
          headers,
          signal: controller.signal,
        },
      );
    } catch {
      if (controller.signal.aborted) {
        throw new CmsUnavailableError("CMS request timed out.", { timedOut: true });
      }

      throw new CmsUnavailableError("CMS request failed before receiving a response.");
    } finally {
      clearTimeout(timeout);
    }

    if (response.status === 401 || response.status === 403) {
      throw new CmsUnauthorizedError();
    }

    if (response.status >= 500) {
      throw new CmsUnavailableError();
    }

    if (!response.ok) {
      throw new CmsInvalidResponseError("CMS returned an unexpected HTTP response.");
    }

    let payload: unknown;

    try {
      payload = await response.json();
    } catch {
      throw new CmsInvalidResponseError("CMS returned invalid JSON.");
    }

    const responseObject = requireRecord(payload, "response");

    if (responseObject.data === null) {
      return null;
    }

    return requireRecord(responseObject.data, "data");
  }
}
