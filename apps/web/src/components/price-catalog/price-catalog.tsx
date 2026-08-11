"use client";

import { Tabs, buttonVariants, cn } from "@drkav/ui";
import Link from "next/link";

type PriceEntry = {
  description?: string;
  name: string;
  price?: string;
};

type PriceGroup = {
  entries: readonly PriceEntry[];
  id: string;
  label: string;
};

const womenGroups: readonly PriceGroup[] = [
  {
    id: "abdomen",
    label: "Пластика живота",
    entries: [
      { name: "Диастаз БЕЗ ШРАМОВ. Авторский метод, подтверждённый патентом", description: "Устранение диастаза и грыжи через пупочную ямку без дополнительных разрезов внизу живота.", price: "360 000 ₽" },
      { name: "Абдоминопластика с перемещением пупка, устранением грыжи и ушиванием диастаза", description: "Коррекция передней брюшной стенки, удаление избытков кожи и жира.", price: "440 000 ₽" },
      { name: "Миниабдоминопластика без диастаза и ушивания пупочной грыжи", description: "Ограниченная подтяжка и коррекция формы передней брюшной стенки.", price: "290 000 ₽" },
      { name: "Миниабдоминопластика с диастазом и ушиванием пупочной грыжи", description: "Ограниченная подтяжка с коррекцией диастаза и ушиванием пупочной грыжи.", price: "340 000 ₽" },
    ],
  },
  {
    id: "breast",
    label: "Пластика груди",
    entries: [
      { name: "Увеличение груди имплантами", description: "Стоимость имплантов включена.", price: "420 000 ₽" },
      { name: "Повторное увеличение груди (реэндопротезирование)", description: "Удаление прежних имплантов и установка новых; стоимость имплантов включена.", price: "470 000 ₽" },
      { name: "Мастопексия с удалением имплантов", description: "Подтяжка груди без установки новых имплантов.", price: "420 000 ₽" },
      { name: "Мастопексия с имплантами", description: "Подтяжка груди с установкой имплантов.", price: "490 000 ₽" },
      { name: "Мастопексия с заменой имплантов", description: "Подтяжка, удаление прежних и установка новых имплантов.", price: "540 000 ₽" },
      { name: "Мастопексия без имплантов", description: "Любой вид подтяжки по показаниям.", price: "380 000 ₽" },
      { name: "Редукция груди", description: "Стоимость зависит от объёма и сложности вмешательства.", price: "450 000–650 000 ₽" },
    ],
  },
  {
    id: "lifts",
    label: "Подтяжки: торс, руки, бёдра",
    entries: [
      { name: "Эстетический бодилифт с подтяжкой ягодиц", description: "Подтяжка живота, лобка, боков, спины и ягодиц; обычно после существенной потери веса.", price: "940 000 ₽" },
      { name: "Подтяжка ягодиц (глютеопластика)", price: "320 000 ₽" },
      { name: "Подтяжка бёдер (феморопластика)", price: "320 000 ₽" },
      { name: "Подтяжка рук (брахиопластика)", price: "320 000 ₽" },
    ],
  },
  {
    id: "liposculpture",
    label: "Липоскульптура",
    entries: [
      { name: "Липосакция одной зоны при липоскульптуре PAL", price: "30 000 ₽" },
      { name: "Ультразвуковая липосакция", description: "Стоимость зависит от количества зон и объёма вмешательства.", price: "100 000–200 000 ₽" },
      { name: "Прорисовка пресса", price: "80 000 ₽" },
      { name: "Атлетизация плеч и рук", price: "60 000 ₽" },
    ],
  },
  {
    id: "lipofilling",
    label: "Липофилинг",
    entries: [
      { name: "Липофилинг груди", description: "Приживаемость жировых клеток индивидуальна; в некоторых случаях требуется несколько этапов.", price: "180 000 ₽" },
      { name: "Липофилинг ягодиц экспертного уровня", description: "Выполняется под контролем УЗИ по методике SIME.", price: "230 000 ₽" },
      { name: "Корректирующий липофилинг", price: "от 60 000 ₽" },
    ],
  },
];

const menPrices: readonly PriceEntry[] = [
  { name: "Гинекомастия", description: "Устранение истинной гинекомастии периареолярным доступом или липосакцией.", price: "260 000 ₽" },
  { name: "Липосакция одной зоны при липоскульптуре PAL", description: "При комплексных операциях стоимость рассчитывается по количеству зон.", price: "30 000 ₽" },
  { name: "Ультразвуковая липосакция", description: "Стоимость зависит от количества зон и объёма вмешательства.", price: "100 000–200 000 ₽" },
  { name: "Прорисовка пресса", price: "80 000 ₽" },
  { name: "Прорисовка грудных мышц", price: "80 000 ₽" },
  { name: "Атлетизация плеч и рук", price: "60 000 ₽" },
];

