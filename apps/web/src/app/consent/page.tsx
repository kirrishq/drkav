import { LegalDocumentPage } from "@/components/legal-document/legal-document";

export const metadata = {
  title: "Согласие на обработку персональных данных — drkav.ru",
  description: "Согласие на обработку персональных данных на сайте drkav.ru.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function PersonalDataConsentPage() {
  return <LegalDocumentPage path="/consent" />;
}
