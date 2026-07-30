import { StaticPage } from "@/components/content-page/static-page";
import { ContributionArticles } from "@/components/contribution-articles/contribution-articles";
import { ContributionPatent } from "@/components/contribution-patent/contribution-patent";
import { AboutRelatedPages } from "@/components/about-related-pages/about-related-pages";

export const metadata = {
  title: "Вклад в медицину — доктор Коробов",
  description:
    "Профессиональные инициативы, исследования и развитие пластической хирургии.",
};

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
