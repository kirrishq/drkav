import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "Интимная пластика", description: "Информация о направлениях интимной пластики, подготовке и восстановлении." };

export default function IntimateSurgeryPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/operacii", label: "Операции" }, { label: "Интимная пластика" }]} description="Деликатная информация о направлениях интимной пластики, подготовке и восстановлении." title="Интимная пластика" />;
}
