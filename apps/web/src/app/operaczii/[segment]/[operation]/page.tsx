import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegistryScaffoldPage } from "@/components/content-page/registry-scaffold-page";
import { allPageRegistryItems, getPageByRoute, getPageMetadata } from "@/content/page-registry";

type NestedOperationPageProps = {
  params: Promise<{ segment: string; operation: string }>;
};

function routeFor(segment: string, operation: string) {
  return `/operaczii/${segment}/${operation}`;
}

export function generateStaticParams() {
  return allPageRegistryItems
    .filter((item) => item.kind === "operation" && item.route.split("/").filter(Boolean).length === 3)
    .map((item) => {
      const [, segment, operation] = item.route.split("/").filter(Boolean);
      return { segment, operation };
    });
}

export async function generateMetadata({ params }: NestedOperationPageProps): Promise<Metadata> {
  const { segment, operation } = await params;
  return getPageMetadata(routeFor(segment, operation));
}

export default async function NestedOperationPage({ params }: NestedOperationPageProps) {
  const { segment, operation } = await params;
  const route = routeFor(segment, operation);
  const item = getPageByRoute(route);

  if (item?.kind !== "operation") {
    notFound();
  }

  return <RegistryScaffoldPage parent={{ href: "/operaczii", label: "Операции" }} route={route} />;
}
