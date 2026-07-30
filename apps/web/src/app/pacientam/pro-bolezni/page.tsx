import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "Информация о заболеваниях и противопоказаниях", description: "Факторы, которые важно обсудить с врачом до планирования операции." };

export default function ConditionsPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Про болезни" }]} description="Общие сведения о факторах, которые важно обсудить с врачом перед планированием операции." title="Информация о заболеваниях и противопоказаниях" />;
}
