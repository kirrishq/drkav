import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/pacientam/pro-bolezni");

export default function ConditionsPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Про болезни" }]} description="Общие сведения о факторах, которые важно обсудить с врачом перед планированием операции." title="Информация о заболеваниях и противопоказаниях" />;
}
