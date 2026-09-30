import { PatientChecklist, PatientSection } from "@/components/patient-content/patient-content";
import { StaticPage } from "@/components/content-page/static-page";
import { PatientRelatedPages } from "@/components/patient-related-pages/patient-related-pages";
import { PatientSubpageLayout } from "@/components/patient-page/patient-subpage-layout";
import { StaticPageSections } from "@/components/patient-content/static-page-sections";
import { getPageMetadata } from "@/content/page-registry";
import { getStaticPageContent } from "@/content/static-page";
import { getStaticPageMetadata } from "@/content/static-page";

export async function generateMetadata() {
  return getStaticPageMetadata("patient-journey", getPageMetadata("/pacientam/kak-vse-budet"));
}

export default async function PatientJourneyPage() {
  const cmsPage = await getStaticPageContent("patient-journey");
  const content = cmsPage?.contentSections.length ? (
    <PatientSubpageLayout>
      <StaticPageSections sections={cmsPage.contentSections} />
    </PatientSubpageLayout>
  ) : (
    <PatientSubpageLayout>
      <div className="patient-page-content">
        <PatientSection title="Консультация"><PatientChecklist items={[{ title: "Способы записи", description: "Записаться можно через формы на сайте, социальные сети или через администратора." }, { title: "Оплата", description: "Администратор заранее направляет ссылку на оплату консультации." }, { title: "Доступность", description: "Как правило, консультацию можно организовать в течение недели." }]} /></PatientSection>
        <PatientSection title="Организация операции"><PatientChecklist items={[{ title: "Консультационный лист", description: "После консультации пациент получает рекомендации врача и расчёт стоимости." }, { title: "Бронирование даты", description: "После принятия решения можно зарезервировать дату операции." }, { title: "Предоперационные этапы", description: "Ассистент направляет памятки и список необходимых обследований." }, { title: "Анализы и обследование", description: "Результаты обследований рекомендуется подготовить заранее и передать врачу на проверку не позднее срока, который сообщит команда." }, { title: "Допуск к операции", description: "Решение о допуске принимается при отсутствии противопоказаний." }]} /></PatientSection>
        <PatientSection title="День операции"><PatientChecklist items={[{ title: "Прибытие в клинику", description: "Обычно необходимо приехать заранее; точное время сообщает администратор." }, { title: "Регистрация и документы", description: "Оформляются договор, информированные согласия и другие необходимые документы." }, { title: "Предоперационная разметка", description: "Доктор проводит финальную беседу, разметку и отвечает на вопросы." }, { title: "Анестезия", description: "Перед операцией проходит беседа с анестезиологом и необходимая подготовка." }, { title: "Операция", description: "Продолжительность зависит от индивидуального плана и выбранной тактики." }]} /></PatientSection>
        <PatientSection title="После операции"><PatientChecklist items={[{ title: "Наблюдение", description: "Во время пребывания в клинике пациент находится под наблюдением медицинской команды." }, { title: "Стационар", description: "Продолжительность пребывания определяется планом лечения и состоянием пациента." }, { title: "Выписка и связь", description: "После выписки выдаются необходимые рекомендации и материалы для первых дней восстановления." }, { title: "Послеоперационные осмотры", description: "Команда согласует график перевязок и контрольных визитов." }, { title: "Дальнейшее наблюдение", description: "Контрольные осмотры проводятся по индивидуальному графику, в клинике или по согласованному формату связи." }]} /></PatientSection>
      </div>
    </PatientSubpageLayout>
  );

  return <StaticPage pageKey="patient-journey" className="patient-subpage-page" breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Как всё будет" }]} description="Понятный путь от первой консультации до контрольных осмотров после операции." title="Как проходит путь пациента">{content}<PatientRelatedPages currentHref="/pacientam/kak-vse-budet" /></StaticPage>;
}
