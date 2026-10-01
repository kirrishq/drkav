import type { ReactNode } from "react";

import type {
  RichTextBlock,
  RichTextInline,
  RichTextText,
} from "@drkav/content-contracts";
import { formatRussianText } from "@drkav/ui";
import Image from "next/image";

function TextMarks({ node }: { node: RichTextText }) {
  let content: ReactNode = formatRussianText(node.text);

  if (node.code) {
    content = <code>{content}</code>;
  }
  if (node.underline) {
    content = <u>{content}</u>;
  }
  if (node.italic) {
    content = <em>{content}</em>;
  }
  if (node.bold) {
    content = <strong>{content}</strong>;
  }

  return content;
}

function InlineNode({ node }: { node: RichTextInline }) {
  if (node.type === "text") {
    return <TextMarks node={node} />;
  }

  return (
    <a className="text-link" href={node.url}>
      {node.children.map((child, index) => (
        <TextMarks key={index} node={child} />
      ))}
    </a>
  );
}

function InlineContent({ children }: { children: readonly RichTextInline[] }) {
  return children.map((node, index) => <InlineNode key={index} node={node} />);
}

function getInlineText(children: readonly RichTextInline[]): string {
  return children.map((node) => node.type === "text" ? node.text : node.children.map((child) => child.text).join("" )).join("");
}

export function getHeadingAnchorId(prefix: string, index: number, children: readonly RichTextInline[]): string {
  const slug = getInlineText(children)
    .toLocaleLowerCase("ru-RU")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return `${prefix}-${index}-${slug || "heading"}`;
}

export function BlocksRenderer({
  blocks,
  className = "operation-content__blocks",
  listVariant = "default",
  headingIdPrefix,
}: {
  blocks: readonly RichTextBlock[];
  className?: string;
  headingIdPrefix?: string;
  listVariant?: "default" | "accent";
}) {
  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p key={index}>
              <InlineContent>{block.children}</InlineContent>
            </p>
          );
        }

        if (block.type === "heading") {
          const Heading = `h${block.level}` as "h2" | "h3" | "h4" | "h5" | "h6";
          return (
            <Heading className={`content-card__heading content-card__heading--h${Math.min(block.level, 4)}`} id={headingIdPrefix ? getHeadingAnchorId(headingIdPrefix, index, block.children) : undefined} key={index}>
              <InlineContent>{block.children}</InlineContent>
            </Heading>
          );
        }

        if (block.type === "image") {
          return (
            <Image
              alt={block.image.alternativeText ?? ""}
              className="operation-content__block-image"
              height={block.image.height ?? 900}
              key={index}
              sizes="(min-width: 72rem) 50vw, 100vw"
              src={block.image.url}
              width={block.image.width ?? 1200}
            />
          );
        }

        const List = block.format === "ordered" ? "ol" : "ul";
        const accentList = listVariant === "accent" && block.format === "unordered";
        return (
          <List className={accentList ? "content-card__list" : "operation-content__blocks-list"} key={index}>
            {block.children.map((item, itemIndex) => (
              <li className={accentList ? "content-card__list-item" : undefined} key={itemIndex}>
                {accentList ? <span aria-hidden="true" className="content-card__list-marker" /> : null}
                {accentList ? <span><InlineContent>{item.children}</InlineContent></span> : <InlineContent>{item.children}</InlineContent>}
              </li>
            ))}
          </List>
        );
      })}
    </div>
  );
}
