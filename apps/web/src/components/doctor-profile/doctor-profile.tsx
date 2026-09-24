import { ArrowUpRightIcon, ConsultationTrigger, RecordCard, buttonVariants, cn } from "@drkav/ui";
import Image from "next/image";
import Link from "next/link";
import { ProdoctorovRatingBanner } from "@/components/prodoctorov-rating-banner/prodoctorov-rating-banner";

const doctorHighlights = [
  {
    href: "/obo-mne#about-doctor",
    id: "sime",
    title: <>Один из первых в России применил <strong>SIME</strong> — безопасный липофилинг груди</>,
  },
  {
    href: "/obo-mne#patents",
    id: "diastasis",
    title: <>Автор <strong>патентованного метода устранения диастаза</strong> без видимых шрамов</>,
  },
  {
    href: "/obo-mne#qualifications",
    id: "congresses",
    title: <>Лектор <strong>федеральных и международных конгрессов</strong> по пластической хирургии</>,
  },
  {
    href: "/obo-mne/neshkola",
    id: "not-school",
    title: <>Основатель <strong>обучающего проекта для пластических хирургов «Не Школа»</strong></>,
  },
  {
    href: "/obo-mne/book",
    id: "novel",
    title: <>Автор <strong>романа «Боль двенадцати женщин»</strong></>,
  },
] as const;

const doctorLinks = [
  { href: "/obo-mne/diplomy-i-licenzii", label: "Дипломы" },
  { href: "/obo-mne/smi", label: "СМИ" },
  { href: "/pacientam/blog", label: "Блог" },
  { href: "/obo-mne/vystupleniya", label: "Видео" },
] as const;

export function DoctorProfile() {
  return (
    <section aria-labelledby="doctor-profile-title" className="doctor-profile">
      <div className="doctor-profile__visual">
        <div className="doctor-profile__portrait">
          <Image
            alt="Артём Владимирович Коробов во время операции"
            className="doctor-profile__portrait-image"
            fill
            loading="lazy"
            sizes="(min-width: 64rem) 18rem, (min-width: 48rem) 30vw, 40vw"
            src="/images/doctor-operating-room.png"
          />
        </div>
        <ProdoctorovRatingBanner className="doctor-profile__rating" />
      </div>

      <div className="doctor-profile__content">
        <h2 className="type-h2 doctor-profile__title" id="doctor-profile-title">О докторе</h2>
        <p className="doctor-profile__lead">
          Доктор Коробов — пластический хирург, <span>кандидат медицинских наук</span>.<br />
          16+ лет практики в мужской и женской пластике.
        </p>

        <div className="doctor-profile__highlights">
          {doctorHighlights.map((highlight) => (
            <RecordCard
              className="doctor-profile__highlight"
              href={highlight.href}
              key={highlight.id}
              title={highlight.title}
            />
          ))}
        </div>

        <nav aria-label="Материалы о докторе" className="doctor-profile__links">
          {doctorLinks.map((link) => (
            <Link className="doctor-profile__link" href={link.href} key={link.href}>
              {link.label}
              <span aria-hidden="true" className="record-card__arrow record-card__arrow--inline">
                <ArrowUpRightIcon />
              </span>
            </Link>
          ))}
        </nav>

        <div className="doctor-profile__actions">
          <ConsultationTrigger className={cn(buttonVariants({ size: "md", variant: "primary" }), "doctor-profile__action")}>
            Записаться на консультацию
          </ConsultationTrigger>
          <p className="doctor-profile__price-note">
            Узнайте стоимость операции<br />и план восстановления
          </p>
        </div>
      </div>
    </section>
  );
}
