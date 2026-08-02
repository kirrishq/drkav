import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/operaczii", {
  title: "Пластические операции",
  description: "Направления пластической хирургии, подготовка и восстановление.",
  canonicalPath: "/operaczii",
});

export default function OperationsPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Операции" }]} description="Направления пластической хирургии, особенности подготовки и восстановления после вмешательств." title="Пластические операции" />;
}
