import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "Ваш личный ассистент", description: "Организация консультаций, подготовки и коммуникации на каждом этапе." };

export default function AssistantPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Ваш личный ассистент" }]} description="Как ассистент помогает организовать консультации, подготовку и коммуникацию на каждом этапе." title="Ваш личный ассистент" />;
}
