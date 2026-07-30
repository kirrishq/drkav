import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "Пациентам", description: "Подготовка к консультации, операции и восстановлению." };

export default function PatientsPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Пациентам" }]} description="Важная информация о подготовке к консультации, операции и восстановлению." title="Пациентам" />;
}
