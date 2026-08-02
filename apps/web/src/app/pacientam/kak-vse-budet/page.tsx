import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/pacientam/kak-vse-budet");

export default function PatientJourneyPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Как всё будет" }]} description="Краткий план: консультация, подготовка, операция, восстановление и контрольные осмотры." title="Как проходит путь пациента" />;
}
