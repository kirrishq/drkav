import type { CSSProperties, ReactNode } from "react";

import type {
  BuilderBlock,
  BuilderPage,
  ContentAction,
} from "@drkav/content-contracts";
import { buttonVariants, cn } from "@drkav/ui";
import Image from "next/image";
import Link from "next/link";

import { BlocksRenderer } from "@/components/operation-content/blocks-renderer";

function BuilderAction({ action }: { action: ContentAction }) {
  const className = buttonVariants({ size: "md", variant: action.variant });
  const props = action.openInNewTab ? { rel: "noreferrer", target: "_blank" } : undefined;

  return action.href.startsWith("/") ? (
    <Link className={className} href={action.href} {...props}>{action.label}</Link>
  ) : (
    <a className={className} href={action.href} {...props}>{action.label}</a>
  );
}

function HeroBlock({ block }: { block: Extract<BuilderBlock, { type: "hero" }> }) {
  return (
    <section
      aria-labelledby={`${block.id}-heading`}
      className={cn(
        "builder-page__hero",
        block.align === "center" && "builder-page__hero--centered",
      )}
    >
      <div className="builder-page__hero-copy">
        {block.eyebrow ? <p className="builder-page__eyebrow">{block.eyebrow}</p> : null}
        <h1 className="builder-page__hero-heading" id={`${block.id}-heading`}>
          {block.heading}
        </h1>
        {block.description ? <p className="builder-page__hero-description">{block.description}</p> : null}
        {block.primaryAction || block.secondaryAction ? (
          <div className="builder-page__actions">
            {block.primaryAction ? <BuilderAction action={block.primaryAction} /> : null}
            {block.secondaryAction ? <BuilderAction action={block.secondaryAction} /> : null}
          </div>
        ) : null}
      </div>
      {block.image ? (
        <Image
          alt={block.image.alternativeText ?? ""}
          className="builder-page__hero-image"
          height={block.image.height ?? 900}
          src={block.image.url}
          width={block.image.width ?? 1200}
        />
      ) : null}
    </section>
  );
}

function RichTextBlock({ block }: { block: Extract<BuilderBlock, { type: "rich-text" }> }) {
  return (
    <section className="builder-page__section">
      {block.heading ? <h2 className="builder-page__heading">{block.heading}</h2> : null}
      <BlocksRenderer blocks={block.body} className="builder-page__rich-text" />
    </section>
  );
}

function CalloutBlock({ block }: { block: Extract<BuilderBlock, { type: "callout" }> }) {
  return (
    <aside className={cn("builder-page__callout", `builder-page__callout--${block.tone}`)}>
      {block.title ? <h2 className="builder-page__callout-title">{block.title}</h2> : null}
      <BlocksRenderer blocks={block.body} className="builder-page__rich-text" />
    </aside>
  );
}

function FaqBlock({ block }: { block: Extract<BuilderBlock, { type: "faq" }> }) {
  return (
    <section className="builder-page__section">
      {block.heading ? <h2 className="builder-page__heading">{block.heading}</h2> : null}
      <div className="builder-page__faq">
        {block.items.map((item) => (
          <details className="builder-page__faq-item" key={item.question}>
            <summary className="builder-page__faq-question">{item.question}</summary>
            <p className="builder-page__faq-answer">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function BuilderBlockContent({ block }: { block: BuilderBlock }): ReactNode {
  switch (block.type) {
    case "hero":
      return <HeroBlock block={block} />;
    case "rich-text":
      return <RichTextBlock block={block} />;
    case "callout":
      return <CalloutBlock block={block} />;
    case "faq":
      return <FaqBlock block={block} />;
  }
}

function getFontFamily(font: BuilderPage["theme"]["headingFont"]): string {
  return font === "geist" ? "var(--font-geist-sans)" : "ui-sans-serif, system-ui, sans-serif";
}

export function PageBuilderRenderer({ page }: { page: BuilderPage }) {
  // CMS theme values are runtime data; CSS custom properties keep them scoped to this page.
  const themeStyle = {
    "--builder-accent": page.theme.accentColor,
    "--builder-background": page.theme.backgroundColor,
    "--builder-body-font": getFontFamily(page.theme.bodyFont),
    "--builder-heading-font": getFontFamily(page.theme.headingFont),
    "--builder-text": page.theme.textColor,
  } as CSSProperties;

  return (
    <main className="builder-page" style={themeStyle}>
      {page.blocks.map((block) =>
        block.hidden ? null : (
          <div className="builder-page__block" data-builder-block={block.id} key={block.id}>
            {BuilderBlockContent({ block })}
          </div>
        ),
      )}
    </main>
  );
}
