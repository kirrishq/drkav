import type { ImageAsset, PortfolioCase, PortfolioCaseSummary, PortfolioMediaAsset } from "@drkav/content-contracts";
import { BeforeAfterComparison, ConsultationTrigger, SectionNavigation, buttonVariants } from "@drkav/ui";
import Image from "next/image";
import Link from "next/link";

import { BlocksRenderer } from "@/components/operation-content/blocks-renderer";

function PortfolioImage({ asset, className = "" }: { asset: ImageAsset; className?: string }) {
  return <Image
    alt={asset.alternativeText ?? ""}
    className={className}
    height={asset.height ?? 900}
    sizes="(min-width: 64rem) 58rem, 100vw"
    src={asset.url}
    unoptimized
    width={asset.width ?? 1200}
  />;
}

function PortfolioMedia({ asset }: { asset: PortfolioMediaAsset }) {
  if (asset.mediaType === "video") {
    return (
      <video className="portfolio-case__video" controls playsInline preload="metadata">
        <source src={asset.url} type={asset.mime} />
        Ваш браузер не поддерживает воспроизведение видео.
      </video>
    );
  }

  return <PortfolioImage asset={asset} className="portfolio-case__stage-image" />;
}

function getOperationLabel(portfolioCase: PortfolioCaseSummary) {
  return portfolioCase.operations.length > 0
    ? portfolioCase.operations.map((operation) => operation.heading).join(" · ")
    : portfolioCase.caseLabel;
}

function getSectionId(index: number): string {
  return `portfolio-case-section-${index + 1}`;
}

function getSectionNavigationItems(portfolioCase: PortfolioCase) {
  return portfolioCase.contentSections.flatMap((section, index) => {
    const label = section.type === "timeline-stage"
      ? section.heading ?? section.term
      : "heading" in section
        ? section.heading
        : undefined;

    return label ? [{ id: getSectionId(index), label }] : [];
  });
}

function RelatedCaseCard({ portfolioCase }: { portfolioCase: PortfolioCaseSummary }) {
  return (
    <Link className="content-card portfolio-case__related-card" href={portfolioCase.canonicalPath}>
      <span className="portfolio-case__related-media">
        <Image
          alt={portfolioCase.cover.alternativeText ?? portfolioCase.title}
          className="portfolio-case__related-image"
          height={portfolioCase.cover.height ?? 900}
          sizes="(min-width: 40rem) 23rem, 100vw"
          src={portfolioCase.cover.url}
          unoptimized
          width={portfolioCase.cover.width ?? 1200}
        />
      </span>
      <span className="type-text-sm portfolio-case__related-meta">{getOperationLabel(portfolioCase)}</span>
      <span className="card-title portfolio-case__related-title">{portfolioCase.title}</span>
    </Link>
  );
}

