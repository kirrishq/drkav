"use client";

import Image from "next/image";
import { useState } from "react";

type Result = {
  label: "До" | "После";
  imageSrc: string;
};

const results: Result[] = [
  { label: "До", imageSrc: "/images/ultrakor/hero-model.png" },
  { label: "После", imageSrc: "/images/ultrakor/hero-model.png" },
  { label: "До", imageSrc: "/images/ultrakor/hero-model.png" },
  { label: "После", imageSrc: "/images/ultrakor/hero-model.png" },
  { label: "До", imageSrc: "/images/ultrakor/hero-model.png" },
  { label: "После", imageSrc: "/images/ultrakor/hero-model.png" },
];

function VideoTrigger({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button className={`ultrakor-results__video-trigger${active ? " is-active" : ""}`} onClick={onClick} type="button" aria-label="Смотреть видео">
      <span className="ultrakor-results__video-label">Смотреть видео&nbsp;&nbsp;•&nbsp;&nbsp; Смотреть видео&nbsp;&nbsp;•&nbsp;&nbsp;</span>
      <span className="ultrakor-results__play" aria-hidden="true">▶</span>
    </button>
  );
}

export function UltrakorResults() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="ultrakor-results" aria-labelledby="ultrakor-results-title">
      <div className="ultrakor-results__intro">
        <h2 className="ultrakor__heading" id="ultrakor-results-title">На что способен<br /><span>Ультракор</span></h2>
      </div>
      <div className="ultrakor-results__grid">
        {results.map((result, index) => (
          <article className={`ultrakor-results__card${activeIndex === index ? " is-active" : ""}`} key={`${result.label}-${index}`}>
            <Image alt={`Результат мужской атлетизации: ${result.label}`} fill sizes="(max-width: 700px) 50vw, 16vw" src={result.imageSrc} />
            <span className="ultrakor-results__state">{result.label}</span>
            <VideoTrigger active={activeIndex === index} onClick={() => setActiveIndex(activeIndex === index ? null : index)} />
          </article>
        ))}
      </div>
      <p className="ultrakor-results__description">Методика сочетает удаление лишних жировых отложений и точное<br className="ultrakor-results__desktop-break" /> моделирование пропорций с учётом мужской анатомии. Цель — не просто<br className="ultrakor-results__desktop-break" /> уменьшить объём, а сделать силуэт более рельефным и гармоничным.</p>
    </section>
  );
}
