import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "Пластическая хирургия для мужчин", description: "Направления коррекции с учётом целей пациентов-мужчин." };

export default function MenOperationsPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/operacii", label: "Операции" }, { label: "Мужчинам" }]} description="Операции и методы коррекции, учитывающие анатомические особенности и цели пациентов-мужчин." title="Пластическая хирургия для мужчин" />;
}
