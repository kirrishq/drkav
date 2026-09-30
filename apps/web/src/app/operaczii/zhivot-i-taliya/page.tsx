import { StaticPage } from "@/components/content-page/static-page";
import { OperationsCatalog } from "@/components/operations-catalog/operations-catalog";
import { createContentRepository } from "@/content/content-repository";
import { getPageMetadata } from "@/content/page-registry";
import { getStaticPageMetadata } from "@/content/static-page";

export async function generateMetadata() {
  return getStaticPageMetadata("operations-abdomen-waist", getPageMetadata("/operaczii/zhivot-i-taliya", {
    title: "Пластика живота и коррекция талии",
    description: "Варианты коррекции контуров живота и талии.",
    canonicalPath: "/operaczii/zhivot-i-taliya",
  }));
}

export default async function AbdomenWaistPage() {
  const groups = await createContentRepository().getOperationCatalog();
  const abdomenGroup = groups.filter((group) => group.key === "abdomen-and-waist");

  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/operaczii", label: "Операции" }, { label: "Живот и талия" }]} description="Варианты коррекции контуров живота и талии с учётом индивидуальных особенностей." pageKey="operations-abdomen-waist" title="Пластика живота и коррекция талии"><OperationsCatalog groups={abdomenGroup} /></StaticPage>;
}
