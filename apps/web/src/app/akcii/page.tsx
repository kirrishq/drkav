import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "Акции и специальные предложения", description: "Актуальные условия и специальные предложения клиники." };

export default function PromotionsPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Акции" }]} description="Актуальные условия и специальные предложения по консультациям и услугам клиники." title="Акции и специальные предложения" />;
}
