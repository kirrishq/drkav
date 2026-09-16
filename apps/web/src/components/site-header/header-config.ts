export type HeaderMenuLink = {
  href: string;
  label: string;
  links?: readonly HeaderMenuLink[];
};

export const administratorContact = {
  phone: "+7 925 625-55-10",
  telHref: "tel:+79256255510",
  telegramHref: "https://t.me/+79256255510",
  // Replace with the administrator's public MAX profile/chat URL when it is available.
  maxHref: "https://max.ru/",
  whatsappHref:
    "https://wa.me/79256255510?text=%D0%9A%D0%BE%D0%BD%D1%81%D1%83%D0%BB%D1%8C%D1%82%D0%B0%D1%86%D0%B8%D1%8F",
  emailHref: "mailto:admin@drkav.ru",
} as const;

export const headerSubmenuImages: Readonly<Record<string, string>> = {
  "/operaczii": "/images/operations/body-contouring.jpg",
  "/operaczii/plastika-grudi": "/images/operations/breast.jpg",
  "/operaczii/zhivot-i-taliya": "/images/operations/abdomen-and-waist.jpg",
  "/operaczii/liposkulptura": "/images/operations/body-contouring.jpg",
  "/operaczii/plasticheskaya-hirurgiya-posle-rodov": "/images/operations/postpartum.jpg",
  "/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya": "/images/operations/after-weight-loss.jpg",
  "/operaczii/muzhskaya-plastika": "/images/operations/male-athletic-contouring.jpg",
  "/operaczii/intimnaya-plastika": "/images/operations/intimate-surgery.jpg",
  "/operaczii/rf-lifting": "/images/operations/rf-lifting.jpg",
};

export type HeaderMenuItem = HeaderMenuLink & {
  featured?: boolean;
  links?: readonly HeaderMenuLink[];
};

