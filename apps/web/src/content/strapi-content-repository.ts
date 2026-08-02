import "server-only";

import type {
  ContentAction,
  ContentRepository,
  ImageAsset,
  OperationCategorySummary,
  OperationContent,
  OperationContentSection,
  OperationStep,
  OperationTextItem,
  PriceItem,
  RichTextBlock,
  RichTextInline,
  RichTextListItem,
  RichTextText,
  SeoData,
  StaticPageContent,
} from "@drkav/content-contracts";

import {
  getCmsFetchCacheOptions,
  getOperationCacheTag,
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

function optionalString(value: unknown, label: string): string | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  return requireString(value, label);
}

function requireBoolean(value: unknown, label: string): boolean {
  if (typeof value !== "boolean") {
    throw new CmsInvalidResponseError(`Invalid Strapi response: ${label} must be a boolean.`);
  }

  return value;
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

function mapBlocks(value: unknown, label: string): readonly RichTextBlock[] {
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

    throw new CmsInvalidResponseError(
      `Invalid Strapi response: ${blockLabel}.type ${type} is unsupported.`,
    );
  });
}

function optionalBlocks(
  value: unknown,
  label: string,
): readonly RichTextBlock[] | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return mapBlocks(value, label);
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
): OperationContentSection {
  const label = `operation.contentSections[${index}]`;
  const section = requireRecord(value, label);
  const component = requireString(section.__component, `${label}.__component`);
  const base = {
    sectionKey: requireString(section.sectionKey, `${label}.sectionKey`),
    anchor: requireAnchor(section.anchor, `${label}.anchor`),
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
      body: mapBlocks(section.body, `${label}.body`),
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
      intro: optionalBlocks(section.intro, `${label}.intro`),
      items,
      outro: optionalBlocks(section.outro, `${label}.outro`),
    };

    return component === "operation.list-section"
      ? { ...shared, type: "list" }
      : { ...shared, type: "checklist" };
  }

  if (component === "operation.steps-section") {
    return {
      ...base,
      type: "steps",
      intro: optionalBlocks(section.intro, `${label}.intro`),
      steps: sortEditorialItems(
        requireArray(section.steps, `${label}.steps`).map((step, stepIndex) =>
          mapStep(step, `${label}.steps[${stepIndex}]`),
        ),
      ),
      outro: optionalBlocks(section.outro, `${label}.outro`),
    };
  }

  if (component === "operation.price-section") {
    return {
      ...base,
      type: "price",
      heading: requireString(section.heading, `${label}.heading`),
      intro: optionalBlocks(section.intro, `${label}.intro`),
      disclaimer: optionalBlocks(section.disclaimer, `${label}.disclaimer`),
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
  const url = new URL(path, `${baseUrl}/`);

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

  async getStaticPage(pageKey: string): Promise<StaticPageContent | null> {
    const params = this.createPublishedParams([
      "pageKey",
      "heading",
      "heroDescription",
      "contentStatus",
    ]);
    params.set("filters[pageKey][$eq]", pageKey);
    this.populatePageFields(params);
    const page = await this.getFirst(
      "/api/static-pages",
      params,
      `static-page:${encodeURIComponent(pageKey)}`,
    );

    if (!page) {
      return null;
    }

    return {
      pageKey: requireString(page.pageKey, "staticPage.pageKey"),
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
      primaryAction: mapAction(
        page.primaryAction,
        "staticPage.primaryAction",
      ),
      secondaryAction: mapAction(
        page.secondaryAction,
        "staticPage.secondaryAction",
      ),
      contentStatus: requireContentStatus(
        page.contentStatus,
        "staticPage.contentStatus",
      ),
    };
  }

  async getOperationByPath(path: string): Promise<OperationContent | null> {
    const params = this.createPublishedParams([
      "slug",
      "canonicalPath",
      "heading",
      "heroDescription",
      "contentStatus",
    ]);
    params.set("filters[canonicalPath][$eq]", path);
    this.populatePageFields(params);
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
    ).map(mapContentSection);
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
      heroDescription: optionalString(
        operation.heroDescription,
        "operation.heroDescription",
      ),
      heroImage: mapImage(
        operation.heroImage,
        this.baseUrl,
        "operation.heroImage",
      ),
      primaryAction: mapAction(
        operation.primaryAction,
        "operation.primaryAction",
      ),
      secondaryAction: mapAction(
        operation.secondaryAction,
        "operation.secondaryAction",
      ),
      seo: mapSeo(operation.seo, this.baseUrl, "operation.seo"),
      categories,
      prices,
      contentSections,
      contentStatus: requireContentStatus(
        operation.contentStatus,
        "operation.contentStatus",
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

  private populateOperationContent(params: URLSearchParams): void {
    const sectionFields = [
      "sectionKey",
      "anchor",
      "heading",
      "showInPageNavigation",
    ];
    const sectionComponents = [
      "operation.rich-text-section",
      "operation.list-section",
      "operation.steps-section",
      "operation.checklist-section",
      "operation.price-section",
    ];

    for (const component of sectionComponents) {
      sectionFields.forEach((field, index) => {
        params.set(
          `populate[contentSections][on][${component}][fields][${index}]`,
          field,
        );
      });
    }

    params.set(
      "populate[contentSections][on][operation.rich-text-section][fields][4]",
      "body",
    );

    for (const component of [
      "operation.list-section",
      "operation.checklist-section",
    ]) {
      params.set(
        `populate[contentSections][on][${component}][fields][4]`,
        "intro",
      );
      params.set(
        `populate[contentSections][on][${component}][fields][5]`,
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
      "populate[contentSections][on][operation.steps-section][fields][4]",
      "intro",
    );
    params.set(
      "populate[contentSections][on][operation.steps-section][fields][5]",
      "outro",
    );
    ["title", "description", "sortOrder"].forEach((field, index) => {
      params.set(
        `populate[contentSections][on][operation.steps-section][populate][steps][fields][${index}]`,
        field,
      );
    });

    params.set(
      "populate[contentSections][on][operation.price-section][fields][4]",
      "intro",
    );
    params.set(
      "populate[contentSections][on][operation.price-section][fields][5]",
      "disclaimer",
    );

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

  private async getFirst(
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
    const cacheOptions = getCmsFetchCacheOptions(cacheTag);
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
        "CMS returned an unexpected HTTP response.",
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

    if (responseObject.data.length === 0) {
      return null;
    }

    if (responseObject.data.length > 1) {
      throw new CmsInvalidResponseError(
        "Strapi returned several records for a unique content path.",
      );
    }

    return requireRecord(responseObject.data[0], "data[0]");
  }
}
