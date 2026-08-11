import { StaticPage } from "@/components/content-page/static-page";
import { PromotionsCatalog } from "@/components/promotions/promotions-catalog";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/akcii");

export default function PromotionsPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Акции" }]} description="Актуальные специальные предложения. Уточняйте условия и возможность совмещения акций у администратора при записи." title="Акции и подарки"><PromotionsCatalog /></StaticPage>;
}
