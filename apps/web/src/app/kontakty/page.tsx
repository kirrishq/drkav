import { StaticPage } from "@/components/content-page/static-page";
import { ContactsPageContent } from "@/components/contacts-page/contacts-page";
import { createContactActions } from "@/components/site-header/contact-actions";
import { getPageMetadata } from "@/content/page-registry";
import { getSiteNavigation } from "@/content/site-navigation";
import { getStaticPageMetadata } from "@/content/static-page";

export async function generateMetadata() {
  return getStaticPageMetadata("contacts", getPageMetadata("/kontakty"));
}

export default async function ContactsPage() {
  const siteNavigation = await getSiteNavigation();

  return (
    <StaticPage
      breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Контакты" }]}
      className="contacts-page-shell"
      description="Адрес клиники, контакты администратора и понятный маршрут до консультации."
      pageKey="contacts"
      title="Контакты"
    >
      <ContactsPageContent
        captchaSiteKey={process.env.NEXT_PUBLIC_SMARTCAPTCHA_SITE_KEY}
        contactActions={createContactActions(siteNavigation.contact)}
      />
    </StaticPage>
  );
}
