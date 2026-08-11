import { RecordCard } from "@drkav/ui";

import { StaticPage } from "@/components/content-page/static-page";
import { getPageMetadata } from "@/content/page-registry";

export const metadata = getPageMetadata("/pacientam");

const patientSections = [
  {
    id: "results",
    title: "Результаты и опыт пациентов",
    pages: [
      {
        description: "Подробные истории лечения: путь пациента, особенности операции и результаты восстановления.",
        href: "/pacientam/portfolio",
        title: "Портфолио",
      },
      {
        description: "Фотографии результатов по срокам, которые помогают обсудить ожидания на консультации.",
        href: "/pacientam/do-i-posle",
        title: "До и после",
      },
      {
        description: "Впечатления пациентов о консультации, операции, сопровождении и восстановлении.",
        href: "/pacientam/otzyvy",
        title: "Отзывы",
      },
    ],
  },
  {
    id: "preparation",
    title: "Подготовка и сопровождение",
    pages: [
      {
        description: "Понятный маршрут от первого обращения и консультации до восстановления после операции.",
        href: "/pacientam/kak-vse-budet",
        title: "Как всё будет",
      },
      {
        description: "Какие обследования нужны перед операцией и как проверить сроки их актуальности.",
        href: "/pacientam/spisok-analizov",
        title: "Список анализов",
      },
      {
        description: "К кому обратиться с организационными вопросами до операции и в период восстановления.",
        href: "/pacientam/lichnyy-assistent",
        title: "Ваш личный ассистент",
      },
      {
        description: "Как формируется безопасный план операции: обследования, анестезия и врачебный контроль.",
        href: "/pacientam/bezopasnost",
        title: "Безопасность",
      },
    ],
  },
  {
    id: "knowledge",
    title: "Ответы и полезные материалы",
    pages: [
      {
        description: "Короткие ответы на частые вопросы о подготовке, операции и восстановлении.",
        href: "/pacientam/vopros-otvet",
        title: "Вопрос-ответ",
      },
      {
        description: "Материалы о заболеваниях, показаниях, противопоказаниях и важных особенностях лечения.",
        href: "/pacientam/pro-bolezni",
        title: "Про болезни",
      },
      {
        description: "Статьи доктора о пластической хирургии, подготовке к операциям и восстановлении.",
        href: "/pacientam/blog",
        title: "Блог доктора",
      },
    ],
  },
] as const;

export default function PatientsPage() {
  return (
    <StaticPage
      breadcrumbs={[{ href: "/", label: "Главная" }, { label: "Пациентам" }]}
      description="Собрали материалы, которые помогают подготовиться к консультации и операции, спланировать восстановление и найти ответы на важные вопросы."
      title="Пациентам"
    >
      <div className="patient-page-content">
        {patientSections.map((section) => (
          <section className="content-card content-card--muted content-section" id={section.id} key={section.id}>
            <h2 className="content-card__heading content-card__heading--h2">{section.title}</h2>
            <div className="content-card__grid">
              {section.pages.map((page) => (
                <RecordCard details={[{ value: page.description }]} href={page.href} key={page.href} title={page.title} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </StaticPage>
  );
}
