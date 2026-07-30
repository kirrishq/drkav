import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "Список анализов перед операцией", description: "Перечень обследований определяется индивидуально на консультации." };

export default function TestsListPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Список анализов" }]} description="Перечень обследований формируется индивидуально на консультации с учётом планируемого вмешательства." title="Список анализов перед операцией" />;
}
