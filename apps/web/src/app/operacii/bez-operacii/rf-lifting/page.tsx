import { StaticPage } from "@/components/content-page/static-page";

export const metadata = { title: "РФ-лифтинг без операции", description: "Неоперационный метод для улучшения качества тканей." };

export default function RfLiftingPage() {
  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/operacii", label: "Операции" }, { label: "Без операции (РФ-лифтинг)" }]} description="Неоперационный метод для улучшения качества тканей и поддержания эстетического результата." title="РФ-лифтинг без операции" />;
}
