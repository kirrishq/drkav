import type {
  BeforeAfterCase,
  PortfolioCaseSummary,
  Review,
} from "@drkav/content-contracts";
import {
  ReviewsSlider,
} from "@drkav/ui";

import { BeforeAfterGallery } from "@/components/before-after-gallery/before-after-gallery";
import { PortfolioIndex } from "@/components/portfolio/portfolio-index";

type OperationRelatedContentProps = {
  beforeAfterCases: readonly BeforeAfterCase[];
  operationHeading: string;
  portfolioCases: readonly PortfolioCaseSummary[];
  reviews: readonly Review[];
};

export function OperationRelatedContent({
  beforeAfterCases,
  operationHeading,
  portfolioCases,
  reviews,
}: OperationRelatedContentProps) {
  const reviewItems = reviews.map((review) => ({
    blurImage: review.kind === "patient",
    id: review.slug,
    imageAlt: review.image?.alternativeText ?? `Фото отзыва: ${review.title}`,
    imageSrc: review.image?.url,
    label: review.title,
    source: review.source,
    text: review.text,
  }));

  if (beforeAfterCases.length === 0 && portfolioCases.length === 0 && reviewItems.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="operation-related-content-title"
      className="content-card content-card--muted operation-related-content"
    >
      <div className="operation-related-content__header">
        <p className="type-overline">Опыт пациентов</p>
        <h2 className="type-h2" id="operation-related-content-title">
          Результаты и отзывы пациентов
        </h2>
        <p className="type-text-base">
          Посмотрите примеры результатов, подробные кейсы и отзывы пациентов по операции «{operationHeading}».
        </p>
      </div>

      {beforeAfterCases.length > 0 ? (
        <div className="operation-related-content__section">
          <div className="operation-related-content__section-header">
            <h3 className="type-h3">До и после</h3>
            <a className="text-link" href="/pacientam/do-i-posle">Все результаты</a>
          </div>
          <BeforeAfterGallery items={beforeAfterCases} />
        </div>
      ) : null}

      {portfolioCases.length > 0 ? (
        <div className="operation-related-content__section">
          <div className="operation-related-content__section-header">
            <h3 className="type-h3">Портфолио</h3>
            <a className="text-link" href="/pacientam/portfolio">Все кейсы</a>
          </div>
          <PortfolioIndex cases={portfolioCases} variant="compact" />
        </div>
      ) : null}

      {reviewItems.length > 0 ? (
        <div className="operation-related-content__section">
          <div className="operation-related-content__section-header">
            <h3 className="type-h3">Отзывы пациентов</h3>
            <a className="text-link" href="/pacientam/otzyvy">Все отзывы</a>
          </div>
          <ReviewsSlider controlsPlacement="below" description="" items={reviewItems} showFooter={false} title="" />
        </div>
      ) : null}
    </section>
  );
}
