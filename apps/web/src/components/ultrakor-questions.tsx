"use client";

import { useState } from "react";

import { ContactActionIcon } from "@drkav/ui";
import { administratorContact } from "@/components/site-header/header-config";

type QuestionBlock = {
  heading?: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
};

type QuestionItem = {
  title: string;
  blocks: readonly QuestionBlock[];
};

const questionItems: readonly QuestionItem[] = [
  {
    title: "Какой формат консультации мне выбрать?",
    blocks: [
      {
        paragraphs: [
          "Выбор формата консультации зависит от того, насколько детально вы хотите обсудить ситуацию и удобно ли вам приехать в клинику. Все варианты дают полное понимание объёма операции, рисков и результата — отличается только формат общения.",
        ],
      },
      {
        heading: "Очная консультация в клинике",
        paragraphs: ["Я буду рад встретиться с вами и ответить на любые интересующие вас вопросы:"],
        bullets: [
          "Поговорим, какими методами можно скорректировать зоны, которые вам не нравятся в теле.",
          "Определим, есть ли диастаз и грыжа, необходима ли коррекция.",
          "Обсудим риски, связанные с операцией.",
          "Вы получите рекомендации по подготовке к операции, направления для обследования и план дальнейших действий.",
          "Вы узнаете точную стоимость операции и подберёте удобную дату, если примете решение.",
        ],
      },
      {
        heading: "Консультация онлайн",
        paragraphs: ["Мы созвонимся по видеосвязи и обсудим всё:"],
        bullets: [
          "Поговорим, какими методами можно скорректировать зоны, которые вам не нравятся в теле.",
          "Обсудим риски, связанные с операцией.",
          "Вы получите рекомендации по подготовке к операции, направления для обследования и план дальнейших действий.",
          "Вы узнаете точную стоимость операции и подберёте удобную дату, если примете решение.",
          "Если после онлайн-консультации вам потребуется дополнительная очная консультация в клинике, она будет предоставлена бесплатно.",
        ],
      },
    ],
  },
  {
    title: "Реабилитация",
    blocks: [
      {
        paragraphs: [
          "Реабилитация после пластической операции является очень важным этапом восстановления здоровья и внешнего вида пациента. Она помогает ускорить заживление ран, снизить отёк и уменьшить риск осложнений.",
          "Следуйте инструкциям пластического хирурга. После операции вам будет дан список рекомендаций, которые нужно соблюдать. Это может включать ношение компрессионного бандажа, ограничение физической активности и приём лекарств.",
          "Наблюдайте за своим здоровьем. Отслеживайте симптомы и не стесняйтесь обращаться к доктору, если вас что-то беспокоит.",
          "Носите компрессионное бельё 1 месяц постоянно. Это поможет снизить отёк и ускорить заживление. Запрещено принимать солнечные ванны, посещать бани и сауны в первые месяцы после операции.",
          "Избегайте физических нагрузок. Первые несколько недель после операции старайтесь не заниматься интенсивными упражнениями и не поднимать тяжести. Спорт вводится только с разрешения доктора.",
          "Употребляйте достаточное количество воды, чтобы избежать обезвоживания. Следуйте рекомендациям по питанию. Питание должно быть сбалансированным и содержать достаточное количество белка и витаминов. Острая и солёная пища нежелательна в период восстановления.",
          "Не курите. Курение может замедлить заживление ран и увеличить риск осложнений. Алкоголь под запретом: он приводит к отёкам и увеличивает риск осложнений.",
          "Рекомендован лимфодренажный массаж — ручной или аппаратный, LPG-массаж, Эндосфера, Icoon laser.",
          "Согласуйте с доктором план ухода за послеоперационными рубцами и следуйте указаниям. Использование силиконовых пластырей и гелей необходимо обсудить с врачом.",
        ],
      },
    ],
  },
  {
    title: "Личный ассистент",
    blocks: [
      {
        paragraphs: [
          "Доктор Коробов предлагает своим пациентам личного помощника. Личный ассистент работает с каждым пациентом индивидуально, обеспечивая персональный подход. Ваш личный ассистент будет выполнять следующие задачи:",
        ],
        bullets: [
          "Поможет в записи на консультацию, подберёт удобное время и дату с учётом ваших индивидуальных потребностей.",
          "Соберёт и подготовит все необходимые медицинские данные и результаты анализов для обработки врачом.",
          "Поможет в подготовке к операции: предоставит информацию и рекомендации, связанные с подготовкой, необходимыми анализами и действиями перед операцией.",
          "Предоставит инструкции и рекомендации, связанные с операцией и восстановительным периодом, чтобы помочь справиться с возможными трудностями и вопросами после операции.",
          "В течение года после операции будет приглашать вас на перевязки и осмотры, подбирая подходящее время приёма.",
        ],
      },
    ],
  },
];

const contactLinks = [
  { href: administratorContact.whatsappHref, kind: "whatsapp" as const, label: "WhatsApp" },
  { href: administratorContact.telegramHref, kind: "telegram" as const, label: "Telegram" },
  { href: administratorContact.maxHref, kind: "max" as const, label: "MAX" },
];

function QuestionContent({ blocks }: { blocks: readonly QuestionBlock[] }) {
  return (
    <div className="ultrakor-accordion__content-inner">
      {blocks.map((block, index) => (
        <div className="ultrakor-questions__block" key={block.heading ?? `question-block-${index}`}>
          {block.heading ? <h3 className="ultrakor-accordion__subheading">{block.heading}</h3> : null}
          {block.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {block.bullets ? (
            <ul>
              {block.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function UltrakorQuestions() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section aria-labelledby="ultrakor-questions-title" className="ultrakor__section ultrakor-questions" id="ask">
      <div className="ultrakor__inner">
        <h2 className="ultrakor__heading" id="ultrakor-questions-title">Ответы на популярные вопросы</h2>
        <div className="ultrakor-pricing__offers ultrakor-questions__offers">
          {questionItems.map((item, index) => {
            const open = openIndex === index;
            const contentId = `ultrakor-question-content-${index}`;

            return (
              <section className={`ultrakor-pricing__offer${open ? " is-open" : ""}`} key={item.title}>
                <button aria-controls={contentId} aria-expanded={open} onClick={() => setOpenIndex(open ? null : index)} type="button">
                  <span>{item.title}</span>
                  <span aria-hidden="true">+</span>
                </button>
                <div aria-hidden={!open} className="ultrakor-pricing__offer-content" id={contentId}>
                  <QuestionContent blocks={item.blocks} />
                </div>
              </section>
            );
          })}
        </div>

        <div className="ultrakor-questions__cta">
          <h3 className="ultrakor__heading">Остались вопросы?</h3>
          <p>Вы можете связаться с ассистентом и получить ответ на любой вопрос по процедуре</p>
          <div className="ultrakor-questions__cta-actions">
            {contactLinks.map((contact) => (
              <a className="ultrakor__button ultrakor__button--solid" href={contact.href} key={contact.kind} rel="noreferrer" target="_blank">
                <span className="ultrakor-questions__cta-icon"><ContactActionIcon kind={contact.kind} /></span>
                <span>{contact.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
