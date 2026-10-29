"use client";

import { useEffect, useRef, useState } from "react";

const indications = [
  <>Есть локальные <span>жировые зоны</span>, которые не уходят даже при тренировках</>,
  <>Хочется более <span>собранный и атлетичный силуэт</span> без неестественного эффекта</>,
  <>В теле не хватает визуальной чёткости: <span>плечи, грудь, пресс, талия</span></>,
  <>Нужен заметный результат, а <span>времени на долгую трансформацию мало</span></>,
  <>Важно, чтобы итог выглядел <span>по-мужски и гармонично</span></>,
];

export function UltrakorIndications() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`ultrakor__section ultrakor-indications${visible ? " is-visible" : ""}`} ref={sectionRef} aria-labelledby="ultrakor-indications-title">
      <div className="ultrakor__inner">
        <h2 className="ultrakor__heading" id="ultrakor-indications-title">Кому подходит<br /><span>методика</span></h2>
        <div className="ultrakor-indications__rule ultrakor-indications__rule--top" aria-hidden="true" />
        <div className="ultrakor-indications__grid">
          {indications.map((indication, index) => (
            <p className={`ultrakor-indications__item ultrakor-indications__item--${index + 1}`} key={index}>
              <span className="ultrakor-indications__cross" aria-hidden="true" />
              <span>{indication}</span>
            </p>
          ))}
          <p className="ultrakor-indications__item ultrakor-indications__item--consultation">
            <span className="ultrakor-indications__cross" aria-hidden="true" />
            <span>Нужна <span>консультация врача</span>, чтобы понять, подходит ли методика именно вам</span>
          </p>
        </div>
        <div className="ultrakor-indications__rule ultrakor-indications__rule--bottom" aria-hidden="true" />
      </div>
    </section>
  );
}
