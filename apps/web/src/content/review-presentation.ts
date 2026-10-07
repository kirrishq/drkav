import type { OperationCatalogGroup, Review } from "@drkav/content-contracts";
import type {
  ReviewSliderFilterGroup,
  ReviewSliderItem,
} from "@drkav/ui";

const SOURCE_FILTERS = [
  { id: "source:video", label: "Видеоотзывы" },
  { id: "source:social", label: "Соцсети" },
  { id: "source:prodoctorov", label: "ПроДокторов" },
] as const;

function getReviewSourceId(kind: Review["kind"]): string {
  if (kind === "video") {
    return "source:video";
  }

  if (kind === "prodoctorov") {
    return "source:prodoctorov";
  }

  // Patient messages are grouped with social proof in the public filter.
  return "source:social";
}

function getOperationCategoryId(
  operationPath: string | undefined,
  operationGroups: readonly OperationCatalogGroup[],
): string | undefined {
  if (!operationPath) {
    return undefined;
  }

  return operationGroups.find((group) => group.operations.some((operation) => operation.canonicalPath === operationPath))?.key;
}

export function mapReviewsToSliderItems(
  reviews: readonly Review[],
  operationGroups: readonly OperationCatalogGroup[] = [],
): readonly ReviewSliderItem[] {
  return reviews.map((review) => {
    const operationCategoryId = getOperationCategoryId(review.operation?.canonicalPath, operationGroups);

    return {
      blurImage: review.kind === "patient",
      externalUrl: review.externalUrl,
      filterIds: [
        getReviewSourceId(review.kind),
        ...(operationCategoryId ? [`body:${operationCategoryId}`] : []),
      ],
      id: review.slug,
      imageAlt: review.image?.alternativeText ?? `Фото отзыва: ${review.title}`,
      imageSrc: review.image?.url,
      label: review.title,
      source: review.source,
      text: review.text,
    };
  });
}

export function getReviewFilterGroups(
  reviews: readonly Review[],
  operationGroups: readonly OperationCatalogGroup[],
): readonly ReviewSliderFilterGroup[] {
  const items = mapReviewsToSliderItems(reviews, operationGroups);
  const availableFilterIds = new Set(items.flatMap((item) => item.filterIds ?? []));
  const sourceFilters = SOURCE_FILTERS
    .filter(({ id }) => availableFilterIds.has(id))
    .map(({ id, label }) => ({ id, label }));
  const bodyFilters = operationGroups
    .filter((group) => availableFilterIds.has(`body:${group.key}`))
    .map((group) => ({ id: `body:${group.key}`, label: group.name }));

  const groups: readonly (ReviewSliderFilterGroup | null)[] = [
    sourceFilters.length > 0 ? { defaultFilterId: "source:video", filters: sourceFilters, id: "source", label: "Источник", showAll: false } : null,
    bodyFilters.length > 0 ? { id: "body", label: "Область", filters: bodyFilters } : null,
  ];

  return groups.filter((group): group is ReviewSliderFilterGroup => group !== null);
}
