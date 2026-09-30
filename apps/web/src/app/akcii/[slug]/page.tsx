import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StaticPage } from "@/components/content-page/static-page";
import { getPromotionsContent } from "@/content/promotions";

type PromotionEntryPageProps = {
  params: Promise<{ slug: string }>;
};

function routeFor(slug: string) {
  return `/akcii/${slug}`;
}

function slugFromPromotionHref(href: string) {
  const match = /^\/akcii\/([^/]+)$/.exec(href);
  return match?.[1];
}

export async function generateStaticParams() {
  const promotions = await getPromotionsContent();

  return Array.from(
    new Set(
      (promotions ?? [])
        .map((promotion) => slugFromPromotionHref(promotion.href))
        .filter((slug): slug is string => Boolean(slug)),
    ),
  ).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PromotionEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = routeFor(slug);
  const promotions = await getPromotionsContent();
  const matchingPromotion = promotions?.find((promotion) => promotion.href === route);

  if (!matchingPromotion) {
    return {};
  }

  return {
    description: matchingPromotion.subtitle ?? matchingPromotion.description[0],
    title: matchingPromotion.title,
  };
}

export default async function PromotionEntryPage({ params }: PromotionEntryPageProps) {
  const { slug } = await params;
  const route = routeFor(slug);

  const cmsPromotions = await getPromotionsContent();
  const matchingPromotions = cmsPromotions?.filter((promotion) => promotion.href === route) ?? [];

  if (!cmsPromotions || matchingPromotions.length === 0) {
    notFound();
  }

  const title = matchingPromotions.length > 0
    ? matchingPromotions.map((promotion) => promotion.title).join(" или ")
    : "Интимная пластика или липофилинг рук в подарок";
  const subtitle = matchingPromotions
    .map((promotion) => promotion.subtitle)
    .filter((value): value is string => Boolean(value))
    .at(0);
  const description = matchingPromotions.flatMap((promotion) => promotion.description);

  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/akcii", label: "Акции" }, { label: title }]} description={subtitle ?? "Специальное предложение доктора Коробова."} title={title}><article className="promotion-detail"><div className="content-card content-card--spacious"><div className="promotion-detail__body">{description.length > 0 ? description.map((paragraph) => <p className="promotion-detail__lead" key={paragraph}>{paragraph}</p>) : <p className="promotion-detail__lead">При записи на операцию условия предложения уточняются на консультации.</p>}</div></div><section className="content-card content-card--muted"><h2 className="content-card__heading content-card__heading--h3">Почему нужна консультация</h2><p>На консультации врач определит показания, подберёт безопасный вариант коррекции, составит персональный план операции и уточнит условия предложения.</p></section></article></StaticPage>;
}
