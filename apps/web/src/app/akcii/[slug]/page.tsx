import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegistryScaffoldPage } from "@/components/content-page/registry-scaffold-page";
import { getPageByRoute, getPageMetadata } from "@/content/page-registry";

type PromotionEntryPageProps = {
  params: Promise<{ slug: string }>;
};

function routeFor(slug: string) {
  return `/akcii/${slug}`;
}

export async function generateMetadata({ params }: PromotionEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return getPageMetadata(routeFor(slug));
}

export default async function PromotionEntryPage({ params }: PromotionEntryPageProps) {
  const { slug } = await params;
  const route = routeFor(slug);

  if (!getPageByRoute(route)) {
    notFound();
  }

  return <RegistryScaffoldPage parent={{ href: "/akcii", label: "Акции" }} route={route} />;
}
