import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "Пластика живота и коррекция талии", description: "Варианты коррекции контуров живота и талии." };

export default function AbdomenWaistPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/operacii", label: "Операции" }, { label: "Живот и талия" }]} description="Варианты коррекции контуров живота и талии с учётом индивидуальных особенностей." title="Пластика живота и коррекция талии" />;
}
