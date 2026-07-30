import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "Отзывы", description: "Отзывы о консультациях, сопровождении и опыте взаимодействия с клиникой." };

export default function ReviewsPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Отзывы" }]} description="Раздел с отзывами о консультациях, сопровождении и опыте взаимодействия с клиникой." title="Отзывы" />;
}
