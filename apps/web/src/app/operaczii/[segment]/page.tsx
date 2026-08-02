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

type OperationPageProps = {
  params: Promise<{ segment: string }>;
};

function routeFor(segment: string) {
  return `/operaczii/${segment}`;
}

export function generateStaticParams() {
  const registryParams = allPageRegistryItems
    .filter(
      (item) =>
        item.kind === "operation" &&
        !isCmsMigratedOperationPath(item.route) &&
        item.route.split("/").filter(Boolean).length === 2,
    )
    .map((item) => ({ segment: item.route.split("/").at(-1) }));
  const oneLevelCmsPaths = cmsMigratedOperationPaths.filter(
    (path) =>
      path !== "/operaczii/diastaz-myshc-zhivota" &&
      path.split("/").filter(Boolean).length === 2,
  );
  const cmsParams = oneLevelCmsPaths.map((path) => ({
    segment: path.split("/").at(-1),
  }));

  if (process.env.NODE_ENV === "production") {
    return Promise.all(
      oneLevelCmsPaths.map(async (path) => {
        const content = await getCmsOperationByPath(path);

        if (!content) {
          throw new CmsInvalidResponseError(
            "A published CMS operation required by the production build was not found.",
          );
        }
      }),
    ).then(() => [...registryParams, ...cmsParams]);
  }

  return [...registryParams, ...cmsParams];
}

export async function generateMetadata({ params }: OperationPageProps): Promise<Metadata> {
  const { segment } = await params;
  const route = routeFor(segment);

  return isCmsMigratedOperationPath(route)
    ? getCmsOperationMetadata(route)
    : getPageMetadata(route);
}

export default async function OperationPage({ params }: OperationPageProps) {
  const { segment } = await params;
  const route = routeFor(segment);

  if (isCmsMigratedOperationPath(route)) {
    return <CmsOperationPage path={route} />;
  }

  const item = getPageByRoute(route);

  if (item?.kind !== "operation") {
    notFound();
  }

  return <RegistryScaffoldPage parent={{ href: "/operaczii", label: "Операции" }} route={route} />;
}
