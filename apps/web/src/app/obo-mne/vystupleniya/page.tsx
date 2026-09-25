import { AboutSubpageLayout } from "@/components/about-page/about-subpage-layout";
import { AboutRelatedPages } from "@/components/about-related-pages/about-related-pages";
import { SpeakingVideos } from "@/components/speaking-videos/speaking-videos";
import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/obo-mne/vystupleniya");

export default function SpeakingPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/obo-mne", label: "Обо мне" }, { label: "Выступления" }]} className="about-subpage-page" description="Доклады, конференции и образовательные события с участием доктора Коробова." title="Выступления и профессиональные мероприятия"><AboutSubpageLayout currentHref="/obo-mne/vystupleniya"><SpeakingVideos /></AboutSubpageLayout><AboutRelatedPages currentHref="/obo-mne/vystupleniya" /></StaticPage>;
}
