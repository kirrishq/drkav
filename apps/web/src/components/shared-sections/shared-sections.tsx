import {
  AdministratorCta,
  ConsultationSection,
  OperationsCards,
  ReviewsSlider,
} from "@drkav/ui";
import type { SharedSection } from "@drkav/content-contracts";

import { DoctorProfile } from "@/components/doctor-profile/doctor-profile";
import { BlocksRenderer } from "@/components/operation-content/blocks-renderer";
import { administratorContact } from "@/components/site-header/header-config";
import { createContentRepository } from "@/content/content-repository";
import { operationCategoryFallbackImages } from "@/content/operation-category-images";
import { homeReviews } from "@/content/home-reviews";
import { getReviewFilterGroups, mapReviewsToSliderItems } from "@/content/review-presentation";
import { getOptimizedImageSrcSet } from "@/content/optimized-image";

export async function SharedSectionContent({ section }: { section: SharedSection }) {
  if (section.type === "doctor-profile") {
    return (
      <DoctorProfile
        description={section.description}
        highlights={section.highlights}
        links={section.links}
        title={section.heading}
      />
    );
  }

  if (section.type === "consultation") {
    return (
      <ConsultationSection
        captchaSiteKey={process.env.NEXT_PUBLIC_SMARTCAPTCHA_SITE_KEY}
        description={section.description}
        details={section.details}
        submitUrl="/api/forms/consultation"
        title={section.heading}
      />
    );
  }

  if (section.type === "administrator") {
    return (
      <AdministratorCta
        avatarSrc="/images/home/administrator-avatar.png"
        backgroundSrc="/images/home/administrator-cta-background.png"
        ctaHref={section.ctaHref ?? administratorContact.whatsappHref}
        ctaLabel={section.ctaLabel ?? "Написать Ольге"}
        description={section.description ?? "Если нужно уточнить детали операции, формат консультации, свободные даты или просто задать вопрос, напишите Ольге. Она сориентирует и поможет организовать запись."}
        name={section.personName ?? "Ольга"}
        role={section.personRole}
        title={section.heading}
      />
    );
  }

  if (section.type === "rich-text") {
    return section.body?.length ? (
      <section className="content-card content-card--spacious content-section">
        {section.heading ? <h2 className="content-card__heading content-card__heading--h2">{section.heading}</h2> : null}
        <BlocksRenderer blocks={section.body} listVariant="accent" />
      </section>
    ) : null;
  }

  const repository = createContentRepository();
  const operationGroups = section.type === "operations-catalog" || section.type === "reviews"
    ? await repository.getOperationCatalog()
    : [];
  const reviews = section.type === "reviews"
    ? await repository.getReviews()
    : [];

  if (section.type === "operations-catalog") {
    return (
      <OperationsCards
        description={section.description}
        items={operationGroups.map((group) => ({
          id: group.key,
          imageAlt: group.image?.alternativeText ?? `Иллюстрация: ${group.name}`,
          imageSrc: group.image?.url ?? operationCategoryFallbackImages[group.key as keyof typeof operationCategoryFallbackImages],
          imageSizes: "(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw",
          imageSrcSet: getOptimizedImageSrcSet(group.image?.url ?? operationCategoryFallbackImages[group.key as keyof typeof operationCategoryFallbackImages]),
          links: group.operations.map((operation) => ({
            href: operation.canonicalPath,
            label: operation.heading,
          })),
          title: group.name,
        }))}
        title={section.heading}
      />
    );
  }

  const localReviewFallback = process.env.NODE_ENV !== "production" ? homeReviews : [];
  const reviewItems = reviews.length > 0 ? mapReviewsToSliderItems(reviews, operationGroups) : localReviewFallback;

  return (
    <ReviewsSlider
      ctaHref={section.ctaHref ?? "/pacientam/otzyvy"}
      ctaLabel={section.ctaLabel}
      description={section.description}
      filterGroups={reviews.length > 0 ? getReviewFilterGroups(reviews, operationGroups) : []}
      items={reviewItems}
      title={section.heading}
    />
  );
}

export async function SharedSections({ sections }: { sections: readonly SharedSection[] }) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="shared-sections">
      {sections.map((section) => (
        <SharedSectionContent key={section.sectionKey} section={section} />
      ))}
    </div>
  );
}
