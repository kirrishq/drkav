import { StaticPage } from "@/components/content-page/static-page";
import { OperationsCatalog } from "@/components/operations-catalog/operations-catalog";
import { createContentRepository } from "@/content/content-repository";
import { getPageMetadata } from "@/content/page-registry";
import { getStaticPageMetadata } from "@/content/static-page";

export async function generateMetadata() {
  return getStaticPageMetadata("operations", getPageMetadata("/operaczii", {
    title: "Пластические операции",
    description: "Направления пластической хирургии, подготовка и восстановление.",
    canonicalPath: "/operaczii",
  }));
}

export default async function OperationsPage() {
  const groups = await createContentRepository().getOperationCatalog();

  return (
    <StaticPage
      breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Операции" }]}
      description="Направления пластической хирургии, особенности подготовки и восстановления после вмешательств."
      pageKey="operations"
      title="Пластические операции"
    >
      <OperationsCatalog groups={groups} />
    </StaticPage>
  );
}
