import { PriceCatalog } from "@/components/price-catalog/price-catalog";
import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";
import { getPriceCatalogContent } from "@/content/price-catalog";
import { getStaticPageMetadata } from "@/content/static-page";

export async function generateMetadata() {
  return getStaticPageMetadata("prices", getPageMetadata("/ceny"));
}

export default async function PricesPage() {
  const catalog = await getPriceCatalogContent();

  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Цены" }]} description="Не является публичной офертой. Цены указаны на сайте ориентировочно: итоговая стоимость рассчитывается врачом после консультации и зависит от индивидуального плана операции." pageKey="prices" title="Стоимость пластических операций"><PriceCatalog sections={catalog?.sections} womenNote={catalog?.womenNote} /></StaticPage>;
}
