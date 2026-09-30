const link = (label, href, links) => ({
  label,
  href,
  ...(links ? { links } : {}),
});

const child = link;

const operationGroups = [
  child("Грудь", "/operaczii/plastika-grudi", [
    link("Пластика груди", "/operaczii/plastika-grudi"),
    link("Увеличение груди", "/operaczii/plastika-grudi/uvelichenie-grudi"),
    link("Подтяжка груди без имплантов", "/operaczii/plastika-grudi/podtyazhka-grudi-bez-implantov"),
    link("Уменьшение груди", "/operaczii/plastika-grudi/umenshenie-grudi"),
    link("Асимметрия груди", "/operaczii/plastika-grudi/asimmetriya-grudi"),
    link("Удаление имплантов груди", "/operaczii/plastika-grudi/udalenie-implantov-grudi"),
    link("Реконструкция груди", "/operaczii/plastika-grudi/rekonstrukciya-grudi"),
    link("Липофилинг груди", "/operaczii/lipofiling/lipofiling-grudi"),
  ]),
  child("Живот и талия", "/operaczii/abdominoplastika", [
    link("Абдоминопластика", "/operaczii/abdominoplastika"),
    link("Диастаз мышц живота", "/operaczii/diastaz-myshc-zhivota"),
  ]),
  child("Коррекция фигуры", "/operaczii/liposkulptura", [
    link("Липоскульптура", "/operaczii/liposkulptura"),
    link("Подтяжка бедер", "/operaczii/liposkulptura/podtyazhka-beder"),
    link("Подтяжка рук", "/operaczii/liposkulptura/podtyazhka-ruk"),
    link("Подтяжка ягодиц", "/operaczii/liposkulptura/podtyazhka-yagodic"),
    link("Ультразвуковая липосакция", "/operaczii/liposkulptura/ultrazvukovaya-liposakciya"),
    link("Липофилинг", "/operaczii/lipofiling"),
    link("Липофилинг ягодиц", "/operaczii/lipofiling/lipofiling-yagodic"),
    link("Липосакция рук", "/operaczii/liposakcziya/liposakcziya-ruk"),
    link("Липосакция спины", "/operaczii/liposakcziya/liposakcziya-spiny"),
    link("Липосакция вдовьего горбика", "/operaczii/liposakcziya/liposakcziya-vdovego-gorbika"),
  ]),
  child("После родов", "/operaczii/plasticheskaya-hirurgiya-posle-rodov"),
  child("После похудения", "/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya"),
  child("Мужчинам", "/operaczii/muzhskaya-plastika", [
    link("Мужская атлетизация", "/operaczii/muzhskaya-plastika"),
    link("Абдоминопластика для мужчин", "/operaczii/muzhskaya-plastika/abdominoplastika-dlya-muzhchin"),
    link("Атлетизация плеч и рук", "/operaczii/muzhskaya-plastika/atletizaciya-plech-i-ruk"),
    link("Бодилифтинг для мужчин", "/operaczii/muzhskaya-plastika/bodilifting-dlya-muzhchin"),
    link("Гинекомастия", "/operaczii/muzhskaya-plastika/ginekomastiya"),
    link("Лечение гинекомастии", "/operaczii/muzhskaya-plastika/lechenie-ginekompastii"),
    link("Подтяжка ягодиц и бедер", "/operaczii/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder"),
    link("Прорисовка пресса", "/operaczii/muzhskaya-plastika/prorisovka-pressa"),
  ]),
  child("Интимная пластика", "/operaczii/intimnaya-plastika"),
  child("Без операции (РФ-лифтинг)", "/operaczii/rf-lifting", [
    link("RF-лифтинг", "/operaczii/rf-lifting"),
    link("RF-лифтинг тела", "/operaczii/rf-lifting/rf-lifting-tela"),
    link("RF-лифтинг живота", "/operaczii/rf-lifting/rf-lifting-zhivota"),
    link("RF-лифтинг шеи и декольте", "/operaczii/rf-lifting/rf-lifting-shei-i-dekolte"),
    link("RF-лифтинг Morpheus 8", "/operaczii/rf-lifting/rf-lifting-morpheus-8"),
  ]),
];

const operationFooterLinks = operationGroups.map(({ href, label }) => ({ href, label }));

