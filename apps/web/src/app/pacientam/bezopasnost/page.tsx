import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/pacientam/bezopasnost");

export default function SafetyPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Безопасность" }]} description="Принципы безопасности, информированного решения и наблюдения на всех этапах лечения." title="Безопасность пациента" />;
}
