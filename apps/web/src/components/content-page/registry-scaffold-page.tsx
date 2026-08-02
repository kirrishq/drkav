import { notFound } from "next/navigation";

import { StaticPage } from "@/components/content-page/static-page";
import { getPageByRoute } from "@/content/page-registry";

type RegistryScaffoldPageProps = {
  route: string;
  parent?: { href: string; label: string };
};

export function RegistryScaffoldPage({ route, parent }: RegistryScaffoldPageProps) {
  const item = getPageByRoute(route);

  if (!item) {
    notFound();
  }

  return (
    <StaticPage
      breadcrumbs={[
        { href: "/", label: "Главная" },
        ...(parent ? [parent] : []),
        { label: item.name },
      ]}
      description={item.seo?.description ?? ""}
      title={item.name}
    />
  );
}
