import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/pacientam/spisok-analizov");

export default function TestsListPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Список анализов" }]} description="Перечень обследований формируется индивидуально на консультации с учётом планируемого вмешательства." title="Список анализов перед операцией" />;
}
