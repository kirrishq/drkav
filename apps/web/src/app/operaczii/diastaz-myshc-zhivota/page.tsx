import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/operaczii/diastaz-myshc-zhivota");

export default function DiastasisOperationPage() {
  return (
    <StaticPage
      breadcrumbs={[
        { href: "/", label: "Главная" },
        { href: "/operaczii", label: "Операции" },
        { label: "Диастаза без шрамов" },
      ]}
      description="Информация о хирургическом лечении диастаза прямых мышц живота."
      title="Лечение диастаза прямых мышц живота"
    />
  );
}
