import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "Восстановление фигуры после родов", description: "Планирование операций после беременности и грудного вскармливания." };

export default function PostpartumPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/operacii", label: "Операции" }, { label: "После родов" }]} description="Подходы к планированию операций после беременности и периода грудного вскармливания." title="Восстановление фигуры после родов" />;
}
