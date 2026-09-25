import { StaticPage } from "@/components/content-page/static-page";
import { AboutRelatedPages } from "@/components/about-related-pages/about-related-pages";
import { CertificateSection } from "@/components/certificate-section/certificate-section";

export const metadata = { title: "Дипломы и лицензии — доктор Коробов", description: "Документы об образовании, квалификации и медицинской практике." };

export default function CredentialsPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/obo-mne", label: "Обо мне" }, { label: "Дипломы и лицензии" }]} description="Документы, подтверждающие образование, квалификацию и право на медицинскую практику." title="Дипломы и лицензии"><CertificateSection /><AboutRelatedPages currentHref="/obo-mne/diplomy-i-licenzii" /></StaticPage>;
}
