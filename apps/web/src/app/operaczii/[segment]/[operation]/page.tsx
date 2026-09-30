import type { Metadata } from "next";
import {
  CmsOperationPage,
  getCmsOperationMetadata,
} from "@/components/content-page/cms-operation-page";
import { getCmsOperationPaths } from "@/content/cms-migrated-operations";

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
  const paths = await getCmsOperationPaths();

  return paths
    .filter((path) => path.split("/").filter(Boolean).length === 3)
    .map(paramsFromRoute);
}

export async function generateMetadata({ params }: NestedOperationPageProps): Promise<Metadata> {
  const { segment, operation } = await params;
  const route = routeFor(segment, operation);

  return getCmsOperationMetadata(route);
}

export default async function NestedOperationPage({ params }: NestedOperationPageProps) {
  const { segment, operation } = await params;
  const route = routeFor(segment, operation);

  return <CmsOperationPage path={route} />;
}
