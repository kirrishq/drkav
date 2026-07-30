import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "Как проходит путь пациента", description: "Консультация, подготовка, операция, восстановление и контрольные осмотры." };

export default function PatientJourneyPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Как всё будет" }]} description="Краткий план: консультация, подготовка, операция, восстановление и контрольные осмотры." title="Как проходит путь пациента" />;
}
