import { RecordCard } from "@drkav/ui";

const patientPageMap = {
  portfolio: {
    description: "Истории операций, восстановление и результаты лечения.",
    href: "/pacientam/portfolio",
    title: "Портфолио",
  },
  beforeAfter: {
    description: "Фотографии результатов по срокам после операции.",
    href: "/pacientam/do-i-posle",
    title: "До и после",
  },
  blog: {
    description: "Статьи о пластической хирургии и восстановлении.",
    href: "/pacientam/blog",
    title: "Блог доктора",
  },
  reviews: {
    description: "Впечатления пациентов о консультации и восстановлении.",
    href: "/pacientam/otzyvy",
    title: "Отзывы",
  },
  journey: {
    description: "Путь пациента от консультации до контрольных осмотров.",
    href: "/pacientam/kak-vse-budet",
    title: "Как всё будет",
  },
  tests: {
    description: "Обследования перед операцией и сроки их актуальности.",
    href: "/pacientam/spisok-analizov",
    title: "Список анализов",
  },
  assistant: {
    description: "Организационная поддержка до и после операции.",
    href: "/pacientam/lichnyy-assistent",
    title: "Ваш личный ассистент",
  },
  safety: {
    description: "Подготовка, анестезия и контроль на всех этапах.",
    href: "/pacientam/bezopasnost",
    title: "Безопасность",
  },
  faq: {
    description: "Ответы на частые вопросы о подготовке и восстановлении.",
    href: "/pacientam/vopros-otvet",
    title: "Вопрос-ответ",
  },
  conditions: {
    description: "Материалы о заболеваниях и особенностях лечения.",
    href: "/pacientam/pro-bolezni",
    title: "Про болезни",
  },
} as const;

export const patientNavigationPages = Object.values(patientPageMap);

export const patientSections = [
  {
    id: "results",
    title: "Результаты и опыт пациентов",
    pages: [patientPageMap.portfolio, patientPageMap.beforeAfter, patientPageMap.reviews],
  },
  {
    id: "preparation",
    title: "Подготовка и сопровождение",
    pages: [patientPageMap.journey, patientPageMap.tests, patientPageMap.assistant, patientPageMap.safety],
  },
  {
    id: "knowledge",
    title: "Ответы и полезные материалы",
    pages: [patientPageMap.faq, patientPageMap.conditions, patientPageMap.blog],
  },
] as const;

export function PatientRelatedPages({ currentHref }: { currentHref: string }) {
  const currentIndex = patientNavigationPages.findIndex((page) => page.href === currentHref);

  if (currentIndex < 0) {
    return null;
  }

  const previousPage = patientNavigationPages.at((currentIndex - 1 + patientNavigationPages.length) % patientNavigationPages.length);
  const nextPage = patientNavigationPages.at((currentIndex + 1) % patientNavigationPages.length);
  const adjacentPages = [previousPage, nextPage].filter((page): page is (typeof patientNavigationPages)[number] => page !== undefined);

  return (
    <section aria-labelledby="patient-related-pages-title" className="patient-related-pages">
      <h2 className="type-h2 patient-related-pages__title" id="patient-related-pages-title">Другие разделы для пациентов</h2>
      <div className="patient-related-pages__grid">
        {adjacentPages.map((page) => (
          <RecordCard description={page.description} href={page.href} key={page.href} title={page.title} />
        ))}
      </div>
    </section>
  );
}
