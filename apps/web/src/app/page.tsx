import { AdministratorCta, BenefitsStrip, buttonVariants, cn, ConsultationSection, ConsultationTrigger, FinalResultsSlider, OperationsCards, ReviewsSlider, VideoHighlights } from "@drkav/ui";
import Image from "next/image";
import Link from "next/link";

import { SiteHeader } from "@/components/site-header/site-header";
import { DoctorProfile } from "@/components/doctor-profile/doctor-profile";
import { administratorContact } from "@/components/site-header/header-config";
import { HomeOperatingRoomBackground } from "@/components/home-operating-room-background";
import { HomeEditorialHighlights } from "@/components/home-editorial-highlights/home-editorial-highlights";
import { HomeSeoBlocks } from "@/components/home-seo/home-seo-blocks";
import { HomeSocialShowcase } from "@/components/home-social-showcase/home-social-showcase";
import { getHomeFinalResults } from "@/content/home-final-results";
import { homeReviews } from "@/content/home-reviews";
import { operationCategoryFallbackImages } from "@/content/operation-category-images";
import { getPageMetadata } from "@/content/page-registry";
import { createContentRepository } from "@/content/content-repository";
import { getReviewFilterGroups, mapReviewsToSliderItems } from "@/content/review-presentation";

function getLocalImageSrcSet(src: string | undefined) {
  if (!src?.startsWith("/")) {
    return undefined;
  }

  const encodedSrc = encodeURIComponent(src);

  return [384, 640, 768, 1024]
    .map((width) => `/_next/image?url=${encodedSrc}&w=${width}&q=70 ${width}w`)
    .join(", ");
}

function ClinicIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24">
      <path d="M4 20h16M6 20V8h12v12M9 8V5h6v3M9 12h2m2 0h2m-6 4h2m2 0h2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
    </svg>
  );
}

function SafetyIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24">
      <path d="m12 3 7 3v5c0 4.5-2.8 7.8-7 10-4.2-2.2-7-5.5-7-10V6l7-3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.75" />
      <path d="m8.5 12 2.2 2.2 4.8-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
    </svg>
  );
}

function RecoveryIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24">
      <path d="M4.5 12a7.5 7.5 0 0 1 12.8-5.3L19 9m0-5v5h-5M19.5 12a7.5 7.5 0 0 1-12.8 5.3L5 15m0 5v-5h5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
    </svg>
  );
}

function ComplexityIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24">
      <path d="m12 3 2.2 5.3L20 10.5l-5.8 2.2L12 18l-2.2-5.3L4 10.5l5.8-2.2L12 3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.75" />
      <path d="m19 16 .8 1.8L21.5 19l-1.7 1.2L19 22l-.8-1.8-1.7-1.2 1.7-1.2L19 16Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

const homeBenefits = [
  { icon: <ClinicIcon />, label: "Премиальная клиника на Барвихе" },
  { icon: <SafetyIcon />, label: "Максимальная безопасность: реанимация и дежурный реаниматолог" },
  { icon: <RecoveryIcon />, label: "Современная реабилитация с первого дня после операции" },
  { icon: <ComplexityIcon />, label: "Опыт и методики для операций любой сложности" },
] as const;

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
  { href: "/operaczii/intimnaya-plastika", id: "intimate-surgery", label: "Интимная пластика" },
  { href: "/operaczii/rf-lifting", id: "non-surgical-rf-lifting", label: "Без операции (РФ-лифтинг)" },
] as const;

export const metadata = getPageMetadata("/");

export default async function HomePage() {
  const [finalResults, cmsReviews] = await Promise.all([
    getHomeFinalResults(),
    createContentRepository().getReviews(),
  ]);
  const reviewItems = cmsReviews.length > 0 ? mapReviewsToSliderItems(cmsReviews, finalResults.groups) : homeReviews;
  const reviewFilterGroups = cmsReviews.length > 0 ? getReviewFilterGroups(cmsReviews, finalResults.groups) : [];
  const resultTabs = finalResults.groups.length > 0
    ? finalResults.groups.map((group) => ({ id: group.key, label: group.name }))
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
        imageSrcSet: getLocalImageSrcSet(group.image?.url ?? operationCategoryFallbackImages[group.key as keyof typeof operationCategoryFallbackImages]),
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
        imageSrcSet: getLocalImageSrcSet(operationCategoryFallbackImages[group.id as keyof typeof operationCategoryFallbackImages]),
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
              <h1 className="type-h1 home-hero__title" id="home-hero-title">Пластический хирург Артём Владимирович Коробов</h1>
              <p className="home-hero__description">Специализируюсь на абдоминопластике, маммопластике, липоскульптуре, комплексном восстановлении фигуры и мужской атлетизации.</p>
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
        <BenefitsStrip items={homeBenefits} />
        <VideoHighlights ctaHref="/obo-mne/vystupleniya" items={homeVideoHighlights} />
        <DoctorProfile />
        <FinalResultsSlider
          links={[
            { href: "/pacientam/portfolio", label: "Портфолио кейсов" },
            { href: "/pacientam/do-i-posle", label: "Фото до/после" },
            { href: "/otzyvy", label: "Отзывы пациентов" },
          ]}
          items={resultItems}
          tabs={resultTabs}
        />
        <OperationsCards items={operationItems} />
        <ReviewsSlider ctaHref="/pacientam/otzyvy" filterGroups={reviewFilterGroups} items={reviewItems} />
        <ConsultationSection submitUrl="/api/forms/consultation" />
        <AdministratorCta
          avatarSrc="/images/home/administrator-avatar.png"
          backgroundSrc="/images/home/administrator-cta-background.png"
          ctaHref={administratorContact.whatsappHref}
          ctaLabel="Написать Ольге"
          description="Если нужно уточнить детали операции, формат консультации, свободные даты или просто задать вопрос, напишите Ольге. Она сориентирует и поможет организовать запись."
          name="Ольга"
        />
        <HomeSocialShowcase />
        <HomeEditorialHighlights />
        <HomeSeoBlocks />
      </main>
    </>
  );
}
