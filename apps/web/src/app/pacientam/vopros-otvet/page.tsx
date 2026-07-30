import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "Вопросы и ответы", description: "Ответы на частые вопросы о подготовке, операции и восстановлении." };

export default function FaqPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Вопрос-ответ" }]} description="Ответы на частые вопросы о подготовке, операции, восстановлении и консультации." title="Вопросы и ответы" />;
}
