import { ReviewsSlider } from "@drkav/ui";

import { homeReviews } from "@/content/home-reviews";
import { StaticPage } from "@/components/content-page/static-page";
import { createContentRepository } from "@/content/content-repository";
import { getPageMetadata } from "@/content/page-registry";
import { getReviewFilterGroups, mapReviewsToSliderItems } from "@/content/review-presentation";
import { PatientRelatedPages } from "@/components/patient-related-pages/patient-related-pages";

export const metadata = getPageMetadata("/pacientam/otzyvy");

export default async function ReviewsPage() {
  const repository = createContentRepository();
  const [cmsReviews, operationGroups] = await Promise.all([
    repository.getReviews(),
    repository.getOperationCatalog(),
  ]);
  const reviewItems = cmsReviews.length > 0 ? mapReviewsToSliderItems(cmsReviews, operationGroups) : homeReviews;
  const reviewFilterGroups = cmsReviews.length > 0 ? getReviewFilterGroups(cmsReviews, operationGroups) : [];

  return <StaticPage breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/pacientam", label: "Пациентам" }, { label: "Отзывы" }]} description="Раздел с отзывами о консультациях, сопровождении и опыте взаимодействия с клиникой." title="Отзывы"><ReviewsSlider className="reviews-slider--viewport-edge" filterGroups={reviewFilterGroups} items={reviewItems} /><PatientRelatedPages currentHref="/pacientam/otzyvy" /></StaticPage>;
}
