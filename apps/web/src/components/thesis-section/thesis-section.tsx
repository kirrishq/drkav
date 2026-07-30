import { RecordCard } from "@drkav/ui";

const theses = [
  {
    source: "VII Конгресс хирургов юга России «Актуальные вопросы хирургической тактики в современных условиях»",
    title: "Грыжа белой линии живота в сочетании с диастазом прямых мышц: кто и что должен делать?",
    year: "2025",
  },
  {
    source: "Материалы XV съезда РОХ совместно с IX конгрессом московских хирургов",
    title: "Клинические факторы риска формирования грыж белой линии живота: результаты многоцентрового регрессионного анализа",
    year: "2023",
  },
  {
    source: "Сборник материалов научно-практической конференции с международным участием «XVIII Съезд хирургов Республики Беларусь»",
    title: "Результаты оценки локализации, факторов риска и сроков возникновения параколостомических грыж",
    year: "2023",
  },
] as const;

export function ThesisSection() {
  return (
    <section className="content-card content-card--muted content-section thesis-section" id="theses">
      <h2 className="content-card__heading content-card__heading--h2">Тезисы</h2>
      <div className="content-card__grid thesis-section__grid">
        {theses.map((thesis) => (
          <RecordCard
            details={[{ tone: "secondary", value: thesis.source }]}
            icon={<span aria-hidden="true" className="thesis-section__icon" />}
            key={`${thesis.year}-${thesis.title}`}
            meta={thesis.year}
            title={thesis.title}
          />
        ))}
      </div>
    </section>
  );
}
