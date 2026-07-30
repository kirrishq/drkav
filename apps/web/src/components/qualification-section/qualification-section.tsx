"use client";

import { Button, cn, RecordCard } from "@drkav/ui";
import { useState } from "react";

type QualificationRecord = {
  title: string;
  year: string;
};

const qualifications: readonly QualificationRecord[] = [
  { year: "2022", title: "«Эстетическая хирургия груди и тела»" },
  { year: "2022", title: "«Авторская методика АРТARTHЕMIS + TOTAL GRAFT, продвинутая мужская скульптура»" },
  { year: "2022", title: "«Пластическая, реконструктивная хирургия и косметология»" },
  { year: "2022", title: "VII Международный конгресс по эстетической и реконструктивной хирургии молочной железы, Moscow Breast Meeting" },
  { year: "2022", title: "Международная конференция «ИШЭМ»" },
  { year: "2022", title: "«Липосакци с ультразвуковой системой Vaser»" },
  { year: "2022", title: "Национальный Конгресс по пластической хирургии" },
  { year: "2022", title: "«Циркулярный бодилифтинг постбариатрических пациентов»" },
  { year: "2021", title: "Мастер-класс «Мастопексия», РОПРЭХ" },
  { year: "2021", title: "«ISAPS. Second module. Body Aesthetic Surgery»" },
  { year: "2021", title: "Мастер-класс «Аугментационная маммапластика», РОПРЭХ" },
  { year: "2021", title: "X Национальный конгресс «Пластическая хирургия, эстетическая медицина, косметология»" },
  { year: "2021", title: "«Инновационная школа эстетической медицины»" },
  { year: "2020", title: "«Современная липоскульптура»" },
  { year: "2020", title: "«Липоскульптура высокой точности», Ланцет" },
  { year: "2019", title: "«Modern Aesthetic Breast Surgery and Body Contouring»" },
  { year: "2019", title: "«Advanced Aesthetic Rhinoplasty and face lifting»" },
  { year: "2017", title: "VI Национальный конгресс «Пластическая хирургия, эстетическая медицина, косметология»" },
  { year: "2016", title: "«Анатомия как ключ к успешной герниопластике»" },
  { year: "2015", title: "«Применение лазера в дерматохирургии»" },
];

export function QualificationSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="content-card content-card--muted content-section qualification-section" id="qualifications">
      <h2 className="content-card__heading content-card__heading--h2">Повышение квалификации</h2>
      <div className={cn("content-card__grid", "qualification-section__grid", expanded && "qualification-section__grid--expanded")}>
        {qualifications.map((qualification) => (
          <RecordCard
            className="qualification-section__item"
            icon={<span aria-hidden="true" className="qualification-section__icon" />}
            key={`${qualification.year}-${qualification.title}`}
            meta={qualification.year}
            title={qualification.title}
          />
        ))}
      </div>
      <div className="qualification-section__action">
        <Button onClick={() => setExpanded((isExpanded) => !isExpanded)} type="button" variant="outline">
          {expanded ? "Скрыть" : "Показать еще"}
        </Button>
      </div>
    </section>
  );
}
