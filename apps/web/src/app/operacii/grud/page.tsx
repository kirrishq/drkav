import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "Пластические операции на груди", description: "Методы коррекции груди, подготовка и восстановление." };

export default function BreastOperationsPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/operacii", label: "Операции" }, { label: "Грудь" }]} description="Информация о методах коррекции груди, подготовке к операции и периоде восстановления." title="Пластические операции на груди" />;
}
