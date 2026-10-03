import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { RichTextBlock } from "@drkav/content-contracts";

import {
  AdministratorCta,
  OperationHero,
  PromotionBanner,
  SectionNavigation,
  VideoCard,
  buttonVariants,
  ConsultationTrigger,
} from "@drkav/ui";

import { DoctorProfile } from "@/components/doctor-profile/doctor-profile";
import { ContributionPatent } from "@/components/contribution-patent/contribution-patent";
import { OperationRelatedContent } from "@/components/operation-related-content/operation-related-content";
import { BlocksRenderer } from "@/components/operation-content/blocks-renderer";
import { OperationContentRenderer } from "@/components/operation-content/operation-content-renderer";
import { administratorContact } from "@/components/site-header/header-config";
import {
  getCmsOperationByPath,
} from "@/content/cms-migrated-operations";
import { logCmsError } from "@/content/cms-logging";
import { getOperationPageEnhancement } from "@/content/operation-page-config";
import { createContentRepository } from "@/content/content-repository";
import {
  getOperationContentLinks,
  getOperationHeroLinks,
} from "@/content/operation-page-navigation";
import { toMetadata, toUnavailableMetadata } from "@/content/seo";

import { StaticPage } from "./static-page";
import { SiteHeader } from "../site-header/site-header-server";

export async function getCmsOperationMetadata(
  path: string,
): Promise<Metadata> {
  try {
    const content = await getCmsOperationByPath(path);

    if (!content) {
      notFound();
    }

    return toMetadata(content.seo);
  } catch (error) {
    logCmsError("cms_metadata_fallback_rendered", error, path);
    return toUnavailableMetadata(path);
  }
}

export async function CmsOperationPage({
  path,
}: {
  path: string;
}) {
  let content: Awaited<ReturnType<typeof getCmsOperationByPath>>;

  try {
    content = await getCmsOperationByPath(path);
  } catch (error) {
    logCmsError("cms_cold_request_failed", error, path);
    throw error;
  }

  if (!content) {
    notFound();
  }

  const enhancement = getOperationPageEnhancement(path);

  if (!enhancement) {
    return (
      <StaticPage
        breadcrumbs={[
          { href: "/", label: "Главная" },
          { href: "/operaczii", label: "Операции" },
          { label: content.breadcrumbLabel ?? content.heading },
        ]}
        description={content.heroDescription ?? ""}
        title={content.heading}
      >
        <OperationContentRenderer
          prices={content.prices}
          sections={content.contentSections}
        />
      </StaticPage>
    );
  }

  const repository = createContentRepository();
  const [beforeAfterCases, portfolioIndex, reviews] = await Promise.all([
    repository.getBeforeAfterCases(),
    repository.getPortfolioIndex(),
    repository.getReviews(),
  ]);
  const relatedBeforeAfterCases = beforeAfterCases.filter(
    (item) => item.operation.canonicalPath === path,
  );
  const relatedPortfolioCases = portfolioIndex.cases.filter((item) =>
    item.operations.some((operation) => operation.canonicalPath === path),
  );
  const relatedReviews = reviews.filter(
    (item) => item.operation?.canonicalPath === path,
  );

  const introSection = content.contentSections.find(
    (section) => !section.heading && !section.showInPageNavigation,
  );
  const promotionSection = content.contentSections.find(
    (section) => section.heading === "Операция в подарок",
  );
  const promotion = enhancement.promotion ?? (promotionSection
    ? {
        description: extractText(promotionSection.type === "rich-text" ? promotionSection.body : []),
        href: "/akcii",
        title: promotionSection.heading ?? "Операция в подарок",
      }
    : {
        description: "Узнайте об актуальных предложениях для этой операции и условиях их получения на консультации.",
        href: "/akcii",
        title: "Актуальные предложения",
      });
  const introText =
    introSection?.type === "rich-text" ? extractText(introSection.body) : "";
  const introBlocks =
    introSection?.type === "rich-text" &&
    introSection.body.length > 0 &&
    !isPlaceholderIntro(introText)
      ? introSection.body
      : null;
  const introDescription =
    getShortIntro(
      enhancement.heroDescription ??
        getFirstParagraphText(introBlocks) ??
        content.heroDescription,
    );
  const contentSections = content.contentSections.filter(
    (section) =>
      section !== introSection &&
      section !== promotionSection,
  );
  const patentSection = path === "/operaczii/diastaz-myshc-zhivota"
    ? contentSections.find((section) => section.heading === "Патент")
    : undefined;
  const renderedContentSections = patentSection
    ? contentSections.filter((section) => section !== patentSection)
    : contentSections;
  const heroLinks = getOperationHeroLinks(renderedContentSections);
  const contentNavigation = [
    ...(patentSection ? [{ id: "operation-patent", label: "Патент" }] : []),
    ...getOperationContentLinks(renderedContentSections),
    { id: "operation-consultation", label: "Консультация", variant: "accent" as const },
  ];

  return (
    <>
      <SiteHeader />
      <main className="operation-page">
        <OperationHero
          backgroundSrc={enhancement.heroImageSrc}
          breadcrumbs={getOperationBreadcrumbs(
            path,
            content.heading,
            content.breadcrumbLabel,
          )}
          description={introDescription}
          links={heroLinks}
          title={content.heading}
        />
        <div className="operation-page__content">
          <div className="operation-page__layout">
            <div className="operation-page__main">
              {promotion ? (
                <PromotionBanner
                  description={promotion.description}
                  emphasis={"emphasis" in promotion ? promotion.emphasis : undefined}
                  href={promotion.href}
                  title={promotion.title}
                />
              ) : null}
              {introBlocks ? (
                <section className="content-card content-card--spacious operation-page__intro">
                  <BlocksRenderer blocks={introBlocks} />
                </section>
              ) : null}
              {enhancement.video ? (
                <section aria-label="Видео об операции" className="content-card operation-page__video">
                  <VideoCard {...enhancement.video} location={content.heading} showDetails={false} year="" />
                </section>
              ) : null}
              {patentSection ? (
                <div id="operation-patent">
                  <ContributionPatent
                    lead={patentSection.type === "rich-text" ? extractText(patentSection.body) : undefined}
                  />
                </div>
              ) : null}
              <OperationContentRenderer
                prices={content.prices}
                sections={renderedContentSections}
                showNavigation={false}
              />
              <section
                className="content-card consultation-section consultation-section--compact operation-page__consultation-cta"
                id="operation-consultation"
              >
                <div className="consultation-section__content">
                  <p className="type-overline">Следующий шаг</p>
                  <h2 className="content-card__heading content-card__heading--h2 consultation-section__title">
                    Обсудим ваш план операции
                  </h2>
                  <p>
                    На консультации разберём задачу, варианты коррекции, подготовку и стоимость.
                  </p>
                </div>
                <ConsultationTrigger
                  className={buttonVariants({ size: "md", variant: "primary" })}
                >
                  Записаться на консультацию
                </ConsultationTrigger>
              </section>
              <OperationRelatedContent
                beforeAfterCases={relatedBeforeAfterCases}
                operationHeading={content.heading}
                portfolioCases={relatedPortfolioCases}
                reviews={relatedReviews}
              />
              <DoctorProfile />
              <AdministratorCta
                avatarSrc="/images/home/administrator-avatar.png"
                backgroundSrc="/images/home/administrator-cta-background.png"
                ctaHref={administratorContact.whatsappHref}
                ctaLabel="Написать Ольге"
                description="Если нужно уточнить детали операции, формат консультации или свободные даты, напишите Ольге — она поможет с организацией записи."
                name="Ольга"
              />
            </div>

            {contentNavigation.length > 0 ? (
              <SectionNavigation
                ariaLabel={`Содержание страницы «${content.heading}»`}
                backLink={{ href: "/operaczii", label: "Все операции" }}
                className="operation-page__navigation"
                items={contentNavigation}
              />
            ) : null}
          </div>
        </div>
      </main>
    </>
  );
}

