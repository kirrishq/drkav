import { StaticPage } from "@/components/content-page/static-page";
import { AboutRelatedPages } from "@/components/about-related-pages/about-related-pages";
import { MediaVideoProjects } from "@/components/media-video-projects/media-video-projects";

export const metadata = { title: "СМИ и проекты — доктор Коробов", description: "Публикации, интервью и специальные проекты." };

export default function MediaProjectsPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/obo-mne", label: "Обо мне" }, { label: "СМИ и проекты" }]} description="Публикации, интервью и проекты, в которых доктор делится профессиональным опытом." title="Доктор Коробов в СМИ и специальных проектах"><MediaVideoProjects /><AboutRelatedPages currentHref="/obo-mne/smi-i-proekty" /></StaticPage>;
}
