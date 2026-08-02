export const seedVersion = 1;

export const seedSources = [
  "drkav [структура] (1).xlsx / структура сайта seo",
  "operaczii.xlsx / Sheet1",
  "apps/web/src/content/page-registry.ts",
  "https://drkav.ru/ceny/plastika-grudi/uvelichenie-grudi.html",
];

export const siteSettings = {
  siteName: "DrKAV",
  defaultSeo: {
    metaTitle: "Артём Коробов — пластический хирург DrKAV",
    metaDescription:
      "Официальный сайт Артёма Владимировича Коробова: направления операций, цены, фото до/после, отзывы и запись на консультацию.",
    canonicalPath: "/",
    noIndex: false,
  },
};

export const operationCategories = [
  {
    name: "Живот и талия",
    key: "abdomen-and-waist",
    hasLandingPage: true,
    landingPageKey: "operations-abdomen-waist",
  },
  { name: "После родов", key: "postpartum", hasLandingPage: false },
  {
    name: "После похудения",
    key: "after-weight-loss",
    hasLandingPage: false,
  },
  { name: "Пластика груди", key: "breast", hasLandingPage: false },
  { name: "Липофилинг", key: "lipofilling", hasLandingPage: false },
  {
    name: "Мужская атлетизация",
    key: "male-athletic-contouring",
    hasLandingPage: false,
  },
  {
    name: "Коррекция фигуры",
    key: "body-contouring",
    hasLandingPage: false,
  },
  { name: "Липоскульптура", key: "liposculpture", hasLandingPage: false },
  { name: "Липосакция", key: "liposuction", hasLandingPage: false },
  {
    name: "Интимная пластика",
    key: "intimate-surgery",
    hasLandingPage: false,
  },
  {
    name: "Без операции (РФ-лифтинг)",
    key: "non-surgical-rf-lifting",
    hasLandingPage: false,
  },
  { name: "RF-лифтинг", key: "rf-lifting", hasLandingPage: false },
  { name: "Мужчинам", key: "men", hasLandingPage: false },
];