function extractText(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(extractText).filter(Boolean).join(" ");
  }

  if (value && typeof value === "object") {
    if ("text" in value && typeof value.text === "string") {
      return value.text;
    }

    if ("children" in value) {
      return extractText(value.children);
    }
  }

  return "";
}

const placeholderIntro = "Наслаждайтесь собой и своим телом!";

function isPlaceholderIntro(value: string): boolean {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("ru-RU") ===
    placeholderIntro.toLocaleLowerCase("ru-RU");
}

function getFirstParagraphText(
  blocks: readonly RichTextBlock[] | null,
): string | undefined {
  const paragraph = blocks?.find((block) => block.type === "paragraph");

  if (!paragraph || paragraph.type !== "paragraph") {
    return undefined;
  }

  return extractText(paragraph.children);
}

function getShortIntro(value?: string): string | undefined {
  const normalized = value?.replace(/\s+/g, " ").trim();

  if (!normalized || isPlaceholderIntro(normalized)) {
    return undefined;
  }

  const firstSentence = normalized.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? normalized;

  if (firstSentence.length <= 220) {
    return firstSentence;
  }

  const shortened = firstSentence.slice(0, 217).replace(/[\s,;:—-]+$/, "");
  return `${shortened}…`;
}

const operationBreadcrumbCategories: Readonly<Record<string, { href: string; label: string }>> = {
  "lipofiling": { href: "/operaczii/lipofiling", label: "Липофилинг" },
  "liposkulptura": { href: "/operaczii/liposkulptura", label: "Коррекция фигуры" },
  "liposakcziya": { href: "/operaczii/liposkulptura", label: "Коррекция фигуры" },
  "muzhskaya-plastika": { href: "/operaczii/muzhskaya-plastika", label: "Мужчинам" },
  "plastika-grudi": { href: "/operaczii/plastika-grudi", label: "Пластика груди" },
  "rf-lifting": { href: "/operaczii/rf-lifting", label: "Без операции (РФ-лифтинг)" },
};

function getOperationBreadcrumbs(
  path: string,
  heading: string,
  breadcrumbLabel?: string,
) {
  const [, segment, operation] = path.split("/").filter(Boolean);
  const category = operationBreadcrumbCategories[segment];
  const currentLabel =
    breadcrumbLabel ?? (category?.href === path ? category.label : heading);

  return [
    { href: "/", label: "Главная" },
    { href: "/operaczii", label: "Операции" },
    ...(operation && category && category.href !== path ? [category] : []),
    { label: currentLabel },
  ];
}
