import { notFound } from "next/navigation";
import Image from "next/image";

import { StaticPage } from "./static-page";
import { createContentRepository } from "@/content/content-repository";

export async function CmsEntryTemplate({ slug }: { slug?: string }) {
  if (!slug) {
    notFound();
  }

  const entry = await createContentRepository().getBeforeAfterCaseBySlug(slug);

  if (!entry) {
    notFound();
  }

  return (
    <StaticPage
      breadcrumbs={[
        { href: "/", label: "Главная" },
        { href: "/pacientam", label: "Пациентам" },
        { href: "/pacientam/do-i-posle", label: "До/после" },
        { label: entry.title },
      ]}
      className="patient-subpage-page"
      description={`Результат операции «${entry.operation.heading}».`}
      pageKey="before-after"
      title={entry.title}
    >
      <article className="content-card content-card--spacious before-after-entry">
        <figure className="before-after-entry__media">
          <Image
            alt={entry.image.alternativeText ?? entry.title}
            fill
            sizes="(min-width: 64rem) 48rem, 100vw"
            src={entry.image.url}
            unoptimized
          />
        </figure>
        <p>
          Операция: <a className="text-link" href={entry.operation.canonicalPath}>{entry.operation.heading}</a>
        </p>
      </article>
    </StaticPage>
  );
}
