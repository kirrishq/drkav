import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/kontakty");

export default function ContactsPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Контакты" }]} description="Способы связаться с клиникой, записаться на консультацию и получить организационную информацию." title="Контакты" />;
}
