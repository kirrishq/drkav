import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { UltrakorConsultation } from "@/components/ultrakor-consultation";
import { UltrakorResults } from "@/components/ultrakor-results";
import { ultrakorZones } from "@/content/ultrakor-zones";

export const metadata: Metadata = {
  title: "Артём Коробов — хирург Ультракора",
  description: "Как Артём Коробов планирует мужскую липоскульптуру в Ультракоре: пропорции тела, зоны коррекции, примеры работ и консультация.",
  alternates: { canonical: "/ultrakor/o-doktore" },
  robots: { index: false, follow: true },
};

const planningSteps = [
  {
    title: "Оценка пропорций",
    description: "Доктор оценивает контуры груди, плеч, живота и талии и обсуждает, как изменение одной зоны повлияет на общий силуэт.",
  },
  {
    title: "Степень рельефа",
    description: "На консультации можно обсудить, какой результат вам ближе: более чёткие контуры корпуса или выраженная прорисовка мышц.",
  },
  {
    title: "Объём коррекции",
    description: "Доктор объясняет, какие зоны можно сочетать в одном плане и что потребуется для подготовки и восстановления.",
  },
];

export default function UltrakorAboutDoctorPage() {
  return (
    <main className="ultrakor-about">
      <section className="ultrakor__section ultrakor-doctor" aria-labelledby="ultrakor-about-title">
        <div className="ultrakor__inner">
          <nav className="ultrakor-about__breadcrumbs" aria-label="Хлебные крошки">
            <Link href="/ultrakor">Ультракор</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">О докторе</span>
          </nav>
          <h1 className="ultrakor__heading" id="ultrakor-about-title">Артём Коробов — хирург Ультракора</h1>

          <div className="ultrakor-doctor__profile">
            <div className="ultrakor-doctor__portrait">
              <Image
                alt="Пластический хирург Артём Коробов"
                fill
                priority
                sizes="(max-width: 700px) 100vw, 360px"
                src="/images/ultrakor/doctor.jpg.webp"
              />
            </div>
            <div className="ultrakor-doctor__bio">
              <span className="ultrakor-doctor__rule" aria-hidden="true" />
              <p><strong>Пластический хирург, кандидат медицинских наук, разработчик методики Ультракор.</strong></p>
              <p>В Ультракоре доктор Коробов занимается мужской липоскульптурой. На консультации он помогает определить, какие пропорции и степень рельефа можно получить с учётом вашей анатомии.</p>
              <p><strong>Более 16 лет практики в пластической хирургии.</strong> Доктор лично проводит операции по методике Ультракор.</p>
              <a className="ultrakor__button ultrakor__button--solid" href="#contact">Записаться на консультацию</a>
              <div className="ultrakor-about__profile-links">
                <Link className="ultrakor-doctor__more" href="/obo-mne">Полная биография</Link>
                <Link className="ultrakor-doctor__more" href="/obo-mne/diplomy-i-licenzii">Дипломы и лицензии</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ultrakor__section ultrakor__section--dark" aria-labelledby="ultrakor-planning-title">
        <div className="ultrakor__inner">
          <h2 className="ultrakor__heading" id="ultrakor-planning-title">Как доктор планирует результат</h2>
          <div className="ultrakor__cards">
            {planningSteps.map((step) => (
              <article className="ultrakor__card" key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
          <nav className="ultrakor-zone__zones" aria-label="Зоны мужской липоскульптуры">
            {ultrakorZones.map((zone) => (
              <a className="ultrakor__button ultrakor__button--outline" href={`/ultrakor/${zone.slug}`} key={zone.slug}>
                {zone.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <UltrakorResults />
      <UltrakorConsultation />
    </main>
  );
}
