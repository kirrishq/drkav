import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegistryScaffoldPage } from "@/components/content-page/registry-scaffold-page";
import { StaticPage } from "@/components/content-page/static-page";
import { OperationContentRenderer } from "@/components/operation-content/operation-content-renderer";
import {
  cmsMigratedOperationPaths,
  getCmsOperationByPath,
  isCmsMigratedOperationPath,
} from "@/content/cms-migrated-operations";
import { CmsInvalidResponseError } from "@/content/cms-errors";
import { logCmsError } from "@/content/cms-logging";
import { allPageRegistryItems, getPageByRoute, getPageMetadata } from "@/content/page-registry";
import { toMetadata, toUnavailableMetadata } from "@/content/seo";

type NestedOperationPageProps = {
  params: Promise<{ segment: string; operation: string }>;
};

function routeFor(segment: string, operation: string) {
  return `/operaczii/${segment}/${operation}`;
}

function paramsFromRoute(route: string) {
  const [, segment, operation] = route.split("/").filter(Boolean);
  return { segment, operation };
}

export async function generateStaticParams() {
  const registryParams = allPageRegistryItems
    .filter(
      (item) =>
        item.kind === "operation" &&
        !isCmsMigratedOperationPath(item.route) &&
        item.route.split("/").filter(Boolean).length === 3,
    )
    .map((item) => paramsFromRoute(item.route));
  const cmsParams = cmsMigratedOperationPaths.map(paramsFromRoute);

  if (process.env.NODE_ENV === "production") {
    await Promise.all(
      cmsMigratedOperationPaths.map(async (path) => {
        const content = await getCmsOperationByPath(path);

        if (!content) {
          throw new CmsInvalidResponseError(
            "A published CMS operation required by the production build was not found.",
          );
        }
      }),
    );
  }

  return [...registryParams, ...cmsParams];
}

export async function generateMetadata({ params }: NestedOperationPageProps): Promise<Metadata> {
  const { segment, operation } = await params;
  const route = routeFor(segment, operation);

  if (isCmsMigratedOperationPath(route)) {
    let content: Awaited<ReturnType<typeof getCmsOperationByPath>>;

    try {
      content = await getCmsOperationByPath(route);
    } catch (error) {
      logCmsError("cms_metadata_fallback_rendered", error, route);
      return toUnavailableMetadata(route);
    }

    if (!content) {
      notFound();
    }

    return toMetadata(content.seo);
  }

  return getPageMetadata(route);
}

export default async function NestedOperationPage({ params }: NestedOperationPageProps) {
  const { segment, operation } = await params;
  const route = routeFor(segment, operation);

  if (isCmsMigratedOperationPath(route)) {
    let content: Awaited<ReturnType<typeof getCmsOperationByPath>>;

    try {
      content = await getCmsOperationByPath(route);
    } catch (error) {
      logCmsError("cms_cold_request_failed", error, route);
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

  const item = getPageByRoute(route);

  if (item?.kind !== "operation") {
    notFound();
  }

  return <RegistryScaffoldPage parent={{ href: "/operaczii", label: "Операции" }} route={route} />;
}
