import { PatientSection } from "@/components/patient-content/patient-content";
import { PatientSubpageLayout } from "@/components/patient-page/patient-subpage-layout";
import { StaticPage } from "@/components/content-page/static-page";
import { PatientRelatedPages } from "@/components/patient-related-pages/patient-related-pages";
import { getPageMetadata } from "@/content/page-registry";
import { getStaticPageContent } from "@/content/static-page";
import { getStaticPageMetadata } from "@/content/static-page";
import { StaticPageSections } from "@/components/patient-content/static-page-sections";

export async function generateMetadata() {
  return getStaticPageMetadata("tests", getPageMetadata("/pacientam/spisok-analizov"));
}

export default async function TestsListPage() {
  const cmsPage = await getStaticPageContent("tests");
  const tests = [
    ["Клинический анализ крови", "14 дней"],
    ["Группа крови, резус-фактор и фенотипирование эритроцитов Rh и Kell", "бессрочно"],
    ["Биохимический анализ крови: АСТ, АЛТ, мочевина, креатинин, общий белок, билирубин, холестерин, глюкоза, амилаза", "14 дней"],
    ["Коагулограмма: ПТИ, АЧТВ, МНО, тромбиновое время, фибриноген", "14 дней"],
    ["Анализы крови на ВИЧ, гепатиты B и C, сифилис", "14 дней"],
    ["D-димер", "14 дней"],
    ["Калий, натрий, хлор", "14 дней"],
    ["Общий анализ мочи с микроскопией", "14 дней"],
    ["ЭКГ", "14 дней"],
    ["Флюорография или рентгенография органов грудной клетки", "6 месяцев"],
    ["Заключение терапевта об отсутствии противопоказаний к плановой операции", "по заключению врача"],
    ["Дуплексное сканирование вен нижних конечностей", "1 месяц"],
    ["УЗИ брюшной полости — при абдоминопластике или липосакции живота", "1 месяц"],
    ["УЗИ передней брюшной стенки — при абдоминопластике или липосакции живота", "1 месяц"],
    ["УЗИ молочных желёз — при операциях на груди", "1 месяц"],
    ["ПЦР-мазок, не экспресс-тест", "48 часов"],
  ] as const;

  const content = cmsPage?.contentSections.length ? (
    <PatientSubpageLayout>
      <StaticPageSections sections={cmsPage.contentSections} />
    </PatientSubpageLayout>
  ) : (
    <PatientSubpageLayout>
      <PatientSection title="Обследования и сроки актуальности">
        <p className="patient-note">Список служит ориентиром. Окончательный перечень исследований, их сроки и решение о допуске к операции определяет врач с учётом планируемого вмешательства и состояния здоровья.</p>
        <dl className="patient-tests">{tests.map(([name, validity]) => <div className="patient-tests__item" key={name}><dt className="patient-tests__name">{name}</dt><dd className="patient-tests__validity">Срок актуальности: {validity}</dd></div>)}</dl>
      </PatientSection>
    </PatientSubpageLayout>
  );

  return <StaticPage pageKey="tests" breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Список анализов" }]} className="patient-subpage-page" description="Перечень обследований и сроков их актуальности перед операцией." title="Список анализов перед операцией">{content}<PatientRelatedPages currentHref="/pacientam/spisok-analizov" /></StaticPage>;
}
