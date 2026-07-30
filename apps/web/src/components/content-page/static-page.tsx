import type { ReactNode } from "react";

import { PageIntro, type PageIntroProps } from "@drkav/ui";

import { SiteHeader } from "@/components/site-header/site-header";

type StaticPageProps = PageIntroProps & {
  children?: ReactNode;
};

/** Shared chrome for independently maintained static content pages. */
export function StaticPage({ children, ...pageIntroProps }: StaticPageProps) {
  return (
    <>
      <SiteHeader />
      <PageIntro {...pageIntroProps}>{children}</PageIntro>
    </>
  );
}
