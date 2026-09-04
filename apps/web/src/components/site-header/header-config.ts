export type HeaderMenuLink = {
  href: string;
  label: string;
};

export const administratorContact = {
  phone: "+7 925 625-55-10",
  telHref: "tel:+79256255510",
  telegramHref: "https://t.me/+79256255510",
  // Replace with the administrator's public MAX profile/chat URL when it is available.
  maxHref: "https://max.ru/",
  whatsappHref:
    "https://wa.me/79256255510?text=%D0%9A%D0%BE%D0%BD%D1%81%D1%83%D0%BB%D1%8C%D1%82%D0%B0%D1%86%D0%B8%D1%8F",
} as const;

export const headerSubmenuImages: Readonly<Record<string, string>> = {
  "/obo-mne": "/images/doctor-portrait.png",
  "/obo-mne/publikacii": "/images/header/research.png",
  "/obo-mne/vystupleniya": "/images/speaking-videos/congress.jpg",
  "/obo-mne/diplomy-i-licenzii": "/images/education-formats/masterclasses.png",
  "/obo-mne/smi": "/images/media-videos/interview.jpg",
  "/obo-mne/neshkola": "/images/education/neschool.png",
  "/obo-mne/book": "/images/book/book-mockup.png",
  "/operaczii": "/images/header/body.png",
  "/operaczii/plastika-grudi": "/images/header/breast.png",
  "/operaczii/zhivot-i-taliya": "/images/header/body.png",
  "/operaczii/liposkulptura": "/images/header/body.png",
  "/operaczii/plasticheskaya-hirurgiya-posle-rodov": "/images/header/body.png",
  "/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya": "/images/header/body.png",
  "/operaczii/muzhskaya-plastika": "/images/header/body.png",
  "/operaczii/intimnaya-plastika": "/images/header/face.png",
  "/operaczii/rf-lifting": "/images/header/face.png",
  "/pacientam": "/images/header/consultation.png",
  "/pacientam/blog": "/images/media-videos/interview.jpg",
  "/pacientam/otzyvy": "/images/header/consultation.png",
  "/pacientam/kak-vse-budet": "/images/header/consultation.png",
  "/pacientam/spisok-analizov": "/images/header/research.png",
  "/pacientam/lichnyy-assistent": "/images/header/consultation.png",
  "/pacientam/bezopasnost": "/images/header/research.png",
  "/pacientam/vopros-otvet": "/images/header/consultation.png",
  "/pacientam/pro-bolezni": "/images/header/face.png",
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
      { href: "/operaczii/plastika-grudi", label: "Грудь" },
      { href: "/operaczii/zhivot-i-taliya", label: "Живот и талия" },
      { href: "/operaczii/liposkulptura", label: "Коррекция фигуры" },
      { href: "/operaczii/plasticheskaya-hirurgiya-posle-rodov", label: "После родов" },
      { href: "/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya", label: "После похудения" },
      { href: "/operaczii/muzhskaya-plastika", label: "Мужчинам" },
      { href: "/operaczii/intimnaya-plastika", label: "Интимная пластика" },
      {
        href: "/operaczii/rf-lifting",
        label: "Без операции (РФ-лифтинг)",
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
