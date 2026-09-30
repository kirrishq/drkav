import { AboutSubpageLayout } from "@/components/about-page/about-subpage-layout";
import { AboutRelatedPages } from "@/components/about-related-pages/about-related-pages";
import { SpeakingVideos } from "@/components/speaking-videos/speaking-videos";
import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";
import { getStaticPageContent, getStaticPageMetadata } from "@/content/static-page";
import { getCardGridItems } from "@/content/static-page-text";

export async function generateMetadata() {
  return getStaticPageMetadata("about-speaking", getPageMetadata("/obo-mne/vystupleniya"));
}

export default async function SpeakingPage() {
  const cmsPage = await getStaticPageContent("about-speaking");
  const videos = getCardGridItems(cmsPage, "videos");

  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/obo-mne", label: "Обо мне" }, { label: "Выступления" }]} className="about-subpage-page" description="Доклады, конференции и образовательные события с участием доктора Коробова." pageKey="about-speaking" title="Выступления и профессиональные мероприятия"><AboutSubpageLayout currentHref="/obo-mne/vystupleniya"><SpeakingVideos copy={videos.length > 0 ? videos.map((video) => ({ title: video.title, year: video.description })) : undefined} /></AboutSubpageLayout><AboutRelatedPages currentHref="/obo-mne/vystupleniya" /></StaticPage>;
}
