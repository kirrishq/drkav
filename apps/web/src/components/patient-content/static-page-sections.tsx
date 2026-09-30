import type { StaticPageContentSection } from "@drkav/content-contracts";
import { formatRussianText, RecordCard } from "@drkav/ui";

import { BlocksRenderer } from "@/components/operation-content/blocks-renderer";

import { PatientChecklist, PatientFaq } from "./patient-content";

function SectionHeading({ heading }: { heading?: string }) {
  return heading ? (
    <h2 className="content-card__heading content-card__heading--h2">{formatRussianText(heading)}</h2>
  ) : null;
}

export function StaticPageSections({ sections }: { sections: readonly StaticPageContentSection[] }) {
  return (
    <div className="patient-page-content">
      {sections.map((section) => (
        <section className="content-card content-card--spacious patient-section" key={section.sectionKey}>
          <SectionHeading heading={section.heading} />
          {section.type === "rich-text" ? (
            <BlocksRenderer blocks={section.body} listVariant="accent" />
          ) : section.type === "card-grid" ? (
            <div className="content-card__grid">
              {section.cards.map((card) => (
                <RecordCard description={card.description} href={card.href} key={card.href} title={card.title} />
              ))}
            </div>
          ) : section.type === "faq" ? (
            <PatientFaq items={section.items} />
          ) : section.type === "tests" ? (
            <>
              {section.intro ? <BlocksRenderer blocks={section.intro} listVariant="accent" /> : null}
              <dl className="patient-tests">
                {section.items.map((item) => (
                  <div className="patient-tests__item" key={item.title ?? item.text}>
                    <dt className="patient-tests__name">{formatRussianText(item.title ?? item.text)}</dt>
                    {item.title ? <dd className="patient-tests__validity">{formatRussianText(item.text)}</dd> : null}
                  </div>
                ))}
              </dl>
              {section.outro ? <BlocksRenderer blocks={section.outro} listVariant="accent" /> : null}
            </>
          ) : (
            <>
              {section.intro ? <BlocksRenderer blocks={section.intro} listVariant="accent" /> : null}
              <PatientChecklist
                items={section.items.map((item) => ({
                  title: item.title ?? "",
                  description: item.text,
                }))}
              />
              {section.outro ? <BlocksRenderer blocks={section.outro} listVariant="accent" /> : null}
            </>
          )}
        </section>
      ))}
    </div>
  );
}
