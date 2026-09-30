import type { MediaPublicationSummary } from "@drkav/content-contracts";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

function PublicationLink({
  children,
  className,
  href,
  publication,
}: {
  children: ReactNode;
  className: string;
  href: string;
  publication: MediaPublicationSummary;
}) {
  if (publication.isExternal) {
    return <a className={className} href={href} rel="noreferrer" target="_blank">{children}</a>;
  }

  return <Link className={className} href={href}>{children}</Link>;
}

function PublicationCard({ publication }: { publication: MediaPublicationSummary }) {
  const href = publication.externalUrl ?? publication.canonicalPath;
  if (!href) return null;

  const content = (
    <>
      <div className="media-publication-card__visual">
        {publication.imagePath ? (
          <Image
            alt={publication.imageAlt ?? ""}
            className="media-publication-card__image"
            fill
            sizes="(min-width: 64rem) 36vw, 100vw"
            src={publication.imagePath}
          />
        ) : null}
      </div>
      <div className="media-publication-card__body">
        <p className="media-publication-card__meta">
          {[publication.sourceName, publication.sourceDateLabel].filter(Boolean).join(" · ")}
        </p>
        <h3 className="card-title card-title--prominent media-publication-card__title">{publication.title}</h3>
        <span aria-hidden="true" className="media-publication-card__arrow">↗</span>
      </div>
    </>
  );

  return (
    <PublicationLink className="media-publication-card" href={href} publication={publication}>
      {content}
    </PublicationLink>
  );
}

function FeaturedPublication({ publication }: { publication: MediaPublicationSummary }) {
  const href = publication.externalUrl ?? publication.canonicalPath;
  if (!href) return null;

  return (
    <PublicationLink className={`media-publication-featured${publication.imagePath ? "" : " media-publication-featured--text-only"}`} href={href} publication={publication}>
      {publication.imagePath ? (
        <span className="media-publication-featured__visual">
          <Image
            alt={publication.imageAlt ?? ""}
            className="media-publication-featured__image"
            fill
            sizes="5rem"
            src={publication.imagePath}
          />
        </span>
      ) : null}
      <span className="media-publication-featured__body">
        <span className="media-publication-featured__meta">
          {[publication.sourceName, publication.sourceDateLabel].filter(Boolean).join(" · ")}
        </span>
        <span className="media-publication-featured__title">{publication.title}</span>
      </span>
    </PublicationLink>
  );
}

export function MediaPublications({ publications }: { publications: readonly MediaPublicationSummary[] }) {
  if (publications.length === 0) return null;

  const primaryPublications = publications.filter((publication) => publication.layoutVariant === "primary");
  const featuredPublications = publications.filter((publication) => publication.layoutVariant === "featured");

  return (
    <section aria-labelledby="media-publications-title" className="content-card content-section media-publications">
      <h2 className="content-card__heading content-card__heading--h2" id="media-publications-title">Публикации</h2>
      <div className="media-publications__layout">
        <div className="media-publications__primary">
          {primaryPublications.map((publication) => <PublicationCard key={publication.sourceUrl} publication={publication} />)}
        </div>
        {featuredPublications.length > 0 ? (
          <div className="media-publications__featured">
            {featuredPublications.map((publication) => <FeaturedPublication key={publication.sourceUrl} publication={publication} />)}
          </div>
        ) : null}
      </div>
    </section>
  );
}
