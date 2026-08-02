import "server-only";

import type {
  ContentAction,
  ContentRepository,
  ImageAsset,
  OperationCategorySummary,
  OperationContent,
  SeoData,
  StaticPageContent,
} from "@drkav/content-contracts";

export type StrapiContentRepositoryOptions = {
  baseUrl: string;
  apiToken: string;
  fetchImplementation?: typeof fetch;
  timeoutMs?: number;
};

export class StrapiIntegrationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "StrapiIntegrationError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new StrapiIntegrationError(`Invalid Strapi response: ${label} must be an object.`);
  }

  return value;
}

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new StrapiIntegrationError(`Invalid Strapi response: ${label} must be a non-empty string.`);
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
    throw new StrapiIntegrationError(`Invalid Strapi response: ${label} must be a boolean.`);
  }

  return value;
}

function optionalNumber(value: unknown, label: string): number | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new StrapiIntegrationError(`Invalid Strapi response: ${label} must be a number.`);
  }

  return value;
}

function requireContentStatus(
  value: unknown,
  label: string,
): OperationContent["contentStatus"] {
  if (value !== "empty" && value !== "partial" && value !== "ready") {
    throw new StrapiIntegrationError(`Invalid Strapi response: ${label} is unsupported.`);
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

  return {
    url: new URL(path, `${baseUrl}/`).toString(),
    alternativeText: optionalString(
      image.alternativeText,
      `${label}.alternativeText`,
    ),
    width: optionalNumber(image.width, `${label}.width`),
    height: optionalNumber(image.height, `${label}.height`),
  };
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
    throw new StrapiIntegrationError(`Invalid Strapi response: ${label}.variant is unsupported.`);
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
    canonicalPath: optionalString(
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
    const parsedBaseUrl = new URL(baseUrl);

    if (parsedBaseUrl.protocol !== "http:" && parsedBaseUrl.protocol !== "https:") {
      throw new Error("STRAPI_API_URL must use HTTP or HTTPS.");
    }

    if (!apiToken) {
      throw new Error("STRAPI_API_TOKEN is required for the closed Strapi API.");
    }

    if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
      throw new Error("Strapi timeout must be a positive number.");
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
    const page = await this.getFirst("/api/static-pages", params);

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
    const operation = await this.getFirst("/api/operations", params);

    if (!operation) {
      return null;
    }

    if (!Array.isArray(operation.categories)) {
      throw new StrapiIntegrationError(
        "Invalid Strapi response: operation.categories must be an array.",
      );
    }

    return {
      slug: requireString(operation.slug, "operation.slug"),
      canonicalPath: requireString(
        operation.canonicalPath,
        "operation.canonicalPath",
      ),
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
      categories: operation.categories.map(mapCategory),
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

  private async getFirst(
    endpoint: string,
    params: URLSearchParams,
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
          cache: "no-store",
          headers,
          signal: controller.signal,
        },
      );
    } catch (error) {
      const message = controller.signal.aborted
        ? "Strapi request timed out."
        : "Strapi request failed before receiving a response.";
      throw new StrapiIntegrationError(message, { cause: error });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      throw new StrapiIntegrationError(
        `Strapi request failed with HTTP status ${response.status}.`,
      );
    }

    let payload: unknown;

    try {
      payload = await response.json();
    } catch (error) {
      throw new StrapiIntegrationError("Strapi returned invalid JSON.", {
        cause: error,
      });
    }

    const responseObject = requireRecord(payload, "response");

    if (!Array.isArray(responseObject.data)) {
      throw new StrapiIntegrationError(
        "Invalid Strapi response: data must be an array.",
      );
    }

    if (responseObject.data.length === 0) {
      return null;
    }

    if (responseObject.data.length > 1) {
      throw new StrapiIntegrationError(
        "Strapi returned several records for a unique content path.",
      );
    }

    return requireRecord(responseObject.data[0], "data[0]");
  }
}
