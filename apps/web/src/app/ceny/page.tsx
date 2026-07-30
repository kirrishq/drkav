import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "Цены на пластические операции", description: "Ориентировочная стоимость консультаций, операций и услуг." };

export default function PricesPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Цены" }]} description="Ориентировочная стоимость консультаций, операций и сопутствующих услуг." title="Цены на пластические операции" />;
}
