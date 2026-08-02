import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegistryScaffoldPage } from "@/components/content-page/registry-scaffold-page";
import { StaticPage } from "@/components/content-page/static-page";
import {
  getCmsOperationByPath,
  isCmsMigratedOperationPath,
} from "@/content/cms-migrated-operations";
import { allPageRegistryItems, getPageByRoute, getPageMetadata } from "@/content/page-registry";
import { toMetadata } from "@/content/seo";

type NestedOperationPageProps = {
  params: Promise<{ segment: string; operation: string }>;
};

function routeFor(segment: string, operation: string) {
  return `/operaczii/${segment}/${operation}`;
}

export function generateStaticParams() {
  return allPageRegistryItems
    .filter(
      (item) =>
        item.kind === "operation" &&
        !isCmsMigratedOperationPath(item.route) &&
        item.route.split("/").filter(Boolean).length === 3,
    )
    .map((item) => {
      const [, segment, operation] = item.route.split("/").filter(Boolean);
      return { segment, operation };
    });
}

export async function generateMetadata({ params }: NestedOperationPageProps): Promise<Metadata> {
  const { segment, operation } = await params;
  const route = routeFor(segment, operation);

  if (isCmsMigratedOperationPath(route)) {
    const content = await getCmsOperationByPath(route);

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
    const content = await getCmsOperationByPath(route);

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
      />
    );
  }

  const item = getPageByRoute(route);

  if (item?.kind !== "operation") {
    notFound();
  }

  return <RegistryScaffoldPage parent={{ href: "/operaczii", label: "Операции" }} route={route} />;
}
