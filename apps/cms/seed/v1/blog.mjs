const text = (value) => ({ type: "text", text: value });
const paragraph = (value) => ({ type: "paragraph", children: [text(value)] });
const heading = (value) => ({ type: "heading", level: 2, children: [text(value)] });

export const blogCategories = [
  { name: "Подготовка к операции", key: "podgotovka", order: 1 },
  { name: "Восстановление", key: "vosstanovlenie", order: 2 },
  { name: "Пластика груди", key: "plastika-grudi", order: 3 },
  { name: "Контур тела", key: "kontur-tela", order: 4 },
];

export const blogArticles = [
  {
    title: "Как подготовиться к консультации пластического хирурга",
    slug: "kak-podgotovitsya-k-konsultacii-plasticheskogo-hirurga",
    canonicalPath: "/pacientam/blog/kak-podgotovitsya-k-konsultacii-plasticheskogo-hirurga",
    excerpt: "Что вспомнить заранее, какие вопросы задать и почему честный разговор о здоровье помогает составить безопасный план.",
    readingTimeMinutes: 4,
    isFeatured: true,
    categoryKeys: ["podgotovka"],
    relatedOperationPaths: ["/operaczii/plastika-grudi"],
    seo: {
      metaTitle: "Как подготовиться к консультации пластического хирурга — DrKAV",
      metaDescription: "Памятка для подготовки к консультации пластического хирурга: цели, вопросы, сведения о здоровье и следующий шаг.",
      canonicalPath: "/pacientam/blog/kak-podgotovitsya-k-konsultacii-plasticheskogo-hirurga",
      noIndex: true,
    },
    contentSections: [
      {
        __component: "blog.rich-text-section",
        sectionKey: "before-appointment",
        heading: "До встречи",
        body: [
          paragraph("Консультация нужна, чтобы обсудить задачу, состояние здоровья и возможные варианты. Заранее сформулируйте, что именно вы хотите изменить и какой результат для вас будет комфортным."),
          heading("Что полезно подготовить"),
          { type: "list", format: "unordered", children: [
            { type: "list-item", children: [text("Список хронических заболеваний, перенесённых операций и принимаемых препаратов.")] },
            { type: "list-item", children: [text("Вопросы о подготовке, восстановлении и ограничениях после вмешательства.")] },
            { type: "list-item", children: [text("Понимание удобных сроков для операции и восстановления.")] }
          ] }
        ]
      },
      {
        __component: "blog.callout",
        sectionKey: "individual-plan",
        title: "Важно",
        body: [paragraph("Информация в статье не заменяет очную консультацию и обследование. План лечения всегда составляется индивидуально.")]
      },
      {
        __component: "blog.faq",
        sectionKey: "faq",
        heading: "Частые вопросы",
        items: [
          { question: "Нужно ли приносить анализы?", answer: "Если у вас есть недавние результаты обследований, возьмите их с собой. Полный перечень необходимых анализов врач определяет после консультации." },
          { question: "Можно ли обсудить несколько задач за один приём?", answer: "Да. Это помогает расставить приоритеты и понять, какие решения могут быть уместны именно в вашей ситуации." }
        ]
      }
    ],
    relatedArticleSlugs: ["pochemu-vazhen-plan-vosstanovleniya"]
  },
  {
    title: "Почему план восстановления обсуждают до операции",
    slug: "pochemu-vazhen-plan-vosstanovleniya",
    canonicalPath: "/pacientam/blog/pochemu-vazhen-plan-vosstanovleniya",
    excerpt: "Восстановление — часть общего плана: как заранее организовать быт, работу и поддержку близких.",
    readingTimeMinutes: 3,
    isFeatured: false,
    categoryKeys: ["vosstanovlenie"],
    relatedOperationPaths: ["/operaczii/plasticheskaya-hirurgiya-posle-rodov"],
    seo: {
      metaTitle: "План восстановления после операции — DrKAV",
      metaDescription: "Почему план восстановления обсуждают заранее: бытовые вопросы, поддержка близких и контрольные визиты.",
      canonicalPath: "/pacientam/blog/pochemu-vazhen-plan-vosstanovleniya",
      noIndex: true,
    },
    contentSections: [
      {
        __component: "blog.rich-text-section",
        sectionKey: "recovery-plan",
        heading: "Восстановление — часть подготовки",
        body: [
          paragraph("До вмешательства важно обсудить не только саму операцию, но и период после неё. Это позволяет заранее распределить бытовые задачи и спланировать контрольные визиты."),
          { type: "list", format: "unordered", children: [
            { type: "list-item", children: [text("Уточните временные ограничения и график осмотров.")] },
            { type: "list-item", children: [text("Предусмотрите помощь близких в первые дни, если она потребуется.")] },
            { type: "list-item", children: [text("Не планируйте важные поездки и интенсивные нагрузки без согласования с врачом.")] }
          ] }
        ]
      },
      {
        __component: "blog.callout",
        sectionKey: "follow-doctor",
        title: "Ориентируйтесь на рекомендации врача",
        body: [paragraph("Сроки восстановления и ограничения зависят от вида вмешательства, исходного состояния и динамики заживления.")]
      }
    ],
    relatedArticleSlugs: ["kak-podgotovitsya-k-konsultacii-plasticheskogo-hirurga"]
  },
  {
    title: "Какие вопросы обсудить перед пластикой груди",
    slug: "voprosy-pered-plastikoy-grudi",
    canonicalPath: "/pacientam/blog/voprosy-pered-plastikoy-grudi",
    excerpt: "Короткий список тем для консультации: цель операции, обследования, план восстановления и реалистичные ожидания.",
    readingTimeMinutes: 4,
    isFeatured: false,
    categoryKeys: ["podgotovka", "plastika-grudi"],
    relatedOperationPaths: ["/operaczii/plastika-grudi"],
    seo: {
      metaTitle: "Вопросы перед пластикой груди — DrKAV",
      metaDescription: "Какие вопросы обсудить с пластическим хирургом перед пластикой груди: цели, подготовка, восстановление и ожидания.",
      canonicalPath: "/pacientam/blog/voprosy-pered-plastikoy-grudi",
      noIndex: true,
    },
    contentSections: [
      {
        __component: "blog.rich-text-section",
        sectionKey: "consultation-topics",
        heading: "На чём сосредоточиться на консультации",
        body: [
          paragraph("Хорошая консультация помогает соотнести ожидания с возможностями конкретной ситуации. Не стесняйтесь уточнять все этапы — от подготовки до восстановления."),
          { type: "list", format: "ordered", children: [
            { type: "list-item", children: [text("Какую задачу решает выбранный вариант вмешательства.")] },
            { type: "list-item", children: [text("Какие обследования потребуются перед операцией.")] },
            { type: "list-item", children: [text("Какие ограничения и контрольные визиты предусмотрены в период восстановления.")] }
          ] }
        ]
      }
    ],
    relatedArticleSlugs: []
  },
  {
    title: "Как формируется индивидуальный план коррекции фигуры",
    slug: "individualnyy-plan-korrekcii-figury",
    canonicalPath: "/pacientam/blog/individualnyy-plan-korrekcii-figury",
    excerpt: "Почему одинаковых планов не бывает: цели, анатомические особенности, безопасность и время на восстановление.",
    readingTimeMinutes: 3,
    isFeatured: false,
    categoryKeys: ["kontur-tela"],
    relatedOperationPaths: ["/operaczii/liposkulptura"],
    seo: {
      metaTitle: "Индивидуальный план коррекции фигуры — DrKAV",
      metaDescription: "Из чего складывается индивидуальный план коррекции фигуры: цель, анатомические особенности, безопасность и восстановление.",
      canonicalPath: "/pacientam/blog/individualnyy-plan-korrekcii-figury",
      noIndex: true,
    },
    contentSections: [
      {
        __component: "blog.rich-text-section",
        sectionKey: "individual-approach",
        heading: "Основа плана — индивидуальная оценка",
        body: [
          paragraph("На консультации врач оценивает исходные данные, обсуждает приоритеты и объясняет, какие решения могут быть уместны. Важна не только желаемая зона коррекции, но и общее состояние здоровья и готовность к восстановлению."),
          paragraph("Цель консультации — составить понятный и безопасный план, а не выбрать решение по шаблону.")
        ]
      }
    ],
    relatedArticleSlugs: []
  }
];
