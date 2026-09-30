import { RecordCard } from "@drkav/ui";

import { AwardIcon } from "../about-page/about-icons";

const awards = [
  { title: "TOP Beauty&fashion AWARD", year: "2022" },
  { title: "Лучший пластический хирург 2021 (Премия Хрустальный лотос)", year: "2021" },
] as const;

export function AwardSection({ items = awards }: { items?: readonly { title: string; year: string }[] }) {
  return (
    <section className="content-card content-card--muted content-section award-section" id="awards">
      <h2 className="content-card__heading content-card__heading--h2">Профессиональные награды</h2>
      <div className="content-card__grid award-section__grid">
        {items.map((award) => (
          <RecordCard
            className="award-section__item"
            icon={<AwardIcon />}
            key={`${award.year}-${award.title}`}
            meta={award.year}
            title={award.title}
          />
        ))}
      </div>
    </section>
  );
}
