import { allPageRegistryItems, type PageRegistryItem } from "@/content/page-registry";

export type SearchResult = PageRegistryItem;

function normalize(value: string) {
  return value.toLocaleLowerCase("ru-RU").replaceAll("ё", "е").trim();
}

function getSearchText(item: PageRegistryItem) {
  return normalize(
    [
      item.name,
      item.section,
      item.group,
      ...(item.groups ?? []),
      item.seo?.title,
      item.seo?.description,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

export function getSearchResultTitle(item: PageRegistryItem) {
  return item.name ?? item.seo?.title ?? item.route;
}

export function getSearchResultDescription(item: PageRegistryItem) {
  return item.seo?.description ?? `${item.section} · ${item.route}`;
}

const searchablePages = allPageRegistryItems.filter(
  (item) => !item.route.includes("["),
);

export function searchPages(query: string, limit?: number) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return [];
  }

  const results = searchablePages.filter((item) =>
    getSearchText(item).includes(normalizedQuery),
  );

  return typeof limit === "number" ? results.slice(0, limit) : results;
}
