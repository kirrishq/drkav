import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "Результаты операций: до и после", description: "Примеры изменений после операций с пояснениями по срокам восстановления." };

export default function BeforeAfterPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { label: "До/после" }]} description="Примеры изменений после операций с пояснениями по срокам восстановления и особенностям результата." title="Результаты операций: до и после" />;
}
