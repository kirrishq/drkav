import { LegalDocumentPage } from "@/components/legal-document/legal-document";

export const metadata = {
  title: "Согласие на рекламную рассылку — drkav.ru",
  description: "Согласие на получение рекламной и информационной рассылки.",
};

export default function MarketingConsentPage() {
  return <LegalDocumentPage path="/consent-marketing" />;
}
