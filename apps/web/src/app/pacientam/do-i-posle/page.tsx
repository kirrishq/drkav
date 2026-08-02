import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/pacientam/do-i-posle");

export default function BeforeAfterPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "До/после" }]} description="Примеры изменений после операций с пояснениями по срокам восстановления и особенностям результата." title="Результаты операций: до и после" />;
}
