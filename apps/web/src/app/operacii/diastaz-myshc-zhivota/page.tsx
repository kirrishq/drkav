import { StaticPage } from "@/components/content-page/static-page";

export const metadata = {
  title: "Лечение диастаза прямых мышц живота",
  description: "Хирургическое лечение диастаза прямых мышц живота.",
};

export default function DiastasisOperationPage() {
  return (
    <StaticPage
      breadcrumbs={[
        { href: "/", label: "Главная" },
        { href: "/operacii", label: "Операции" },
        { label: "Лечение диастаза прямых мышц живота" },
      ]}
      description="Информация о хирургическом лечении диастаза прямых мышц живота."
      title="Лечение диастаза прямых мышц живота"
    />
  );
}
