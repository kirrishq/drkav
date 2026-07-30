import type { ComponentPropsWithoutRef } from "react";

import { cn } from "./lib/cn";

export type TextLinkProps = ComponentPropsWithoutRef<"a">;

/** Inline link for text content, independent from a particular router. */
export function TextLink({ className, ...props }: TextLinkProps) {
  return <a className={cn("text-link", className)} {...props} />;
}
