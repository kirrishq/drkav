import { AboutSubpageLayout } from "@/components/about-page/about-subpage-layout";
import { AboutRelatedPages } from "@/components/about-related-pages/about-related-pages";
import { StaticPage } from "@/components/content-page/static-page";
import { MediaVideoProjects } from "@/components/media-video-projects/media-video-projects";
import { getPageMetadata } from "@/content/page-registry";
import { getStaticPageContent, getStaticPageMetadata } from "@/content/static-page";
import { getCardGridItems } from "@/content/static-page-text";

export async function generateMetadata() {
  return getStaticPageMetadata("about-media", getPageMetadata("/obo-mne/smi"));
}

export default async function MediaProjectsPage() {
  const cmsPage = await getStaticPageContent("about-media");
  const videos = getCardGridItems(cmsPage, "videos");

  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/obo-mne", label: "Обо мне" }, { label: "СМИ" }]} className="about-subpage-page" description="Публикации, интервью и проекты, в которых доктор делится профессиональным опытом." pageKey="about-media" title="Доктор Коробов в СМИ и специальных проектах"><AboutSubpageLayout currentHref="/obo-mne/smi"><MediaVideoProjects copy={videos.length > 0 ? videos.map((video) => ({ description: video.description, title: video.title })) : undefined} /></AboutSubpageLayout><AboutRelatedPages currentHref="/obo-mne/smi" /></StaticPage>;
}
