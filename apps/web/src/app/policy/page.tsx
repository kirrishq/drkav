import { LegalDocumentPage } from "@/components/legal-document/legal-document";

export const metadata = {
  title: "Политика обработки персональных данных — drkav.ru",
  description: "Политика обработки персональных данных ИП Коробова Артема Владимировича.",
};

export default function PersonalDataPolicyPage() {
  return <LegalDocumentPage path="/policy" />;
}
