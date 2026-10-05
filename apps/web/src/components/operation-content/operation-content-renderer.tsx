import type {
  OperationContentSection,
  OperationTextItem,
  PriceItem,
} from "@drkav/content-contracts";
import { formatPriceItem } from "@drkav/content-contracts";
import { formatRussianText } from "@drkav/ui";

import { BlocksRenderer } from "./blocks-renderer";

type OperationContentRendererProps = {
  prices: readonly PriceItem[];
  sections: readonly OperationContentSection[];
  showNavigation?: boolean;
};

function SectionHeading({
  heading,
  level,
}: {
  heading?: string;
  level: 2 | 3;
}) {
  if (!heading) {
    return null;
  }

  return level === 2 ? (
    <h2 className="content-card__heading content-card__heading--h2">{formatRussianText(heading)}</h2>
  ) : (
    <h3 className="content-card__heading content-card__heading--h3">{formatRussianText(heading)}</h3>
  );
}

function TextItems({
  checklist = false,
  items,
}: {
  checklist?: boolean;
  items: readonly OperationTextItem[];
}) {
  return (
    <ul className="content-card__list">
      {items.map((item, index) => (
        <li className="content-card__list-item" key={`${item.title ?? item.text}-${index}`}>
          <span
            aria-hidden="true"
            className={
              checklist
                ? "operation-content__check-marker"
                : "content-card__list-marker"
            }
          >
            {checklist ? "✓" : null}
          </span>
          <div className="operation-content__item-copy">
            {item.title ? <strong>{formatRussianText(item.title)}</strong> : null}
            <span>{formatRussianText(item.text)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function PriceList({ prices }: { prices: readonly PriceItem[] }) {
  if (prices.length === 0) {
    return null;
  }

  return (
    <ul className="operation-content__prices">
      {prices.map((price) => (
        <li className="operation-content__price-item" key={price.key}>
          <div className="operation-content__price-header">
            <h3 className="content-card__heading content-card__heading--h3">
              {formatRussianText(price.name)}
            </h3>
            <p className="operation-content__price-value">
              {formatPriceItem(price)}
            </p>
          </div>
          {price.description ? (
            <p className="operation-content__price-description">
              {formatRussianText(price.description)}
            </p>
          ) : null}
          {price.note ? (
            <p className="operation-content__price-note">{formatRussianText(price.note)}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function SectionContent({
  prices,
  section,
}: {
  prices: readonly PriceItem[];
  section: OperationContentSection;
}) {
  const headingLevel = section.showInPageNavigation ? 2 : 3;

  if (section.type === "rich-text") {
    return (
      <>
        <SectionHeading heading={section.heading} level={headingLevel} />
        <BlocksRenderer blocks={section.body} listVariant="accent" />
      </>
    );
  }

  if (section.type === "steps") {
    return (
      <>
        <SectionHeading heading={section.heading} level={headingLevel} />
        {section.intro ? <BlocksRenderer blocks={section.intro} listVariant="accent" /> : null}
        <ol className="operation-content__steps">
          {section.steps.map((step, index) => (
            <li className="operation-content__step" key={`${step.title}-${index}`}>
              <div aria-hidden="true" className="operation-content__step-number">
                {index + 1}
              </div>
              <div>
                <h3 className="content-card__heading content-card__heading--h3">
                  {formatRussianText(step.title)}
                </h3>
                {step.description ? <p>{formatRussianText(step.description)}</p> : null}
              </div>
            </li>
          ))}
        </ol>
        {section.outro ? <BlocksRenderer blocks={section.outro} listVariant="accent" /> : null}
      </>
    );
  }

  if (section.type === "price") {
    return (
      <>
        <SectionHeading heading={section.heading} level={headingLevel} />
        {section.intro ? <BlocksRenderer blocks={section.intro} listVariant="accent" /> : null}
        <PriceList prices={prices} />
        {section.disclaimer ? (
          <div className="operation-content__disclaimer">
          <BlocksRenderer blocks={section.disclaimer} listVariant="accent" />
          </div>
        ) : null}
      </>
    );
  }

  if (section.type === "video") {
    return (
      <video className="operation-content__video" controls playsInline preload="none" poster={section.poster.url}>
        {section.webm ? <source src={section.webm.url} type={section.webm.mime} /> : null}
        <source src={section.mp4.url} type={section.mp4.mime} />
        Ваш браузер не поддерживает воспроизведение видео.
      </video>
    );
  }

  return (
    <>
      <SectionHeading heading={section.heading} level={headingLevel} />
      {section.intro ? <BlocksRenderer blocks={section.intro} listVariant="accent" /> : null}
      <TextItems
        checklist={section.type === "checklist"}
        items={section.items}
      />
      {section.outro ? <BlocksRenderer blocks={section.outro} listVariant="accent" /> : null}
    </>
  );
}

export function OperationContentRenderer({
  prices,
  sections,
  showNavigation = true,
}: OperationContentRendererProps) {
  const navigation = sections.flatMap((section) =>
    section.showInPageNavigation && section.anchor && section.heading
      ? [{ anchor: section.anchor, heading: section.heading }]
      : [],
  );

  return (
    <div className="operation-content">
      {showNavigation && navigation.length > 0 ? (
        <nav
          aria-label="Навигация по разделам операции"
          className="operation-content__navigation content-card"
        >
          <ul>
            {navigation.map((item) => (
              <li key={item.anchor}>
                <a className="operation-content__navigation-link" href={`#${item.anchor}`}>
                  {formatRussianText(item.heading)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <div className="operation-content__sections">
        {sections.map((section) => (
          <section
            className="content-card content-card--spacious content-section operation-content__section"
            id={section.anchor}
            key={section.sectionKey}
          >
            <SectionContent prices={prices} section={section} />
          </section>
        ))}
      </div>
    </div>
  );
}
