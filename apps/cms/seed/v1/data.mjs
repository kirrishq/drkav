import { navigation } from "./navigation.mjs";

export const seedVersion = 1;

export const seedSources = [
  "drkav [структура] (1).xlsx / структура сайта seo",
  "operaczii.xlsx / Sheet1",
  "apps/web/src/content/page-registry.ts",
  "https://drkav.ru/ceny/plastika-grudi/uvelichenie-grudi.html",
];

export const siteSettings = {
  ...navigation,
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

const paragraph = (text) => ({
  type: "paragraph",
  children: [{ type: "text", text }],
});

const checklistItem = (title, text, sortOrder) => ({
  title,
  text,
  sortOrder,
});

export const sharedSections = [
  {
    internalName: "Профиль доктора",
    sectionKey: "doctor-profile",
    type: "doctor-profile",
  },
  {
    internalName: "Каталог операций",
    sectionKey: "operations-catalog",
    type: "operations-catalog",
  },
  {
    internalName: "Отзывы пациентов",
    sectionKey: "reviews",
    type: "reviews",
  },
  {
    internalName: "Запись на консультацию",
    sectionKey: "consultation",
    type: "consultation",
  },
  {
    internalName: "Личный администратор",
    sectionKey: "administrator",
    type: "administrator",
  },
];

const defaultSharedSectionKeys = [
];

const homeSharedSectionKeys = [
  "doctor-profile",
  "operations-catalog",
  "reviews",
  "consultation",
  "administrator",
];

export const staticPages = [
  {
    internalName: "Главная",
    pageKey: "home",
    seo: siteSettings.defaultSeo,
    heading: "Пластический хирург Артём Владимирович Коробов",
    heroDescription: "Специализируюсь на абдоминопластике, маммопластике, липоскульптуре, комплексном восстановлении фигуры и мужской атлетизации.",
    sharedSectionKeys: homeSharedSectionKeys,
    contentSections: [
      {
        __component: "static-page.card-grid-section",
        sectionKey: "benefits",
        heading: "Почему пациенты выбирают доктора",
        cards: [
          { title: "Премиальная клиника на Барвихе", href: "/kontakty", sortOrder: 1 },
          { title: "Максимальная безопасность: реанимация и дежурный реаниматолог", href: "/pacientam/bezopasnost", sortOrder: 2 },
          { title: "Современная реабилитация с первого дня после операции", href: "/pacientam/kak-vse-budet", sortOrder: 3 },
          { title: "Опыт и методики для операций любой сложности", href: "/obo-mne", sortOrder: 4 },
        ],
      },
      {
        __component: "static-page.card-grid-section",
        sectionKey: "editorial",
        heading: "Ещё о докторе и его проектах",
        cards: [
          { title: "Обучение для пластических хирургов", description: "Практическое обучение: мастер-классы, стажировки, менторство и работа в операционной.", href: "/obo-mne/neshkola", sortOrder: 1 },
          { title: "«Боль двенадцати женщин» — роман о жизни и работе пластического хирурга", description: "Роман о человеческих историях, которые остаются за пределами операционной.", href: "/obo-mne/book", sortOrder: 2 },
          { title: "Интервью Ксении Собчак", description: "Интервью о липосакции, опыте звёзд и безопасности пластической хирургии.", href: "/obo-mne/smi", sortOrder: 3 },
        ],
      },
    ],
    contentStatus: "partial",
  },
  {
    internalName: "Консультация",
    pageKey: "consultation",
    seo: {
      metaTitle: "Консультация пластического хирурга — DrKAV",
      metaDescription: "Запись на очную или онлайн-консультацию с доктором Коробовым.",
      canonicalPath: "/konsultaciya",
      noIndex: false,
    },
    heading: "Консультация пластического хирурга",
    heroDescription: "Запись на очную или онлайн-консультацию с доктором Коробовым.",
    contentStatus: "ready",
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
    heading: "Доктор Коробов в СМИ и специальных проектах",
    sharedSectionKeys: defaultSharedSectionKeys,
    contentSections: [
      {
        __component: "static-page.card-grid-section",
        sectionKey: "videos",
        heading: "Видео проекты",
        cards: [
          { title: "Липосакция: самая опасная операция в пластической хирургии? Опыт звезд и мнение врачей.", description: "Интервью Ксении Собчак", href: "https://drkav.ru/videos/smi/sobchak.mp4", sortOrder: 1 },
          { title: "Как сделать тело мечты без спортзала и диет.", description: "Интервью для шоу «ТОП ПЕРСОНА»", href: "https://drkav.ru/videos/smi/interview.mp4", sortOrder: 2 },
        ],
      },
    ],
    contentStatus: "ready",
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
    heading: "Не Школа — обучение пластических хирургов",
    sharedSectionKeys: defaultSharedSectionKeys,
    contentSections: [
      {
        __component: "static-page.rich-text-section",
        sectionKey: "project",
        body: [
          paragraph("Не Школа — это максимально много практики в разных форматах. Теорию разберем на примерах из моего опыта (а так же обсудим и ваши кейсы, если вы придете на тариф с обратной связью или менторство)."),
          paragraph("Смотрите мастер-классы онлайн, посещайте операционную, приходите на долгосрочную стажировку."),
          paragraph("Присоединяйтесь!"),
        ],
      },
      {
        __component: "static-page.card-grid-section",
        sectionKey: "formats",
        heading: "Форматы обучения в НеШколе",
        cards: [
          { title: "Онлайн мастер-классы", description: "Расширяйте свой опыт и развивайте насмотренность, адаптируйте методики к разным сценариям и повышайте уверенность при выполнении сложных операций.", href: "https://neschool.drkav.ru/", sortOrder: 1 },
          { title: "Менторство", description: "Разбирайте свои ошибки, обретайте уверенность в рекомендациях и решениях, становитесь авторитетом для коллег и пациентов.", href: "https://neschool.drkav.ru/", sortOrder: 2 },
          { title: "1 на 1 в операционной", description: "Выбирайте конкретную операцию, приходите в операционную и получайте полное представление о технике и ключевых методиках.", href: "https://neschool.drkav.ru/", sortOrder: 3 },
          { title: "Стажировка — интенсив", description: "Погрузитесь в реальные кейсы, получите рекомендации и опыт профессионального наставничества.", href: "https://neschool.drkav.ru/", sortOrder: 4 },
        ],
      },
    ],
    contentStatus: "ready",
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
    heading: "Книга доктора Коробова А.В.",
    sharedSectionKeys: defaultSharedSectionKeys,
    contentSections: [
      {
        __component: "static-page.rich-text-section",
        sectionKey: "story",
        body: [
          paragraph("На консультациях женщины рассказывают мне о своей жизни: у каждой своя боль и свое счастье, и я вижу следы этой истории на их телах."),
          paragraph("Живот, бедра, спина, грудь — все это страницы книги, написанные языком стыда, боли и любви. Мне понадобился опыт — профессиональный и человеческий, — чтобы увидеть за телами людей истории и пройденный путь."),
          paragraph("Этим опытом я делюсь в книге, рассказывая вам истории двенадцати женщин…"),
        ],
      },
      {
        __component: "static-page.rich-text-section",
        sectionKey: "order",
        body: [paragraph("Закажите бумажную версию книги и получите консультацию доктора Коробова бесплатно!")],
      },
    ],
    contentStatus: "ready",
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
    sharedSectionKeys: defaultSharedSectionKeys,
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
    internalName: "Ваш личный ассистент",
    pageKey: "assistant",
    seo: {
      metaTitle: "Ваш личный ассистент — DrKAV",
      metaDescription: "Организация консультаций, подготовки и коммуникации на каждом этапе.",
      canonicalPath: "/pacientam/lichnyy-assistent",
      noIndex: false,
    },
    heading: "Ваш личный ассистент",
    heroDescription: "Ассистент сопровождает пациента в организационных вопросах до и после операции.",
    sharedSectionKeys: defaultSharedSectionKeys,
    contentSections: [
      {
        __component: "static-page.checklist-section",
        sectionKey: "support",
        heading: "Поддержка на каждом этапе",
        items: [
          checklistItem("Запись на консультацию", "Поможет выбрать удобные дату и время консультации.", 1),
          checklistItem("Подготовка информации", "Соберёт результаты обследований и другие данные, необходимые врачу.", 2),
          checklistItem("Подготовка к операции", "Направит памятки о подготовке, обследованиях и действиях перед операцией.", 3),
          checklistItem("Период восстановления", "Передаст инструкции по операции и восстановлению, поможет с организационными вопросами.", 4),
          checklistItem("Контрольные визиты", "В течение года после операции поможет согласовать перевязки и осмотры.", 5),
        ],
      },
    ],
    contentStatus: "ready",
  },
  {
    internalName: "Вопрос-ответ",
    pageKey: "faq",
    seo: {
      metaTitle: "Вопросы и ответы — DrKAV",
      metaDescription: "Ответы на частые вопросы о подготовке, операции и восстановлении.",
      canonicalPath: "/pacientam/vopros-otvet",
      noIndex: false,
    },
    heading: "Вопросы и ответы",
    heroDescription: "Ответы на частые вопросы о подготовке, операции, восстановлении и консультации.",
    sharedSectionKeys: defaultSharedSectionKeys,
    contentSections: [
      {
        __component: "static-page.faq-section",
        sectionKey: "clinic-and-safety",
        heading: "Клиника и безопасность",
        items: [
          { question: "Есть ли в клинике реанимация?", answer: "В клинике предусмотрена палата интенсивной терапии, работают анестезиологи-реаниматологи и используется оборудование для контроля состояния пациента во время и после операции." },
          { question: "Обеспечен ли послеоперационный уход?", answer: "Во время пребывания в клинике пациент находится под наблюдением медицинского персонала; выполнение назначений и раннее восстановление контролируются командой врача." },
          { question: "Сколько дней нужно находиться в клинике?", answer: "Срок пребывания зависит от вмешательства и состояния пациента. Ориентиры обсуждаются на консультации и уточняются в плане лечения." },
          { question: "Какой наркоз используется?", answer: "Вид анестезии определяется анестезиологом индивидуально после оценки планируемого вмешательства, обследований и состояния здоровья." },
        ],
      },
      {
        __component: "static-page.faq-section",
        sectionKey: "preparation-and-organization",
        heading: "Подготовка и организация",
        items: [
          { question: "Какие анализы необходимо сдать перед операцией?", answer: "Стандартное обследование может включать анализы крови, коагулограмму, ЭКГ, исследования по показаниям и заключение терапевта. Полный список выдаётся индивидуально." },
          { question: "Как узнать стоимость операции?", answer: "Стоимость рассчитывается индивидуально после консультации и формирования плана операции." },
          { question: "Сколько стоит консультация?", answer: "Актуальные форматы и стоимость консультаций уточняйте у администратора перед записью." },
          { question: "Нужно ли отменять лекарства перед операцией?", answer: "Не отменяйте назначенные препараты самостоятельно. Все лекарства и добавки необходимо заранее обсудить с врачом и анестезиологом." },
          { question: "Нужно ли отменять оральные контрацептивы?", answer: "Этот вопрос решается индивидуально с учётом операции и анамнеза; обсудите его с врачом заранее." },
          { question: "Что нужно взять с собой в день операции?", answer: "Обычно потребуются паспорт, результаты исследований, зарядное устройство, необходимые личные вещи и препараты, которые вы принимаете на постоянной основе." },
          { question: "Выдадут ли договор и чек?", answer: "Перед вмешательством оформляются договор и информированное согласие; пациент получает подтверждающие документы об оплате." },
        ],
      },
      {
        __component: "static-page.faq-section",
        sectionKey: "operation-and-recovery",
        heading: "Операция и восстановление",
        items: [
          { question: "Влияет ли менструальный цикл на дату операции?", answer: "Менструация не всегда является противопоказанием, но о ней необходимо сообщить команде заранее, чтобы врач оценил ситуацию индивидуально." },
          { question: "Когда можно планировать беременность после операции?", answer: "Срок зависит от вида вмешательства и особенностей восстановления. Его следует обсудить с хирургом на контрольном осмотре." },
          { question: "Можно ли делать операцию во время грудного вскармливания?", answer: "Тактика зависит от вида вмешательства и периода после завершения грудного вскармливания. Решение принимается только после очной консультации." },
          { question: "Когда лучше делать пластическую операцию?", answer: "Подходящее время определяется состоянием здоровья, возможностью пройти подготовку и выделить время на восстановление, а не только сезоном." },
          { question: "Через какое время после COVID-19 можно оперироваться?", answer: "Срок определяет врач после полного выздоровления и оценки состояния организма; о перенесённой инфекции важно сообщить заранее." },
        ],
      },
      {
        __component: "static-page.faq-section",
        sectionKey: "additional",
        heading: "Дополнительные вопросы",
        items: [
          { question: "Как доктор подтверждает квалификацию?", answer: "Информация об образовании, сертификатах, опыте, научной деятельности и профессиональных мероприятиях представлена в разделе «Обо мне»." },
          { question: "Работаете ли вы с мужчинами?", answer: "Да, операции для мужчин входят в направления практики. Варианты коррекции обсуждаются индивидуально на консультации." },
          { question: "С какого возраста проводятся операции?", answer: "Операции проводятся совершеннолетним пациентам; возрастные и медицинские ограничения определяются индивидуально." },
          { question: "Может ли близкий находиться в палате?", answer: "Возможность присутствия сопровождающего зависит от условий размещения и правил клиники; её нужно согласовать заранее." },
          { question: "Есть ли одноместные палаты и личная медсестра?", answer: "Дополнительные условия размещения и ухода могут быть доступны по предварительному согласованию с клиникой." },
        ],
      },
    ],
    contentStatus: "ready",
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
    sharedSectionKeys: defaultSharedSectionKeys,
    contentSections: [
      {
        __component: "static-page.checklist-section",
        sectionKey: "consultation",
        heading: "Консультация",
        items: [
          checklistItem("Способы записи", "Записаться можно через формы на сайте, социальные сети или через администратора.", 1),
          checklistItem("Оплата", "Администратор заранее направляет ссылку на оплату консультации.", 2),
          checklistItem("Доступность", "Как правило, консультацию можно организовать в течение недели.", 3),
        ],
      },
      {
        __component: "static-page.checklist-section",
        sectionKey: "operation-planning",
        heading: "Организация операции",
        items: [
          checklistItem("Консультационный лист", "После консультации пациент получает рекомендации врача и расчёт стоимости.", 1),
          checklistItem("Бронирование даты", "После принятия решения можно зарезервировать дату операции.", 2),
          checklistItem("Предоперационные этапы", "Ассистент направляет памятки и список необходимых обследований.", 3),
          checklistItem("Анализы и обследование", "Результаты обследований рекомендуется подготовить заранее и передать врачу на проверку не позднее срока, который сообщит команда.", 4),
          checklistItem("Допуск к операции", "Решение о допуске принимается при отсутствии противопоказаний.", 5),
        ],
      },
      {
        __component: "static-page.checklist-section",
        sectionKey: "operation-day",
        heading: "День операции",
        items: [
          checklistItem("Прибытие в клинику", "Обычно необходимо приехать заранее; точное время сообщает администратор.", 1),
          checklistItem("Регистрация и документы", "Оформляются договор, информированные согласия и другие необходимые документы.", 2),
          checklistItem("Предоперационная разметка", "Доктор проводит финальную беседу, разметку и отвечает на вопросы.", 3),
          checklistItem("Анестезия", "Перед операцией проходит беседа с анестезиологом и необходимая подготовка.", 4),
          checklistItem("Операция", "Продолжительность зависит от индивидуального плана и выбранной тактики.", 5),
        ],
      },
      {
        __component: "static-page.checklist-section",
        sectionKey: "recovery",
        heading: "После операции",
        items: [
          checklistItem("Наблюдение", "Во время пребывания в клинике пациент находится под наблюдением медицинской команды.", 1),
          checklistItem("Стационар", "Продолжительность пребывания определяется планом лечения и состоянием пациента.", 2),
          checklistItem("Выписка и связь", "После выписки выдаются необходимые рекомендации и материалы для первых дней восстановления.", 3),
          checklistItem("Послеоперационные осмотры", "Команда согласует график перевязок и контрольных визитов.", 4),
          checklistItem("Дальнейшее наблюдение", "Контрольные осмотры проводятся по индивидуальному графику, в клинике или по согласованному формату связи.", 5),
        ],
      },
    ],
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
    heading: "Список анализов перед операцией",
    sharedSectionKeys: defaultSharedSectionKeys,
    contentSections: [
      {
        __component: "static-page.tests-section",
        sectionKey: "examinations",
        heading: "Обследования и сроки актуальности",
        intro: [
          paragraph("Список служит ориентиром. Окончательный перечень исследований, их сроки и решение о допуске к операции определяет врач с учётом планируемого вмешательства и состояния здоровья."),
        ],
        items: [
          checklistItem("Клинический анализ крови", "Срок актуальности: 14 дней", 1),
          checklistItem("Группа крови, резус-фактор и фенотипирование эритроцитов Rh и Kell", "Срок актуальности: бессрочно", 2),
          checklistItem("Биохимический анализ крови: АСТ, АЛТ, мочевина, креатинин, общий белок, билирубин, холестерин, глюкоза, амилаза", "Срок актуальности: 14 дней", 3),
          checklistItem("Коагулограмма: ПТИ, АЧТВ, МНО, тромбиновое время, фибриноген", "Срок актуальности: 14 дней", 4),
          checklistItem("Анализы крови на ВИЧ, гепатиты B и C, сифилис", "Срок актуальности: 14 дней", 5),
          checklistItem("D-димер", "Срок актуальности: 14 дней", 6),
          checklistItem("Калий, натрий, хлор", "Срок актуальности: 14 дней", 7),
          checklistItem("Общий анализ мочи с микроскопией", "Срок актуальности: 14 дней", 8),
          checklistItem("ЭКГ", "Срок актуальности: 14 дней", 9),
          checklistItem("Флюорография или рентгенография органов грудной клетки", "Срок актуальности: 6 месяцев", 10),
          checklistItem("Заключение терапевта об отсутствии противопоказаний к плановой операции", "Срок актуальности: по заключению врача", 11),
          checklistItem("Дуплексное сканирование вен нижних конечностей", "Срок актуальности: 1 месяц", 12),
          checklistItem("УЗИ брюшной полости — при абдоминопластике или липосакции живота", "Срок актуальности: 1 месяц", 13),
          checklistItem("УЗИ передней брюшной стенки — при абдоминопластике или липосакции живота", "Срок актуальности: 1 месяц", 14),
          checklistItem("УЗИ молочных желёз — при операциях на груди", "Срок актуальности: 1 месяц", 15),
          checklistItem("ПЦР-мазок, не экспресс-тест", "Срок актуальности: 48 часов", 16),
        ],
      },
    ],
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
    sharedSectionKeys: defaultSharedSectionKeys,
    contentSections: [
      {
        __component: "static-page.rich-text-section",
        sectionKey: "system",
        heading: "Система безопасности",
        body: [
          paragraph("Доктор Коробов применяет рекомендации по безопасности операций РОПРЭХ и ISAPS и совершенствует их в своей практике."),
          paragraph("Безопасность операции — это результат работы целой системы, в которой учитывается каждая деталь и все этапы находятся под контролем."),
          paragraph("Клиника оснащена анестезиологическим оборудованием, а в команде работают анестезиологи-реаниматологи; необходимые сертификаты и лицензия предусмотрены."),
        ],
      },
      {
        __component: "static-page.checklist-section",
        sectionKey: "before-surgery",
        heading: "До операции",
        items: [
          checklistItem("Анамнез", "Врач уточняет хронические заболевания, аллергии и другие сведения, важные для планирования лечения.", 1),
          checklistItem("Полное предоперационное обследование", "Подробный список анализов и консультаций специалистов составляется с учётом индивидуальных показаний, чтобы оценить возможность хирургического вмешательства.", 2),
          checklistItem("Консультация анестезиолога", "Перед операцией анестезиолог дополнительно изучает анализы и заключения и принимает решение о допуске или недопуске к операции.", 3),
          checklistItem("Индивидуальная тактика операции", "Доктор внимательно контролирует допустимые объёмы операции, включая удаление жировой ткани при липосакции и трансплантацию жировой ткани при липофилинге.", 4),
        ],
      },
      {
        __component: "static-page.checklist-section",
        sectionKey: "during-surgery",
        heading: "Во время операции",
        items: [
          checklistItem("Оснащение клиники", "Оборудование для мониторинга помогает контролировать состояние пациента на всех этапах и оперативно реагировать на изменения.", 1),
          checklistItem("Анестезиолог", "Анестезиолог-реаниматолог находится в операционной на протяжении операции.", 2),
          checklistItem("Протоколы безопасности операций", "Это перечень обязательных действий медицинского персонала: под контролем стерильность, температура в операционной и порядок действий каждого члена команды.", 3),
        ],
      },
      {
        __component: "static-page.checklist-section",
        sectionKey: "after-surgery",
        heading: "После операции",
        items: [
          checklistItem("Дежурный анестезиолог", "Анестезиолог наблюдает за пациентом до стабилизации состояния и делает необходимые назначения; в клинике предусмотрено круглосуточное дежурство анестезиолога.", 1),
          checklistItem("Послеоперационный уход", "Медицинская команда сопровождает пациента в раннем периоде восстановления в соответствии с назначениями врача.", 2),
          checklistItem("Личный контроль доктора Коробова", "Доктор контролирует выполнение назначений и состояние пациента в раннем послеоперационном периоде.", 3),
          checklistItem("Забота", "После выписки пациенты получают набор медикаментов и перевязочный материал, необходимый на первые три суток.", 4),
          checklistItem("Соблюдение санитарных норм", "Приём пациентов организован с соблюдением норм и правил дезинфекции.", 5),
        ],
      },
    ],
    contentStatus: "ready",
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
    sharedSectionKeys: defaultSharedSectionKeys,
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
    sharedSectionKeys: defaultSharedSectionKeys,
    contentStatus: "partial",
  },
  {
    internalName: "Обо мне",
    pageKey: "about",
    seo: {
      metaTitle: "Доктор Коробов — пластический хирург",
      metaDescription: "Профессиональный путь, подход к работе и направления практики доктора Коробова в пластической хирургии.",
      canonicalPath: "/obo-mne",
      noIndex: false,
    },
    heading: "Обо мне",
    heroDescription: "Профессиональный путь, подход к работе и направления практики доктора Коробова.",
    sharedSectionKeys: defaultSharedSectionKeys,
    contentStatus: "partial",
  },
  {
    internalName: "Научная деятельность",
    pageKey: "about-publications",
    seo: {
      metaTitle: "Научная деятельность доктора Коробова",
      metaDescription: "Материалы о профессиональных инициативах, исследованиях и развитии современной пластической хирургии доктора Коробова.",
      canonicalPath: "/obo-mne/publikacii",
      noIndex: false,
    },
    heading: "Вклад доктора Коробова в медицину",
    heroDescription: "Материалы о профессиональных инициативах, исследованиях и развитии современной пластической хирургии.",
    sharedSectionKeys: defaultSharedSectionKeys,
    contentSections: [
      {
        __component: "static-page.rich-text-section",
        sectionKey: "patent",
        body: [paragraph("На операцию «Диастаз без шрамов» получен патент № 2801500 от 09 августа 2023 г.")],
      },
      {
        __component: "static-page.card-grid-section",
        sectionKey: "articles",
        heading: "Научная деятельность",
        cards: [
          { title: "Экспериментальное обоснование оригинального мини-инвазивного доступа для хирургической коррекции диастаза прямых мышц живота", description: "2024", href: "/documents/diastaz.pdf", sortOrder: 1 },
          { title: "Постулаты и современные тенденции в хирургии грыж белой линии живота", description: "2023", href: "https://cyberleninka.ru/article/n/postulaty-i-sovremennye-tendentsii-v-hirurgii-gryzh-beloy-linii-zhivota/viewer", sortOrder: 2 },
          { title: "Диастаз прямых мышц живота: истинные вопросы диагностики и лечения неистинной грыжи", description: "2022", href: "https://cyberleninka.ru/article/n/diastaz-pryamyh-myshts-zhivota-istinnye-voprosy-diagnostiki-i-lecheniya-neistinnoy-gryzhi/viewer", sortOrder: 3 },
        ],
      },
    ],
    contentStatus: "ready",
  },
  {
    internalName: "Выступления",
    pageKey: "about-speaking",
    seo: {
      metaTitle: "Выступления доктора Коробова",
      metaDescription: "Доклады, конференции и образовательные события с участием доктора Коробова и его коллег в профессиональном сообществе.",
      canonicalPath: "/obo-mne/vystupleniya",
      noIndex: false,
    },
    heading: "Выступления и профессиональные мероприятия",
    heroDescription: "Доклады, конференции и образовательные события с участием доктора Коробова.",
    sharedSectionKeys: defaultSharedSectionKeys,
    contentSections: [
      {
        __component: "static-page.card-grid-section",
        sectionKey: "videos",
        heading: "Выступления",
        cards: [
          { title: "VI Всероссийский съезд герниологов", description: "2023", href: "https://drkav.ru/videos/conferences/spb.mp4", sortOrder: 1 },
          { title: "Инновационная школа эстетической медицины. Обзор конференции ИШЭМ", description: "2023", href: "https://drkav.ru/videos/conferences/innovation.mp4", sortOrder: 2 },
          { title: "XI Национальный конгресс имени Миланова. Пластическая хирургия, эстетическая медицина и косметология", description: "2022", href: "https://drkav.ru/videos/homepage/video-2.mp4", sortOrder: 3 },
        ],
      },
    ],
    contentStatus: "ready",
  },
  {
    internalName: "Дипломы и лицензии",
    pageKey: "about-credentials",
    seo: {
      metaTitle: "Дипломы и лицензии — доктор Коробов",
      metaDescription: "Документы об образовании, квалификации и медицинской практике доктора Коробова собраны в одном разделе сайта.",
      canonicalPath: "/obo-mne/diplomy-i-licenzii",
      noIndex: false,
    },
    heading: "Дипломы и лицензии",
    heroDescription: "Документы, подтверждающие образование, квалификацию и право на медицинскую практику.",
    sharedSectionKeys: defaultSharedSectionKeys,
    contentStatus: "partial",
  },
  {
    internalName: "Цены",
    pageKey: "prices",
    seo: {
      metaTitle: "Стоимость пластических операций — DrKAV",
      metaDescription: "Ориентировочная стоимость пластических операций и дополнительных услуг DrKAV с пояснениями по составу цены и консультации.",
      canonicalPath: "/ceny",
      noIndex: false,
    },
    heading: "Стоимость пластических операций",
    heroDescription: "Цены указаны ориентировочно, а итоговая стоимость рассчитывается врачом после консультации и зависит от индивидуального плана операции.",
    sharedSectionKeys: defaultSharedSectionKeys,
    contentStatus: "partial",
  },
  {
    internalName: "Операции",
    pageKey: "operations",
    seo: {
      metaTitle: "Пластические операции — DrKAV",
      metaDescription: "Направления пластической хирургии, особенности подготовки, проведения операций и восстановления под наблюдением команды DrKAV.",
      canonicalPath: "/operaczii",
      noIndex: false,
    },
    heading: "Пластические операции",
    heroDescription: "Направления пластической хирургии, особенности подготовки и восстановления после вмешательств.",
    contentStatus: "partial",
  },
  {
    internalName: "Живот и талия",
    pageKey: "operations-abdomen-waist",
    seo: {
      metaTitle: "Пластика живота и коррекция талии — DrKAV",
      metaDescription: "Варианты коррекции контуров живота и талии с учётом индивидуальных особенностей, состояния тканей и целей пациента.",
      canonicalPath: "/operaczii/zhivot-i-taliya",
      noIndex: false,
    },
    heading: "Пластика живота и коррекция талии",
    heroDescription: "Варианты коррекции контуров живота и талии с учётом индивидуальных особенностей.",
    contentStatus: "partial",
  },
  {
    internalName: "Пациентам",
    pageKey: "patients",
    seo: {
      metaTitle: "Пациентам — DrKAV",
      metaDescription: "Материалы DrKAV помогают подготовиться к консультации и операции, спланировать восстановление и найти ответы на важные вопросы.",
      canonicalPath: "/pacientam",
      noIndex: false,
    },
    heading: "Пациентам",
    heroDescription: "Собрали материалы, которые помогают подготовиться к консультации и операции, спланировать восстановление и найти ответы на важные вопросы.",
    sharedSectionKeys: defaultSharedSectionKeys,
    contentSections: [
      {
        __component: "static-page.card-grid-section",
        sectionKey: "results",
        heading: "Результаты и опыт пациентов",
        cards: [
          { title: "Портфолио", description: "Истории операций, восстановление и результаты лечения.", href: "/pacientam/portfolio", sortOrder: 1 },
          { title: "До и после", description: "Фотографии результатов по срокам после операции.", href: "/pacientam/do-i-posle", sortOrder: 2 },
          { title: "Отзывы", description: "Впечатления пациентов о консультации и восстановлении.", href: "/pacientam/otzyvy", sortOrder: 3 },
        ],
      },
      {
        __component: "static-page.card-grid-section",
        sectionKey: "preparation",
        heading: "Подготовка и сопровождение",
        cards: [
          { title: "Как всё будет", description: "Путь пациента от консультации до контрольных осмотров.", href: "/pacientam/kak-vse-budet", sortOrder: 1 },
          { title: "Список анализов", description: "Обследования перед операцией и сроки их актуальности.", href: "/pacientam/spisok-analizov", sortOrder: 2 },
          { title: "Ваш личный ассистент", description: "Организационная поддержка до и после операции.", href: "/pacientam/lichnyy-assistent", sortOrder: 3 },
          { title: "Безопасность", description: "Подготовка, анестезия и контроль на всех этапах.", href: "/pacientam/bezopasnost", sortOrder: 4 },
        ],
      },
      {
        __component: "static-page.card-grid-section",
        sectionKey: "knowledge",
        heading: "Ответы и полезные материалы",
        cards: [
          { title: "Вопрос-ответ", description: "Ответы на частые вопросы о подготовке и восстановлении.", href: "/pacientam/vopros-otvet", sortOrder: 1 },
          { title: "Про болезни", description: "Материалы о заболеваниях и особенностях лечения.", href: "/pacientam/pro-bolezni", sortOrder: 2 },
          { title: "Блог доктора", description: "Статьи о пластической хирургии и восстановлении.", href: "/pacientam/blog", sortOrder: 3 },
        ],
      },
    ],
    contentStatus: "partial",
  },
  {
    internalName: "Блог доктора",
    pageKey: "blog",
    seo: {
      metaTitle: "Блог доктора Коробова — DrKAV",
      metaDescription: "Статьи и профессиональные комментарии о пластической хирургии, подготовке к операциям и восстановлении пациентов.",
      canonicalPath: "/pacientam/blog",
      noIndex: false,
    },
    heading: "Блог доктора Коробова",
    heroDescription: "Статьи и профессиональные комментарии о пластической хирургии, подготовке и восстановлении.",
    sharedSectionKeys: defaultSharedSectionKeys,
    contentStatus: "partial",
  },
  {
    internalName: "Про болезни",
    pageKey: "conditions",
    seo: {
      metaTitle: "Про болезни — DrKAV",
      metaDescription: "Материалы о заболеваниях, подготовке, операциях и восстановлении простым и понятным языком.",
      canonicalPath: "/pacientam/pro-bolezni",
      noIndex: false,
    },
    heading: "Про болезни",
    heroDescription: "Материалы о заболеваниях, подготовке, операциях и восстановлении.",
    sharedSectionKeys: defaultSharedSectionKeys,
    contentStatus: "partial",
  },
  {
    internalName: "Портфолио",
    pageKey: "portfolio",
    seo: {
      metaTitle: "Портфолио пластических операций — DrKAV",
      metaDescription: "Реальные кейсы пациентов с кратким описанием операции, восстановления и срока после получения результата.",
      canonicalPath: "/pacientam/portfolio",
      noIndex: false,
    },
    heading: "Портфолио пластических операций",
    heroDescription: "Кейсы пациентов с кратким описанием операции и сроком результата.",
    sharedSectionKeys: defaultSharedSectionKeys,
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
    heading: "Увеличение груди",
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
