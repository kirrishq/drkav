import { AboutSubpageLayout } from "@/components/about-page/about-subpage-layout";
import { AboutRelatedPages } from "@/components/about-related-pages/about-related-pages";
import { StaticPage } from "@/components/content-page/static-page";
import { MediaVideoProjects } from "@/components/media-video-projects/media-video-projects";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/obo-mne/smi");

export default function MediaProjectsPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/obo-mne", label: "Обо мне" }, { label: "СМИ" }]} className="about-subpage-page" description="Публикации, интервью и проекты, в которых доктор делится профессиональным опытом." title="Доктор Коробов в СМИ и специальных проектах"><AboutSubpageLayout currentHref="/obo-mne/smi"><MediaVideoProjects /></AboutSubpageLayout><AboutRelatedPages currentHref="/obo-mne/smi" /></StaticPage>;
}
