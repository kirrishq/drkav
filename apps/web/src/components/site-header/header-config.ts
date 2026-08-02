export type HeaderMenuLink = {
  href: string;
  label: string;
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
      { href: "/obo-mne/specializaciya", label: "Специализация" },
      { href: "/obo-mne/obrazovanie", label: "Образование" },
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
