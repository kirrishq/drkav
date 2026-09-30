import type { ReactNode } from "react";

import { PageIntro, type PageIntroProps } from "@drkav/ui";

import { SiteHeader } from "@/components/site-header/site-header-server";
import { SharedSections } from "@/components/shared-sections/shared-sections";
import { getStaticPageContent } from "@/content/static-page";

type StaticPageProps = Omit<PageIntroProps, "description" | "title"> & {
  children?: ReactNode;
  description?: string;
  pageKey?: string;
  title?: string;
};

/** Shared chrome for independently maintained static content pages. */
export async function StaticPage({ children, description = "", pageKey, title = "", ...pageIntroProps }: StaticPageProps) {
  const cmsPage = pageKey ? await getStaticPageContent(pageKey) : null;

  return (
    <>
      <SiteHeader />
      <PageIntro
        {...pageIntroProps}
        description={cmsPage?.heroDescription || description}
        title={cmsPage?.heading || title}
      >
        {children}
      </PageIntro>
      {cmsPage?.sharedSections.length ? <SharedSections sections={cmsPage.sharedSections} /> : null}
    </>
  );
}
