import type { Metadata } from "next";

import { toMetadata, type SeoData } from "./seo";

export type PageRegistryItem = {
  key: string;
  name?: string;
  route: string;
  kind: "static" | "operation" | "listing" | "dynamic-template";
  section: string;
  group?: string;
  groups?: readonly string[];
  legacyRoutes?: readonly string[];
  seo?: SeoData;
  contentStatus: "existing" | "partial" | "scaffold" | "cms" | "cms-template";
  contentSource?: "registry" | "cms";
};

const page = (item: PageRegistryItem): PageRegistryItem => item;

export const pageRegistry = [
  page({
    key: "home",
    name: "Главная",
    route: "/",
    kind: "static",
    section: "Главная",
    seo: {
      title: "Артём Коробов — пластический хирург DrKAV",
      description: "Официальный сайт Артёма Владимировича Коробова: направления операций, цены, фото до/после, отзывы и запись на консультацию.",
      canonicalPath: "/",
      noIndex: false,
    },
    contentStatus: "partial",
  }),
  page({ key: "about", name: "Обо мне", route: "/obo-mne", kind: "listing", section: "Обо мне", contentStatus: "existing" }),
  page({
    key: "about-publications",
    name: "Научная деятельность",
    route: "/obo-mne/publikacii",
    kind: "listing",
    section: "Обо мне",
    legacyRoutes: ["/obo-mne/publikacii.html"],
    seo: { title: "Научная деятельность", description: "Научная деятельность доктора Коробова", canonicalPath: "/obo-mne/publikacii" },
    contentStatus: "existing",
  }),
  page({
    key: "about-media",
    name: "СМИ",
    route: "/obo-mne/smi",
    kind: "listing",
    section: "Обо мне",
    legacyRoutes: ["/smi/smi.html", "/obo-mne/smi-i-proekty"],
    seo: {
      title: "DrKAV в СМИ — статьи и интервью",
      description: "DrKAV в СМИ: подборка статей, интервью и публикаций о работе доктора Коробова и профессиональном опыте в пластической хирургии.",
      canonicalPath: "/obo-mne/smi",
    },
    contentStatus: "existing",
  }),
  page({
    key: "about-speaking",
    name: "Выступления",
    route: "/obo-mne/vystupleniya",
    kind: "listing",
    section: "Обо мне",
    legacyRoutes: ["/obo-mne/vystupleniya.html"],
    seo: { title: "Выступления", description: "Специализация", canonicalPath: "/obo-mne/vystupleniya" },
    contentStatus: "existing",
  }),
  page({
    key: "about-school",
    name: "Не Школа",
    route: "/obo-mne/neshkola",
    kind: "static",
    section: "Обо мне",
    legacyRoutes: ["/obo-mne/neschool.html", "/obo-mne/obuchenie"],
    seo: {
      title: "Не Школа доктора Коробова — на DrKAV",
      description: "Страница о проекте «Не Школа» доктора Коробова на сайте DrKAV: формат, цели, направления обучения и ссылки на программы.",
      canonicalPath: "/obo-mne/neshkola",
    },
    contentStatus: "existing",
  }),
  page({
    key: "about-book",
    name: "Книга",
    route: "/obo-mne/book",
    kind: "static",
    section: "Обо мне",
    legacyRoutes: ["/obo-mne/book.html"],
    seo: {
      title: "Книга «Боль двенадцати женщин» — доктор Коробов",
      description: "Книга Артёма Коробова «Боль двенадцати женщин»: описание, доступные форматы и где узнать подробности о покупке/получении.",
      canonicalPath: "/obo-mne/book",
    },
    contentStatus: "existing",
  }),
  page({ key: "about-credentials", name: "Дипломы и лицензии", route: "/obo-mne/diplomy-i-licenzii", kind: "static", section: "Обо мне", contentStatus: "partial" }),
  page({ key: "consultation", name: "Консультация", route: "/konsultaciya", kind: "listing", section: "Консультация", contentStatus: "scaffold" }),
  page({
    key: "consultation-in-person",
    name: "Очная консультация",
    route: "/konsultacii/ochnaya-konsultaciya-v-klinike",
    kind: "static",
    section: "Консультация",
    legacyRoutes: ["/konsultacii/ochnaya-konsultaciya-v-klinike.html"],
    seo: {
      title: "Консультация пластического хирурга в Москве - запись на прием к пластическому хирургу | Артем Коробов",
      description: "Консультация пластического хирурга по низкой цене в Москве. Прием проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните!",
      canonicalPath: "/konsultacii/ochnaya-konsultaciya-v-klinike",
    },
    contentStatus: "scaffold",
  }),
  page({ key: "consultation-online", name: "Онлайн-консультация", route: "/konsultacii/onlayn-konsultaciya", kind: "static", section: "Консультация", legacyRoutes: ["/konsultacii/onlayn-konsultaciya.html"], contentStatus: "scaffold" }),
  page({ key: "consultation-form", name: "Консультация по анкете", route: "/konsultacii/konsultaciya-po-ankete", kind: "static", section: "Консультация", legacyRoutes: ["/konsultacii/konsultaciya-po-ankete.html"], contentStatus: "scaffold" }),
  page({
    key: "promotions",
    name: "Акции",
    route: "/akcii",
    kind: "listing",
    section: "Акции",
    legacyRoutes: ["/akcii.html"],
    seo: { title: "Акции и подарки от Артема Коробова", description: "Актуальные специальные предложения и подарки при записи на операции. Условия и возможность совмещения акций уточняйте у администратора.", canonicalPath: "/akcii" },
    contentStatus: "partial",
  }),
  page({
    key: "promotion-intimate-or-arm-lipofilling",
    name: "Интимная пластика или липофилинг рук в подарок",
    route: "/akcii/intimnaya-plastika-ili-lipofiling-ruk-v-podarok",
    kind: "static",
    section: "Акции",
    legacyRoutes: ["/akcii/intimnaya-plastika-ili-lipofiling-ruk-v-podarok.html"],
    seo: {
      title: "Интимная пластика или липофилинг рук в подарок",
      description: "При записи на операцию в декабре — интимная пластика или липофилинг кистей рук в подарок, по показаниям врача.",
      canonicalPath: "/akcii/intimnaya-plastika-ili-lipofiling-ruk-v-podarok",
    },
    contentStatus: "scaffold",
  }),
  page({ key: "promotion-template", name: "Акция", route: "/akcii/[slug]", kind: "dynamic-template", section: "Акции", contentStatus: "cms-template" }),
  page({
    key: "prices",
    name: "Цены",
    route: "/ceny",
    kind: "static",
    section: "Цены",
    legacyRoutes: ["/ceny.html"],
    seo: { title: "Стоимость операций", description: "Стоимость операций", canonicalPath: "/ceny" },
    contentStatus: "partial",
  }),
  page({ key: "operations", name: "Операции", route: "/operaczii", kind: "listing", section: "Операции", legacyRoutes: ["/operacii"], contentStatus: "partial" }),
  page({ key: "operations-abdomen-waist", name: "Живот и талия", route: "/operaczii/zhivot-i-taliya", kind: "listing", section: "Операции", legacyRoutes: ["/operacii/zhivot-i-taliya"], contentStatus: "partial" }),
  page({
    key: "operation-postpartum",
    name: "Восстановление после беременности и родов",
    route: "/operaczii/plasticheskaya-hirurgiya-posle-rodov",
    kind: "operation",
    section: "Операции",
    groups: ["Живот и талия", "После родов"],
    legacyRoutes: ["/ceny/plasticheskaya-hirurgiya-posle-rodov.html", "/operacii/posle-rodov"],
    seo: {
      title: "Пластика после родов по низкой цене в Москве | Артем Коробов",
      description: "Пластика после родов по выгодной цене в Москве. Операция проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните!",
      canonicalPath: "/operaczii/plasticheskaya-hirurgiya-posle-rodov",
    },
    contentStatus: "partial",
  }),
  page({
    key: "operation-after-weight-loss",
    name: "Пластика после бариатрических операций и массивного похудения",
    route: "/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya",
    kind: "operation",
    section: "Операции",
    groups: ["Живот и талия", "После похудения"],
    legacyRoutes: ["/ceny/plasticheskaya-hirurgiya-posle-pohudeniya.html", "/operacii/posle-pohudeniya"],
    seo: {
      title: "Пластика после похудения - операция по удалению кожи после похудения в Москве | Артем Коробов",
      description: "Операция по удалению кожи после похудения по выгодной цене в Москве. Профессиональная пластика после похудения от пластического хирурга Артема Коробова. Звоните!",
      canonicalPath: "/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya",
    },
    contentStatus: "partial",
  }),
] satisfies readonly PageRegistryItem[];

