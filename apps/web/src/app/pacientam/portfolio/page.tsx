import { StaticPage } from "@/components/content-page/static-page";
import { MediaVideoProjects } from "@/components/media-video-projects/media-video-projects";
import { PatientSubpageLayout } from "@/components/patient-page/patient-subpage-layout";
import { PortfolioIndex } from "@/components/portfolio/portfolio-index";
import { PatientRelatedPages } from "@/components/patient-related-pages/patient-related-pages";
import { createContentRepository } from "@/content/content-repository";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/pacientam/portfolio", {
  title: "Портфолио пластических операций доктора Коробова",
  description: "Реальные кейсы, восстановление и результаты пластических операций.",
  canonicalPath: "/pacientam/portfolio",
});

const patientReviewVideos = [
  {
    location: "Видеоотзыв",
    posterAlt: "Превью видео «О чём я жалею? Пластика живота»",
    posterSrc: "https://drkav.ru/images/reviews/1.jpg",
    showDetails: false,
    title: "О чём я жалею? Пластика живота",
    videoSrc: "https://drkav.ru/videos/reviews/1.mp4",
    year: "",
  },
  {
    location: "Видеоотзыв",
    posterAlt: "Превью видео «Я получила фигуру мечты за 1 день»",
    posterSrc: "https://drkav.ru/images/reviews/2.jpg",
    showDetails: false,
    title: "Я получила фигуру мечты за 1 день",
    videoSrc: "https://drkav.ru/videos/reviews/2.mp4",
    year: "",
  },
  {
    location: "Видеоотзыв",
    posterAlt: "Превью видео «Живот после родов мешал мне жить!»",
    posterSrc: "https://drkav.ru/images/reviews/3.jpg",
    showDetails: false,
    title: "Живот после родов мешал мне жить!",
    videoSrc: "https://drkav.ru/videos/reviews/3.mp4",
    year: "",
  },
  {
    location: "Видеоотзыв",
    posterAlt: "Превью видео «Трансформация»",
    posterSrc: "https://drkav.ru/images/reviews/4.jpg",
    showDetails: false,
    title: "Трансформация",
    videoSrc: "https://drkav.ru/videos/reviews/4.mp4",
    year: "",
  },
  {
    location: "Видеоотзыв",
    posterAlt: "Превью видео «2 года после пластики — откровенный разговор»",
    posterSrc: "https://drkav.ru/images/reviews/5.jpg",
    showDetails: false,
    title: "2 года после пластики — откровенный разговор",
    videoSrc: "https://drkav.ru/videos/reviews/5.mp4",
    year: "",
  },
  {
    location: "Видеоотзыв",
    posterAlt: "Превью видео «Первая и вторая беременность: отличия и последствия»",
    posterSrc: "https://drkav.ru/images/reviews/6.jpg",
    showDetails: false,
    title: "Первая и вторая беременность: отличия и последствия",
    videoSrc: "https://drkav.ru/videos/reviews/6.mp4",
    year: "",
  },
  {
    location: "Видеоотзыв из соцсетей",
    posterAlt: "Превью видео с отзывом пациентки из социальных сетей",
    posterSrc: "https://drkav.ru/images/reviews/8.jpg",
    showDetails: false,
    title: "Вы вернули мне меня",
    videoSrc: "https://drkav.ru/videos/reviews/8.mp4",
    year: "",
  },
];

export default async function PortfolioPage() {
  const portfolio = await createContentRepository().getPortfolioIndex();

  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Портфолио" }]} className="patient-subpage-page portfolio-index" description="Кейсы пациентов с кратким описанием операции и сроком результата." title="Портфолио пластических операций"><PatientSubpageLayout><div className="content-card content-card--muted portfolio-index__principles"><p><span className="type-overline">01</span>Показываем результат честно и с указанием срока после операции.</p><p><span className="type-overline">02</span>Объясняем, почему был выбран именно такой план вмешательства.</p><p><span className="type-overline">03</span>Публикуем материалы с разрешения пациентов.</p></div><MediaVideoProjects items={patientReviewVideos} title="Видеокейсы" tone="surface" /><PortfolioIndex {...portfolio} /></PatientSubpageLayout><PatientRelatedPages currentHref="/pacientam/portfolio" /></StaticPage>;
}
