import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "Безопасность пациента", description: "Принципы безопасности и наблюдения на всех этапах лечения." };

export default function SafetyPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Безопасность" }]} description="Принципы безопасности, информированного решения и наблюдения на всех этапах лечения." title="Безопасность пациента" />;
}
