import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OperationContentRenderer } from "@/components/operation-content/operation-content-renderer";
import {
  getCmsOperationByPath,
  type CmsMigratedOperationPath,
} from "@/content/cms-migrated-operations";
import { logCmsError } from "@/content/cms-logging";
import { toMetadata, toUnavailableMetadata } from "@/content/seo";

import { StaticPage } from "./static-page";

export async function getCmsOperationMetadata(
  path: CmsMigratedOperationPath,
): Promise<Metadata> {
  try {
    const content = await getCmsOperationByPath(path);

    if (!content) {
      notFound();
    }

    return toMetadata(content.seo);
  } catch (error) {
    logCmsError("cms_metadata_fallback_rendered", error, path);
    return toUnavailableMetadata(path);
  }
}

export async function CmsOperationPage({
  path,
}: {
  path: CmsMigratedOperationPath;
}) {
  let content: Awaited<ReturnType<typeof getCmsOperationByPath>>;

  try {
    content = await getCmsOperationByPath(path);
  } catch (error) {
    logCmsError("cms_cold_request_failed", error, path);
    throw error;
  }

  if (!content) {
    notFound();
  }

  return (
    <StaticPage
      breadcrumbs={[
        { href: "/", label: "Главная" },
        { href: "/operaczii", label: "Операции" },
        { label: content.heading },
      ]}
      description={content.heroDescription ?? ""}
      title={content.heading}
    >
      <OperationContentRenderer
        prices={content.prices}
        sections={content.contentSections}
      />
    </StaticPage>
  );
}
