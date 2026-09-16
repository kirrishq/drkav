import type { Review } from "@drkav/content-contracts";
import type { ReviewSliderFilter, ReviewSliderItem } from "@drkav/ui";

export function mapReviewsToSliderItems(
  reviews: readonly Review[],
): readonly ReviewSliderItem[] {
  return reviews.map((review) => ({
    blurImage: review.kind === "patient",
    externalUrl: review.externalUrl,
    filterIds: [review.kind, ...(review.operation ? [review.operation.canonicalPath] : [])],
    id: review.slug,
    imageAlt: review.image.alternativeText ?? `Фото отзыва: ${review.title}`,
    imageSrc: review.image.url,
    label: review.title,
    source: review.source,
    text: review.text,
  }));
}

export function getReviewFilters(
  reviews: readonly Review[],
): readonly ReviewSliderFilter[] {
  const filters: ReviewSliderFilter[] = [];
  const seen = new Set<string>();
  const kindLabels = {
    prodoctorov: "ПроДокторов",
    social: "Соцсети",
  } as const;

  for (const review of reviews) {
    if (review.kind !== "patient" && !seen.has(review.kind)) {
      seen.add(review.kind);
      filters.push({ id: review.kind, label: kindLabels[review.kind] });
    }

    if (review.operation && !seen.has(review.operation.canonicalPath)) {
      seen.add(review.operation.canonicalPath);
      filters.push({ id: review.operation.canonicalPath, label: review.operation.heading });
    }
  }

  return filters;
}
