import type {
  ContentAction,
  ContentRepository,
  ImageAsset,
  OperationCategorySummary,
  OperationContent,
  SeoData,
  StaticPageContent,
} from "@drkav/content-contracts";

type StrapiMedia = {
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
};

type StrapiSeo = {
  metaTitle: string;
  metaDescription: string;
  shareImage?: StrapiMedia | null;
  canonicalPath?: string | null;
  noIndex: boolean;
};

type StrapiAction = {
  label: string;
  href: string;
  variant: ContentAction["variant"];
  openInNewTab: boolean;
};

type StrapiStaticPage = {
  pageKey: string;
  seo: StrapiSeo;
  heading?: string | null;
  heroDescription?: string | null;
  heroImage?: StrapiMedia | null;
  primaryAction?: StrapiAction | null;
  secondaryAction?: StrapiAction | null;
  contentStatus: StaticPageContent["contentStatus"];
};

type StrapiOperationCategory = {
  key: string;
  name: string;
  description?: string | null;
  hasLandingPage: boolean;
  landingPageKey?: string | null;
};

type StrapiOperation = {
  slug: string;
  canonicalPath: string;
  heading: string;
  heroDescription?: string | null;
  heroImage?: StrapiMedia | null;
  primaryAction?: StrapiAction | null;
  secondaryAction?: StrapiAction | null;
  seo: StrapiSeo;
  categories?: readonly StrapiOperationCategory[];
  contentStatus: OperationContent["contentStatus"];
};

type StrapiCollectionResponse<T> = {
  data: readonly T[];
};

export type StrapiContentRepositoryOptions = {
  baseUrl: string;
  apiToken?: string;
  fetchImplementation?: typeof fetch;
};

function optional<T>(value: T | null | undefined): T | undefined {
  return value ?? undefined;
}

export class StrapiContentRepository implements ContentRepository {
  private readonly baseUrl: string;
  private readonly apiToken?: string;
  private readonly fetchImplementation: typeof fetch;

  constructor({
    baseUrl,
    apiToken,
    fetchImplementation = fetch,
  }: StrapiContentRepositoryOptions) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.apiToken = apiToken;
    this.fetchImplementation = fetchImplementation;
  }

  async getStaticPage(pageKey: string): Promise<StaticPageContent | null> {
    const params = this.createBasePopulateParams();
    params.set("filters[pageKey][$eq]", pageKey);
    const page = await this.getFirst<StrapiStaticPage>("/api/static-pages", params);

    return page
      ? {
          pageKey: page.pageKey,
          seo: this.mapSeo(page.seo),
          heading: optional(page.heading),
          heroDescription: optional(page.heroDescription),
          heroImage: this.mapImage(page.heroImage),
          primaryAction: optional(page.primaryAction),
          secondaryAction: optional(page.secondaryAction),
          contentStatus: page.contentStatus,
        }
      : null;
  }

  async getOperationByPath(path: string): Promise<OperationContent | null> {
    const params = this.createBasePopulateParams();
    params.set("filters[canonicalPath][$eq]", path);
    params.set("populate[categories]", "true");
    const operation = await this.getFirst<StrapiOperation>("/api/operations", params);

    return operation
      ? {
          slug: operation.slug,
          canonicalPath: operation.canonicalPath,
          heading: operation.heading,
          heroDescription: optional(operation.heroDescription),
          heroImage: this.mapImage(operation.heroImage),
          primaryAction: optional(operation.primaryAction),
          secondaryAction: optional(operation.secondaryAction),
          seo: this.mapSeo(operation.seo),
          categories: (operation.categories ?? []).map(
            (category): OperationCategorySummary => ({
              key: category.key,
              name: category.name,
              description: optional(category.description),
              hasLandingPage: category.hasLandingPage,
              landingPageKey: optional(category.landingPageKey),
            }),
          ),
          contentStatus: operation.contentStatus,
        }
      : null;
  }

  private createBasePopulateParams(): URLSearchParams {
    return new URLSearchParams({
      "pagination[pageSize]": "1",
      "populate[seo][populate][shareImage]": "true",
      "populate[heroImage]": "true",
      "populate[primaryAction]": "true",
      "populate[secondaryAction]": "true",
      status: "published",
    });
  }

  private async getFirst<T>(
    endpoint: string,
    params: URLSearchParams,
  ): Promise<T | null> {
    const headers = new Headers({ Accept: "application/json" });

    if (this.apiToken) {
      headers.set("Authorization", `Bearer ${this.apiToken}`);
    }

    const response = await this.fetchImplementation(
      `${this.baseUrl}${endpoint}?${params.toString()}`,
      { headers },
    );

    if (!response.ok) {
      throw new Error(`Strapi request failed with status ${response.status}.`);
    }

    const payload = (await response.json()) as StrapiCollectionResponse<T>;
    return payload.data[0] ?? null;
  }

  private mapSeo(seo: StrapiSeo): SeoData {
    return {
      title: seo.metaTitle,
      description: seo.metaDescription,
      shareImage: this.mapImage(seo.shareImage),
      canonicalPath: optional(seo.canonicalPath),
      noIndex: seo.noIndex,
    };
  }

  private mapImage(image: StrapiMedia | null | undefined): ImageAsset | undefined {
    if (!image) {
      return undefined;
    }

    return {
      url: image.url.startsWith("http") ? image.url : `${this.baseUrl}${image.url}`,
      alternativeText: optional(image.alternativeText),
      width: optional(image.width),
      height: optional(image.height),
    };
  }
}
