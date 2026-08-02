import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegistryScaffoldPage } from "@/components/content-page/registry-scaffold-page";
import { allPageRegistryItems, getPageByRoute, getPageMetadata } from "@/content/page-registry";

type OperationPageProps = {
  params: Promise<{ segment: string }>;
};

function routeFor(segment: string) {
  return `/operaczii/${segment}`;
}

export function generateStaticParams() {
  return allPageRegistryItems
    .filter((item) => item.kind === "operation" && item.route !== "/operaczii/diastaz-myshc-zhivota" && item.route.split("/").filter(Boolean).length === 2)
    .map((item) => ({ segment: item.route.split("/").at(-1) }));
}

export async function generateMetadata({ params }: OperationPageProps): Promise<Metadata> {
  const { segment } = await params;
  return getPageMetadata(routeFor(segment));
}

export default async function OperationPage({ params }: OperationPageProps) {
  const { segment } = await params;
  const route = routeFor(segment);
  const item = getPageByRoute(route);

  if (item?.kind !== "operation") {
    notFound();
  }

  return <RegistryScaffoldPage parent={{ href: "/operaczii", label: "Операции" }} route={route} />;
}
