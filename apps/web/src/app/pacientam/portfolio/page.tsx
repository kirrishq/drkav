import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/pacientam/portfolio", {
  title: "Портфолио пластических операций доктора Коробова",
  description: "Реальные кейсы, восстановление и результаты пластических операций.",
  canonicalPath: "/pacientam/portfolio",
});

export default function PortfolioPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Портфолио" }]} description={"В портфолио собраны подробные кейсы пластических операций: консультации, ход лечения, особенности восстановления и результаты.\n\nЗдесь можно посмотреть реальные примеры маммопластики, абдоминопластики, липосакции и других операций, чтобы лучше понять подход доктора и оценить возможный результат."} title="Портфолио пластических операций доктора Коробова: реальные кейсы, восстановление и результаты" />;
}
