import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/akcii");

export default function PromotionsPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Акции" }]} description="Актуальные условия и специальные предложения по консультациям и услугам клиники." title="Акции и специальные предложения" />;
}
