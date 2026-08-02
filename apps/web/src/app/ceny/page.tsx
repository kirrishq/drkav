import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/ceny");

export default function PricesPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Цены" }]} description="Ориентировочная стоимость консультаций, операций и сопутствующих услуг." title="Цены на пластические операции" />;
}
