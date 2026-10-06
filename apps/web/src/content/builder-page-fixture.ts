import type { BuilderPage } from "@drkav/content-contracts";

/** Local visual fixture for validating the renderer before the first CMS entry exists. */
export const builderPageFixture = {
  pageKey: "builder-demo",
  canonicalPath: "/design-system/page-builder",
  internalName: "Демонстрация конструктора",
  seo: {
    title: "Конструктор страниц — drkav",
    description: "Внутренняя демонстрация рендера страниц из блоков.",
    canonicalPath: "/design-system/page-builder",
    noIndex: true,
  },
  theme: {
    accentColor: "#ff4aa8",
    backgroundColor: "#eceef3",
    textColor: "#16171c",
    headingFont: "geist",
    bodyFont: "geist",
  },
  blocks: [
    {
      id: "demo-hero",
      type: "hero",
      eyebrow: "Controlled block library",
      heading: "Страница собирается из управляемых блоков",
      description:
        "Этот первый вертикальный срез показывает, как одна и та же типизированная модель будет работать для CMS, preview и опубликованной страницы.",
      image: {
        url: "/images/doctor-portrait.png",
        alternativeText: "Доктор Коробов",
        width: 960,
        height: 1200,
      },
      primaryAction: {
        label: "Записаться на консультацию",
        href: "/konsultaciya",
        variant: "primary",
        openInNewTab: false,
      },
      secondaryAction: {
        label: "Открыть дизайн-систему",
        href: "/design-system",
        variant: "outline",
        openInNewTab: false,
      },
      align: "left",
    },
    {
      id: "demo-copy",
      type: "rich-text",
      heading: "Что уже заложено в контракт",
      body: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "Блоки получают данные через ContentRepository и не знают о Strapi или способе загрузки контента.",
            },
          ],
        },
        {
          type: "list",
          format: "unordered",
          children: [
            {
              type: "list-item",
              children: [{ type: "text", text: "одинаковый renderer для preview и public" }],
            },
            {
              type: "list-item",
              children: [{ type: "text", text: "ограниченные настройки темы вместо произвольного CSS" }],
            },
          ],
        },
      ],
    },
    {
      id: "demo-callout",
      type: "callout",
      title: "Без переключения существующих страниц",
      tone: "accent",
      body: [
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "Новые страницы могут использовать конструктор постепенно, пока текущие React-маршруты продолжают работать без изменений.",
            },
          ],
        },
      ],
    },
    {
      id: "demo-faq",
      type: "faq",
      heading: "Следующий этап",
      items: [
        {
          question: "Где будет храниться порядок блоков?",
          answer: "В Dynamic Zone Strapi: порядок элементов в blocks и есть порядок на странице.",
        },
        {
          question: "Как менеджер увидит мобильную версию?",
          answer: "В редакторе будет отдельный responsive preview с тем же renderer и ограниченной шириной viewport.",
        },
      ],
    },
  ],
} satisfies BuilderPage;
