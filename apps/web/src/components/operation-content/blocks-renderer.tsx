import type { ReactNode } from "react";

import type {
  RichTextBlock,
  RichTextInline,
  RichTextText,
} from "@drkav/content-contracts";

function TextMarks({ node }: { node: RichTextText }) {
  let content: ReactNode = node.text;

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

export function BlocksRenderer({
  blocks,
  className = "operation-content__blocks",
}: {
  blocks: readonly RichTextBlock[];
  className?: string;
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
            <Heading className={`content-card__heading content-card__heading--h${Math.min(block.level, 4)}`} key={index}>
              <InlineContent>{block.children}</InlineContent>
            </Heading>
          );
        }

        const List = block.format === "ordered" ? "ol" : "ul";
        return (
          <List className="operation-content__blocks-list" key={index}>
            {block.children.map((item, itemIndex) => (
              <li key={itemIndex}>
                <InlineContent>{item.children}</InlineContent>
              </li>
            ))}
          </List>
        );
      })}
    </div>
  );
}
