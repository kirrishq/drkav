import { StaticPage } from "@/components/content-page/static-page";
import { MediaVideoProjects } from "@/components/media-video-projects/media-video-projects";
import { PatientSubpageLayout } from "@/components/patient-page/patient-subpage-layout";
import { PortfolioIndex } from "@/components/portfolio/portfolio-index";
import { PatientRelatedPages } from "@/components/patient-related-pages/patient-related-pages";
import { createContentRepository } from "@/content/content-repository";
import { getPageMetadata } from "@/content/page-registry";
import { getStaticPageMetadata } from "@/content/static-page";

export async function generateMetadata() {
  return getStaticPageMetadata("portfolio", getPageMetadata("/pacientam/portfolio", {
    title: "Портфолио пластических операций доктора Коробова",
    description: "Реальные кейсы, восстановление и результаты пластических операций.",
    canonicalPath: "/pacientam/portfolio",
  }));
}

export default async function PortfolioPage() {
  const repository = createContentRepository();
  const [portfolio, filterGroups, videoCases] = await Promise.all([
    repository.getPortfolioIndex(),
    repository.getOperationCatalog(),
    repository.getVideoCases(),
  ]);

  const videoItems = videoCases.map((item) => ({
    location: item.location,
    posterAlt: item.poster.alternativeText ?? `Превью видео «${item.title}»`,
    posterSrc: item.poster.url,
    showDetails: false,
    title: item.title,
    videoSrc: item.mp4,
    webmSrc: item.webm,
    year: item.year,
  }));

  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Портфолио" }]} className="patient-subpage-page portfolio-index" description="Кейсы пациентов с кратким описанием операции и сроком результата." pageKey="portfolio" title="Портфолио пластических операций"><PatientSubpageLayout><div className="content-card content-card--muted portfolio-index__principles"><p><span className="type-overline">01</span>Показываем результат честно и с указанием срока после операции.</p><p><span className="type-overline">02</span>Объясняем, почему был выбран именно такой план вмешательства.</p><p><span className="type-overline">03</span>Публикуем материалы с разрешения пациентов.</p></div>{videoItems.length > 0 ? <MediaVideoProjects items={videoItems} title="Видеокейсы" tone="surface" /> : null}<PortfolioIndex {...portfolio} filterGroups={filterGroups} /></PatientSubpageLayout><PatientRelatedPages currentHref="/pacientam/portfolio" /></StaticPage>;
}
