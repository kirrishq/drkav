const fixed = (key, publicName, amount, description) => ({ key, internalName: publicName, publicName, priceType: "fixed", amount, currency: "RUB", isActive: true, sortOrder: 0, description });
const range = (key, publicName, minAmount, maxAmount, description) => ({ key, internalName: publicName, publicName, priceType: "range", minAmount, maxAmount, currency: "RUB", isActive: true, sortOrder: 0, description });
const from = (key, publicName, amount, description) => ({ key, internalName: publicName, publicName, priceType: "from", amount, currency: "RUB", isActive: true, sortOrder: 0, description });
const noPrice = (key, publicName, description, priceLabel) => ({ key, internalName: publicName, publicName, priceType: "on-request", currency: "RUB", isActive: true, sortOrder: 0, description, priceLabel });

const sections = [
  {
    sectionKey: "abdomen",
    internalName: "Цены — пластика живота",
    title: "Пластика живота",
    kind: "women-tab",
    sortOrder: 10,
    note: "В ряде случаев доктор также может помочь в коррекции неудовлетворительных результатов операций, выполненных другими хирургами в других клиниках. Стоимость таких случаев рассчитывается индивидуально.",
    entries: [
      fixed("abdomen-diastasis-without-scars", "Диастаз БЕЗ ШРАМОВ. Авторский метод, подтверждённый патентом", 360000, "Устранение диастаза и грыжи через пупочную ямку без дополнительных разрезов внизу живота."),
      fixed("abdomen-abdominoplasty-navel-hernia", "Абдоминопластика с перемещением пупка, устранением грыжи и ушиванием диастаза", 440000, "Коррекция передней брюшной стенки, удаление избытков кожи и жира."),
      fixed("abdomen-mini-without-diastasis", "Миниабдоминопластика без диастаза и ушивания пупочной грыжи", 290000, "Ограниченная подтяжка и коррекция формы передней брюшной стенки."),
      fixed("abdomen-mini-with-diastasis", "Миниабдоминопластика с диастазом и ушиванием пупочной грыжи", 340000, "Ограниченная подтяжка с коррекцией диастаза и ушиванием пупочной грыжи."),
    ],
  },
  {
    sectionKey: "breast",
    internalName: "Цены — пластика груди",
    title: "Пластика груди",
    kind: "women-tab",
    sortOrder: 20,
    entries: [
      fixed("breast-augmentation", "Увеличение груди имплантами", 420000, "Стоимость имплантов включена."),
      fixed("breast-repeat-augmentation", "Повторное увеличение груди (реэндопротезирование)", 470000, "Удаление прежних имплантов и установка новых; стоимость имплантов включена."),
      fixed("breast-mastopexy-without-implants-removal", "Мастопексия с удалением имплантов", 420000, "Подтяжка груди без установки новых имплантов."),
      fixed("breast-mastopexy-with-implants", "Мастопексия с имплантами", 490000, "Подтяжка груди с установкой имплантов."),
      fixed("breast-mastopexy-replacement", "Мастопексия с заменой имплантов", 540000, "Подтяжка, удаление прежних и установка новых имплантов."),
      fixed("breast-mastopexy", "Мастопексия без имплантов", 380000, "Любой вид подтяжки по показаниям."),
      range("breast-reduction", "Редукция груди", 450000, 650000, "Стоимость зависит от объёма и сложности вмешательства."),
    ],
  },
  {
    sectionKey: "lifts",
    internalName: "Цены — подтяжки",
    title: "Подтяжки: торс, руки, бёдра",
    kind: "women-tab",
    sortOrder: 30,
    entries: [
      fixed("lift-body", "Эстетический бодилифт с подтяжкой ягодиц", 940000, "Подтяжка живота, лобка, боков, спины и ягодиц; обычно после существенной потери веса."),
      fixed("lift-buttocks", "Подтяжка ягодиц (глютеопластика)", 320000),
      fixed("lift-thighs", "Подтяжка бёдер (феморопластика)", 320000),
      fixed("lift-arms", "Подтяжка рук (брахиопластика)", 320000),
    ],
  },
  {
    sectionKey: "liposculpture",
    internalName: "Цены — липоскульптура",
    title: "Липоскульптура",
    kind: "women-tab",
    sortOrder: 40,
    entries: [
      fixed("lipo-zone", "Липосакция одной зоны при липоскульптуре PAL", 30000),
      range("lipo-ultrasonic", "Ультразвуковая липосакция", 100000, 200000, "Стоимость зависит от количества зон и объёма вмешательства."),
      fixed("lipo-abs", "Прорисовка пресса", 80000),
      fixed("lipo-shoulders", "Атлетизация плеч и рук", 60000),
    ],
  },
  {
    sectionKey: "lipofilling",
    internalName: "Цены — липофилинг",
    title: "Липофилинг",
    kind: "women-tab",
    sortOrder: 50,
    entries: [
      fixed("lipofilling-breast", "Липофилинг груди", 180000, "Приживаемость жировых клеток индивидуальна; в некоторых случаях требуется несколько этапов."),
      fixed("lipofilling-buttocks", "Липофилинг ягодиц экспертного уровня", 230000, "Выполняется под контролем УЗИ по методике SIME."),
      from("lipofilling-correction", "Корректирующий липофилинг", 60000),
    ],
  },
  {
    sectionKey: "men",
    internalName: "Цены — мужчинам",
    title: "Стоимость операций для",
    accent: "мужчин",
    kind: "standalone",
    sortOrder: 100,
    entries: [
      fixed("men-gynecomastia", "Гинекомастия", 260000, "Устранение истинной гинекомастии периареолярным доступом или липосакцией."),
      fixed("men-lipo-zone", "Липосакция одной зоны при липоскульптуре PAL", 30000, "При комплексных операциях стоимость рассчитывается по количеству зон."),
      range("men-lipo-ultrasonic", "Ультразвуковая липосакция", 100000, 200000, "Стоимость зависит от количества зон и объёма вмешательства."),
      fixed("men-abs", "Прорисовка пресса", 80000),
      fixed("men-chest", "Прорисовка грудных мышц", 80000),
      fixed("men-shoulders", "Атлетизация плеч и рук", 60000),
    ],
  },
  {
    sectionKey: "rf",
    internalName: "Цены — RF-лифтинг Morpheus 8",
    title: "Стоимость",
    accent: "RF-лифтинга Morpheus 8",
    kind: "standalone",
    sortOrder: 110,
    entries: [
      fixed("rf-face", "Лицо", 60000), fixed("rf-eyelids", "Верхние и нижние веки", 35000), fixed("rf-neck", "Шея", 40000), fixed("rf-décolleté", "Декольте", 50000),
      fixed("rf-face-neck-eyelids", "Лицо + шея + веки", 90000), fixed("rf-face-neck", "Лицо + шея (без век)", 75000), fixed("rf-face-neck-décolleté", "Лицо (без век) + шея + декольте", 90000),
      fixed("rf-arms-inner", "Руки: внутренняя поверхность от плеча до локтя", 50000), fixed("rf-knees", "Колени", 50000), fixed("rf-abdomen", "Живот", 55000),
      fixed("rf-thighs-inner", "Внутренняя поверхность бёдер", 60000), fixed("rf-buttocks", "Ягодицы", 75000), fixed("rf-thighs-back", "Задняя поверхность бёдер", 60000),
      fixed("rf-shoulders-back", "Задняя внутренняя поверхность плеч", 50000), fixed("rf-hands", "Кисти рук", 30000), fixed("rf-elbows", "Локти", 30000), fixed("rf-body-zone", "Одна зона 10 × 10 см (тело)", 30000),
    ],
  },
  {
    sectionKey: "additional",
    internalName: "Дополнительные расходы",
    title: "Дополнительно",
    accent: "оплачивается",
    kind: "standalone",
    sortOrder: 120,
    entries: [
      range("additional-anesthesia", "Любой вид наркоза по показаниям", 45000, 55000),
      fixed("additional-inpatient", "Стационар (стоимость за сутки)", 13000),
      fixed("additional-single-room", "Одноместное размещение в палате (стоимость за сутки)", 26000),
      range("additional-early-arrival", "Заселение в клинику накануне вечером", 6500, 13000, "Пожалуйста, предупредите заранее, если приезжаете заблаговременно."),
      noPrice("additional-compression", "Компрессионное бельё и чулки", "Стоимость зависит от вида операции; бельё можно приобрести самостоятельно или заказать через ассистента.", "Цена по запросу"),
      noPrice("additional-tests", "Предоперационное обследование и анализы", "Можно пройти в любой клинике или лаборатории, где вам удобно.", "Цена по запросу"),
      noPrice("additional-dressings", "Перевязки после выписки из стационара", undefined, "Цена по запросу"),
      noPrice("additional-lipo-for-lipofilling", "Липосакция для аспирации жира при липофилинге", "Оплачивается отдельно.", "Цена по запросу"),
    ],
  },
];

export const priceSections = sections;
export const priceItems = sections.flatMap((section) => section.entries);
