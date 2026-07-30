import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "Пластические операции", description: "Направления пластической хирургии, подготовка и восстановление." };

export default function OperationsPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Операции" }]} description="Направления пластической хирургии, особенности подготовки и восстановления после вмешательств." title="Пластические операции" />;
}
