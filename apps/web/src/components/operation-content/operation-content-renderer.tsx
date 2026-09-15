import type {
  OperationContentSection,
  OperationTextItem,
  PriceItem,
} from "@drkav/content-contracts";
import { formatPriceItem } from "@drkav/content-contracts";

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
    <h2 className="content-card__heading content-card__heading--h2">{heading}</h2>
  ) : (
    <h3 className="content-card__heading content-card__heading--h3">{heading}</h3>
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
            {item.title ? <strong>{item.title}</strong> : null}
            <span>{item.text}</span>
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
              {price.name}
            </h3>
            <p className="operation-content__price-value">
              {formatPriceItem(price)}
            </p>
          </div>
          {price.description ? (
            <p className="operation-content__price-description">
              {price.description}
            </p>
          ) : null}
          {price.note ? (
            <p className="operation-content__price-note">{price.note}</p>
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
        <BlocksRenderer blocks={section.body} />
      </>
    );
  }

  if (section.type === "steps") {
    return (
      <>
        <SectionHeading heading={section.heading} level={headingLevel} />
        {section.intro ? <BlocksRenderer blocks={section.intro} /> : null}
        <ol className="operation-content__steps">
          {section.steps.map((step, index) => (
            <li className="operation-content__step" key={`${step.title}-${index}`}>
              <div aria-hidden="true" className="operation-content__step-number">
                {index + 1}
              </div>
              <div>
                <h3 className="content-card__heading content-card__heading--h3">
                  {step.title}
                </h3>
                {step.description ? <p>{step.description}</p> : null}
              </div>
            </li>
          ))}
        </ol>
        {section.outro ? <BlocksRenderer blocks={section.outro} /> : null}
      </>
    );
  }

  if (section.type === "price") {
    return (
      <>
        <SectionHeading heading={section.heading} level={headingLevel} />
        {section.intro ? <BlocksRenderer blocks={section.intro} /> : null}
        <PriceList prices={prices} />
        {section.disclaimer ? (
          <div className="operation-content__disclaimer">
            <BlocksRenderer blocks={section.disclaimer} />
          </div>
        ) : null}
      </>
    );
  }

  return (
    <>
      <SectionHeading heading={section.heading} level={headingLevel} />
      {section.intro ? <BlocksRenderer blocks={section.intro} /> : null}
      <TextItems
        checklist={section.type === "checklist"}
        items={section.items}
      />
      {section.outro ? <BlocksRenderer blocks={section.outro} /> : null}
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
                  {item.heading}
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
