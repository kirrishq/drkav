import { StaticPage } from "@/components/content-page/static-page";
import { ContributionArticles } from "@/components/contribution-articles/contribution-articles";
import { ContributionPatent } from "@/components/contribution-patent/contribution-patent";
import { AboutRelatedPages } from "@/components/about-related-pages/about-related-pages";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/obo-mne/publikacii");

export default function ContributionPage() {
  return (
    <StaticPage
      breadcrumbs={[
        { href: "/", label: "Главная" },
        { href: "/obo-mne", label: "Обо мне" },
        { label: "Вклад в медицину" },
      ]}
      description="Материалы о профессиональных инициативах, исследованиях и развитии современной пластической хирургии."
      title="Вклад доктора Коробова в медицину"
    >
      <ContributionPatent />
      <ContributionArticles />
      <AboutRelatedPages currentHref="/obo-mne/publikacii" />
    </StaticPage>
  );
}
