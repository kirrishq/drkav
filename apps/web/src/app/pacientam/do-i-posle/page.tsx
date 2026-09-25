import { BeforeAfterGallery } from "@/components/before-after-gallery/before-after-gallery";
import { PatientSubpageLayout } from "@/components/patient-page/patient-subpage-layout";
import { StaticPage } from "@/components/content-page/static-page";
import { PatientRelatedPages } from "@/components/patient-related-pages/patient-related-pages";
import { createContentRepository } from "@/content/content-repository";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/pacientam/do-i-posle");

export default async function BeforeAfterPage() {
  const cases = await createContentRepository().getBeforeAfterCases();
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "До/после" }]} className="patient-subpage-page" description="Фотографии результатов операций и примеры работ доктора Коробова." title="Результаты операций: до и после"><PatientSubpageLayout><BeforeAfterGallery items={cases} /></PatientSubpageLayout><PatientRelatedPages currentHref="/pacientam/do-i-posle" /></StaticPage>;
}
