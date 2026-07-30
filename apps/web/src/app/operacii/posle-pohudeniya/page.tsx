import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "Пластические операции после похудения", description: "Коррекция контуров тела после значительного снижения веса." };

export default function WeightLossPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/operacii", label: "Операции" }, { label: "После похудения" }]} description="Возможности коррекции избытков кожи и контуров тела после значительного снижения веса." title="Пластические операции после похудения" />;
}
