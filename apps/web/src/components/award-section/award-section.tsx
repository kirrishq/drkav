import { RecordCard } from "@drkav/ui";

const awards = [
  { title: "TOP Beauty&fashion AWARD", year: "2022" },
  { title: "Лучший пластический хирург 2021 (Премия Хрустальный лотос)", year: "2021" },
] as const;

export function AwardSection() {
  return (
    <section className="content-card content-card--muted content-section award-section" id="awards">
      <h2 className="content-card__heading content-card__heading--h2">Профессиональные награды</h2>
      <div className="content-card__grid award-section__grid">
        {awards.map((award) => (
          <RecordCard
            className="award-section__item"
            icon={<span aria-hidden="true" className="award-section__icon" />}
            key={`${award.year}-${award.title}`}
            meta={award.year}
            title={award.title}
          />
        ))}
      </div>
    </section>
  );
}