export function PortfolioCaseContent({
  portfolioCase,
  relatedCases,
}: {
  portfolioCase: PortfolioCase;
  relatedCases: readonly PortfolioCaseSummary[];
}) {
  const navigationItems = getSectionNavigationItems(portfolioCase);

  return (
    <article className="portfolio-case">
      <header className="content-card content-card--intro portfolio-case__hero">
        <h1 className="content-card__heading content-card__heading--h1 portfolio-case__title">{portfolioCase.title}</h1>
        <p className="content-card__lead portfolio-case__lead">{portfolioCase.excerpt}</p>
        <dl className="portfolio-case__facts">
          <div>
            <dt className="type-overline">Операция</dt>
            <dd className="portfolio-case__operation-links">
              {portfolioCase.operations.length > 0
                ? portfolioCase.operations.map((operation) => <Link href={operation.canonicalPath} key={operation.canonicalPath}>{operation.heading}</Link>)
                : portfolioCase.caseLabel}
            </dd>
          </div>
          <div>
            <dt className="type-overline">Результат через</dt>
            <dd>{portfolioCase.resultTerm}</dd>
          </div>
          <div>
            <dt className="type-overline">Выполнено</dt>
            <dd>{portfolioCase.procedureSummary}</dd>
          </div>
        </dl>
      </header>

      <div className="portfolio-case__content-layout">
        {navigationItems.length > 0 ? (
          <SectionNavigation
            ariaLabel="Содержание кейса"
            className="portfolio-case__navigation"
            items={navigationItems}
            title="Содержание"
          />
        ) : null}

        <div className="portfolio-case__main">
          <div className="portfolio-case__sections">
          {portfolioCase.contentSections.map((section, index) => {
          const sectionId = getSectionId(index);

          if (section.type === "rich-text") {
            const hasHeading = Boolean(section.eyebrow || section.heading);
            return (
              <section className={`content-card content-card--spacious portfolio-case__text-section${hasHeading ? " portfolio-case__text-section--with-heading" : ""}`} id={sectionId} key={section.sectionKey}>
                {hasHeading ? <div className="portfolio-case__section-heading">
                  {section.eyebrow ? <p className="type-overline">{section.eyebrow}</p> : null}
                  {section.heading ? <h2 className="content-card__heading content-card__heading--h2">{section.heading}</h2> : null}
                </div> : null}
                <BlocksRenderer blocks={section.body} className="portfolio-case__blocks" />
              </section>
            );
          }

          if (section.type === "statement") {
            return <blockquote className={`type-h2 content-card portfolio-case__statement portfolio-case__statement--${section.tone}`} id={sectionId} key={section.sectionKey}>{section.text}</blockquote>;
          }

          if (section.type === "comparison") {
            return (
              <figure className="content-card content-card--spacious portfolio-case__comparison" id={sectionId} key={section.sectionKey}>
                {section.heading ? <h2 className="content-card__heading content-card__heading--h2">{section.heading}</h2> : null}
                <BeforeAfterComparison afterAlt={section.afterAlt} afterImage={section.afterImage.url} beforeAlt={section.beforeAlt} beforeImage={section.beforeImage.url} className="portfolio-case__comparison-media" />
                {section.caption ? <figcaption>{section.caption}</figcaption> : null}
              </figure>
            );
          }

          if (section.type === "timeline-stage") {
            return (
              <section className="content-card content-card--spacious portfolio-case__stage" id={sectionId} key={section.sectionKey}>
                <div className="portfolio-case__stage-copy">
                  <p className="type-overline portfolio-case__term">{section.term}</p>
                  {section.heading ? <h2 className="content-card__heading content-card__heading--h2">{section.heading}</h2> : null}
                  <BlocksRenderer blocks={section.body} className="portfolio-case__blocks" />
                </div>
                {section.media.length > 0 ? <div className="portfolio-case__stage-media">{section.media.map((asset) => <PortfolioMedia asset={asset} key={asset.url} />)}</div> : null}
              </section>
            );
          }

          if (section.type === "gallery") {
            return (
              <section className={`content-card content-card--spacious portfolio-case__gallery portfolio-case__gallery--${section.presentation}`} id={sectionId} key={section.sectionKey}>
                {section.heading ? <h2 className="content-card__heading content-card__heading--h2">{section.heading}</h2> : null}
                <div className={`portfolio-case__gallery-grid${section.images.length === 1 ? " portfolio-case__gallery-grid--single" : ""}`}>{section.images.map((image) => <PortfolioImage asset={image} className={`portfolio-case__gallery-image${image.width && image.height && image.width / image.height > 1.8 ? " portfolio-case__gallery-image--wide" : ""}`} key={image.url} />)}</div>
                {section.caption ? <p className="portfolio-case__caption">{section.caption}</p> : null}
              </section>
            );
          }

          return (
            <figure className="content-card portfolio-case__quote" id={sectionId} key={section.sectionKey}>
              <blockquote className="type-h2">«{section.text}»</blockquote>
              {section.attribution || section.note ? <figcaption>{[section.attribution, section.note].filter(Boolean).join(" · ")}</figcaption> : null}
            </figure>
          );
          })}
          </div>

          <aside className="type-text-sm content-card content-card--muted portfolio-case__disclaimer">Результат операции индивидуален. Фотографии показывают конкретный клинический случай и не гарантируют аналогичный результат.</aside>
        </div>
      </div>

      <section className="portfolio-case__cta">
        <div><p className="type-overline">Обсудить ваш случай</p><h2 className="type-h2">На консультации доктор оценит исходные данные и предложит подходящий план.</h2></div>
        <ConsultationTrigger className={buttonVariants({ size: "md", variant: "primary" })}>Записаться на консультацию</ConsultationTrigger>
      </section>

      {relatedCases.length > 0 ? <section className="portfolio-case__related" aria-labelledby="portfolio-related-heading">
        <h2 className="content-card__heading content-card__heading--h2" id="portfolio-related-heading">Другие кейсы</h2>
        <div className="portfolio-case__related-grid">
          {relatedCases.map((item) => <RelatedCaseCard key={item.slug} portfolioCase={item} />)}
        </div>
      </section> : null}
    </article>
  );
}
