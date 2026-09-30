import type { RichTextInline, StaticPageContent } from "@drkav/content-contracts";
import { formatRussianText } from "@drkav/ui";

function inlineText(value: RichTextInline): string {
  if (value.type === "link") {
    return value.children.map((child) => child.text).join("");
  }

  return value.text;
}

export function getRichTextParagraphs(
  page: StaticPageContent | null,
  sectionKey: string,
): readonly string[] {
  const section = page?.contentSections.find(
    (candidate) => candidate.type === "rich-text" && candidate.sectionKey === sectionKey,
  );

  if (!section || section.type !== "rich-text") {
    return [];
  }

  return section.body.flatMap((block) => {
    if (block.type !== "paragraph") {
      return [];
    }

    const text = formatRussianText(block.children.map(inlineText).join("").trim());
    return text ? [text] : [];
  });
}

export function getCardGridItems(
  page: StaticPageContent | null,
  sectionKey: string,
) {
  const section = page?.contentSections.find(
    (candidate) => candidate.type === "card-grid" && candidate.sectionKey === sectionKey,
  );

  return section?.type === "card-grid" ? section.cards : [];
}
