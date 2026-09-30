import type { ReactNode } from "react";
import { Accordion, formatRussianText, type AccordionItem } from "@drkav/ui";

export type PatientChecklistItem = {
  description: string;
  title: string;
};

export function PatientChecklist({ items }: { items: readonly PatientChecklistItem[] }) {
  return (
    <ul className="patient-checklist">
      {items.map((item) => (
        <li className="patient-checklist__item" key={item.title}>
          <span aria-hidden="true" className="patient-checklist__marker">✓</span>
          <div>
            <h3 className="card-title patient-checklist__title">{formatRussianText(item.title)}</h3>
            <p className="patient-checklist__description">{formatRussianText(item.description)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function PatientSection({ children, title }: { children: ReactNode; title: string }) {
  return <section className="content-card content-card--spacious patient-section"><h2 className="content-card__heading content-card__heading--h2">{formatRussianText(title)}</h2>{children}</section>;
}

export type PatientFaqItem = AccordionItem;

export function PatientFaq({ items }: { items: readonly PatientFaqItem[] }) {
  return <Accordion items={items} />;
}
