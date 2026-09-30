import { RecordCard } from "@drkav/ui";

import { StaticPage } from "@/components/content-page/static-page";
import { StaticPageSections } from "@/components/patient-content/static-page-sections";
import { patientSections } from "@/components/patient-related-pages/patient-related-pages";
import { getPageMetadata } from "@/content/page-registry";
import { getStaticPageContent } from "@/content/static-page";
import { getStaticPageMetadata } from "@/content/static-page";

export async function generateMetadata() {
  return getStaticPageMetadata("patients", getPageMetadata("/pacientam"));
}

export default async function PatientsPage() {
  const cmsPage = await getStaticPageContent("patients");
  const content = cmsPage?.contentSections.length ? (
    <StaticPageSections sections={cmsPage.contentSections} />
  ) : (
    <div className="patient-page-content">
      {patientSections.map((section) => (
        <section className="content-card content-card--muted content-section" id={section.id} key={section.id}>
          <h2 className="content-card__heading content-card__heading--h2">{section.title}</h2>
          <div className="content-card__grid">
            {section.pages.map((page) => (
              <RecordCard details={[{ value: page.description }]} href={page.href} key={page.href} title={page.title} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );

  return (
    <StaticPage
      breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Пациентам" }]}
      description="Собрали материалы, которые помогают подготовиться к консультации и операции, спланировать восстановление и найти ответы на важные вопросы."
      pageKey="patients"
      title="Пациентам"
    >
      {content}
    </StaticPage>
  );
}
