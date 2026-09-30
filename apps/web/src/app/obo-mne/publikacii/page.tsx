import { AboutSubpageLayout } from "@/components/about-page/about-subpage-layout";
import { AboutRelatedPages } from "@/components/about-related-pages/about-related-pages";
import { ContributionArticles } from "@/components/contribution-articles/contribution-articles";
import { ContributionPatent } from "@/components/contribution-patent/contribution-patent";
import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";
import { getStaticPageContent, getStaticPageMetadata } from "@/content/static-page";
import { getCardGridItems, getRichTextParagraphs } from "@/content/static-page-text";

export async function generateMetadata() {
  return getStaticPageMetadata("about-publications", getPageMetadata("/obo-mne/publikacii"));
}

export default async function ContributionPage() {
  const cmsPage = await getStaticPageContent("about-publications");
  const patentLead = getRichTextParagraphs(cmsPage, "patent")[0];
  const articleCards = getCardGridItems(cmsPage, "articles");

  return (
    <StaticPage
      breadcrumbs={[
        { href: "/", label: "Главная" },
        { href: "/obo-mne", label: "Обо мне" },
        { label: "Вклад в медицину" },
      ]}
      className="about-subpage-page"
      description="Материалы о профессиональных инициативах, исследованиях и развитии современной пластической хирургии."
      pageKey="about-publications"
      title="Вклад доктора Коробова в медицину"
    >
      <AboutSubpageLayout currentHref="/obo-mne/publikacii">
        <ContributionPatent lead={patentLead} />
        <ContributionArticles items={articleCards.length > 0 ? articleCards.map((article) => ({ href: article.href, title: article.title, year: article.description })) : undefined} />
      </AboutSubpageLayout>
      <AboutRelatedPages currentHref="/obo-mne/publikacii" />
    </StaticPage>
  );
}
