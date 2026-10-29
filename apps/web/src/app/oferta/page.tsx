import { LegalDocumentPage } from "@/components/legal-document/legal-document";

export const metadata = {
  title: "Публичная оферта — drkav.ru",
  description: "Публичная оферта ИП Коробова Артема Владимировича.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function OfferPage() {
  return <LegalDocumentPage path="/oferta" />;
}
