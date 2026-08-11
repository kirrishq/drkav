import { RecordCard, buttonVariants, cn } from "@drkav/ui";
import Image from "next/image";
import Link from "next/link";

const doctorHighlights = [
  {
    href: "/obo-mne#about-doctor",
    title: "Один из первых в России применил SIME — безопасный липофилинг груди",
  },
  {
    href: "/obo-mne#patents",
    title: "Автор патентованного метода устранения диастаза без видимых шрамов",
  },
  {
    href: "/obo-mne#qualifications",
    title: "Лектор федеральных и международных конгрессов по пластической хирургии",
  },
  {
    href: "/obo-mne/neshkola",
    title: "Основатель обучающего проекта для пластических хирургов «EhellШкола»",
  },
  {
    href: "/obo-mne/book",
    title: "Автор романа «Боль двенадцати женщин»",
  },
] as const;

const doctorLinks = [
  { href: "/obo-mne/diplomy-i-licenzii", label: "Дипломы" },
  { href: "/obo-mne/smi", label: "СМИ" },
  { href: "/pacientam/blog", label: "Блог" },
  { href: "/obo-mne/vystupleniya", label: "Видео" },
] as const;

function DoctorRating() {
  return (
    <div aria-label="Рейтинг 5 из 5 на портале ПроДокторов" className="doctor-profile__rating">
      <div className="doctor-profile__rating-topline">
        <span className="doctor-profile__rating-provider"><span>ПРО</span>ДОКТОРОВ</span>
        <span aria-hidden="true" className="doctor-profile__stars">★★★★★</span>
      </div>
      <div className="doctor-profile__rating-bottomline">
        <span>Коробов Артём Владимирович</span>
        <span><strong>5.0</strong> Рейтинг на портале</span>
      </div>
    </div>
  );
}

export function DoctorProfile() {
  return (
    <section aria-labelledby="doctor-profile-title" className="doctor-profile">
      <div className="doctor-profile__portrait">
        <Image
          alt="Артём Владимирович Коробов в белом халате"
          className="doctor-profile__portrait-image"
          fill
          priority
          sizes="(min-width: 64rem) 18rem, (min-width: 48rem) 30vw, 100vw"
          src="/images/doctor-portrait.png"
        />
        <DoctorRating />
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
              key={highlight.title}
              title={highlight.title}
            />
          ))}
        </div>

        <nav aria-label="Материалы о докторе" className="doctor-profile__links">
          {doctorLinks.map((link) => (
            <Link className="doctor-profile__link" href={link.href} key={link.href}>
              {link.label}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>

        <div className="doctor-profile__actions">
          <Link className={cn(buttonVariants({ size: "md", variant: "primary" }), "doctor-profile__action")} href="/konsultaciya">
            Записаться на консультацию
          </Link>
          <p className="doctor-profile__price-note">
            Узнайте стоимость операции<br />и план восстановления
          </p>
        </div>
      </div>
    </section>
  );
}
