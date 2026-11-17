"use client";

import Image from "next/image";
import { useState } from "react";
import { UltrakorSkipArrow } from "@/components/ultrakor-arrow";
import { formatUltrakorPrice, ultrakorZones } from "@/content/ultrakor-zones";

const included = [
  "Сама операция",
  "Дополнительная онлайн или очная консультация",
  "Разъяснения, ведение пациента до и после операции",
  "Контроль гемоглобина в стационаре после операции",
  "Контроль послеоперационного реабилитационного периода (очно в клинике или дистанционно через мессенджеры или директ)",
  "Послеоперационные осмотры (запись обязательна)",
  "Плановые осмотры в 1, 3 и 6 мес (запись обязательна)",
  "Выдача всех рекомендаций",
  "Контроль состояния пациента после операции",
  "Набор медикаментов на первые 3 дня после выписки (чтобы не ходить в аптеку)",
];

const additional = [
  "Наркоз 65.000−80.000 рублей (любой вид наркоза по показаниям)",
  "Стационар 16.000 рублей в сутки. Одноместное размещение в палате 32.000 рублей в сутки. Услуги личной медсестры 16.000 рублей в сутки",
  "Компрессионное белье и чулки в зависимости от вида операции",
  "Предоперационное обследование и анализы",
  "Перевязки после выписки из стационара",
  "Стоимость липосакции для аспирации жира для липофилинга оплачивается отдельно",
];

function OfferRow({ title, items }: { title: string; items: readonly string[] }) {
  const [open, setOpen] = useState(false);
  return <section className={`ultrakor-pricing__offer${open ? " is-open" : ""}`}>
    <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
      <span>{title}</span><span aria-hidden="true">+</span>
    </button>
    <div className="ultrakor-pricing__offer-content" aria-hidden={!open}>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  </section>;
}

export function UltrakorPricing() {
  return <section className="ultrakor__section ultrakor-pricing" aria-labelledby="ultrakor-pricing-title">
    <div className="ultrakor__inner">
      <h2 className="ultrakor__heading" id="ultrakor-pricing-title">Стоимость</h2>
      <div className="ultrakor-pricing__offer-note ultrakor-pricing__offer-note--intro">
        <p>Не является публичной офертой. Цены, указанные на сайте являются ориентировочными. Стоимость операции рассчитывается доктором в индивидуальном порядке после консультации любого формата. Операция на всех этапах проходит лично Артём Владимирович Коробов.</p>
      </div>
      <div className="ultrakor-pricing__prices">
        {ultrakorZones.map(({ slug, title, amount, imageSrc }) => (
          <article className="ultrakor-pricing__card" key={slug}>
            <Image
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 701px) 50vw, 100vw"
              src={imageSrc}
            />
            <div className="ultrakor-pricing__card-content">
              <h3>{title}</h3>
              <p>{formatUltrakorPrice(amount)}</p>
              <a className="ultrakor__button ultrakor__button--outline" href={`/ultrakor/${slug}`}>
                Подробнее <UltrakorSkipArrow /><span className="sr-only">: {title}</span>
              </a>
            </div>
          </article>
        ))}
      </div>
      <div className="ultrakor-pricing__offer-note ultrakor-pricing__offer-note--after-prices">
        <p>Внимание! Доктор Коробов также может помочь в коррекции неудовлетворительных результатов операций, которые были выполнены другими хирургами в других клиниках. Стоимость в таких случаях рассчитывается индивидуально и, как правило, составляет +30%.</p>
      </div>
      <div className="ultrakor-pricing__offers">
        <OfferRow title="Что входит в стоимость?" items={included} />
        <OfferRow title="Дополнительно оплачивается" items={additional} />
      </div>
    </div>
  </section>;
}
