import { BlogIndex } from "@/components/blog/blog-index";
import { PatientSubpageLayout } from "@/components/patient-page/patient-subpage-layout";
import { StaticPage } from "@/components/content-page/static-page";
import { PatientRelatedPages } from "@/components/patient-related-pages/patient-related-pages";
import { createContentRepository } from "@/content/content-repository";
import { getPageMetadata } from "@/content/page-registry";
import { getStaticPageMetadata } from "@/content/static-page";

export async function generateMetadata() {
  return getStaticPageMetadata("conditions", getPageMetadata("/pacientam/pro-bolezni"));
}

export default async function ConditionsPage() {
  const conditions = await createContentRepository().getConditionIndex();
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Про болезни" }]} className="patient-subpage-page" description="Материалы о заболеваниях, подготовке, операциях и восстановлении." pageKey="conditions" title="Про болезни"><PatientSubpageLayout><BlogIndex {...conditions} basePath="/pacientam/pro-bolezni" cardVariant="compact" gridColumns="three" showCategories={false} showCover={false} showPublishedAt={false} showReadingTime={false} /></PatientSubpageLayout><PatientRelatedPages currentHref="/pacientam/pro-bolezni" /></StaticPage>;
}
