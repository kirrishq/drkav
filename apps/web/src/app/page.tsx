import { AdministratorCta, BenefitsStrip, buttonVariants, cn, ConsultationSection, ConsultationTrigger, FinalResultsSlider, formatRussianText, OperationsCards, ReviewsSlider, VideoHighlights } from "@drkav/ui";
import Image from "next/image";
import Link from "next/link";

import { SiteHeader } from "@/components/site-header/site-header-server";
import { DoctorProfile } from "@/components/doctor-profile/doctor-profile";
import { administratorContact } from "@/components/site-header/header-config";
import { HomeOperatingRoomBackground } from "@/components/home-operating-room-background";
import { HomeBenefitsLottie } from "@/components/home-benefits-lottie";
import { HomeEditorialHighlights } from "@/components/home-editorial-highlights/home-editorial-highlights";
import { HomeSeoBlocks } from "@/components/home-seo/home-seo-blocks";
import { HomeSocialShowcase } from "@/components/home-social-showcase/home-social-showcase";
import { SharedSectionContent } from "@/components/shared-sections/shared-sections";
import { getHomeFinalResults } from "@/content/home-final-results";
import { homeReviews } from "@/content/home-reviews";
import { operationCategoryFallbackImages } from "@/content/operation-category-images";
import { getPageMetadata } from "@/content/page-registry";
import { createContentRepository } from "@/content/content-repository";
import { getReviewFilterGroups, mapReviewsToSliderItems } from "@/content/review-presentation";
import { getStaticPageContent } from "@/content/static-page";
import { getCardGridItems } from "@/content/static-page-text";
import academicBackgroundAnimation from "@/assets/lottie/home-benefits/academic-background.json";
import doctorHealthAnimation from "@/assets/lottie/home-benefits/doctor-health.json";
import headquarterAnimation from "@/assets/lottie/home-benefits/headquarter.json";
import heartBeatAnimation from "@/assets/lottie/home-benefits/heart-beat.json";

const homeBenefits = [
  {
    icon: <HomeBenefitsLottie animationData={headquarterAnimation} label="Премиальная клиника на Барвихе" />,
    label: "Премиальная клиника на Барвихе",
  },
  {
    icon: <HomeBenefitsLottie animationData={heartBeatAnimation} label="Максимальная безопасность" />,
    label: "Максимальная безопасность: реанимация и дежурный реаниматолог",
  },
  {
    icon: <HomeBenefitsLottie animationData={doctorHealthAnimation} label="Современная реабилитация" />,
    label: "Современная реабилитация с первого дня после операции",
  },
  {
    icon: <HomeBenefitsLottie animationData={academicBackgroundAnimation} label="Опыт и методики" />,
    label: "Опыт и методики для операций любой сложности",
  },
] as const;

function getHomeBenefits(labels?: readonly { title: string }[]) {
  return homeBenefits.map((benefit, index) => ({
    ...benefit,
    label: labels?.[index]?.title ?? benefit.label,
  }));
}

const homeVideoHighlights = [
  {
    contentPosition: "before",
    dialogVideoSrc: "https://drkav.ru/videos/homepage/video-1.mp4",
    description: "MOMMY MAKEOVER по версии Всероссийской премии «ХРУСТАЛЬНЫЙ ЛОТОС»",
    posterAlt: "Церемония премии «Хрустальный лотос»",
    posterSrc: "/videos/doctor-award-poster.jpg",
    title: "Лучший хирург",
    videoSrc: "/videos/doctor-award.mp4",
    webmSrc: "/videos/doctor-award.webm",
  },
  {
    contentPosition: "after",
    dialogVideoSrc: "https://drkav.ru/videos/homepage/video-2.mp4",
    description: "Пластическая хирургия, эстетическая медицина и косметология",
    posterAlt: "Доктор Коробов выступает на Национальном конгрессе имени Миланова",
    posterSrc: "/videos/milanov-congress-poster.jpg",
    title: "XI Национальный конгресс имени Миланова",
    videoSrc: "/videos/milanov-congress.mp4",
    webmSrc: "/videos/milanov-congress.webm",
  },
] as const;

