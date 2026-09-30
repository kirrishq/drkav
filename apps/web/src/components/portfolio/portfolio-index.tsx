"use client";

import type { PortfolioIndexContent } from "@drkav/content-contracts";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="portfolio-index__arrow" fill="none" viewBox="0 0 24 24">
      <path d="M6 18 18 6m-8 0h8v8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg aria-hidden="true" className="portfolio-index__reveal-icon" fill="none" viewBox="0 0 24 24">
      <path d="M3.5 12s3.25-5 8.5-5 8.5 5 8.5 5-3.25 5-8.5 5-8.5-5-8.5-5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function getOperationLabel(operations: PortfolioIndexContent["cases"][number]["operations"], fallback: string) {
  return operations.length > 0 ? operations.map((operation) => operation.heading).join(" · ") : fallback;
}

export function PortfolioIndex({ cases, variant = "default" }: PortfolioIndexContent & { variant?: "default" | "compact" }) {
  const [revealedCases, setRevealedCases] = useState<ReadonlySet<string>>(new Set());

  if (cases.length === 0) {
    return <p className="portfolio-index__empty">Кейсы готовятся к публикации.</p>;
  }

  return (
    <div className={`portfolio-index__list${variant === "compact" ? " portfolio-index__list--compact" : ""}`}>
      {cases.map((portfolioCase, index) => (
        <article className="content-card content-card--spacious portfolio-index__case" key={portfolioCase.slug}>
          <Link className="portfolio-index__card-link" href={portfolioCase.canonicalPath}>
            <span className="portfolio-index__media">
            <Image
              alt={portfolioCase.cover.alternativeText ?? portfolioCase.title}
              className={`portfolio-index__cover${revealedCases.has(portfolioCase.slug) ? " portfolio-index__cover--revealed" : ""}`}
              height={portfolioCase.cover.height ?? 900}
              priority={index === 0}
              sizes="(min-width: 40rem) 40vw, 100vw"
              src={portfolioCase.cover.url}
              width={portfolioCase.cover.width ?? 1200}
            />
            </span>
            <div className="portfolio-index__case-content">
              <p className={variant === "compact" ? "portfolio-index__case-operation portfolio-index__case-operation--compact" : "type-overline portfolio-index__case-operation"}>{getOperationLabel(portfolioCase.operations, portfolioCase.caseLabel)}</p>
              <h2 className="card-title card-title--prominent portfolio-index__case-title">{portfolioCase.title}</h2>
              <p className="type-text-base portfolio-index__excerpt">{portfolioCase.excerpt}</p>
              <p className="type-text-sm portfolio-index__procedure"><span className="type-overline">Выполнено</span>{portfolioCase.procedureSummary}</p>
              <span className="type-label portfolio-index__case-link">
                Смотреть кейс <ArrowIcon />
              </span>
            </div>
          </Link>
          <button
            aria-label={revealedCases.has(portfolioCase.slug) ? "Скрыть фото" : "Нажмите, чтобы увидеть фото"}
            aria-pressed={revealedCases.has(portfolioCase.slug)}
            className="portfolio-index__reveal-button focus-ring"
            onClick={() => setRevealedCases((current) => {
              const next = new Set(current);
              if (next.has(portfolioCase.slug)) next.delete(portfolioCase.slug);
              else next.add(portfolioCase.slug);
              return next;
            })}
            type="button"
          >
            <EyeIcon />
            <span>{revealedCases.has(portfolioCase.slug) ? "Скрыть фото" : "Нажмите, чтобы увидеть"}</span>
          </button>
        </article>
      ))}
    </div>
  );
}
