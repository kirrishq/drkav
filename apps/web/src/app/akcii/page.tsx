import { StaticPage } from "@/components/content-page/static-page";
import { PromotionsCatalog } from "@/components/promotions/promotions-catalog";
import { getPageMetadata } from "@/content/page-registry";
import { getPromotionsContent } from "@/content/promotions";
import { getStaticPageMetadata } from "@/content/static-page";

export async function generateMetadata() {
  return getStaticPageMetadata("promotions", getPageMetadata("/akcii"));
}

export default async function PromotionsPage() {
  const promotions = await getPromotionsContent();

  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Акции" }]} description="Актуальные специальные предложения. Уточняйте условия и возможность совмещения акций у администратора при записи." pageKey="promotions" title="Акции и подарки"><PromotionsCatalog items={promotions ?? undefined} /></StaticPage>;
}
