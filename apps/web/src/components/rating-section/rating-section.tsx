"use client";

import { cn } from "@drkav/ui";
import { ProdoctorovRatingBanner } from "@/components/prodoctorov-rating-banner/prodoctorov-rating-banner";
import { useEffect, useRef, useState } from "react";

const ratings = [
  { label: "Обследование", value: "Отлично" },
  { label: "Эффективность лечения", value: "Отлично" },
  { label: "Отношение к пациенту", value: "Отлично" },
  { label: "Информирование", value: "Отлично" },
  { label: "Посоветуете ли врача?", value: "Обязательно" },
] as const;

export function RatingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={cn("content-card", "content-card--muted", "content-section", "rating-section", hasStarted && "rating-section--started")}
      id="rating"
      ref={sectionRef}
    >
      <div className="rating-section__header">
        <h2 className="content-card__heading content-card__heading--h2">Рейтинг</h2>
        <ProdoctorovRatingBanner className="rating-section__provider" />
      </div>
      <dl className="rating-section__list">
        {ratings.map((rating) => (
          <div className="rating-section__item" key={rating.label}>
            <div className="rating-section__label-row">
              <dt>{rating.label}</dt>
              <dd>{rating.value}</dd>
            </div>
            <div aria-hidden="true" className="rating-section__track">
              <span className="rating-section__progress" />
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
