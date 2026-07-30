import { StaticPage } from "@/components/content-page/static-page";
import { AboutRelatedPages } from "@/components/about-related-pages/about-related-pages";
import { EducationProject } from "@/components/education-project/education-project";
import { EducationFormats } from "@/components/education-formats/education-formats";

export const metadata = { title: "Не Школа — обучение пластических хирургов", description: "Авторский проект доктора Коробова А.В. для обучения пластических хирургов через онлайн мастер-классы, менторство и стажировки." };

export default function EducationPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/obo-mne", label: "Обо мне" }, { label: "Обучение" }]} description="Не Школа — авторский проект доктора Коробова А.В. для обучения пластических хирургов через онлайн мастер-классы, менторство и стажировки." title="Не Школа — обучение пластических хирургов"><EducationProject /><EducationFormats /><AboutRelatedPages currentHref="/obo-mne/obuchenie" /></StaticPage>;
}
