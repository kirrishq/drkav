import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegistryScaffoldPage } from "@/components/content-page/registry-scaffold-page";
import {
  CmsOperationPage,
  getCmsOperationMetadata,
} from "@/components/content-page/cms-operation-page";
import {
  cmsMigratedOperationPaths,
  getCmsOperationByPath,
  isCmsMigratedOperationPath,
} from "@/content/cms-migrated-operations";
import { CmsInvalidResponseError } from "@/content/cms-errors";
import { allPageRegistryItems, getPageByRoute, getPageMetadata } from "@/content/page-registry";

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
  const nestedCmsPaths = cmsMigratedOperationPaths.filter(
    (path) => path.split("/").filter(Boolean).length === 3,
  );
  const cmsParams = nestedCmsPaths.map(paramsFromRoute);

  if (process.env.NODE_ENV === "production") {
    await Promise.all(
      nestedCmsPaths.map(async (path) => {
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
    return getCmsOperationMetadata(route);
  }

  return getPageMetadata(route);
}

export default async function NestedOperationPage({ params }: NestedOperationPageProps) {
  const { segment, operation } = await params;
  const route = routeFor(segment, operation);

  if (isCmsMigratedOperationPath(route)) {
    return <CmsOperationPage path={route} />;
  }

  const item = getPageByRoute(route);

  if (item?.kind !== "operation") {
    notFound();
  }

  return <RegistryScaffoldPage parent={{ href: "/operaczii", label: "Операции" }} route={route} />;
}
