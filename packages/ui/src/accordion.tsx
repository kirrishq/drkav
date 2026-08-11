import { cn } from "./lib/cn";

export type AccordionItem = {
  answer: string;
  question: string;
};

export type AccordionProps = {
  className?: string;
  items: readonly AccordionItem[];
};

/** Native-details accordion for concise, independently readable answers. */
export function Accordion({ className, items }: AccordionProps) {
  return (
    <div className={cn("accordion", className)}>
      {items.map((item) => (
        <details className="accordion__item" key={item.question}>
          <summary className="accordion__summary">
            <span>{item.question}</span>
            <span aria-hidden="true" className="accordion__indicator">
              <svg className="accordion__indicator-icon" fill="none" viewBox="0 0 20 20">
                <path d="m5.5 7.5 4.5 4.5 4.5-4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
              </svg>
            </span>
          </summary>
          <div className="accordion__content"><p>{item.answer}</p></div>
        </details>
      ))}
    </div>
  );
}
