import { StaticPage } from "@/components/content-page/static-page";
import { ContactsPageContent } from "@/components/contacts-page/contacts-page";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/kontakty");

export default function ContactsPage() {
  return (
    <StaticPage
      breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Контакты" }]}
      className="contacts-page-shell"
      description="Адрес клиники, контакты администратора и понятный маршрут до консультации."
      title="Контакты"
    >
      <ContactsPageContent />
    </StaticPage>
  );
}
