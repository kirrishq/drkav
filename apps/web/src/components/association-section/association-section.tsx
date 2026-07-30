import { RecordCard } from "@drkav/ui";

const associations = [
  "Российское общество хирургов",
  "International Society of Surgery",
  "Общество пластических и реконструктивно-эстетических хирургов (ОПРЭХ)",
] as const;

export function AssociationSection() {
  return (
    <section className="content-card content-card--muted content-section association-section" id="associations">
      <h2 className="content-card__heading content-card__heading--h2">Медицинские ассоциации</h2>
      <div className="content-card__grid association-section__grid">
        {associations.map((association) => (
          <RecordCard
            className="association-section__item"
            icon={<span aria-hidden="true" className="association-section__icon" />}
            key={association}
            title={association}
          />
        ))}
      </div>
    </section>
  );
}
