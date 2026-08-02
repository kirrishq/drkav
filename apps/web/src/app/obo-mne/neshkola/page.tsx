import { AboutRelatedPages } from "@/components/about-related-pages/about-related-pages";
import { EducationFormats } from "@/components/education-formats/education-formats";
import { EducationProject } from "@/components/education-project/education-project";
import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/obo-mne/neshkola");

export default function EducationPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/obo-mne", label: "Обо мне" }, { label: "Не Школа" }]} description="Не Школа — авторский проект доктора Коробова А.В. для обучения пластических хирургов через онлайн мастер-классы, менторство и стажировки." title="Не Школа — обучение пластических хирургов"><EducationProject /><EducationFormats /><AboutRelatedPages currentHref="/obo-mne/neshkola" /></StaticPage>;
}
