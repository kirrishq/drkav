import type { ContentRepository } from "@drkav/content-contracts";
import type {
  OperationsCardItem,
  ReviewSliderFilterGroup,
  ReviewSliderItem,
} from "@drkav/ui";

import { homeReviews } from "./home-reviews";
import { operationCategoryFallbackImages } from "./operation-category-images";
import { getReviewFilterGroups, mapReviewsToSliderItems } from "./review-presentation";
import { getOptimizedImageSrcSet } from "./optimized-image";

const fallbackOperationGroups = [
  { href: "/operaczii/abdominoplastika", id: "abdomen-and-waist", label: "Живот и талия" },
  { href: "/operaczii/plasticheskaya-hirurgiya-posle-rodov", id: "postpartum", label: "После родов" },
  { href: "/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya", id: "after-weight-loss", label: "После похудения" },
  { href: "/operaczii/plastika-grudi", id: "breast", label: "Пластика груди" },
  { href: "/operaczii/muzhskaya-plastika", id: "male-athletic-contouring", label: "Мужская атлетизация" },
  { href: "/operaczii/liposkulptura", id: "body-contouring", label: "Коррекция фигуры" },
  { href: "/operaczii/intimnaya-plastika", id: "intimate-surgery", label: "Интимная пластика" },
  { href: "/operaczii/rf-lifting", id: "non-surgical-rf-lifting", label: "Без операции (РФ-лифтинг)" },
] as const;

function getFallbackOperationItems(): readonly OperationsCardItem[] {
  return fallbackOperationGroups.map((group) => ({
    id: group.id,
    imageAlt: `Заглушка: ${group.label}`,
    imageSrc: operationCategoryFallbackImages[group.id as keyof typeof operationCategoryFallbackImages],
    imageSizes: "(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw",
    imageSrcSet: getOptimizedImageSrcSet(operationCategoryFallbackImages[group.id as keyof typeof operationCategoryFallbackImages]),
    links: [{ href: group.href, label: group.label }],
    title: group.label,
  }));
}

export type ArticleSupportData = {
  operationItems: readonly OperationsCardItem[];
  reviewFilterGroups: readonly ReviewSliderFilterGroup[];
  reviewItems: readonly ReviewSliderItem[];
};

export async function getArticleSupportData(repository: ContentRepository): Promise<ArticleSupportData> {
  try {
    const [operationGroups, reviews] = await Promise.all([
      repository.getOperationCatalog(),
      repository.getReviews(),
    ]);
    const localOperationFallback = process.env.NODE_ENV !== "production" ? getFallbackOperationItems() : [];
    const operationItems = operationGroups.length > 0
      ? operationGroups.map((group) => ({
          id: group.key,
          imageAlt: group.image?.alternativeText ?? `Иллюстрация: ${group.name}`,
          imageSrc: group.image?.url ?? operationCategoryFallbackImages[group.key as keyof typeof operationCategoryFallbackImages],
          imageSizes: "(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw",
          imageSrcSet: getOptimizedImageSrcSet(group.image?.url ?? operationCategoryFallbackImages[group.key as keyof typeof operationCategoryFallbackImages]),
          links: group.operations.map((operation) => ({ href: operation.canonicalPath, label: operation.heading })),
          title: group.name,
        }))
      : localOperationFallback;
    const localReviewFallback = process.env.NODE_ENV !== "production" ? homeReviews : [];
    const reviewItems = reviews.length > 0 ? mapReviewsToSliderItems(reviews, operationGroups) : localReviewFallback;

    return {
      operationItems,
      reviewFilterGroups: reviews.length > 0 ? getReviewFilterGroups(reviews, operationGroups) : [],
      reviewItems,
    };
  } catch {
    return {
      operationItems: process.env.NODE_ENV !== "production" ? getFallbackOperationItems() : [],
      reviewFilterGroups: [],
      reviewItems: process.env.NODE_ENV !== "production" ? homeReviews : [],
    };
  }
}
