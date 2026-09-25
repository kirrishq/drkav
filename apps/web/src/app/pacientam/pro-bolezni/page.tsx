import { BlogIndex } from "@/components/blog/blog-index";
import { StaticPage } from "@/components/content-page/static-page";
import { PatientRelatedPages } from "@/components/patient-related-pages/patient-related-pages";
import { createContentRepository } from "@/content/content-repository";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/pacientam/pro-bolezni");

export default async function ConditionsPage() {
  const conditions = await createContentRepository().getConditionIndex();
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Про болезни" }]} description="Материалы о заболеваниях, подготовке, операциях и восстановлении." title="Про болезни"><BlogIndex {...conditions} basePath="/pacientam/pro-bolezni" cardVariant="compact" gridColumns="three" showCategories={false} showCover={false} showPublishedAt={false} showReadingTime={false} /><PatientRelatedPages currentHref="/pacientam/pro-bolezni" /></StaticPage>;
}
