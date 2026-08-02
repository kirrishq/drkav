import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/operaczii/zhivot-i-taliya", {
  title: "Пластика живота и коррекция талии",
  description: "Варианты коррекции контуров живота и талии.",
  canonicalPath: "/operaczii/zhivot-i-taliya",
});

export default function AbdomenWaistPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/operaczii", label: "Операции" }, { label: "Живот и талия" }]} description="Варианты коррекции контуров живота и талии с учётом индивидуальных особенностей." title="Пластика живота и коррекция талии" />;
}
