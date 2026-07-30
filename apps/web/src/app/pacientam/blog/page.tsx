import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "Блог доктора Коробова", description: "Статьи и профессиональные комментарии о пластической хирургии." };

export default function BlogPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Блог доктора" }]} description="Статьи и профессиональные комментарии о пластической хирургии, подготовке и восстановлении." title="Блог доктора Коробова" />;
}
