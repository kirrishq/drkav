"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

const safetyItems = [
  ["Ультразвуковой контроль (УЗИ-навигация)", "Процедура липофилинга выполняется под контролем ультразвука. Хирург видит положение канюли в реальном времени, контролирует глубину, слой и распределение тканей. Это позволяет работать с максимальной точностью, избегая повреждения сосудов и мышц, и обеспечивает высочайший уровень безопасности даже при сложной анатомии."],
  ["Опыт хирурга", "Методику проводит врач с большим стажем работы в липоскульптуре и анатомическом моделировании тела. Опыт, основанный на сотнях операций, превращает процесс в ювелирную работу, где каждый миллиметр формы выверен. Опыт — это не годы. Это сотни идеально выполненных тел."],
  ["Строгие протоколы и стерильность", "Мы следуем самым высоким международным стандартам операционной безопасности: стерильная среда, индивидуальный инструментарий, система контроля каждой манипуляции. Каждый пациент проходит полный медицинский чек перед процедурой."],
  ["Комфорт и конфиденциальность", "После операции мужчины размещаются в отдельных палатах премиум-класса:\n2−3-местные палаты — только мужские,\nпо запросу — одноместное размещение.\n\nСпокойствие, комфорт, полная конфиденциальность. Всё, чтобы вы восстанавливались в среде, где чувствуете контроль, а не больницу."],
  ["Наблюдение 24/7", "Медицинская команда контролирует состояние пациента круглосуточно, чтобы восстановление проходило легко и предсказуемо. Каждое изменение фиксируется и анализируется."],
] as const;

function SafetyVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg className="ultrakor-safety__visual ultrakor-safety__visual--scan" viewBox="0 0 320 180" aria-hidden="true">
        <path className="ultrakor-safety__outline" d="M78 151c15-56 28-90 56-112 11-9 28-11 39 2 12 15 20 32 31 47 9 12 24 19 35 31 8 8 12 19 15 32" />
        <path className="ultrakor-safety__scan-path" d="M102 127c18-9 37-12 57-9 22 3 42 13 64 11" />
        <path className="ultrakor-safety__scan-path ultrakor-safety__scan-path--delay" d="M111 101c20-8 40-8 60-2 17 5 31 15 48 18" />
        <line className="ultrakor-safety__scanner" x1="72" y1="32" x2="254" y2="32" />
        <circle className="ultrakor-safety__signal" cx="158" cy="118" r="5" />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg className="ultrakor-safety__visual ultrakor-safety__visual--precision" viewBox="0 0 320 180" aria-hidden="true">
        <circle className="ultrakor-safety__orbit ultrakor-safety__orbit--outer" cx="160" cy="90" r="62" />
        <circle className="ultrakor-safety__orbit ultrakor-safety__orbit--inner" cx="160" cy="90" r="34" />
        <path className="ultrakor-safety__crosshair" d="M160 12v38m0 80v38M82 90h38m80 0h38" />
        <path className="ultrakor-safety__precision-hand" d="M112 125c18-9 29-20 40-37l39-42 14 13-39 43c-14 15-27 26-38 33" />
        <circle className="ultrakor-safety__target" cx="160" cy="90" r="6" />
      </svg>
    );
  }

  if (index === 2) {
    return (
      <svg className="ultrakor-safety__visual ultrakor-safety__visual--protocol" viewBox="0 0 320 180" aria-hidden="true">
        <rect className="ultrakor-safety__document" x="82" y="22" width="156" height="136" />
        {[0, 1, 2, 3].map((item) => (
          <g className={`ultrakor-safety__protocol-row ultrakor-safety__protocol-row--${item + 1}`} key={item}>
            <rect x="102" y={48 + item * 25} width="12" height="12" />
            <path d={`M105 ${54 + item * 25}l4 4 8-10`} />
            <line x1="128" y1={54 + item * 25} x2="215" y2={54 + item * 25} />
          </g>
        ))}
      </svg>
    );
  }

  if (index === 3) {
    return (
      <svg className="ultrakor-safety__visual ultrakor-safety__visual--privacy" viewBox="0 0 320 180" aria-hidden="true">
        <path className="ultrakor-safety__room" d="M55 148V40h210v108M55 70h210" />
        <path className="ultrakor-safety__bed" d="M83 124h150v25H83zm12-27h44c12 0 22 10 22 22v5H95z" />
        <path className="ultrakor-safety__curtain ultrakor-safety__curtain--left" d="M56 41h70c-5 22-7 44-4 66 2 15 1 28-4 41H56z" />
        <path className="ultrakor-safety__curtain ultrakor-safety__curtain--right" d="M264 41h-70c5 22 7 44 4 66-2 15-1 28 4 41h62z" />
        <path className="ultrakor-safety__privacy-lock" d="M151 92v-8a9 9 0 0 1 18 0v8m-23 0h28v25h-28z" />
      </svg>
    );
  }

  return (
    <svg className="ultrakor-safety__visual ultrakor-safety__visual--monitor" viewBox="0 0 320 180" aria-hidden="true">
      <rect className="ultrakor-safety__monitor-frame" x="43" y="29" width="234" height="122" />
      <path className="ultrakor-safety__monitor-grid" d="M43 70h234M43 110h234M90 29v122m47-122v122m47-122v122m47-122v122" />
      <path className="ultrakor-safety__pulse-line" d="M50 96h45l13-21 18 48 20-70 18 43h31l12-20 18 20h45" />
      <circle className="ultrakor-safety__monitor-status" cx="258" cy="47" r="5" />
    </svg>
  );
}

export function UltrakorSafety() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`ultrakor__section ultrakor-safety${visible ? " is-visible" : ""}`} aria-labelledby="ultrakor-safety-title" ref={sectionRef}>
      <div className="ultrakor__inner">
        <h2 className="ultrakor__heading" id="ultrakor-safety-title">Как мы обеспечиваем<br />безопасность</h2>
        <div className="ultrakor-safety__grid">
          {safetyItems.map(([title, text], index) => (
            <article className="ultrakor-safety__card" key={title} style={{ "--safety-index": index } as CSSProperties}>
              <div className="ultrakor-safety__card-top">
                <span>0{index + 1}</span>
              </div>
              <SafetyVisual index={index} />
              <div className="ultrakor-safety__card-copy">
                <h3>{title}</h3>
                {title === "Комфорт и конфиденциальность" ? (
                  <>
                    <p>После операции мужчины размещаются в отдельных палатах премиум-класса:</p>
                    <ul>
                      <li>2−3-местные палаты — только мужские</li>
                      <li>по запросу — одноместное размещение</li>
                    </ul>
                    <p>Спокойствие, комфорт, полная конфиденциальность. Всё, чтобы вы восстанавливались в среде, где чувствуете контроль, а не больницу.</p>
                  </>
                ) : <p>{text}</p>}
              </div>
            </article>
          ))}
        </div>
        <div className="ultrakor-questions__cta ultrakor-safety__cta">
          <h3 className="ultrakor__heading">Безопасность — это не опция.<br />Это фундамент УЛЬТРАКОР</h3>
          <div className="ultrakor-safety__actions">
            <a className="ultrakor__button ultrakor__button--solid" href="/konsultaciya">Записаться на консультацию</a>
            <a className="ultrakor__button ultrakor__button--solid" href="#contact">Задать вопрос</a>
          </div>
        </div>
      </div>
    </section>
  );
}
