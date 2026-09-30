import { AboutSubpageLayout } from "@/components/about-page/about-subpage-layout";
import { AboutRelatedPages } from "@/components/about-related-pages/about-related-pages";
import { EducationFormats } from "@/components/education-formats/education-formats";
import { EducationProject } from "@/components/education-project/education-project";
import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";
import { getStaticPageContent, getStaticPageMetadata } from "@/content/static-page";
import { getCardGridItems, getRichTextParagraphs } from "@/content/static-page-text";

export async function generateMetadata() {
  return getStaticPageMetadata("about-school", getPageMetadata("/obo-mne/neshkola"));
}

export default async function EducationPage() {
  const cmsPage = await getStaticPageContent("about-school");
  const projectParagraphs = getRichTextParagraphs(cmsPage, "project");
  const formatCards = getCardGridItems(cmsPage, "formats");

  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/obo-mne", label: "Обо мне" }, { label: "Не Школа" }]} className="about-subpage-page" description="Не Школа — авторский проект доктора Коробова А.В. для обучения пластических хирургов через онлайн мастер-классы, менторство и стажировки." pageKey="about-school" title="Не Школа — обучение пластических хирургов"><AboutSubpageLayout currentHref="/obo-mne/neshkola"><EducationProject paragraphs={projectParagraphs.length > 0 ? projectParagraphs : undefined} /><EducationFormats copy={formatCards.length > 0 ? formatCards.map((card) => ({ description: card.description ?? "", title: card.title })) : undefined} /></AboutSubpageLayout><AboutRelatedPages currentHref="/obo-mne/neshkola" /></StaticPage>;
}
