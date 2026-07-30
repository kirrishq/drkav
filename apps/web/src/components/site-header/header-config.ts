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
      { href: "/obo-mne/publikacii", label: "Вклад в медицину" },
      { href: "/obo-mne/vystupleniya", label: "Выступления" },
      {
        href: "/obo-mne/diplomy-i-licenzii",
        label: "Дипломы и лицензии",
      },
      { href: "/obo-mne/smi-i-proekty", label: "СМИ и проекты" },
      { href: "/obo-mne/obuchenie", label: "Обучение" },
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
    href: "/operacii",
    label: "Операции",
    links: [
      { href: "/operacii", label: "Все операции" },
      { href: "/operacii/grud", label: "Грудь" },
      { href: "/operacii/zhivot-i-taliya", label: "Живот и талия" },
      { href: "/operacii/korrekciya-figury", label: "Коррекция фигуры" },
      { href: "/operacii/posle-rodov", label: "После родов" },
      { href: "/operacii/posle-pohudeniya", label: "После похудения" },
      { href: "/operacii/muzhchinam", label: "Мужчинам" },
      { href: "/operacii/intimnaya-plastika", label: "Интимная пластика" },
      {
        href: "/operacii/bez-operacii/rf-lifting",
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
    href: "/portfolio",
    label: "Портфолио",
  },
  {
    href: "/do-posle",
    label: "До/после",
  },
  {
    href: "/kontakty",
    label: "Контакты",
  },
] as const;