const operationRegistry = [
  ["breast", "Маммопластика", "/operaczii/plastika-grudi", "Грудь", "Грудь главная", "Пластика груди: цены — DrKAV", "Пластика груди у DrKAV: стоимость, что входит в цену, варианты операций и что обсудить на консультации перед вмешательством.", ["/ceny/plastika-grudi.html", "/operacii/grud"], "partial"],
  ["breast-lift", "Подтяжка груди без имплантов", "/operaczii/plastika-grudi/podtyazhka-grudi-bez-implantov", "Грудь", "Пластика груди", "Подтяжка груди без имплантов по низкой цене в Москве | Артем Коробов", "Подтяжка груди без имплантов по выгодной цене в Москве. Операция по подтяжке груди без использования имплантов. Звоните!", ["/ceny/podtyazhka-grudi-bez-implantov.html", "/ceny/plastika-grudi/podtyazhka-grudi-bez-implantov.html"], "scaffold"],
  ["breast-reduction", "Уменьшение груди", "/operaczii/plastika-grudi/umenshenie-grudi", "Грудь", "Пластика груди", "Уменьшение груди по низкой цене в Москве у Артема Коробова", "Уменьшение груди хирургом Артемом Коробовым. Выгодная цена на операцию по уменьшению руди в Москве. Звоните!", ["/ceny/umenshenie-grudi.html", "/ceny/plastika-grudi/umenshenie-grudi.html", "/operaczii/umenshenie-grudi"], "scaffold"],
  ["breast-asymmetry", "Коррекция асимметрии груди", "/operaczii/plastika-grudi/asimmetriya-grudi", "Грудь", "Пластика груди", "Асимметрия груди - операция по исправлению асимметрии груди в Москве, низкая цена | Артем Коробов", "Операция по исправлению асимметрии груди пластическим хирургом Артемом Коробовым. Выгодная цена на коррекцию груди в Москве. Звоните!", ["/ceny/plastika-grudi/asimmetriya-grudi.html"], "scaffold"],
  ["breast-implant-removal", "Удаление имплантов", "/operaczii/plastika-grudi/udalenie-implantov-grudi", "Грудь", "Пластика груди", "Удаление имплантов груди по выгодной цене в Москве у Артема Коробова", "Операция по удалению грудных имплантов пластическим хирургом Артемом Коробовым. Выгодная цена на удаление имплантов груди в Москве. Звоните!", ["/ceny/plastika-grudi/udalenie-implantov-grudi.html"], "scaffold"],
  ["breast-reconstruction", "Реконструкция груди", "/operaczii/plastika-grudi/rekonstrukciya-grudi", "Грудь", "Пластика груди", "Реконструкция груди после мастэктомии по низкой цене, восстановлении груди в Москве | Артем Коробов", "Реконструкция груди по выгодной цене в Москве. Восстановлении груди после мастэктомии профессиональным пластическим хирургом Артемом Коробовым. Звоните!", ["/ceny/plastika-grudi/rekonstrukciya-grudi.html"], "scaffold"],
  ["breast-lipofilling", "Липофилинг груди", "/operaczii/lipofiling/lipofiling-grudi", "Грудь", "Липофилинг", "Липофилинг груди по низкой цене - записаться на процедуру липофилинга груди в Москве | Артем Коробов", "Липофилинг груди по выгодной цене в Москве. Операция липофилинга груди проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните!", ["/ceny/lipofiling/lipofiling-grudi.html"], "scaffold"],
  ["abdominoplasty", "Абдоминопластика", "/operaczii/abdominoplastika", "Живот и талия", undefined, "Абдоминопластика в Москве - сделать пластику живота по низкой цене | Артем Коробов", "Как проходит абдоминопластика: показания и противопоказания, виды операции, этапы подготовки и восстановления. Узнайте, кому подходит процедура и как добиться лучших результатов.", ["/ceny/abdominoplastika.html"], "scaffold"],
  ["diastasis", "Диастаза без шрамов", "/operaczii/diastaz-myshc-zhivota", "Живот и талия", undefined, "Ушивание диастаза без шрамов - операция лапароскопического ушивания диастаза в Москве | Артем Коробов", "Лапароскопическое ушивание диастаза по выгодной цене в Москве. Операция по ушиванию диастаза без шрамов. Авторская методика! Звоните!", ["/ceny/diastaz-myshc-zhivota.html", "/operacii/diastaz-myshc-zhivota"], "partial"],
  ["male-abdominoplasty", "Пластика живота для мужчин", "/operaczii/muzhskaya-plastika/abdominoplastika-dlya-muzhchin", "Живот и талия", "Мужская атлетизация", "Абдоминопластика живота для мужчин по низкой цене в Москве | Артем Коробов", "Пластика живота для мужчин по выгодной цене в Москве. Мужская абдоминопластика профессиональным пластическим хирургом Артемом Коробовым. Звоните!", ["/muzhskaya-plastika/abdominoplastika-dlya-muzhchin.html", "/ceny/muzhskaya-plastika/abdominoplastika-dlya-muzhchin.html"], "scaffold"],
  ["body-contouring", "Коррекция фигуры", "/operaczii/liposkulptura", "Коррекция фигуры", "Липоскульптура (главная)", "Липоскульптура по низкой цене - записаться на процедуру липомоделирования в Москве | Артем Коробов", "Липомоделирование по выгодной цене в Москве. Процедура липоскульптуры проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните!", ["/ceny/liposkulptura.html", "/operacii/korrekciya-figury"], "partial"],
  ["buttock-lift", "Подтяжка ягодиц", "/operaczii/liposkulptura/podtyazhka-yagodic", "Коррекция фигуры", "Липоскульптура", "Подтяжка ягодиц в Москве - сдлеать глютеопластика по низкой цене | Артем Коробов", "Подтяжка ягодиц в Москве пластическим хирургом Артемом Коробовым. Многолетний опыт, довольные пациенты, выгодные цены! Запись на консультацию.", ["/ceny/liposkulptura/podtyazhka-yagodic.html", "/operaczii/podtyazhka-yagodic"], "scaffold"],
  ["thigh-lift", "Подтяжка бедер", "/operaczii/liposkulptura/podtyazhka-beder", "Коррекция фигуры", "Липоскульптура", "Подтяжка бедер в Москве - сдлеать феморопластику по низкой цене | Артем Коробов", "Подтяжка бедер в Москве пластическим хирургом Артемом Коробовым. Многолетний опыт, довольные пациенты, выгодные цены! Запись на консультацию.", ["/ceny/liposkulptura/podtyazhka-beder.html", "/operaczii/podtyazhka-beder"], "scaffold"],
  ["arm-lift", "Подтяжка рук", "/operaczii/liposkulptura/podtyazhka-ruk", "Коррекция фигуры", "Липоскульптура", "Подтяжка рук в Москве - сдлеать брахиопластику по низкой цене | Артем Коробов", "Подтяжка рук в Москве пластическим хирургом Артемом Коробовым. Многолетний опыт, довольные пациенты, выгодные цены! Запись на консультацию.", ["/ceny/liposkulptura/podtyazhka-ruk.html", "/operaczii/podtyazhka-ruk"], "scaffold"],
  ["ultrasonic-liposuction", "Ультразвуковая липосакция", "/operaczii/liposkulptura/ultrazvukovaya-liposakciya", "Коррекция фигуры", "Липоскульптура", "Ультразвуковая липосакция в Москве - сдлеать ультразвуковую липосакцию по низкой цене | Артем Коробов", "Ультразвуковая липосакция в Москве пластическим хирургом Артемом Коробовым. Многолетний опыт, довольные пациенты, выгодные цены! Запись на консультацию.", ["/ceny/liposkulptura/ultrazvukovaya-liposakciya.html", "/operaczii/ultrazvukovaya-liposakciya"], "scaffold"],
  ["lipofilling", "Липофилинг", "/operaczii/lipofiling", "Коррекция фигуры", "Липофилинг, главная", "Липофилинг по низкой цене - записаться на процедуру липофилинга в Москве | Артем Коробов", "Липофилинг по выгодной цене в Москве. Операция проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните!", ["/ceny/lipofiling.html"], "scaffold"],
  ["buttock-lipofilling", "Липофилинг ягодиц", "/operaczii/lipofiling/lipofiling-yagodic", "Коррекция фигуры", "Липофилинг", "Липофилинг ягодиц по низкой цене - записаться на процедуру липофилинга ягодиц в Москве | Артем Коробов", "Липофилинг ягодиц по выгодной цене в Москве. Операция липофилинга ягодиц проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните!", ["/ceny/lipofiling/lipofiling-yagodic.html"], "scaffold"],
  ["arm-liposuction", "Липосакция рук", "/operaczii/liposakcziya/liposakcziya-ruk", "Коррекция фигуры", "Липосакция", "Липосакция рук в Москве - удаление жира с рук и коррекция контура", "Липосакция рук в Москве: удаление жировых отложений в области плеча и предплечья. Классическая и лазерная методика, быстрая реабилитация, консультация хирурга.", ["/ceny/liposakcziya/liposakcziya-ruk.html"], "scaffold"],
  ["back-liposuction", "Липосакция спины", "/operaczii/liposakcziya/liposakcziya-spiny", "Коррекция фигуры", "Липосакция", "Липосакция спины в Москве - удаление жира со спины и боков, методы и цена", "Липосакция спины в Москве: удаление жировых отложений на спине и боках. Современные методы, аккуратная коррекция контура, консультация пластического хирурга.", ["/ceny/liposakcziya/liposakcziya-spiny.html"], "scaffold"],
  ["buffalo-hump-liposuction", "Липосакция вдовьего горбика", "/operaczii/liposakcziya/liposakcziya-vdovego-gorbika", "Коррекция фигуры", "Липосакция", "Липосакция вдовьего горбика в Москве - убрать холку на шее", "Липосакция вдовьего горбика в Москве: удаление жирового валика в области шеи и загривка. Минимальные проколы, аккуратная коррекция контура, консультация хирурга.", ["/ceny/liposakcziya/liposakcziya-vdovego-gorbika.html"], "scaffold"],
  ["intimate-surgery", "Интимная пластика", "/operaczii/intimnaya-plastika", "Интимная пластика", undefined, "Интимная пластика в Москве, сделать лабиопластику (пластику интимной зоны) по выгодной цене | Артем Коробов", "Пластика интимной зоны: лабиопластика, коррекция формы и объема, восстановление после родов и возрастных изменений. Запись на консультацию перед интимной пластикой в Москве.", ["/ceny/intimnaya-plastika.html", "/operacii/intimnaya-plastika"], "partial"],
  ["rf-lifting", "Без операции (РФ-лифтинг)", "/operaczii/rf-lifting", "Без операции (РФ-лифтинг)", "RF-лифтинг, главная", "RF лифтинг по низкой цене - записаться на процедуру микроигольчатого РФ лифтинга в Москве | Артем Коробов", "Микроигольчатый RF лифтинг по выгодной цене в Москве. Процедура РФ лифтинга проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните!", ["/ceny/rf-lifting.html", "/operacii/bez-operacii/rf-lifting"], "partial"],
  ["rf-body", "RF-лифтинг тела", "/operaczii/rf-lifting/rf-lifting-tela", "Без операции (РФ-лифтинг)", "RF-лифтинг", "RF лифтинг тела по низкой цене - записаться на процедуру микроигольчатого РФ лифтинга тела в Москве | Артем Коробов", "Микроигольчатый RF лифтинг тела по выгодной цене в Москве. Процедура РФ-лифтинга тела проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните!", ["/ceny/rf-lifting/rf-lifting-tela.html"], "scaffold"],
  ["rf-abdomen", "RF-лифтинг живота", "/operaczii/rf-lifting/rf-lifting-zhivota", "Без операции (РФ-лифтинг)", "RF-лифтинг", "RF лифтинг живота по низкой цене - записаться на процедуру микроигольчатого РФ лифтинга живота в Москве | Артем Коробов", "Микроигольчатый RF лифтинг живота по выгодной цене в Москве. Процедура РФ лифтинга живота проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните!", ["/ceny/rf-lifting/rf-lifting-zhivota.html"], "scaffold"],
  ["rf-neck", "RF-лифтинг шеи и декольте", "/operaczii/rf-lifting/rf-lifting-shei-i-dekolte", "Без операции (РФ-лифтинг)", "RF-лифтинг", "RF лифтинг шеи и декольте по низкой цене - записаться на процедуру микроигольчатого РФ лифтинга шеи и декольте в Москве | Артем Коробов", "Микроигольчатый RF лифтинг шеи и декольте по выгодной цене в Москве. Процедура РФ лифтинга шеи и декольте проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните!", ["/ceny/rf-lifting/rf-lifting-shei-i-dekolte.html"], "scaffold"],
  ["rf-morpheus", "RF-лифтинг Morpheus 8", "/operaczii/rf-lifting/rf-lifting-morpheus-8", "Без операции (РФ-лифтинг)", "RF-лифтинг", "RF лифтинг Morpheus 8 по низкой цене - записаться на процедуру микроигольчатого РФ лифтинга Морфеус 8 в Москве | Артем Коробов", "Микроигольчатый RF лифтинг Morpheus 8 по выгодной цене в Москве. Процедура РФ лифтинга Morpheus 8 проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните!", ["/ceny/rf-lifting/rf-lifting-morpheus-8.html"], "scaffold"],
  ["male-surgery", "Мужская пластика", "/operaczii/muzhskaya-plastika", "Мужчинам", "Мужская атлетизация, Главная", "Мужская пластика: цены — DrKAV", "Мужская пластическая хирургия у DrKAV: направления, ориентиры по стоимости, подготовка и восстановление. Запись на консультацию.", ["/muzhskaya-plastika.html", "/ceny/muzhskaya-plastika.html", "/operacii/muzhchinam"], "partial"],
  ["gynecomastia", "Уменьшение мужской груди", "/operaczii/muzhskaya-plastika/ginekomastiya", "Мужчинам", "Мужская атлетизация", "Лечение гинекомастии в Москве у Артема Коробова - низкая цена", "Операция по удалению гинекомастии пластическим хирургом Артемом Коробовым. Выгодная цена на лечение гинекомастии в Москве. Звоните!", ["/muzhskaya-plastika/ginekomastiya.html", "/ceny/muzhskaya-plastika/ginekomastiya.html"], "scaffold"],
  ["gynecomastia-treatment", "Лечение гинекомастии", "/operaczii/muzhskaya-plastika/lechenie-ginekompastii", "Мужчинам", "Мужская атлетизация", "Лечение гинекомастии: цены — DrKAV", "Лечение гинекомастии у DrKAV: варианты тактики, стоимость, подготовка, особенности восстановления и запись на консультацию.", ["/ceny/lechenie-ginekompastii.html", "/operaczii/lechenie-ginekompastii"], "scaffold"],
  ["male-ab-definition", "Прорисовка пресса", "/operaczii/muzhskaya-plastika/prorisovka-pressa", "Мужчинам", "Мужская атлетизация", "Прорисовка пресса мужчинам - низкая цена в Москве | Артем Коробов", "Операция по прорисовке пресса мужчинам пластическим хирургом Артемом Коробовым. Выгодная цена на прорисовку пресса в Москве. Звоните!", ["/muzhskaya-plastika/prorisovka-pressa.html", "/ceny/muzhskaya-plastika/prorisovka-pressa.html"], "scaffold"],
  ["male-shoulders-arms", "Атлетизация плеч и рук", "/operaczii/muzhskaya-plastika/atletizaciya-plech-i-ruk", "Мужчинам", "Мужская атлетизация", "Атлетизация плеч и рук для мужчин по низкой цене в Москве | Артем Коробов", "Атлетизация плеч и рук для мужчин по выгодной цене в Москве. Мужская атлетизация рук и плеч профессиональным пластическим хирургом Артемом Коробовым. Звоните!", ["/muzhskaya-plastika/atletizaciya-plech-i-ruk.html", "/ceny/muzhskaya-plastika/atletizaciya-plech-i-ruk.html"], "scaffold"],
  ["male-buttock-thigh-lift", "Мужская подтяжка ягодиц или бедер", "/operaczii/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder", "Мужчинам", "Мужская атлетизация", "Подтяжка ягодиц или бедер мужчинам у Артема Коробова - низкая цена в Москве", "Пластичекая подтяжка ягодиц и бедер хирургом Артемом Коробовым. Выгодная цена на операцию по подтяжке бедер и ягодиц в Москве. Звоните!", ["/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder.html", "/ceny/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder.html"], "scaffold"],
  ["male-body-lift", "Бодилифтинг для мужчин", "/operaczii/muzhskaya-plastika/bodilifting-dlya-muzhchin", "Мужчинам", "Мужская атлетизация", "Бодилифтинг (торсопластика) для мужчин у Артема Коробова в Москве, низкая цена", "Торсопластика для мужчин по выгодной цене в Москве. Мужской бодилифтинг профессиональным пластическим хирургом Артемом Коробовым. Звоните!", ["/muzhskaya-plastika/bodilifting-dlya-muzhchin.html", "/ceny/muzhskaya-plastika/bodilifting-dlya-muzhchin.html"], "scaffold"],
  ["male-chest-definition", "Прорисовка грудных мышц", "/operaczii/muzhskaya-plastika/prorisovka-grudnykh-myshcz", "Мужчинам", "Мужская атлетизация", undefined, undefined, [], "scaffold"],
] as const;

