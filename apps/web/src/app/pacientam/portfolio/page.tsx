import { StaticPage } from "@/components/content-page/static-page";
import { PortfolioIndex } from "@/components/portfolio/portfolio-index";
import { createContentRepository } from "@/content/content-repository";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/pacientam/portfolio", {
  title: "Портфолио пластических операций доктора Коробова",
  description: "Реальные кейсы, восстановление и результаты пластических операций.",
  canonicalPath: "/pacientam/portfolio",
});

export default async function PortfolioPage() {
  const portfolio = await createContentRepository().getPortfolioIndex();

  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Портфолио" }]} className="portfolio-index" description="Не только «до и после», а путь целиком: задача, выбор метода, восстановление и результат в динамике." title="Портфолио пластических операций"><div className="content-card content-card--muted portfolio-index__principles"><p><span className="type-overline">01</span>Показываем результат честно и с указанием срока после операции.</p><p><span className="type-overline">02</span>Объясняем, почему был выбран именно такой план вмешательства.</p><p><span className="type-overline">03</span>Публикуем материалы с разрешения пациентов.</p></div><PortfolioIndex {...portfolio} /></StaticPage>;
}
