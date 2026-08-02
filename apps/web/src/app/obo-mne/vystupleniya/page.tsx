import { StaticPage } from "@/components/content-page/static-page";
import { AboutRelatedPages } from "@/components/about-related-pages/about-related-pages";
import { SpeakingVideos } from "@/components/speaking-videos/speaking-videos";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/obo-mne/vystupleniya");

export default function SpeakingPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/obo-mne", label: "Обо мне" }, { label: "Выступления" }]} description="Доклады, конференции и образовательные события с участием доктора Коробова." title="Выступления и профессиональные мероприятия"><SpeakingVideos /><AboutRelatedPages currentHref="/obo-mne/vystupleniya" /></StaticPage>;
}
