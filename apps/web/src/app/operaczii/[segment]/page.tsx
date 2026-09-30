import type { Metadata } from "next";
import {
  CmsOperationPage,
  getCmsOperationMetadata,
} from "@/components/content-page/cms-operation-page";
import { getCmsOperationPaths } from "@/content/cms-migrated-operations";

type OperationPageProps = {
  params: Promise<{ segment: string }>;
};

function routeFor(segment: string) {
  return `/operaczii/${segment}`;
}

export async function generateStaticParams() {
  const paths = await getCmsOperationPaths();

  return paths
    .filter((path) => path.split("/").filter(Boolean).length === 2)
    .map((path) => ({ segment: path.split("/").at(-1) }));
}

export async function generateMetadata({ params }: OperationPageProps): Promise<Metadata> {
  const { segment } = await params;
  const route = routeFor(segment);

  return getCmsOperationMetadata(route);
}

export default async function OperationPage({ params }: OperationPageProps) {
  const { segment } = await params;
  const route = routeFor(segment);

  return <CmsOperationPage path={route} />;
}
