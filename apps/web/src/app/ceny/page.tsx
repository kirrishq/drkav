import { PriceCatalog } from "@/components/price-catalog/price-catalog";
import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/ceny");

export default function PricesPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Цены" }]} description="Не является публичной офертой. Цены указаны на сайте ориентировочно: итоговая стоимость рассчитывается врачом после консультации и зависит от индивидуального плана операции." title="Стоимость пластических операций"><PriceCatalog /></StaticPage>;
}