export const navigation = {
  headerMenu: [
    {
      href: "/obo-mne",
      label: "Обо мне",
      links: [
        link("Обо мне", "/obo-mne"),
        link("Дипломы и лицензии", "/obo-mne/diplomy-i-licenzii"),
        link("Вклад в медицину", "/obo-mne/publikacii"),
        link("Выступления", "/obo-mne/vystupleniya"),
        link("СМИ и проекты", "/obo-mne/smi"),
        link("Не Школа", "/obo-mne/neshkola"),
        link("Книга", "/obo-mne/book"),
      ],
    },
    { href: "/akcii", label: "Акции", featured: true },
    { href: "/ceny", label: "Цены" },
    {
      href: "/operaczii",
      label: "Операции",
      links: [link("Все операции", "/operaczii"), ...operationGroups],
    },
    {
      href: "/pacientam",
      label: "Пациентам",
      links: [
        link("Пациентам", "/pacientam"),
        link("Блог доктора", "/pacientam/blog"),
        link("Отзывы", "/pacientam/otzyvy"),
        link("Как всё будет", "/pacientam/kak-vse-budet"),
        link("Список анализов", "/pacientam/spisok-analizov"),
        link("Ваш личный ассистент", "/pacientam/lichnyy-assistent"),
        link("Безопасность", "/pacientam/bezopasnost"),
        link("Вопрос-ответ", "/pacientam/vopros-otvet"),
        link("Про болезни", "/pacientam/pro-bolezni"),
      ],
    },
    { href: "/pacientam/portfolio", label: "Портфолио" },
    { href: "/pacientam/do-i-posle", label: "До/после" },
    { href: "/kontakty", label: "Контакты" },
  ],
  footerColumns: [
    {
      heading: "Обо мне",
      links: [
        link("Обо мне", "/obo-mne"),
        link("Дипломы и лицензии", "/obo-mne/diplomy-i-licenzii"),
        link("Вклад в медицину", "/obo-mne/publikacii"),
        link("Выступления", "/obo-mne/vystupleniya"),
        link("СМИ и проекты", "/obo-mne/smi"),
        link("Не Школа", "/obo-mne/neshkola"),
        link("Книга", "/obo-mne/book"),
      ],
    },
    {
      heading: "Операции",
      links: [link("Все операции", "/operaczii"), ...operationFooterLinks],
    },
    {
      heading: "Пациентам",
      links: [
        link("Пациентам", "/pacientam"),
        link("Блог доктора", "/pacientam/blog"),
        link("Отзывы", "/pacientam/otzyvy"),
        link("Как всё будет", "/pacientam/kak-vse-budet"),
        link("Список анализов", "/pacientam/spisok-analizov"),
        link("Ваш личный ассистент", "/pacientam/lichnyy-assistent"),
        link("Безопасность", "/pacientam/bezopasnost"),
        link("Вопрос-ответ", "/pacientam/vopros-otvet"),
        link("Про болезни", "/pacientam/pro-bolezni"),
        link("Портфолио", "/pacientam/portfolio"),
        link("До/после", "/pacientam/do-i-posle"),
      ],
    },
    {
      heading: "Основное",
      links: [
        link("Акции", "/akcii"),
        link("Цены", "/ceny"),
        link("Контакты", "/kontakty"),
      ],
    },
  ],
  socialLinks: [
    { href: "https://t.me/drkav_official", kind: "telegram", label: "Telegram" },
    { href: "https://www.youtube.com/channel/UCyNisHCb9vYS6qLWlgK6lwg", kind: "youtube", label: "YouTube" },
    { href: "https://www.instagram.com/dr.kav/", kind: "instagram", label: "Instagram*" },
    { href: "https://vk.com/publicdoctorkav", kind: "vk", label: "ВКонтакте" },
  ],
  contact: {
    administratorHours: "Администратор · 9:15–19:00, Пн–Пт",
    administratorPhone: "+7 925 625-55-10",
    administratorPhoneHref: "tel:+79256255510",
    clinicAddress: "г. Москва, Рублёво-Успенское шоссе, 123Б, этаж 2, кабинет 1",
    clinicDescriptor: "Пластический хирург, Москва",
    clinicPhone: "+7 495 151-42-06",
    clinicPhoneHref: "tel:+74951514206",
    emailHref: "mailto:admin@drkav.ru",
    emailLabel: "admin@drkav.ru",
    footerEmailHref: "mailto:pr@drkav.ru",
    footerEmailLabel: "pr@drkav.ru",
    footerWhatsappHref: "https://api.whatsapp.com/send/?app_absent=0&phone=79256255510&text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%2C%20%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%21%20%D0%9F%D0%B8%D1%88%D1%83%20%D1%81%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20drkav.ru.%20%D0%95%D1%81%D1%82%D1%8C%20%D0%B2%D0%BE%D0%BF%D1%80%D0%BE%D1%81%3A",
    footerWhatsappLabel: "WhatsApp: +7 925 625-55-10",
    maxHref: "https://max.ru/",
    telegramHref: "https://t.me/+79256255510",
    whatsappHref: "https://wa.me/79256255510?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%2C%20%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%21%20%D0%9F%D0%B8%D1%88%D1%83%20%D1%81%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20drkav.ru.%20%D0%95%D1%81%D1%82%D1%8C%20%D0%B2%D0%BE%D0%BF%D1%80%D0%BE%D1%81%3A",
  },
};
