import { Breadcrumbs, buttonVariants, cn, RecordCard } from "@drkav/ui";
import Link from "next/link";

import { AboutSectionNavigation } from "@/components/about-page/about-section-navigation";
import { AssociationSection } from "@/components/association-section/association-section";
import { AwardSection } from "@/components/award-section/award-section";
import { CertificateSection } from "@/components/certificate-section/certificate-section";
import { JournalArticleSection } from "@/components/journal-article-section/journal-article-section";
import { PatentSection } from "@/components/patent-section/patent-section";
import { QualificationSection } from "@/components/qualification-section/qualification-section";
import { RatingSection } from "@/components/rating-section/rating-section";
import { SiteHeader } from "@/components/site-header/site-header";
import { ThesisSection } from "@/components/thesis-section/thesis-section";

export const metadata = {
  title: "Доктор Коробов — пластический хирург",
  description: "Профессиональный путь, подход к работе и направления практики доктора Коробова.",
};

function GraduationCapIcon() {
  return (
    <svg aria-hidden="true" className="about-page__education-icon" fill="none" viewBox="0 0 24 24">
      <path
        d="m3.5 9 8.5-4 8.5 4-8.5 4-8.5-4Zm3 2.25V15c2.1 1.6 8.9 1.6 11 0v-3.75M20.5 10v5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const educationRecords = [
  {
    details: [
      { value: "Лечебное дело" },
      { tone: "secondary" as const, value: "Базовое образование" },
    ],
    meta: "2009",
    title: "Саратовский государственный медицинский университет им. В.И. Разумовского",
  },
  {
    details: [
      { value: "Хирургия" },
      { tone: "secondary" as const, value: "Интернатура" },
    ],
    meta: "2010",
    title: "Пензенский государственный университет",
  },
  {
    details: [
      { value: "Эндоскопия" },
      { tone: "secondary" as const, value: "Циклы переподготовки" },
    ],
    meta: "2012",
    title: "Медицинский институт Пензенского государственного университета",
  },
  {
    details: [
      { value: "—" },
      { tone: "secondary" as const, value: "Ординатура" },
    ],
    meta: "2015",
    title: "Саратовский государственный медицинский университет им. В.И. Разумовского",
  },
  {
    details: [
      { value: "Хирургия" },
      { tone: "secondary" as const, value: "Повышение квалификации" },
    ],
    meta: "2015",
    title: "Медицинский университет «Реавиз»",
  },
  {
    details: [
      { value: "Пластическая хирургия" },
      { tone: "secondary" as const, value: "Ординатура" },
    ],
    meta: "2020",
    title: "МОНИКИ им. М.Ф. Владимирского",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="about-page">
        <Breadcrumbs items={[{ href: "/", label: "Главная" }, { label: "Обо мне" }]} />

        <div className="about-page__layout">
          <AboutSectionNavigation />

          <div className="about-page__content">
            <section className="content-section" id="about-doctor">
              <div className="about-page__profile">
                <figure className="about-page__portrait">
                  <div className="about-page__portrait-placeholder">
                    <svg aria-hidden="true" className="about-page__portrait-icon" fill="none" viewBox="0 0 80 80">
                      <circle cx="40" cy="26" r="12" stroke="currentColor" strokeWidth="4" />
                      <path d="M16 68c2.5-14 11-21 24-21s21.5 7 24 21" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
                    </svg>
                    <figcaption className="about-page__portrait-caption">Фотография доктора</figcaption>
                  </div>
                </figure>

                <div className="content-card content-card--spacious">
                  <h1 className="content-card__heading content-card__heading--h2">
                    О докторе Коробове Артеме Владимировиче
                  </h1>
                  <p className="content-card__lead">
                    Пластический хирург, КМН, многолетний профессиональный опыт работы с телом.
                  </p>

                  <ul className="content-card__list">
                    {[
                      {
                        content: <>Один из первых в России применил <strong>SIME</strong> — безопасный липофилинг груди.</>,
                        key: "sime",
                      },
                      {
                        content: <>Автор <strong>патентованного метода устранения диастаза</strong> без видимых шрамов.</>,
                        key: "diastasis",
                      },
                      {
                        content: <>Лектор <strong>федеральных и международных конгрессов</strong> по пластической хирургии.</>,
                        key: "congresses",
                      },
                      {
                        content: <>Основатель <strong>обучающего проекта для пластических хирургов «Не Школа»</strong>.</>,
                        key: "not-school",
                      },
                      {
                        content: <>Автор <strong>романа «Боль двенадцати женщин»</strong>.</>,
                        key: "novel",
                      },
                    ].map(({ content, key }) => (
                      <li className="content-card__list-item" key={key}>
                        <span aria-hidden="true" className="content-card__list-marker" />
                        <span>{content}</span>
                      </li>
                    ))}
                  </ul>

                  <Link className={cn(buttonVariants({ size: "sm", variant: "primary" }), "about-page__action")} href="/konsultaciya">
                    Записаться на консультацию
                  </Link>
                </div>
              </div>
            </section>

            <section className="content-card content-card--muted content-section" id="education">
              <h2 className="content-card__heading content-card__heading--h2">Образование</h2>
              <div className="content-card__grid">
                {educationRecords.map((record) => (
                  <RecordCard icon={<GraduationCapIcon />} key={`${record.meta}-${record.title}`} {...record} />
                ))}
              </div>
            </section>

            <QualificationSection />

            <CertificateSection />

            <AwardSection />

            <AssociationSection />

            <PatentSection />

            <JournalArticleSection />

            <ThesisSection />

            <RatingSection />
          </div>
        </div>
      </main>
    </>
  );
}
