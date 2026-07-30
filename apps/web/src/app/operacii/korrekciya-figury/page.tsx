import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "Коррекция фигуры", description: "Методы для гармонизации пропорций и контуров тела." };

export default function BodyContouringPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/operacii", label: "Операции" }, { label: "Коррекция фигуры" }]} description="Методы пластической хирургии для гармонизации пропорций и контуров тела." title="Коррекция фигуры" />;
}
