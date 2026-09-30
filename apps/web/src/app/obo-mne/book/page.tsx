import { AboutSubpageLayout } from "@/components/about-page/about-subpage-layout";
import { AboutRelatedPages } from "@/components/about-related-pages/about-related-pages";
import { BookPageContent } from "@/components/book-page-content/book-page-content";
import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";
import { getStaticPageContent, getStaticPageMetadata } from "@/content/static-page";
import { getRichTextParagraphs } from "@/content/static-page-text";

export async function generateMetadata() {
  return getStaticPageMetadata("about-book", getPageMetadata("/obo-mne/book"));
}

export default async function BookPage() {
  const cmsPage = await getStaticPageContent("about-book");
  const story = getRichTextParagraphs(cmsPage, "story");
  const order = getRichTextParagraphs(cmsPage, "order");

  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/obo-mne", label: "Обо мне" }, { label: "Книга" }]} className="about-subpage-page" description="«Боль двенадцати женщин» — роман о жизни и работе пластического хирурга." pageKey="about-book" title="Книга доктора Коробова А.В."><AboutSubpageLayout currentHref="/obo-mne/book"><BookPageContent orderTitle={order[0]} story={story.length > 0 ? story : undefined} /></AboutSubpageLayout><AboutRelatedPages currentHref="/obo-mne/book" /></StaticPage>;
}
