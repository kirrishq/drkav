import type { PortfolioIndexContent } from "@drkav/content-contracts";
import Image from "next/image";
import Link from "next/link";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="portfolio-index__arrow" fill="none" viewBox="0 0 24 24">
      <path d="M6 18 18 6m-8 0h8v8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

export function PortfolioIndex({ cases }: PortfolioIndexContent) {
  if (cases.length === 0) {
    return <p className="portfolio-index__empty">Кейсы готовятся к публикации.</p>;
  }

  return (
    <div className="portfolio-index__list">
      {cases.map((portfolioCase, index) => (
        <article className="content-card content-card--spacious portfolio-index__case" key={portfolioCase.slug}>
          <Link className="portfolio-index__media-link" href={portfolioCase.canonicalPath}>
            <Image
              alt={portfolioCase.cover.alternativeText ?? portfolioCase.title}
              className="portfolio-index__cover"
              height={portfolioCase.cover.height ?? 900}
              priority={index === 0}
              sizes="(min-width: 72rem) 62vw, 100vw"
              src={portfolioCase.cover.url}
              unoptimized
              width={portfolioCase.cover.width ?? 1200}
            />
          </Link>
          <div className="portfolio-index__case-content">
            <p className="type-overline portfolio-index__case-number">Кейс {String(index + 1).padStart(2, "0")}</p>
            <p className="type-text-sm portfolio-index__case-meta">{portfolioCase.resultTerm}</p>
            <h2 className="card-title card-title--prominent portfolio-index__case-title">
              <Link href={portfolioCase.canonicalPath}>{portfolioCase.title}</Link>
            </h2>
            <p className="type-text-base portfolio-index__excerpt">{portfolioCase.excerpt}</p>
            <p className="type-text-sm portfolio-index__procedure"><span className="type-overline">Выполнено</span>{portfolioCase.procedureSummary}</p>
            <Link className="type-label portfolio-index__case-link" href={portfolioCase.canonicalPath}>
              Смотреть кейс <ArrowIcon />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
