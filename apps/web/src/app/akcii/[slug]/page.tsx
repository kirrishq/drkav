import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StaticPage } from "@/components/content-page/static-page";
import { getPageByRoute, getPageMetadata } from "@/content/page-registry";

type PromotionEntryPageProps = {
  params: Promise<{ slug: string }>;
};

function routeFor(slug: string) {
  return `/akcii/${slug}`;
}

export async function generateMetadata({ params }: PromotionEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return getPageMetadata(routeFor(slug));
}

export default async function PromotionEntryPage({ params }: PromotionEntryPageProps) {
  const { slug } = await params;
  const route = routeFor(slug);

  if (!getPageByRoute(route)) {
    notFound();
  }
  if (slug !== "intimnaya-plastika-ili-lipofiling-ruk-v-podarok") notFound();

  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/akcii", label: "Акции" }, { label: "Интимная пластика или липофилинг рук в подарок" }]} description="Только в декабре: при записи на операцию — интимная пластика или липофилинг рук в подарок." title="Интимная пластика или липофилинг рук в подарок"><article className="promotion-detail"><p className="promotion-detail__lead">При записи на любую операцию в декабре вы можете получить в подарок интимную пластику или липофилинг кистей рук — по показаниям и в рамках одного анестезиологического входа.</p><section className="content-card content-card--spacious"><h2 className="content-card__heading content-card__heading--h2">Условия предложения</h2><ul className="promotion-detail__list"><li>Подарочная процедура стоимостью до 350 000 ₽.</li><li>Основная операция и подарок выполняются в один день.</li><li>Количество мест ограничено; предложение не суммируется с другими спецпредложениями.</li><li>На консультации врач определит показания и составит персональный план операции.</li></ul></section><section className="content-card content-card--muted"><h2 className="content-card__heading content-card__heading--h3">Почему нужна консультация</h2><p>На консультации можно обсудить задачи, подобрать безопасный вариант коррекции, получить точную смету и зафиксировать стоимость операции на три месяца.</p></section></article></StaticPage>;
}
