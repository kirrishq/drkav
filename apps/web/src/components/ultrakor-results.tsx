"use client";

import Image from "next/image";
import { ImageGalleryDialog } from "@drkav/ui";
import { useState } from "react";

type Result = {
  label: "До" | "После";
  imageSrc: string;
  videoSrc: string;
  caseId: number;
};

const results: Result[] = [1, 2, 3].flatMap(caseId => [
  { label: "До" as const, caseId, imageSrc: `/images/ultrakor/results/case_${caseId}_before.webp`, videoSrc: `/videos/ultrakor/results/case_${caseId}_before.mp4` },
  { label: "После" as const, caseId, imageSrc: `/images/ultrakor/results/case_${caseId}_after.webp`, videoSrc: `/videos/ultrakor/results/case_${caseId}_after.mp4` },
]);


export function UltrakorResults() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);

  return (
    <section className="ultrakor__section ultrakor-results" aria-labelledby="ultrakor-results-title">
      <div className="ultrakor__inner">
        <div className="ultrakor-results__intro">
          <h2 className="ultrakor__heading" id="ultrakor-results-title">На что способен<br /><span>Ультракор</span></h2>
        </div>
        <div className="ultrakor-results__grid">
          {results.map((result, index) => (
            <article className={`ultrakor-results__card${activeIndex === index ? " is-active" : ""}`} key={`${result.label}-${index}`}>
              <button className="ultrakor-results__photo" type="button" aria-label={`Открыть фото: кейс ${result.caseId}, ${result.label}`} onClick={() => { setActiveIndex(null); setPhotoIndex(index); }}>
                <Image alt={`Результат мужской атлетизации, кейс ${result.caseId}: ${result.label}`} fill sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 16vw" src={result.imageSrc} />
                {activeIndex === index ? <video aria-label={`Кейс ${result.caseId}: ${result.label}`} autoPlay muted loop playsInline preload="none" poster={result.imageSrc} src={result.videoSrc} /> : null}
              </button>
              <span className="ultrakor-results__state">{result.label}</span>
              <button className={`ultrakor-results__video-trigger${activeIndex === index ? " is-active" : ""}`} type="button" aria-label={`Смотреть видео: кейс ${result.caseId}, ${result.label}`} aria-pressed={activeIndex === index}
                onPointerEnter={event => { if (event.pointerType === "mouse" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) setActiveIndex(index); }}
                onPointerLeave={event => { if (event.pointerType === "mouse") setActiveIndex(current => current === index ? null : current); }}
                onClick={event => { if (event.detail > 0 && window.matchMedia("(hover: hover) and (pointer: fine)").matches) setActiveIndex(index); else setActiveIndex(current => current === index ? null : index); }}>
                <span className="ultrakor-results__video-label">Смотреть видео&nbsp;&nbsp;•&nbsp;&nbsp; Смотреть видео&nbsp;&nbsp;•&nbsp;&nbsp;</span>
                <span className="ultrakor-results__play" aria-hidden="true">▶</span>
              </button>
            </article>
          ))}
        </div>
        <p className="ultrakor-results__description">Методика сочетает удаление лишних жировых отложений и точное<br className="ultrakor-results__desktop-break" /> моделирование пропорций с учётом мужской анатомии. Цель — не просто<br className="ultrakor-results__desktop-break" /> уменьшить объём, а сделать силуэт более рельефным и гармоничным.</p>
      </div>
      <ImageGalleryDialog items={results.map(result => ({ src: result.imageSrc, alt: `Результат мужской атлетизации, кейс ${result.caseId}: ${result.label}`, label: `Кейс ${result.caseId} — ${result.label}` }))} index={photoIndex} onIndexChange={setPhotoIndex} onClose={() => setPhotoIndex(null)} />
    </section>
  );
}