export const staticPages = [
  {
    internalName: "Главная",
    pageKey: "home",
    seo: siteSettings.defaultSeo,
    heading: "Главная",
    contentStatus: "partial",
  },
  {
    internalName: "СМИ",
    pageKey: "about-media",
    seo: {
      metaTitle: "DrKAV в СМИ — статьи и интервью",
      metaDescription:
        "DrKAV в СМИ: подборка статей, интервью и публикаций о работе доктора Коробова и профессиональном опыте в пластической хирургии.",
      canonicalPath: "/obo-mne/smi",
      noIndex: false,
    },
    heading: "СМИ",
    contentStatus: "partial",
  },
  {
    internalName: "Не Школа",
    pageKey: "about-school",
    seo: {
      metaTitle: "Не Школа доктора Коробова — на DrKAV",
      metaDescription:
        "Страница о проекте «Не Школа» доктора Коробова на сайте DrKAV: формат, цели, направления обучения и ссылки на программы.",
      canonicalPath: "/obo-mne/neshkola",
      noIndex: false,
    },
    heading: "Не Школа",
    contentStatus: "partial",
  },
  {
    internalName: "Книга",
    pageKey: "about-book",
    seo: {
      metaTitle: "Книга «Боль двенадцати женщин» — доктор Коробов",
      metaDescription:
        "Книга Артёма Коробова «Боль двенадцати женщин»: описание, доступные форматы и где узнать подробности о покупке/получении.",
      canonicalPath: "/obo-mne/book",
      noIndex: false,
    },
    heading: "Книга",
    contentStatus: "partial",
  },
  {
    internalName: "Интимная пластика или липофилинг рук в подарок",
    pageKey: "promotion-intimate-or-arm-lipofilling",
    seo: {
      metaTitle: "Специальные предложения на операции доктора Коробова А.В.",
      metaDescription: "Интимная пластика или липофилинг рук в подарок | Акции",
      canonicalPath: "/akcii/intimnaya-plastika-ili-lipofiling-ruk-v-podarok",
      noIndex: false,
    },
    heading: "Интимная пластика или липофилинг рук в подарок",
    contentStatus: "empty",
  },
  {
    internalName: "Отзывы",
    pageKey: "reviews",
    seo: {
      metaTitle: "Отзывы — доктор Коробов",
      metaDescription:
        "Отзывы пациентов о докторе Коробове: опыт консультации, операции и восстановления, впечатления и обратная связь.",
      canonicalPath: "/pacientam/otzyvy",
      noIndex: false,
    },
    heading: "Отзывы",
    contentStatus: "partial",
  },
  {
    internalName: "Как всё будет",
    pageKey: "patient-journey",
    seo: {
      metaTitle: "Как всё будет: этапы для пациента — DrKAV",
      metaDescription:
        "Как проходит путь пациента: консультация, подготовка, день операции, наблюдение и восстановление. Понятный план по шагам.",
      canonicalPath: "/pacientam/kak-vse-budet",
      noIndex: false,
    },
    heading: "Как всё будет",
    contentStatus: "partial",
  },
  {
    internalName: "Список анализов",
    pageKey: "tests",
    seo: {
      metaTitle: "Список анализов перед операцией — DrKAV",
      metaDescription:
        "Список анализов и обследований перед операцией: что требуется, сроки актуальности результатов и рекомендации по подготовке к сдаче.",
      canonicalPath: "/pacientam/spisok-analizov",
      noIndex: false,
    },
    heading: "Список анализов",
    contentStatus: "partial",
  },
  {
    internalName: "Безопасность",
    pageKey: "safety",
    seo: {
      metaTitle: "Безопасность операций — DrKAV",
      metaDescription:
        "Безопасность операций: обследования, подготовка, анестезия, контроль состояния и рекомендации для снижения рисков в восстановлении.",
      canonicalPath: "/pacientam/bezopasnost",
      noIndex: false,
    },
    heading: "Безопасность",
    contentStatus: "partial",
  },
  {
    internalName: "До/после",
    pageKey: "before-after",
    seo: {
      metaTitle: "До и после — результаты работ DrKAV",
      metaDescription:
        "Фото «до и после» работ DrKAV: примеры результатов, визуальные изменения и ориентиры для обсуждения на консультации.",
      canonicalPath: "/pacientam/do-i-posle",
      noIndex: false,
    },
    heading: "До/после",
    contentStatus: "partial",
  },
  {
    internalName: "Контакты",
    pageKey: "contacts",
    seo: {
      metaTitle: "Контакты и запись — DrKAV",
      metaDescription:
        "Контакты DrKAV: как записаться на консультацию, способы связи, адрес и информация для планирования визита.",
      canonicalPath: "/kontakty",
      noIndex: false,
    },
    heading: "Контакты",
    contentStatus: "partial",
  },
];

