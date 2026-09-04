import Link from "next/link";

import { buttonVariants, cn } from "@drkav/ui";

import { StaticPage } from "@/components/content-page/static-page";
import { allPageRegistryItems, type PageRegistryItem } from "@/content/page-registry";

export const metadata = {
  title: "Поиск по сайту — DrKAV",
  description: "Поиск по страницам сайта пластического хирурга Артёма Коробова.",
};

type SearchParams = Promise<{ q?: string | string[] }>;

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

function getResultTitle(item: PageRegistryItem) {
  return item.name ?? item.seo?.title ?? item.route;
}

function getResultDescription(item: PageRegistryItem) {
  return item.seo?.description ?? `${item.section} · ${item.route}`;
}

function getQuery(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const query = getQuery((await searchParams).q).trim();
  const normalizedQuery = normalize(query);
  const searchablePages = allPageRegistryItems.filter(
    (item) => !item.route.includes("["),
  );
  const results = normalizedQuery
    ? searchablePages.filter((item) => getSearchText(item).includes(normalizedQuery))
    : [];

  return (
    <StaticPage
      breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Поиск" }]}
      description="Найдите нужную страницу, операцию или информацию для пациентов."
      title="Поиск по сайту"
    >
      <section className="site-search" aria-labelledby="site-search-title">
        <h2 className="sr-only" id="site-search-title">Поиск по сайту</h2>
        <form action="/poisk" className="site-search__form" role="search">
          <label className="sr-only" htmlFor="site-search-query">Поисковый запрос</label>
          <input
            autoComplete="off"
            className="site-search__input"
            defaultValue={query}
            id="site-search-query"
            name="q"
            placeholder="Например, пластика груди"
            type="search"
          />
          <button className={buttonVariants({ size: "md", variant: "primary" })} type="submit">
            Найти
          </button>
        </form>

        {!query ? (
          <p className="site-search__empty">Введите запрос, чтобы найти материалы на сайте.</p>
        ) : results.length === 0 ? (
          <p className="site-search__empty">По запросу «{query}» ничего не найдено.</p>
        ) : (
          <>
            <p className="site-search__count">Найдено: {results.length}</p>
            <ul className="site-search__results">
              {results.map((item) => (
                <li className="site-search__result" key={item.route}>
                  <Link className="site-search__result-link" href={item.route}>
                    <span className="site-search__result-section">{item.section}</span>
                    <span className="site-search__result-title">{getResultTitle(item)}</span>
                    <span className="site-search__result-description">{getResultDescription(item)}</span>
                    <span className={cn("site-search__result-route", "type-text-sm")}>{item.route}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </StaticPage>
  );
}