export const headerMenu: readonly HeaderMenuItem[] = [
  {
    href: "/obo-mne",
    label: "Обо мне",
    links: [
      { href: "/obo-mne", label: "Обо мне" },
      { href: "/obo-mne/publikacii", label: "Научная деятельность" },
      { href: "/obo-mne/vystupleniya", label: "Выступления" },
      {
        href: "/obo-mne/diplomy-i-licenzii",
        label: "Дипломы и лицензии",
      },
      { href: "/obo-mne/smi", label: "СМИ" },
      { href: "/obo-mne/neshkola", label: "Не Школа" },
      { href: "/obo-mne/book", label: "Книга" },
    ],
  },
  {
    featured: true,
    href: "/akcii",
    label: "Акции",
  },
  {
    href: "/ceny",
    label: "Цены",
  },
  {
    href: "/operaczii",
    label: "Операции",
    links: [
      { href: "/operaczii", label: "Все операции" },
      {
        href: "/operaczii/plastika-grudi",
        label: "Грудь",
        links: [
          { href: "/operaczii/plastika-grudi", label: "Пластика груди" },
          { href: "/operaczii/plastika-grudi/uvelichenie-grudi", label: "Увеличение груди" },
          { href: "/operaczii/plastika-grudi/podtyazhka-grudi-bez-implantov", label: "Подтяжка груди без имплантов" },
          { href: "/operaczii/plastika-grudi/umenshenie-grudi", label: "Уменьшение груди" },
          { href: "/operaczii/plastika-grudi/asimmetriya-grudi", label: "Асимметрия груди" },
          { href: "/operaczii/plastika-grudi/udalenie-implantov-grudi", label: "Удаление имплантов груди" },
          { href: "/operaczii/plastika-grudi/rekonstrukciya-grudi", label: "Реконструкция груди" },
          { href: "/operaczii/lipofiling/lipofiling-grudi", label: "Липофилинг груди" },
        ],
      },
      {
        href: "/operaczii/abdominoplastika",
        label: "Живот и талия",
        links: [
          { href: "/operaczii/abdominoplastika", label: "Абдоминопластика" },
          { href: "/operaczii/diastaz-myshc-zhivota", label: "Диастаз мышц живота" },
        ],
      },
      {
        href: "/operaczii/liposkulptura",
        label: "Коррекция фигуры",
        links: [
          { href: "/operaczii/liposkulptura", label: "Липоскульптура" },
          { href: "/operaczii/liposkulptura/podtyazhka-beder", label: "Подтяжка бедер" },
          { href: "/operaczii/liposkulptura/podtyazhka-ruk", label: "Подтяжка рук" },
          { href: "/operaczii/liposkulptura/podtyazhka-yagodic", label: "Подтяжка ягодиц" },
          { href: "/operaczii/liposkulptura/ultrazvukovaya-liposakciya", label: "Ультразвуковая липосакция" },
          { href: "/operaczii/lipofiling", label: "Липофилинг" },
          { href: "/operaczii/lipofiling/lipofiling-yagodic", label: "Липофилинг ягодиц" },
          { href: "/operaczii/liposakcziya/liposakcziya-ruk", label: "Липосакция рук" },
          { href: "/operaczii/liposakcziya/liposakcziya-spiny", label: "Липосакция спины" },
          { href: "/operaczii/liposakcziya/liposakcziya-vdovego-gorbika", label: "Липосакция вдовьего горбика" },
        ],
      },
      {
        href: "/operaczii/plasticheskaya-hirurgiya-posle-rodov",
        label: "После родов",
      },
      {
        href: "/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya",
        label: "После похудения",
      },
      {
        href: "/operaczii/muzhskaya-plastika",
        label: "Мужчинам",
        links: [
          { href: "/operaczii/muzhskaya-plastika", label: "Мужская атлетизация" },
          { href: "/operaczii/muzhskaya-plastika/abdominoplastika-dlya-muzhchin", label: "Абдоминопластика для мужчин" },
          { href: "/operaczii/muzhskaya-plastika/atletizaciya-plech-i-ruk", label: "Атлетизация плеч и рук" },
          { href: "/operaczii/muzhskaya-plastika/bodilifting-dlya-muzhchin", label: "Бодилифтинг для мужчин" },
          { href: "/operaczii/muzhskaya-plastika/ginekomastiya", label: "Гинекомастия" },
          { href: "/operaczii/muzhskaya-plastika/lechenie-ginekompastii", label: "Лечение гинекомастии" },
          { href: "/operaczii/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder", label: "Подтяжка ягодиц и бедер" },
          { href: "/operaczii/muzhskaya-plastika/prorisovka-pressa", label: "Прорисовка пресса" },
        ],
      },
      {
        href: "/operaczii/intimnaya-plastika",
        label: "Интимная пластика",
      },
      {
        href: "/operaczii/rf-lifting",
        label: "Без операции (РФ-лифтинг)",
        links: [
          { href: "/operaczii/rf-lifting", label: "RF-лифтинг" },
          { href: "/operaczii/rf-lifting/rf-lifting-tela", label: "RF-лифтинг тела" },
          { href: "/operaczii/rf-lifting/rf-lifting-zhivota", label: "RF-лифтинг живота" },
          { href: "/operaczii/rf-lifting/rf-lifting-shei-i-dekolte", label: "RF-лифтинг шеи и декольте" },
          { href: "/operaczii/rf-lifting/rf-lifting-morpheus-8", label: "RF-лифтинг Morpheus 8" },
        ],
      },
    ],
  },
  {
    href: "/pacientam",
    label: "Пациентам",
    links: [
      { href: "/pacientam", label: "Пациентам" },
      { href: "/pacientam/blog", label: "Блог доктора" },
      { href: "/pacientam/otzyvy", label: "Отзывы" },
      { href: "/pacientam/kak-vse-budet", label: "Как всё будет" },
      { href: "/pacientam/spisok-analizov", label: "Список анализов" },
      {
        href: "/pacientam/lichnyy-assistent",
        label: "Ваш личный ассистент",
      },
      { href: "/pacientam/bezopasnost", label: "Безопасность" },
      { href: "/pacientam/vopros-otvet", label: "Вопрос-ответ" },
      { href: "/pacientam/pro-bolezni", label: "Про болезни" },
    ],
  },
  {
    href: "/pacientam/portfolio",
    label: "Портфолио",
  },
  {
    href: "/pacientam/do-i-posle",
    label: "До/после",
  },
  {
    href: "/kontakty",
    label: "Контакты",
  },
] as const;
