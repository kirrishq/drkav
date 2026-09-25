import { PatientChecklist, PatientSection } from "@/components/patient-content/patient-content";
import { PatientSubpageLayout } from "@/components/patient-page/patient-subpage-layout";
import { StaticPage } from "@/components/content-page/static-page";
import { PatientRelatedPages } from "@/components/patient-related-pages/patient-related-pages";

export const metadata = { title: "Ваш личный ассистент", description: "Организация консультаций, подготовки и коммуникации на каждом этапе." };

export default function AssistantPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Ваш личный ассистент" }]} className="patient-subpage-page" description="Ассистент сопровождает пациента в организационных вопросах до и после операции." title="Ваш личный ассистент"><PatientSubpageLayout><PatientSection title="Поддержка на каждом этапе"><PatientChecklist items={[{ title: "Запись на консультацию", description: "Поможет выбрать удобные дату и время консультации." }, { title: "Подготовка информации", description: "Соберёт результаты обследований и другие данные, необходимые врачу." }, { title: "Подготовка к операции", description: "Направит памятки о подготовке, обследованиях и действиях перед операцией." }, { title: "Период восстановления", description: "Передаст инструкции по операции и восстановлению, поможет с организационными вопросами." }, { title: "Контрольные визиты", description: "В течение года после операции поможет согласовать перевязки и осмотры." }]} /></PatientSection></PatientSubpageLayout><PatientRelatedPages currentHref="/pacientam/lichnyy-assistent" /></StaticPage>;
}
