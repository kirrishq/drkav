import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "Контакты", description: "Как связаться с клиникой и записаться на консультацию." };

export default function ContactsPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Контакты" }]} description="Способы связаться с клиникой, записаться на консультацию и получить организационную информацию." title="Контакты" />;
}