export const operations = [
  {
    internalName: "Восстановление после беременности и родов",
    slug: "plasticheskaya-hirurgiya-posle-rodov",
    canonicalPath: "/operaczii/plasticheskaya-hirurgiya-posle-rodov",
    heading: "Восстановление после беременности и родов",
    seo: {
      metaTitle: "Пластика после родов по низкой цене в Москве | Артем Коробов",
      metaDescription:
        "Пластика после родов по выгодной цене в Москве. Операция проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните!",
      canonicalPath: "/operaczii/plasticheskaya-hirurgiya-posle-rodov",
      noIndex: false,
    },
    categoryKeys: ["abdomen-and-waist", "postpartum"],
    contentStatus: "partial",
  },
  {
    internalName: "Маммопластика",
    slug: "plastika-grudi",
    canonicalPath: "/operaczii/plastika-grudi",
    heading: "Маммопластика",
    seo: {
      metaTitle: "Пластика груди: цены — DrKAV",
      metaDescription:
        "Пластика груди у DrKAV: стоимость, что входит в цену, варианты операций и что обсудить на консультации перед вмешательством.",
      canonicalPath: "/operaczii/plastika-grudi",
      noIndex: false,
    },
    categoryKeys: ["breast"],
    contentStatus: "partial",
  },
  {
    internalName: "Увеличение груди",
    slug: "uvelichenie-grudi",
    canonicalPath: "/operaczii/plastika-grudi/uvelichenie-grudi",
    heading: "Увеличение груди: аугментационная маммопластика",
    heroDescription: "Наслаждайтесь собой и своим телом!",
    seo: {
      metaTitle:
        "Увеличить грудь по низкой цене, увеличение груди в Москве | Артем Коробов",
      metaDescription:
        "Увеличить грудь по выгодной цене в Москве. Увеличение груди профессиональным пластическим хирургом Артемом Коробовым. Звоните!",
      canonicalPath: "/operaczii/plastika-grudi/uvelichenie-grudi",
      noIndex: false,
    },
    categoryKeys: ["breast"],
    contentStatus: "empty",
  },
  {
    internalName: "Подтяжка груди без имплантов",
    slug: "podtyazhka-grudi-bez-implantov",
    canonicalPath: "/operaczii/plastika-grudi/podtyazhka-grudi-bez-implantov",
    heading: "Подтяжка груди без имплантов",
    seo: {
      metaTitle: "Подтяжка груди без имплантов по низкой цене в Москве | Артем Коробов",
      metaDescription:
        "Подтяжка груди без имплантов по выгодной цене в Москве. Операция по подтяжке груди без использования имплантов. Звоните!",
      canonicalPath: "/operaczii/plastika-grudi/podtyazhka-grudi-bez-implantov",
      noIndex: false,
    },
    categoryKeys: ["breast"],
    contentStatus: "empty",
  },
  {
    internalName: "Уменьшение груди",
    slug: "umenshenie-grudi",
    canonicalPath: "/operaczii/plastika-grudi/umenshenie-grudi",
    heading: "Уменьшение груди",
    seo: {
      metaTitle: "Уменьшение груди по низкой цене в Москве у Артема Коробова",
      metaDescription:
        "Уменьшение груди хирургом Артемом Коробовым. Выгодная цена на операцию по уменьшению руди в Москве. Звоните!",
      canonicalPath: "/operaczii/plastika-grudi/umenshenie-grudi",
      noIndex: false,
    },
    categoryKeys: ["breast"],
    contentStatus: "empty",
  },
  {
    internalName: "Удаление имплантов",
    slug: "udalenie-implantov-grudi",
    canonicalPath: "/operaczii/plastika-grudi/udalenie-implantov-grudi",
    heading: "Удаление имплантов",
    seo: {
      metaTitle: "Удаление имплантов груди по выгодной цене в Москве у Артема Коробова",
      metaDescription:
        "Операция по удалению грудных имплантов пластическим хирургом Артемом Коробовым. Выгодная цена на удаление имплантов груди в Москве. Звоните!",
      canonicalPath: "/operaczii/plastika-grudi/udalenie-implantov-grudi",
      noIndex: false,
    },
    categoryKeys: ["breast"],
    contentStatus: "empty",
  },
  {
    internalName: "Липосакция рук",
    slug: "liposakcziya-ruk",
    canonicalPath: "/operaczii/liposakcziya/liposakcziya-ruk",
    heading: "Липосакция рук",
    seo: {
      metaTitle: "Липосакция рук в Москве - удаление жира с рук и коррекция контура",
      metaDescription:
        "Липосакция рук в Москве: удаление жировых отложений в области плеча и предплечья. Классическая и лазерная методика, быстрая реабилитация, консультация хирурга.",
      canonicalPath: "/operaczii/liposakcziya/liposakcziya-ruk",
      noIndex: false,
    },
    categoryKeys: ["body-contouring", "liposuction"],
    contentStatus: "empty",
  },
  {
    internalName: "Липосакция вдовьего горбика",
    slug: "liposakcziya-vdovego-gorbika",
    canonicalPath: "/operaczii/liposakcziya/liposakcziya-vdovego-gorbika",
    heading: "Липосакция вдовьего горбика",
    seo: {
      metaTitle: "Липосакция вдовьего горбика в Москве - убрать холку на шее",
      metaDescription:
        "Липосакция вдовьего горбика в Москве: удаление жирового валика в области шеи и загривка. Минимальные проколы, аккуратная коррекция контура, консультация хирурга.",
      canonicalPath: "/operaczii/liposakcziya/liposakcziya-vdovego-gorbika",
      noIndex: false,
    },
    categoryKeys: ["body-contouring", "liposuction"],
    contentStatus: "empty",
  },
  {
    internalName: "Мужская пластика",
    slug: "muzhskaya-plastika",
    canonicalPath: "/operaczii/muzhskaya-plastika",
    heading: "Мужская пластика",
    seo: {
      metaTitle: "Мужская пластика: цены — DrKAV",
      metaDescription:
        "Мужская пластическая хирургия у DrKAV: направления, ориентиры по стоимости, подготовка и восстановление. Запись на консультацию.",
      canonicalPath: "/operaczii/muzhskaya-plastika",
      noIndex: false,
    },
    categoryKeys: ["men", "male-athletic-contouring"],
    contentStatus: "partial",
  },
];
