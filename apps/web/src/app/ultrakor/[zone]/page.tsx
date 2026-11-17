import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { UltrakorZoneContent } from "@/components/ultrakor-zone-content";
import {
  getUltrakorOperationByZone,
  getUltrakorOperationCatalog,
} from "@/content/ultrakor-operations";
import { ultrakorZoneContexts } from "@/content/ultrakor-zone-context";
import { toMetadata } from "@/content/seo";

type Props = { params: Promise<{ zone: string }> };

export async function generateStaticParams() {
  const operations = await getUltrakorOperationCatalog();
  return operations.map(({ zoneSlug }) => ({ zone: zoneSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { zone } = await params;
  const operation = await getUltrakorOperationByZone(zone);
  if (!operation) notFound();

  const context = ultrakorZoneContexts[zone];
  return toMetadata(context ? { ...operation.seo, title: context.title, description: context.description } : operation.seo);
}

export default function UltrakorZonePage({ params }: Props) {
  return <UltrakorZoneContent params={params} />;
}
