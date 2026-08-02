import { StaticPage } from "@/components/content-page/static-page";
import { AboutRelatedPages } from "@/components/about-related-pages/about-related-pages";
import { BookPageContent } from "@/components/book-page-content/book-page-content";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/obo-mne/book");

export default function BookPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/obo-mne", label: "Обо мне" }, { label: "Книга" }]} description="«Боль двенадцати женщин» — роман о жизни и работе пластического хирурга." title="Книга доктора Коробова А.В."><BookPageContent /><AboutRelatedPages currentHref="/obo-mne/book" /></StaticPage>;
}
