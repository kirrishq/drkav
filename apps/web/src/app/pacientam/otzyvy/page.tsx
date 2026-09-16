import { ReviewsSlider } from "@drkav/ui";

import { homeReviews } from "@/content/home-reviews";
import { StaticPage } from "@/components/content-page/static-page";
import { createContentRepository } from "@/content/content-repository";
import { getPageMetadata } from "@/content/page-registry";
import { getReviewFilters, mapReviewsToSliderItems } from "@/content/review-presentation";

export const metadata = getPageMetadata("/pacientam/otzyvy");

export default async function ReviewsPage() {
  const cmsReviews = await createContentRepository().getReviews();
  const reviewItems = cmsReviews.length > 0 ? mapReviewsToSliderItems(cmsReviews) : homeReviews;
  const reviewFilters = cmsReviews.length > 0 ? getReviewFilters(cmsReviews) : [];

  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Отзывы" }]} description="Раздел с отзывами о консультациях, сопровождении и опыте взаимодействия с клиникой." title="Отзывы"><ReviewsSlider filters={reviewFilters} items={reviewItems} /></StaticPage>;
}
