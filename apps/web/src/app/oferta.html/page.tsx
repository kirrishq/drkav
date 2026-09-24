import { LegalDocumentPage } from "@/components/legal-document/legal-document";

export const metadata = {
  title: "Публичная оферта — drkav.ru",
  description: "Публичная оферта ИП Коробова Артема Владимировича.",
};

export default function LegacyOfferPage() {
  return <LegalDocumentPage path="/oferta" />;
}
