import { LegalDocumentPage } from "@/components/legal-document/legal-document";

export const metadata = {
  title: "Согласие на обработку cookies — drkav.ru",
  description: "Согласие на обработку файлов cookies и пользовательских данных.",
};

export default function CookiesConsentPage() {
  return <LegalDocumentPage path="/cookies" />;
}