export const operationPages: readonly PageRegistryItem[] = operationRegistry.map(([
  key,
  name,
  route,
  sectionGroup,
  group,
  title,
  description,
  legacyRoutes,
  contentStatus,
]) => ({
  key: `operation-${key}`,
  name,
  route,
  kind: "operation",
  section: "Операции",
  group,
  groups: [sectionGroup],
  legacyRoutes,
  seo: title && description ? { title, description, canonicalPath: route, noIndex: false } : undefined,
  contentStatus,
}));

const cmsOperationPages: readonly PageRegistryItem[] = [
  page({
    key: "operation-breast-augmentation",
    route: "/operaczii/plastika-grudi/uvelichenie-grudi",
    kind: "operation",
    section: "Операции",
    legacyRoutes: ["/ceny/plastika-grudi/uvelichenie-grudi.html"],
    contentStatus: "cms",
    contentSource: "cms",
  }),
];

const patientAndTemplatePages: readonly PageRegistryItem[] = [
  page({ key: "patients", name: "Пациентам", route: "/pacientam", kind: "listing", section: "Пациентам", contentStatus: "partial" }),
  page({ key: "blog", name: "Блог доктора", route: "/pacientam/blog", kind: "listing", section: "Пациентам", contentStatus: "partial" }),
  page({ key: "blog-template", name: "Статья блога", route: "/pacientam/blog/[slug]", kind: "dynamic-template", section: "Пациентам", group: "Блог", contentStatus: "cms-template" }),
  page({ key: "reviews", name: "Отзывы", route: "/pacientam/otzyvy", kind: "listing", section: "Пациентам", legacyRoutes: ["/obo-mne/otzyvy.html", "/pacientam/otzyvy.html"], seo: { title: "Отзывы — доктор Коробов", description: "Отзывы пациентов о докторе Коробове: опыт консультации, операции и восстановления, впечатления и обратная связь.", canonicalPath: "/pacientam/otzyvy" }, contentStatus: "partial" }),
  page({ key: "patient-journey", name: "Как всё будет", route: "/pacientam/kak-vse-budet", kind: "static", section: "Пациентам", legacyRoutes: ["/pacientam/kak-vsyo-budet.html"], seo: { title: "Как всё будет: этапы для пациента — DrKAV", description: "Как проходит путь пациента: консультация, подготовка, день операции, наблюдение и восстановление. Понятный план по шагам.", canonicalPath: "/pacientam/kak-vse-budet" }, contentStatus: "partial" }),
  page({ key: "tests", name: "Список анализов", route: "/pacientam/spisok-analizov", kind: "static", section: "Пациентам", legacyRoutes: ["/pacientam/spisok-analizov.html"], seo: { title: "Список анализов перед операцией — DrKAV", description: "Список анализов и обследований перед операцией: что требуется, сроки актуальности результатов и рекомендации по подготовке к сдаче.", canonicalPath: "/pacientam/spisok-analizov" }, contentStatus: "partial" }),
  page({ key: "assistant", name: "Ваш личный ассистент", route: "/pacientam/lichnyy-assistent", kind: "static", section: "Пациентам", legacyRoutes: ["/pacientam/lichnyy-assistent.html"], contentStatus: "partial" }),
  page({ key: "safety", name: "Безопасность", route: "/pacientam/bezopasnost", kind: "static", section: "Пациентам", legacyRoutes: ["/pacientam/bezopasnost.html"], seo: { title: "Безопасность операций — DrKAV", description: "Безопасность операций: обследования, подготовка, анестезия, контроль состояния и рекомендации для снижения рисков в восстановлении.", canonicalPath: "/pacientam/bezopasnost" }, contentStatus: "partial" }),
  page({ key: "faq", name: "Вопрос-ответ", route: "/pacientam/vopros-otvet", kind: "static", section: "Пациентам", contentStatus: "partial" }),
  page({ key: "conditions", name: "Про болезни", route: "/pacientam/pro-bolezni", kind: "listing", section: "Пациентам", legacyRoutes: ["/pacientam/pro-bolezni.html"], seo: { title: "Про болезни", description: "Статьи про болезни и способы их лечения.", canonicalPath: "/pacientam/pro-bolezni" }, contentStatus: "partial" }),
  page({ key: "condition-template", name: "Материал «Про болезни»", route: "/pacientam/pro-bolezni/[slug]", kind: "dynamic-template", section: "Пациентам", group: "Про болезни", contentStatus: "cms-template" }),
  page({ key: "portfolio", name: "Портфолио", route: "/pacientam/portfolio", kind: "listing", section: "Пациентам", legacyRoutes: ["/portfolio"], contentStatus: "partial" }),
  page({ key: "portfolio-template", name: "Кейс", route: "/pacientam/portfolio/[slug]", kind: "dynamic-template", section: "Пациентам", group: "Портфолио", contentStatus: "cms-template" }),
  page({ key: "before-after", name: "До/после", route: "/pacientam/do-i-posle", kind: "listing", section: "Пациентам", legacyRoutes: ["/pacientam/do-i-posle.html", "/do-posle"], seo: { title: "До и после — результаты работ DrKAV", description: "Фото «до и после» работ DrKAV: примеры результатов, визуальные изменения и ориентиры для обсуждения на консультации.", canonicalPath: "/pacientam/do-i-posle" }, contentStatus: "partial" }),
  page({ key: "before-after-template", name: "Работа «До/после»", route: "/pacientam/do-i-posle/[slug]", kind: "dynamic-template", section: "Пациентам", group: "До/после", contentStatus: "cms-template" }),
  page({ key: "contacts", name: "Контакты", route: "/kontakty", kind: "static", section: "Пациентам", legacyRoutes: ["/kontakty.html"], seo: { title: "Контакты и запись — DrKAV", description: "Контакты DrKAV: как записаться на консультацию, способы связи, адрес и информация для планирования визита.", canonicalPath: "/kontakty" }, contentStatus: "partial" }),
  page({ key: "scientific-publication-template", name: "Научная публикация", route: "/obo-mne/publikacii/[slug]", kind: "dynamic-template", section: "Обо мне", group: "Научная деятельность", contentStatus: "cms-template" }),
  page({ key: "media-publication-template", name: "Публикация в СМИ", route: "/obo-mne/smi/[slug]", kind: "dynamic-template", section: "Обо мне", group: "СМИ", contentStatus: "cms-template" }),
  page({ key: "speaking-template", name: "Выступление", route: "/obo-mne/vystupleniya/[slug]", kind: "dynamic-template", section: "Обо мне", group: "Выступления", contentStatus: "cms-template" }),
];

export const allPageRegistryItems: readonly PageRegistryItem[] = [
  ...pageRegistry,
  ...operationPages,
  ...cmsOperationPages,
  ...patientAndTemplatePages,
];

const registryByRoute = new Map(allPageRegistryItems.map((item) => [item.route, item]));

if (registryByRoute.size !== allPageRegistryItems.length) {
  throw new Error("Page registry contains duplicate canonical routes.");
}

export function getPageByRoute(route: string): PageRegistryItem | undefined {
  return registryByRoute.get(route);
}

export function getPageMetadata(route: string, fallback?: SeoData): Metadata {
  const seo = getPageByRoute(route)?.seo ?? fallback;

  return seo ? toMetadata(seo) : {};
}