const rfPrices: readonly PriceEntry[] = [
  { name: "Лицо", price: "60 000 ₽" }, { name: "Верхние и нижние веки", price: "35 000 ₽" }, { name: "Шея", price: "40 000 ₽" }, { name: "Декольте", price: "50 000 ₽" },
  { name: "Лицо + шея + веки", price: "90 000 ₽" }, { name: "Лицо + шея (без век)", price: "75 000 ₽" }, { name: "Лицо (без век) + шея + декольте", price: "90 000 ₽" },
  { name: "Руки: внутренняя поверхность от плеча до локтя", price: "50 000 ₽" }, { name: "Колени", price: "50 000 ₽" }, { name: "Живот", price: "55 000 ₽" },
  { name: "Внутренняя поверхность бёдер", price: "60 000 ₽" }, { name: "Ягодицы", price: "75 000 ₽" }, { name: "Задняя поверхность бёдер", price: "60 000 ₽" },
  { name: "Задняя внутренняя поверхность плеч", price: "50 000 ₽" }, { name: "Кисти рук", price: "30 000 ₽" }, { name: "Локти", price: "30 000 ₽" }, { name: "Одна зона 10 × 10 см (тело)", price: "30 000 ₽" },
];

const additionalPrices: readonly PriceEntry[] = [
  { name: "Любой вид наркоза по показаниям", price: "45 000–55 000 ₽" },
  { name: "Стационар (стоимость за сутки)", price: "13 000 ₽" },
  { name: "Одноместное размещение в палате (стоимость за сутки)", price: "26 000 ₽" },
  { name: "Заселение в клинику накануне вечером", description: "Пожалуйста, предупредите заранее, если приезжаете заблаговременно.", price: "6 500–13 000 ₽" },
  { name: "Компрессионное бельё и чулки", description: "Стоимость зависит от вида операции; бельё можно приобрести самостоятельно или заказать через ассистента." },
  { name: "Предоперационное обследование и анализы", description: "Можно пройти в любой клинике или лаборатории, где вам удобно." },
  { name: "Перевязки после выписки из стационара" },
  { name: "Липосакция для аспирации жира при липофилинге", description: "Оплачивается отдельно." },
];

function PriceList({ entries }: { entries: readonly PriceEntry[] }) {
  return <ul className="price-catalog__list">{entries.map((entry) => <li className="price-catalog__item" key={entry.name}><div><h3 className="card-title price-catalog__item-name">{entry.name}</h3>{entry.description ? <p className="price-catalog__item-description">{entry.description}</p> : null}</div>{entry.price ? <p className="price-catalog__item-value">{entry.price}</p> : null}</li>)}</ul>;
}

function ConsultationCallout() {
  return <div className="price-catalog__callout"><p>Запишитесь на консультацию, если у вас возникли вопросы</p><Link className={cn(buttonVariants({ size: "sm", variant: "primary" }))} href="/konsultaciya">Записаться</Link></div>;
}

function PriceSection({ accent, entries, title }: { accent?: string; entries: readonly PriceEntry[]; title: string }) {
  return <section className="price-catalog__section"><h2 className="type-h2 price-catalog__heading">{title}{accent ? <span> {accent}</span> : null}</h2><div className="price-catalog__panel"><PriceList entries={entries} /><ConsultationCallout /></div></section>;
}

export function PriceCatalog() {
  const tabs = womenGroups.map((group) => ({ content: <div className="price-catalog__panel"><PriceList entries={group.entries} /><ConsultationCallout /></div>, id: group.id, label: group.label }));

  return <div className="price-catalog">
    <section className="price-catalog__section">
      <h2 className="type-h2 price-catalog__heading">Стоимость операций для <span>женщин</span></h2>
      <p className="price-catalog__note">В ряде случаев доктор также может помочь в коррекции неудовлетворительных результатов операций, выполненных другими хирургами в других клиниках. Стоимость таких случаев рассчитывается индивидуально.</p>
      <Tabs ariaLabel="Разделы стоимости операций для женщин" defaultTabId="abdomen" items={tabs} />
    </section>
    <PriceSection accent="мужчин" entries={menPrices} title="Стоимость операций для" />
    <PriceSection accent="RF-лифтинга Morpheus 8" entries={rfPrices} title="Стоимость" />
    <PriceSection accent="оплачивается" entries={additionalPrices} title="Дополнительно" />
  </div>;
}
