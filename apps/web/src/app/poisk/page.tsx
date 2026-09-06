import Link from "next/link";

import { buttonVariants } from "@drkav/ui";

import { StaticPage } from "@/components/content-page/static-page";
import {
  getSearchResultDescription,
  getSearchResultTitle,
  searchPages,
} from "@/components/site-search/search-index";

export const metadata = {
  title: "Поиск по сайту — DrKAV",
  description: "Поиск по страницам сайта пластического хирурга Артёма Коробова.",
};

type SearchParams = Promise<{ q?: string | string[] }>;

function getQuery(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const query = getQuery((await searchParams).q).trim();
  const results = searchPages(query);

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
                    <span className="site-search__result-title">{getSearchResultTitle(item)}</span>
                    <span className="site-search__result-description">{getSearchResultDescription(item)}</span>
                    <span className="site-search__result-route type-text-sm">{item.route}</span>
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
