import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  AdministratorCta,
  OperationSectionIcon,
  OperationHero,
  PromotionBanner,
  SectionNavigation,
  VideoCard,
  buttonVariants,
  ConsultationTrigger,
} from "@drkav/ui";

import { DoctorProfile } from "@/components/doctor-profile/doctor-profile";
import { OperationContentRenderer } from "@/components/operation-content/operation-content-renderer";
import { administratorContact } from "@/components/site-header/header-config";
import {
  getCmsOperationByPath,
  type CmsMigratedOperationPath,
} from "@/content/cms-migrated-operations";
import { logCmsError } from "@/content/cms-logging";
import { getOperationPageEnhancement } from "@/content/operation-page-config";
import {
  getOperationContentLinks,
  getOperationHeroLinks,
} from "@/content/operation-page-navigation";
import { toMetadata, toUnavailableMetadata } from "@/content/seo";

import { StaticPage } from "./static-page";
import { SiteHeader } from "../site-header/site-header";

export async function getCmsOperationMetadata(
  path: CmsMigratedOperationPath,
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
  path: CmsMigratedOperationPath;
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
  const promotionHeading = promotionSection?.heading ?? enhancement.promotion?.title;
  const introText =
    introSection?.type === "rich-text" ? extractText(introSection.body) : "";
  const introDescription =
    enhancement.heroDescription ?? (introText || content.heroDescription);
  const leadSections = content.contentSections.filter(
    (section) => !section.heading && !section.showInPageNavigation && section !== introSection,
  );
  const contentSections = content.contentSections.filter(
    (section) =>
      section.heading !== promotionHeading &&
      (section.heading || section.showInPageNavigation),
  );
  const heroLinks = getOperationHeroLinks(contentSections);
  const contentNavigation = [
    ...getOperationContentLinks(contentSections),
    { id: "operation-consultation", icon: "consultation" as const, label: "Консультация" },
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
            {contentNavigation.length > 0 ? (
              <SectionNavigation
                ariaLabel={`Содержание страницы «${content.heading}»`}
                className="operation-page__navigation"
                items={contentNavigation}
              />
            ) : null}

            <div className="operation-page__main">
              {leadSections.length > 0 ? (
                <OperationContentRenderer
                  prices={content.prices}
                  sections={leadSections}
                  showNavigation={false}
                />
              ) : null}
              {promotion ? (
                <PromotionBanner
                  description={promotion.description}
                  emphasis={"emphasis" in promotion ? promotion.emphasis : undefined}
                  href={promotion.href}
                  title={promotion.title}
                />
              ) : null}
              {enhancement.video ? (
                <section aria-label="Видео об операции" className="operation-page__video">
                  <VideoCard {...enhancement.video} location="Маммопластика" showDetails={false} year="" />
                </section>
              ) : null}
              <OperationContentRenderer
                prices={content.prices}
                sections={contentSections}
                showNavigation={false}
              />
              <section
                className="content-card content-card--muted operation-page__consultation-cta"
                id="operation-consultation"
              >
                <div>
                  <p className="type-overline">Следующий шаг</p>
                  <h2 className="content-card__heading content-card__heading--h2 operation-content__heading">
                    <OperationSectionIcon icon="consultation" />
                    <span>Обсудим ваш план операции</span>
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
              <DoctorProfile />
              <AdministratorCta
                backgroundSrc="/images/home/administrator-cta-background.png"
                ctaHref={administratorContact.whatsappHref}
                ctaLabel="Написать Ольге"
                description="Если нужно уточнить детали операции, формат консультации или свободные даты, напишите Ольге — она поможет с организацией записи."
                name="Ольга"
              />
            </div>
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
