import { buttonVariants, cn, ConsultationSection, ConsultationTrigger, FinalResultsSlider, OperationsCards, ReviewsSlider, StatsStrip, VideoHighlights } from "@drkav/ui";
import Image from "next/image";
import Link from "next/link";

import { SiteHeader } from "@/components/site-header/site-header";
import { DoctorProfile } from "@/components/doctor-profile/doctor-profile";
import { HomeSpaceBackground } from "@/components/home-space-background";
import { getHomeFinalResults } from "@/content/home-final-results";
import { homeReviews } from "@/content/home-reviews";
import { operationCategoryFallbackImages } from "@/content/operation-category-images";
import { getPageMetadata } from "@/content/page-registry";

const homeStats = [
  { label: "Пациентов по рекомендациям", prefix: "~", suffix: "%", value: 85 },
  { label: "Довольных пациентов", prefix: "~", suffix: "%", value: 98 },
  { label: "Операций в год", suffix: "+", value: 350 },
  { label: "Брошенных пациентов", value: 0 },
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
  const finalResults = await getHomeFinalResults();
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
      imageSrc: "/images/before-after/placeholder-after.png",
      label: tab.label,
      tabId: tab.id,
    }];
  });
  const operationItems = finalResults.groups.length > 0
    ? finalResults.groups.map((group) => ({
        id: group.key,
        imageAlt: group.image?.alternativeText ?? `Иллюстрация: ${group.name}`,
        imageSrc: group.image?.url ?? operationCategoryFallbackImages[group.key as keyof typeof operationCategoryFallbackImages],
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
        links: [{ href: group.href, label: group.label }],
        title: group.label,
      }));

  return (
    <>
      <SiteHeader />
      <main className="home-page">
        <section aria-labelledby="home-hero-title" className="home-hero">
          <HomeSpaceBackground />
          <div className="home-hero__content">
            <div className="home-hero__details">
              <div className="home-hero__badges">
                <span className="home-hero__badge">Пластический хирург</span>
                <span className="home-hero__badge">Кандидат медицинских наук</span>
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
                alt="Артём Владимирович Коробов в белом халате"
                className="home-hero__portrait-image"
                fill
                priority
                sizes="(min-width: 80rem) 30rem, (min-width: 40rem) 36vw, 88vw"
                src="/images/doctor-portrait.png"
              />
            </div>
          </div>
        </section>
        <StatsStrip items={homeStats} />
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
        <ReviewsSlider ctaHref="/pacientam/otzyvy" items={homeReviews} />
        <ConsultationSection />
      </main>
    </>
  );
}