const homeFinalResultFallbacks = [
  { href: "/operaczii/abdominoplastika", id: "abdomen-and-waist", label: "Живот и талия" },
  { href: "/operaczii/plasticheskaya-hirurgiya-posle-rodov", id: "postpartum", label: "После родов" },
  { href: "/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya", id: "after-weight-loss", label: "После похудения" },
  { href: "/operaczii/plastika-grudi", id: "breast", label: "Пластика груди" },
  { href: "/operaczii/muzhskaya-plastika", id: "male-athletic-contouring", label: "Мужская атлетизация" },
  { href: "/operaczii/liposkulptura", id: "body-contouring", label: "Коррекция фигуры" },
  { href: "/operaczii/rf-lifting", id: "non-surgical-rf-lifting", label: "Без операции (РФ-лифтинг)" },
] as const;

const homeFinalResultExcludedCategoryKeys = new Set(["intimate-surgery"]);

export const metadata = getPageMetadata("/");

export default async function HomePage() {
  const [finalResults, cmsReviews, cmsHome] = await Promise.all([
    getHomeFinalResults(),
    createContentRepository().getReviews(),
    getStaticPageContent("home"),
  ]);
  const heroTitle = cmsHome?.heading ?? "Пластический хирург Артём Владимирович Коробов";
  const heroDescription = cmsHome?.heroDescription ?? "Специализируюсь на абдоминопластике, маммопластике, липоскульптуре, комплексном восстановлении фигуры и мужской атлетизации.";
  const sharedSections = new Map(cmsHome?.sharedSections.map((section) => [section.type, section]) ?? []);
  const doctorSection = sharedSections.get("doctor-profile");
  const operationsSection = sharedSections.get("operations-catalog");
  const reviewsSection = sharedSections.get("reviews");
  const consultationSection = sharedSections.get("consultation");
  const administratorSection = sharedSections.get("administrator");
  const localReviewFallback = process.env.NODE_ENV !== "production" ? homeReviews : [];
  const reviewItems = cmsReviews.length > 0 ? mapReviewsToSliderItems(cmsReviews, finalResults.groups) : localReviewFallback;
  const reviewFilterGroups = cmsReviews.length > 0 ? getReviewFilterGroups(cmsReviews, finalResults.groups) : [];
  const benefitCards = getCardGridItems(cmsHome, "benefits");
  const editorialCards = getCardGridItems(cmsHome, "editorial");
  const resultTabs = finalResults.groups.length > 0
    ? finalResults.groups
      .filter((group) => !homeFinalResultExcludedCategoryKeys.has(group.key))
      .map((group) => ({ id: group.key, label: group.name }))
    : homeFinalResultFallbacks.map(({ id, label }) => ({ id, label }));
  const resultItems = resultTabs.flatMap((tab) => {
    const cmsItems = finalResults.results.filter((result) => result.categoryKey === tab.id);

    if (cmsItems.length > 0) {
      return cmsItems.map((result) => ({
        href: result.operation.canonicalPath,
        id: result.slug,
        imageAlt: result.image.alternativeText ?? `${result.title} — финальный результат`,
        imageSrc: result.image.url,
        label: result.title,
        tabId: result.categoryKey,
      }));
    }

    const fallback = homeFinalResultFallbacks.find((item) => item.id === tab.id);
    const group = finalResults.groups.find((item) => item.key === tab.id);

    return [{
      href: group?.featuredOperation.canonicalPath ?? fallback?.href ?? "/operaczii",
      id: `placeholder-${tab.id}`,
      imageAlt: `Заглушка для результатов: ${tab.label}`,
      imageSrc: "/images/before-after/results-placeholder.svg",
      label: tab.label,
      tabId: tab.id,
    }];
  });
  const operationItems = finalResults.groups.length > 0
    ? finalResults.groups.map((group) => ({
        id: group.key,
        imageAlt: group.image?.alternativeText ?? `Иллюстрация: ${group.name}`,
        imageSrc: group.image?.url ?? operationCategoryFallbackImages[group.key as keyof typeof operationCategoryFallbackImages],
        imageSizes: "(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw",
        links: group.operations.map((operation) => ({
          href: operation.canonicalPath,
          label: operation.heading,
        })),
        title: group.name,
      }))
    : homeFinalResultFallbacks.map((group) => ({
        id: group.id,
        imageAlt: `Заглушка: ${group.label}`,
        imageSrc: operationCategoryFallbackImages[group.id as keyof typeof operationCategoryFallbackImages],
        imageSizes: "(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw",
        links: [{ href: group.href, label: group.label }],
        title: group.label,
      }));

  return (
    <>
      <SiteHeader />
      <main className="home-page">
        <section aria-labelledby="home-hero-title" className="home-hero">
          <HomeOperatingRoomBackground />
          <div className="home-hero__content">
            <div className="home-hero__details">
              <div className="home-hero__badges">
                <span className="home-hero__badge">Кандидат медицинских наук</span>
                <span className="home-hero__badge">Автор патента и учебника</span>
                <span className="home-hero__badge">16+ лет опыта</span>
              </div>
              <h1 className="type-h1 home-hero__title" id="home-hero-title">{formatRussianText(heroTitle)}</h1>
              <p className="home-hero__description">{formatRussianText(heroDescription)}</p>
              <div className="home-hero__actions">
                <ConsultationTrigger className={buttonVariants({ size: "md", variant: "primary" })}>Записаться на консультацию</ConsultationTrigger>
                <Link className={cn(buttonVariants({ size: "md", variant: "outline" }), "home-hero__secondary-action")} href="/ceny">Услуги и цены</Link>
              </div>
            </div>
            <div className="home-hero__portrait">
              <Image
                alt="Артём Владимирович Коробов в чёрном костюме и белом медицинском халате, портрет по пояс"
                className="home-hero__portrait-image"
                fill
                priority
                quality={75}
                sizes="(min-width: 80rem) 30rem, (min-width: 40rem) 36vw, calc(100vw - 2rem)"
                src="/images/home/doctor-hero-suit-half.png"
              />
            </div>
          </div>
        </section>
        <BenefitsStrip items={getHomeBenefits(benefitCards)} />
        <VideoHighlights ctaHref="/obo-mne/vystupleniya" items={homeVideoHighlights} />
        {doctorSection ? <SharedSectionContent section={doctorSection} /> : <DoctorProfile />}
        <FinalResultsSlider
          links={[
            { href: "/pacientam/portfolio", label: "Портфолио кейсов" },
            { href: "/pacientam/do-i-posle", label: "Фото до/после" },
            { href: "/pacientam/otzyvy", label: "Отзывы пациентов" },
          ]}
          items={resultItems}
          tabs={resultTabs}
        />
        {operationsSection ? <SharedSectionContent section={operationsSection} /> : <OperationsCards items={operationItems} />}
        {reviewsSection ? <SharedSectionContent section={reviewsSection} /> : <ReviewsSlider ctaHref="/pacientam/otzyvy" filterGroups={reviewFilterGroups} items={reviewItems} />}
        {consultationSection ? <SharedSectionContent section={consultationSection} /> : <ConsultationSection captchaSiteKey={process.env.NEXT_PUBLIC_SMARTCAPTCHA_SITE_KEY} submitUrl="/api/forms/consultation" />}
        {administratorSection ? <SharedSectionContent section={administratorSection} /> : (
          <AdministratorCta
            avatarSrc="/images/home/administrator-avatar.png"
            backgroundSrc="/images/home/administrator-cta-background.png"
            ctaHref={administratorContact.whatsappHref}
            ctaLabel="Написать Ольге"
            description="Если нужно уточнить детали операции, формат консультации, свободные даты или просто задать вопрос, напишите Ольге. Она сориентирует и поможет организовать запись."
            name="Ольга"
          />
        )}
        <HomeSocialShowcase />
        <HomeEditorialHighlights copy={editorialCards.length > 0 ? editorialCards : undefined} />
        <HomeSeoBlocks />
      </main>
    </>
  );
}
