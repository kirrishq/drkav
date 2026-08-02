import type { Metadata } from "next";
import type { ReactNode, SVGProps } from "react";

import {
  Button,
  Checkbox,
  RecordCard,
  FormDescription,
  FormField,
  FormMessage,
  FeatureLinkCard,
  Input,
  Label,
  PageIntro,
  Radio,
  RadioButton,
  TextLink,
  VideoCard,
} from "@drkav/ui";
import { PhoneInput } from "@drkav/ui/phone-input";

import { DesignSystemNav } from "./design-system-nav";

export const metadata: Metadata = {
  title: "Design System — drkav",
  description: "Внутренняя документация дизайн-системы drkav.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const semanticColors = [
  { name: "background", className: "bg-background" },
  { name: "surface", className: "bg-surface" },
  { name: "surface-muted", className: "bg-surface-muted" },
  { name: "surface-inverse", className: "bg-surface-inverse" },
  { name: "text-primary", className: "bg-text-primary" },
  { name: "text-secondary", className: "bg-text-secondary" },
  { name: "text-muted", className: "bg-text-muted" },
  { name: "border-subtle", className: "bg-border-subtle" },
  { name: "border-strong", className: "bg-border-strong" },
  { name: "accent", className: "bg-accent" },
  { name: "accent-hover", className: "bg-accent-hover" },
  { name: "accent-soft", className: "bg-accent-soft" },
  { name: "success", className: "bg-success" },
] as const;

const typographyRoles = [
  {
    name: "type-display",
    sample: "Выразительный первый экран",
    description: "Крупный акцентный текст hero-блока.",
  },
  {
    name: "type-h1",
    sample: "Заголовок страницы",
    description: "Главный заголовок h1, один на страницу.",
  },
  {
    name: "type-h2",
    sample: "Заголовок раздела",
    description: "Основные смысловые секции страницы.",
  },
  {
    name: "type-h3",
    sample: "Заголовок группы",
    description: "Группы карточек и вложенные блоки.",
  },
  {
    name: "type-h4",
    sample: "Заголовок карточки или компактного блока",
    description: "Четвёртый уровень заголовков и самостоятельные карточки.",
  },
  {
    name: "type-text-xl",
    sample: "Крупный вводный текст помогает быстро понять содержание страницы.",
    description: "Лид, вступление и важные пояснения.",
  },
  {
    name: "type-text-base",
    sample: "Основной текст для материалов, описаний и интерфейсного контента.",
    description: "Базовый стиль длинного и интерфейсного текста.",
  },
  {
    name: "type-text-sm",
    sample: "Вспомогательный текст и компактные пояснения.",
    description: "Подписи, метаданные и вторичная информация.",
  },
  {
    name: "type-text-xs",
    sample: "Короткие метаданные и дата",
    description: "Самая компактная текстовая роль для вторичной информации.",
  },
  {
    name: "type-label",
    sample: "Подпись элемента",
    description: "Кнопки, поля и короткие интерфейсные метки.",
  },
  {
    name: "type-overline",
    sample: "Категория раздела",
    description: "Надзаголовки и группирующие метки.",
  },
  {
    name: "type-code",
    sample: "const repository: ContentRepository",
    description: "Код, токены и технические значения.",
  },
] as const;

const variants = ["primary", "secondary", "outline", "ghost", "link"] as const;
const sizes = ["sm", "md", "lg", "icon"] as const;

const nameConstraints = {
  maxLength: 80,
  minLength: 2,
  pattern: "[A-Za-zА-Яа-яЁё](?:[A-Za-zА-Яа-яЁё ]|'|-){1,79}",
  title: "Используйте от 2 до 80 букв, пробел, дефис или апостроф.",
} as const;

const emailConstraints = {
  inputMode: "email",
  maxLength: 254,
} as const;

const searchConstraints = {
  enterKeyHint: "search",
  maxLength: 120,
  minLength: 2,
  pattern: ".{2,120}",
} as const;

const textConstraints = {
  maxLength: 120,
  minLength: 2,
  pattern: ".{2,120}",
} as const;

function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        d="M4 10h12m-4-4 4 4-4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        d="m5 5 10 10M15 5 5 15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20" {...props}>
      <circle cx="10" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4.5 16c.6-3 2.5-4.5 5.5-4.5s4.9 1.5 5.5 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20" {...props}>
      <path
        d="M6.25 3.5 8 6.75 6.8 8.1a11 11 0 0 0 5.1 5.1l1.35-1.2 3.25 1.75-.35 2.1c-.1.6-.65 1.05-1.25 1.05C8.4 16.9 3.1 11.6 3.1 5.1c0-.6.45-1.15 1.05-1.25l2.1-.35Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20" {...props}>
      <path
        d="m3.25 9.25 12.9-5.15c.55-.2 1.05.3.85.85l-4.65 11.8c-.2.55-.95.6-1.25.1L8.65 13l-2.5 2.05.35-3.45 7.2-5.15-8.85 4.2-1.6-.55c-.45-.15-.45-.7 0-.85Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function MaxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20" {...props}>
      <path
        d="M4 15.5v-11l6 6 6-6v11"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20" {...props}>
      <circle cx="8.75" cy="8.75" r="4.75" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m12.25 12.25 3.5 3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ValidationIcon({
  status,
  ...props
}: SVGProps<SVGSVGElement> & { status: "error" | "success" }) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20" {...props}>
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      {status === "success" ? (
        <path
          d="m6.75 10 2.1 2.1 4.4-4.45"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.75"
        />
      ) : (
        <path
          d="M10 6.25v4.5m0 2.75h.01"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.75"
        />
      )}
    </svg>
  );
}

function Section({
  children,
  description,
  id,
  title,
}: {
  children: ReactNode;
  description: string;
  id: string;
  title: string;
}) {
  return (
    <section
      className="scroll-mt-8 border-t border-border py-12 first:border-t-0 first:pt-0"
      id={id}
    >
      <div className="mb-8 max-w-reading">
        <p className="type-overline text-accent">
          {["button", "text-link", "page-intro", "record-card", "input", "checkbox", "radio", "radio-button"].includes(id)
            ? "Components"
            : id === "overview"
              ? "System"
              : "Foundations"}
        </p>
        <h2 className="type-h2 mt-2 text-primary">
          {title}
        </h2>
        <p className="type-text-base mt-3 text-secondary">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Subsection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="mt-10 first:mt-0">
      <h3 className="type-h3 text-primary">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ExamplePanel({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-surface p-6 shadow-subtle">
      {children}
    </div>
  );
}

function FieldGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-6 rounded-lg border border-border bg-surface p-5 shadow-subtle sm:grid-cols-2 sm:p-6">
      {children}
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="type-code overflow-x-auto rounded-lg border border-border bg-surface-inverse p-4 text-inverse">
      <code>{children}</code>
    </pre>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-wide items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <p className="type-label text-primary">drkav / Design System</p>
          <p className="type-text-sm text-secondary">Internal documentation</p>
        </div>
      </header>

      <div className="mx-auto max-w-wide px-4 py-10 sm:px-6 lg:grid lg:grid-cols-4 lg:gap-12 lg:px-8 lg:py-16">
        <DesignSystemNav />

        <main className="min-w-0 max-w-content pb-24 lg:col-span-3">
          <Section
            description="Минимальная общая основа для последовательного, доступного и CMS-независимого интерфейса drkav.ru."
            id="overview"
            title="Overview"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Principle", "Mobile-first"],
                ["Architecture", "Server-first"],
                ["Styling", "Shared tokens"],
              ].map(([label, value]) => (
                <div
                  className="rounded-lg border border-border bg-surface p-5 shadow-subtle"
                  key={label}
                >
                  <p className="type-overline text-secondary">
                    {label}
                  </p>
                  <p className="type-label mt-2 text-primary">{value}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section
            description="FeatureLinkCard — карточка-навигация с изображением, подписью и общей стрелкой интерактивных карточек. Изображение мягко увеличивается при наведении и фокусе."
            id="feature-link-card"
            title="Feature Link Card"
          >
            <Subsection title="Usage">
              <div className="max-w-md">
                <FeatureLinkCard
                  href="#feature-link-card"
                  imageAlt="Доктор читает книгу"
                  imageSrc="/images/about-pages/book.png"
                  title="Книга «Боль двенадцати женщин»"
                />
              </div>
              <CodeBlock>{`import { FeatureLinkCard } from "@drkav/ui";

<FeatureLinkCard
  href="/obo-mne/book"
  imageSrc="/images/about-pages/book.png"
  imageAlt="Доктор читает книгу"
  title="Книга «Боль двенадцати женщин»"
  variant="square"
/>

<FeatureLinkCard
  href="https://example.com"
  imageSrc="/images/education/masterclass.png"
  imageAlt="Мастер-класс"
  title="Онлайн мастер-классы"
  description="Практика и разборы методик"
  variant="wide"
/>`}</CodeBlock>
            </Subsection>

            <Subsection title="Accessibility">
              <ul className="type-text-sm list-disc space-y-2 pl-5 text-secondary">
                <li>Карточка выводится ссылкой и доступна с клавиатуры.</li>
                <li>Передавайте осмысленный alt для информационного изображения.</li>
                <li>Стрелка скрыта от скринридера как декоративный элемент.</li>
              </ul>
            </Subsection>
          </Section>

          <Section
            description="VideoCard показывает превью видеозаписи и открывает встроенный плеер в модальном окне."
            id="video-card"
            title="Video Card"
          >
            <Subsection title="Usage">
              <div className="max-w-md">
                <VideoCard
                  location="Санкт-Петербург"
                  posterAlt="Превью выступления"
                  posterSrc="/images/speaking-videos/spb.jpg"
                  title="VI Всероссийский съезд герниологов"
                  videoSrc="https://drkav.ru/videos/conferences/spb.mp4"
                  year="2023"
                />
              </div>
              <CodeBlock>{`import { VideoCard } from "@drkav/ui";

<VideoCard
  location="Санкт-Петербург"
  year="2023"
  title="VI Всероссийский съезд герниологов"
  posterSrc="/images/speaking-videos/spb.jpg"
  posterAlt="Превью выступления"
  videoSrc="https://example.com/video.mp4"
/>`}</CodeBlock>
            </Subsection>

            <Subsection title="Accessibility">
              <ul className="type-text-sm list-disc space-y-2 pl-5 text-secondary">
                <li>Кнопка превью сообщает скринридеру название видеозаписи.</li>
                <li>Плеер открывается в модальном окне, которое можно закрыть кнопкой, кликом по фону или клавишей Esc.</li>
              </ul>
            </Subsection>
          </Section>

          <Section
            description="TextLink — единый текстовый линк для содержимого: заметный, доступный с клавиатуры и независимый от конкретного роутера."
            id="text-link"
            title="Text Link"
          >
            <Subsection title="Example">
              <p className="type-text-base text-primary">
                Подробнее об операции <TextLink href="/operaczii/diastaz-myshc-zhivota">«Диастаз без шрамов»</TextLink>.
              </p>
            </Subsection>

            <Subsection title="Usage">
              <CodeBlock>{`import { TextLink } from "@drkav/ui";

<TextLink href="/operaczii/diastaz-myshc-zhivota">
  «Диастаз без шрамов»
</TextLink>`}</CodeBlock>
            </Subsection>
          </Section>

          <Section
            description="Семантические токены описывают роль цвета в интерфейсе и не привязаны к конкретной CMS."
            id="colors"
            title="Colors"
          >
            <Subsection title="Semantic palette">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {semanticColors.map((color) => (
                  <div
                    className="flex items-center gap-3 rounded-md border border-border bg-surface p-3"
                    key={color.name}
                  >
                    <span
                      className={`size-10 rounded-md border border-border ${color.className}`}
                    />
                    <code className="type-code text-secondary">{color.name}</code>
                  </div>
                ))}
              </div>
            </Subsection>
          </Section>

          <Section
            description="Именованные роли отделяют заголовки, основной текст, подписи и технический контент друг от друга."
            id="typography"
            title="Typography"
          >
            <div className="space-y-6 rounded-lg border border-border bg-surface p-6">
              {typographyRoles.map(({ description, name, sample }) => (
                <div className="border-b border-border pb-5 last:border-0 last:pb-0" key={name}>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <code className="type-code text-accent">{name}</code>
                    <span className="type-text-sm text-muted">{description}</span>
                  </div>
                  <p className={`mt-2 text-primary ${name}`}>{sample}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section
            description="Шаг 4px задаёт spacing scale. Containers и breakpoints ограничивают ширину чтения и сохраняют mobile-first поведение."
            id="spacing"
            title="Spacing"
          >
            <Subsection title="Spacing scale">
              <div className="space-y-3 rounded-lg border border-border bg-surface p-6">
                {[
                  ["spacing-1", "w-1"],
                  ["spacing-2", "w-2"],
                  ["spacing-4", "w-4"],
                  ["spacing-6", "w-6"],
                  ["spacing-8", "w-8"],
                  ["spacing-12", "w-12"],
                  ["spacing-16", "w-16"],
                ].map(([token, width]) => (
                  <div className="flex items-center gap-4" key={token}>
                    <code className="type-code w-28 text-secondary">{token}</code>
                    <span className={`h-3 rounded-sm bg-accent ${width}`} />
                  </div>
                ))}
              </div>
            </Subsection>

            <Subsection title="Containers & Breakpoints">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["reading", "46rem"],
                  ["content", "72rem"],
                  ["wide", "90rem"],
                  ["sidebar", "15rem"],
                  ["sm / md", "40rem / 48rem"],
                  ["lg / xl", "64rem / 80rem"],
                ].map(([token, value]) => (
                  <div
                    className="rounded-md border border-border bg-surface p-4"
                    key={token}
                  >
                    <code className="type-code text-primary">{token}</code>
                    <p className="type-text-sm mt-1 text-secondary">{value}</p>
                  </div>
                ))}
              </div>
            </Subsection>
          </Section>

          <Section
            description="Небольшой набор радиусов поддерживает согласованную геометрию компонентов и контейнеров."
            id="radii"
            title="Radii"
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["sm", "rounded-sm"],
                ["md", "rounded-md"],
                ["lg", "rounded-lg"],
                ["full", "rounded-full"],
              ].map(([token, radius]) => (
                <div className="text-center" key={token}>
                  <div className={`h-24 border border-border-strong bg-surface ${radius}`} />
                  <code className="type-code mt-2 block text-secondary">{token}</code>
                </div>
              ))}
            </div>
          </Section>

          <Section
            description="Тени используются экономно: для отделения интерактивного элемента или поднятой поверхности."
            id="shadows"
            title="Shadows"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg bg-surface p-8 shadow-subtle">
                <code className="type-code text-secondary">shadow-subtle</code>
              </div>
              <div className="rounded-lg bg-surface p-8 shadow-raised">
                <code className="type-code text-secondary">shadow-raised</code>
              </div>
            </div>
          </Section>

          <Section
            description="Короткие переходы поясняют изменение состояния. При reduced motion движение отключается."
            id="motion"
            title="Motion"
          >
            <ExamplePanel>
              <Button variant="secondary">Hover or press</Button>
              <p className="type-text-sm text-secondary">
                duration-fast · ease-standard · motion-reduce
              </p>
            </ExamplePanel>
          </Section>

          <Section
            description="Focus ring всегда заметен при клавиатурной навигации и строится на общем semantic token."
            id="focus"
            title="Focus"
          >
            <ExamplePanel>
              <a
                className="focus-ring type-label rounded-md px-3 py-2 text-accent"
                href="#button"
              >
                Нажмите Tab и перейдите к Button
              </a>
              <Button variant="outline">Focusable Button</Button>
            </ExamplePanel>
          </Section>

          <Section
            description="Button запускает действие. Компонент использует нативный button, типизированные variants и sizes, единые tokens и предсказуемые accessibility states."
            id="button"
            title="Button"
          >
            <Subsection title="Overview">
              <p className="type-text-base max-w-reading text-secondary">
                Используйте Button для явного пользовательского действия. В одном
                смысловом блоке должен быть один доминирующий primary action.
              </p>
            </Subsection>

            <Subsection title="Variants">
              <ExamplePanel>
                {variants.map((variant) => (
                  <Button key={variant} variant={variant}>
                    {variant}
                  </Button>
                ))}
              </ExamplePanel>
            </Subsection>

            <Subsection title="Sizes">
              <ExamplePanel>
                {sizes.map((size) =>
                  size === "icon" ? (
                    <Button aria-label="Закрыть" key={size} size={size} variant="outline">
                      <CloseIcon className="size-5" />
                    </Button>
                  ) : (
                    <Button key={size} size={size} variant="secondary">
                      {size}
                    </Button>
                  ),
                )}
              </ExamplePanel>
            </Subsection>

            <Subsection title="States">
              <ExamplePanel>
                <Button>default</Button>
                <Button variant="outline">
                  focus-visible
                </Button>
                <Button selected variant="outline">
                  selected
                </Button>
                <Button disabled>disabled</Button>
                <Button loading>loading</Button>
              </ExamplePanel>
              <p className="type-text-sm mt-3 text-secondary">
                Hover и active проверяются непосредственно указателем; focus-visible —
                клавишей Tab. Selected выделяет текущий outline-пункт навигации.
                Disabled и loading нативно блокируют взаимодействие.
              </p>
            </Subsection>

            <Subsection title="With icons">
              <ExamplePanel>
                <Button>
                  <ArrowRightIcon className="size-4 rotate-180" />
                  Назад
                </Button>
                <Button variant="secondary">
                  Продолжить
                  <ArrowRightIcon className="size-4" />
                </Button>
                <Button aria-label="Закрыть" size="icon" variant="ghost">
                  <CloseIcon className="size-5" />
                </Button>
              </ExamplePanel>
            </Subsection>

            <Subsection title="Loading">
              <ExamplePanel>
                <Button loading>Отправка</Button>
                <Button aria-label="Отправка" loading size="icon" variant="secondary" />
              </ExamplePanel>
              <p className="type-text-sm mt-3 text-secondary">
                Индикатор расположен поверх исходного содержимого, поэтому размер
                кнопки не меняется. Устанавливаются disabled и aria-busy.
              </p>
            </Subsection>

            <Subsection title="Accessibility">
              <ul className="type-text-sm list-disc space-y-2 pl-5 text-secondary">
                <li>Используется нативный button и все стандартные attributes.</li>
                <li>Icon-only API требует доступное имя через aria-label.</li>
                <li>Минимальная интерактивная высота подходит для mobile.</li>
                <li>Focus-visible заметен, loading предотвращает повторное действие.</li>
              </ul>
            </Subsection>

            <Subsection title="Usage">
              <CodeBlock>{`<Button variant="primary" size="md">
  Записаться на консультацию
</Button>

<Button variant="secondary" size="lg" loading>
  Отправка
</Button>

<Button variant="outline" selected aria-current="page">
  Акции
</Button>

<Button variant="ghost" size="icon" aria-label="Закрыть">
  <CloseIcon />
</Button>`}</CodeBlock>
            </Subsection>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-surface p-5">
                <h3 className="type-h3 text-primary">Do</h3>
                <ul className="type-text-sm mt-3 list-disc space-y-2 pl-5 text-secondary">
                  <li>Один главный CTA в смысловом блоке.</li>
                  <li>Понятный текст действия и подходящий size.</li>
                  <li>Loading во время отправки формы.</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-surface-muted p-5">
                <h3 className="type-h3 text-primary">Don’t</h3>
                <ul className="type-text-sm mt-3 list-disc space-y-2 pl-5 text-secondary">
                  <li>Несколько primary рядом без иерархии.</li>
                  <li>Слишком длинная подпись или icon-only без aria-label.</li>
                  <li>Только визуальный disabled без нативного attribute.</li>
                  <li>Копирование Button utilities в application page.</li>
                </ul>
              </div>
            </div>

            <Subsection title="API">
              <div className="overflow-x-auto rounded-lg border border-border bg-surface">
                <table className="type-text-sm w-full border-collapse text-left">
                  <thead className="bg-surface-muted text-primary">
                    <tr>
                      <th className="type-label px-4 py-3">Prop</th>
                      <th className="type-label px-4 py-3">Type</th>
                      <th className="type-label px-4 py-3">Default</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-secondary">
                    <tr>
                      <td className="px-4 py-3"><code>variant</code></td>
                      <td className="px-4 py-3"><code>primary | secondary | outline | ghost | link</code></td>
                      <td className="px-4 py-3"><code>primary</code></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3"><code>size</code></td>
                      <td className="px-4 py-3"><code>sm | md | lg | icon</code></td>
                      <td className="px-4 py-3"><code>md</code></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3"><code>loading</code></td>
                      <td className="px-4 py-3"><code>boolean</code></td>
                      <td className="px-4 py-3"><code>false</code></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3"><code>selected</code></td>
                      <td className="px-4 py-3"><code>boolean</code></td>
                      <td className="px-4 py-3"><code>false</code></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3"><code>disabled</code></td>
                      <td className="px-4 py-3"><code>boolean</code></td>
                      <td className="px-4 py-3"><code>false</code></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3"><code>type</code></td>
                      <td className="px-4 py-3"><code>button | submit | reset</code></td>
                      <td className="px-4 py-3"><code>button</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Subsection>
          </Section>

          <Section
            description="PageIntro задаёт единый первый экран для статических контентных страниц: крошки, название и краткое описание. Он не зависит от Next.js или источника контента."
            id="page-intro"
            title="Page Intro"
          >
            <Subsection title="Example">
              <div className="overflow-hidden rounded-lg border border-border bg-background shadow-subtle">
                <PageIntro
                  as="div"
                  breadcrumbs={[
                    { href: "/", label: "Главная" },
                    { label: "Портфолио" },
                  ]}
                  description="Краткое описание помогает посетителю сразу понять назначение страницы."
                  title="Портфолио пластических операций"
                />
              </div>
            </Subsection>

            <Subsection title="Usage">
              <CodeBlock>{`import { PageIntro } from "@drkav/ui";

<PageIntro
  breadcrumbs={[
    { href: "/", label: "Главная" },
    { label: "Портфолио" },
  ]}
  title="Портфолио пластических операций"
  description="Краткое описание страницы."
/>`}</CodeBlock>
            </Subsection>

            <Subsection title="Accessibility">
              <ul className="type-text-sm list-disc space-y-2 pl-5 text-secondary">
                <li>Крошки размечены навигацией с доступным названием.</li>
                <li>Текущая страница получает <code>aria-current=&quot;page&quot;</code>.</li>
                <li>Заголовок всегда выводится как единственный <code>h1</code> страницы.</li>
              </ul>
            </Subsection>
          </Section>

          <Section
            description="RecordCard показывает структурированную запись любого типа. Пустые детали не занимают место, а href превращает карточку в ссылку со стрелкой и интерактивными состояниями."
            id="record-card"
            title="Record Card"
          >
            <Subsection title="Variants">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <RecordCard
                  details={[
                    { value: "Лечебное дело" },
                    { tone: "secondary", value: "Базовое образование" },
                  ]}
                  meta="2009"
                  title="Саратовский государственный медицинский университет им. В.И. Разумовского"
                />
                <RecordCard
                  details={[{ value: "Подробнее о публикации" }]}
                  href="#record-card"
                  meta="2026"
                  title="Интерактивная запись"
                />
                <RecordCard title="Запись без дополнительных строк" />
              </div>
            </Subsection>

            <Subsection title="Usage">
              <CodeBlock>{`import { RecordCard } from "@drkav/ui";

<RecordCard
  title="Медицинский университет"
  meta="2015"
  details={[
    { value: "Хирургия" },
    { value: "Повышение квалификации", tone: "secondary" },
  ]}
/>

<RecordCard
  href="/obo-mne/diplomy-i-licenzii"
  title="Документ об образовании"
/>`}</CodeBlock>
            </Subsection>

            <Subsection title="Accessibility">
              <ul className="type-text-sm list-disc space-y-2 pl-5 text-secondary">
                <li>Без href карточка выводится как семантическая статья.</li>
                <li>С href карточка выводится как ссылка и получает заметный focus-visible.</li>
                <li>Стрелка — декоративный признак ссылки и скрыта от скринридера.</li>
              </ul>
            </Subsection>
          </Section>

          <Section
            description="Input сохраняет нативный HTML API, а FormField централизованно связывает label, описание, validation message и accessibility-атрибуты."
            id="input"
            title="Input"
          >
            <Subsection title="Basic">
              <FieldGrid>
                <FormField id="input-basic-name" label="Ваше имя" required>
                  <Input
                    {...nameConstraints}
                    autoComplete="name"
                    name="basic-name"
                    placeholder="Анна"
                  />
                </FormField>
              </FieldGrid>
            </Subsection>

            <Subsection title="Types">
              <FieldGrid>
                <FormField id="input-type-text" label="Город">
                  <Input
                    {...textConstraints}
                    autoComplete="address-level2"
                    name="type-city"
                    placeholder="Москва"
                    type="text"
                  />
                </FormField>
                <FormField id="input-type-email" label="Email" required>
                  <Input
                    {...emailConstraints}
                    autoComplete="email"
                    name="type-email"
                    placeholder="name@example.ru"
                    type="email"
                  />
                </FormField>
                <FormField id="input-type-tel" label="Телефон" required>
                  <PhoneInput
                    autoComplete="tel"
                    name="type-phone"
                    placeholder="+7 900 000-00-00"
                  />
                </FormField>
                <FormField id="input-type-password" label="Пароль" required>
                  <Input
                    autoComplete="current-password"
                    maxLength={128}
                    minLength={8}
                    name="type-password"
                    placeholder="Введите пароль"
                    type="password"
                  />
                </FormField>
                <FormField
                  className="sm:col-span-2"
                  id="input-type-search"
                  label="Поиск процедуры"
                >
                  <Input
                    {...searchConstraints}
                    name="type-search"
                    placeholder="Например, ринопластика"
                    type="search"
                  />
                </FormField>
              </FieldGrid>
            </Subsection>

            <Subsection title="Phone mask">
              <FieldGrid>
                <FormField
                  description="Можно вводить и вставлять только цифры; формат добавляется автоматически."
                  id="input-phone-mask"
                  label="Телефон"
                  required
                >
                  <PhoneInput name="masked-phone" />
                </FormField>
              </FieldGrid>
              <p className="type-text-sm mt-3 text-secondary">
                PhoneInput нормализует 8 или 7 в префикс +7, удаляет буквы и
                ограничивает номер десятью национальными цифрами.
              </p>
            </Subsection>

            <Subsection title="States">
              <FieldGrid>
                <FormField id="input-state-default" label="Default">
                  <Input name="state-default" placeholder="Введите значение" />
                </FormField>
                <FormField id="input-state-filled" label="Filled">
                  <Input defaultValue="Санкт-Петербург" name="state-filled" />
                </FormField>
                <FormField
                  disabled
                  id="input-state-disabled"
                  label="Disabled"
                >
                  <Input defaultValue="Недоступное значение" name="state-disabled" />
                </FormField>
                <FormField id="input-state-readonly" label="Read-only">
                  <Input
                    defaultValue="Подтверждено"
                    name="state-readonly"
                    readOnly
                  />
                </FormField>
                <FormField
                  id="input-state-error"
                  label="Error"
                  message="Введите телефон в формате +7 900 000-00-00."
                  status="error"
                >
                  <PhoneInput
                    defaultValue="+7 900"
                    name="state-error"
                  />
                </FormField>
                <FormField
                  id="input-state-success"
                  label="Success"
                  message="Номер телефона проверен."
                  status="success"
                >
                  <PhoneInput
                    defaultValue="+7 900 000-00-00"
                    name="state-success"
                  />
                </FormField>
              </FieldGrid>
              <p className="type-text-sm mt-3 text-secondary">
                Hover проверяется указателем, focus-visible — клавишей Tab. Focus
                ring остаётся заметным и в validation states.
              </p>
            </Subsection>

            <Subsection title="Labels">
              <FieldGrid>
                <FormField id="input-label-default" label="Желаемая процедура">
                  <Input
                    {...textConstraints}
                    name="label-default"
                    placeholder="Название процедуры"
                  />
                </FormField>
                <FormField
                  id="input-label-required"
                  label="Телефон"
                  required
                >
                  <PhoneInput
                    autoComplete="tel"
                    name="label-required"
                    placeholder="+7 900 000-00-00"
                  />
                </FormField>
                <FormField
                  id="input-label-optional"
                  label="Город"
                  optional
                >
                  <Input
                    {...textConstraints}
                    autoComplete="address-level2"
                    name="label-optional"
                    placeholder="Москва"
                  />
                </FormField>
                <FormField
                  description="Укажите имя, по которому к вам можно обращаться."
                  id="input-label-description"
                  label="Имя"
                >
                  <Input
                    {...nameConstraints}
                    autoComplete="name"
                    name="label-description"
                    placeholder="Анна"
                  />
                </FormField>
              </FieldGrid>
            </Subsection>

            <Subsection title="Validation">
              <p className="type-text-base mb-4 max-w-reading text-secondary">
                Браузер проверяет обязательность, длину, формат email и допустимый
                формат телефона через нативные HTML constraints. После проверки
                формы результат передаётся в контролируемые status и message;
                серверная проверка при отправке всё равно обязательна.
              </p>
              <FieldGrid>
                <FormField id="input-validation-normal" label="Имя" required>
                  <Input
                    {...nameConstraints}
                    autoComplete="name"
                    name="validation-name"
                    placeholder="Анна"
                  />
                </FormField>
                <FormField
                  description="Используем адрес только для ответа на обращение."
                  id="input-validation-helper"
                  label="Email"
                  optional
                >
                  <Input
                    {...emailConstraints}
                    autoComplete="email"
                    name="validation-email"
                    placeholder="name@example.ru"
                    type="email"
                  />
                </FormField>
                <FormField
                  id="input-validation-error"
                  label="Телефон"
                  message="Добавьте код страны и десять цифр номера."
                  required
                  status="error"
                >
                  <PhoneInput
                    autoComplete="tel"
                    defaultValue="900 12"
                    name="validation-phone"
                  />
                </FormField>
                <FormField
                  id="input-validation-success"
                  label="Город"
                  message="Город указан корректно."
                  status="success"
                >
                  <Input
                    {...textConstraints}
                    autoComplete="address-level2"
                    defaultValue="Москва"
                    name="validation-city"
                  />
                </FormField>
              </FieldGrid>
            </Subsection>

            <Subsection title="With icon">
              <FieldGrid>
                <div className="grid gap-2">
                  <Label htmlFor="input-icon-user">Имя</Label>
                  <div className="relative self-start">
                    <UserIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted" />
                    <Input
                      {...nameConstraints}
                      autoComplete="name"
                      className="pl-10"
                      id="input-icon-user"
                      name="icon-user"
                      placeholder="Анна"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="input-icon-phone">Телефон</Label>
                  <div className="relative self-start">
                    <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted" />
                    <PhoneInput
                      aria-describedby="input-icon-phone-description"
                      autoComplete="tel"
                      className="pl-10"
                      id="input-icon-phone"
                      name="icon-phone"
                      placeholder="+7 900 000-00-00"
                    />
                  </div>
                  <FormDescription id="input-icon-phone-description">
                    Используйте номер с кодом страны.
                  </FormDescription>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="input-icon-search">Поиск</Label>
                  <div className="relative self-start">
                    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted" />
                    <Input
                      {...searchConstraints}
                      className="pl-10"
                      id="input-icon-search"
                      name="icon-search"
                      placeholder="Найти процедуру"
                      type="search"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="input-icon-success">Email</Label>
                  <div className="relative self-start">
                    <Input
                      {...emailConstraints}
                      aria-describedby="input-icon-success-message"
                      autoComplete="email"
                      className="pr-10"
                      data-status="success"
                      defaultValue="name@example.ru"
                      id="input-icon-success"
                      name="icon-success"
                      type="email"
                    />
                    <ValidationIcon
                      className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-success"
                      status="success"
                    />
                  </div>
                  <FormMessage
                    id="input-icon-success-message"
                    status="success"
                  >
                    Email указан корректно.
                  </FormMessage>
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="input-icon-error">Телефон</Label>
                  <div className="relative self-start">
                    <PhoneInput
                      aria-describedby="input-icon-error-message"
                      aria-invalid="true"
                      className="pr-10"
                      defaultValue="+7 900"
                      id="input-icon-error"
                      name="icon-error"
                    />
                    <ValidationIcon
                      className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-error"
                      status="error"
                    />
                  </div>
                  <FormMessage id="input-icon-error-message" status="error">
                    Добавьте недостающие цифры номера.
                  </FormMessage>
                </div>
              </FieldGrid>
              <p className="type-text-sm mt-3 text-secondary">
                Иконки размещаются композицией вокруг Input. Базовый компонент
                остаётся нативным и не получает декоративных props.
              </p>
            </Subsection>

            <Subsection title="Accessibility">
              <ul className="type-text-sm list-disc space-y-2 pl-5 text-secondary">
                <li>Важное поле всегда получает видимый Label, связанный через htmlFor.</li>
                <li>FormField передаёт required и disabled непосредственно в Input.</li>
                <li>Error устанавливает aria-invalid и связывает message через aria-describedby.</li>
                <li>Описание и сообщение получают стабильные уникальные id от FormField.</li>
                <li>Ошибка обозначается текстом и иконкой, а не только цветом.</li>
                <li>Динамическому сообщению можно явно передать role=&quot;alert&quot; при необходимости.</li>
              </ul>
            </Subsection>

            <Subsection title="Usage">
              <div className="grid gap-4">
                <CodeBlock>{`import { FormField } from "@drkav/ui";
import { PhoneInput } from "@drkav/ui/phone-input";

<FormField
  id="phone"
  label="Телефон"
  description="Мы используем номер только для связи."
  required
>
  <PhoneInput
    name="phone"
    autoComplete="tel"
    placeholder="+7 900 000-00-00"
  />
</FormField>`}</CodeBlock>
                <CodeBlock>{`import {
  FormDescription,
  FormMessage,
  Input,
  Label,
} from "@drkav/ui";

<Label htmlFor="email" required>Email</Label>
<Input
  id="email"
  name="email"
  type="email"
  inputMode="email"
  maxLength={254}
  aria-invalid="true"
  aria-describedby="email-description email-message"
/>
<FormDescription id="email-description">
  Укажите адрес для ответа.
</FormDescription>
<FormMessage id="email-message" status="error">
  Проверьте формат email.
</FormMessage>`}</CodeBlock>
              </div>
            </Subsection>

            <Subsection title="Usage rules">
              <ul className="type-text-sm list-disc space-y-2 pl-5 text-secondary">
                <li>Всегда используйте видимый label для важных полей.</li>
                <li>Placeholder не заменяет label.</li>
                <li>Текст ошибки должен объяснять, как исправить значение.</li>
                <li>Не используйте красный цвет без текстового сообщения.</li>
                <li>Для телефона используйте type=&quot;tel&quot;, для email — type=&quot;email&quot; и подходящий autoComplete.</li>
                <li>Не блокируйте вставку данных и избегайте длинных placeholder.</li>
                <li>Required и optional обозначаются единообразно через FormField.</li>
              </ul>
            </Subsection>

            <Subsection title="API">
              <p className="type-text-base max-w-reading text-secondary">
                Input принимает стандартные InputHTMLAttributes и ref. PhoneInput
                добавляет маску российского номера. FormField добавляет только
                композиционные props: id, label, description, message, status,
                disabled, required и optional.
              </p>
            </Subsection>
          </Section>

          <Section
            description="Checkbox используется для независимого выбора одного или нескольких параметров и сохраняет нативное поведение input."
            id="checkbox"
            title="Checkbox"
          >
            <Subsection title="Basic">
              <FieldGrid>
                <div className="flex items-start gap-3">
                  <Checkbox
                    defaultChecked
                    id="checkbox-consent"
                    name="consent"
                  />
                  <div className="grid gap-1">
                    <Label htmlFor="checkbox-consent">
                      Согласие на обработку данных
                    </Label>
                    <FormDescription>
                      Используйте только тестовые данные без персональной информации.
                    </FormDescription>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox id="checkbox-updates" name="updates" />
                  <Label htmlFor="checkbox-updates">
                    Получать информационные сообщения
                  </Label>
                </div>
              </FieldGrid>
            </Subsection>

            <Subsection title="States">
              <FieldGrid>
                <div className="flex items-center gap-3">
                  <Checkbox id="checkbox-default" name="checkbox-default" />
                  <Label htmlFor="checkbox-default">Default</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    defaultChecked
                    id="checkbox-checked"
                    name="checkbox-checked"
                  />
                  <Label htmlFor="checkbox-checked">Checked</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    disabled
                    id="checkbox-disabled"
                    name="checkbox-disabled"
                  />
                  <Label disabled htmlFor="checkbox-disabled">
                    Disabled
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    defaultChecked
                    disabled
                    id="checkbox-disabled-checked"
                    name="checkbox-disabled-checked"
                  />
                  <Label disabled htmlFor="checkbox-disabled-checked">
                    Disabled checked
                  </Label>
                </div>
              </FieldGrid>
            </Subsection>

            <Subsection title="Accessibility">
              <ul className="type-text-sm list-disc space-y-2 pl-5 text-secondary">
                <li>Checkbox остаётся нативным input type=&quot;checkbox&quot;.</li>
                <li>Каждый контрол получает видимый Label и уникальный id.</li>
                <li>Checked и disabled доступны скринридерам без дополнительных ролей.</li>
                <li>Focus-visible использует общий focus ring дизайн-системы.</li>
              </ul>
            </Subsection>

            <Subsection title="Usage">
              <CodeBlock>{`import { Checkbox, Label } from "@drkav/ui";

<div className="flex items-center gap-3">
  <Checkbox id="consent" name="consent" required />
  <Label htmlFor="consent">
    Согласие на обработку данных
  </Label>
</div>`}</CodeBlock>
            </Subsection>
          </Section>

          <Section
            description="Radio объединяет взаимоисключающие варианты с одинаковым name. Для доступного названия группы используется fieldset и legend."
            id="radio"
            title="Radio"
          >
            <Subsection title="Basic">
              <fieldset className="rounded-lg border border-border bg-surface p-5 shadow-subtle sm:p-6">
                <legend className="type-label px-1 text-primary">
                  Предпочтительное время связи
                </legend>
                <div className="mt-3 grid gap-4 sm:grid-cols-3">
                  {[
                    ["radio-time-morning", "Утро", "morning"],
                    ["radio-time-day", "День", "day"],
                    ["radio-time-evening", "Вечер", "evening"],
                  ].map(([id, label, value], index) => (
                    <div className="flex items-center gap-3" key={id}>
                      <Radio
                        defaultChecked={index === 1}
                        id={id}
                        name="preferred-time"
                        value={value}
                      />
                      <Label htmlFor={id}>{label}</Label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </Subsection>

            <Subsection title="States">
              <FieldGrid>
                <div className="flex items-center gap-3">
                  <Radio id="radio-default" name="radio-state-default" />
                  <Label htmlFor="radio-default">Default</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Radio
                    defaultChecked
                    id="radio-checked"
                    name="radio-state-checked"
                  />
                  <Label htmlFor="radio-checked">Checked</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Radio
                    disabled
                    id="radio-disabled"
                    name="radio-state-disabled"
                  />
                  <Label disabled htmlFor="radio-disabled">
                    Disabled
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Radio
                    defaultChecked
                    disabled
                    id="radio-disabled-checked"
                    name="radio-state-disabled-checked"
                  />
                  <Label disabled htmlFor="radio-disabled-checked">
                    Disabled checked
                  </Label>
                </div>
              </FieldGrid>
            </Subsection>

            <Subsection title="Usage">
              <CodeBlock>{`import { Label, Radio } from "@drkav/ui";

<fieldset>
  <legend>Предпочтительное время связи</legend>
  <Radio id="time-morning" name="preferred-time" value="morning" />
  <Label htmlFor="time-morning">Утро</Label>
</fieldset>`}</CodeBlock>
            </Subsection>
          </Section>

          <Section
            description="Radio Button визуально оформляет взаимоисключающие radio-варианты как кнопки. Подходит для выбора одного предпочтительного канала связи."
            id="radio-button"
            title="Radio Button"
          >
            <Subsection title="Contact channels">
              <fieldset className="rounded-lg border border-border bg-surface p-5 shadow-subtle sm:p-6">
                <legend className="type-label px-1 text-primary">
                  Как с вами связаться
                </legend>
                <div className="mt-3 flex flex-wrap gap-3">
                  <RadioButton
                    defaultChecked
                    icon={<TelegramIcon className="size-5" />}
                    id="contact-telegram"
                    name="contact-channel"
                    value="telegram"
                  >
                    Telegram
                  </RadioButton>
                  <RadioButton
                    icon={<PhoneIcon className="size-5" />}
                    id="contact-phone"
                    name="contact-channel"
                    value="phone"
                  >
                    Телефон
                  </RadioButton>
                  <RadioButton
                    icon={<MaxIcon className="size-5" />}
                    id="contact-max"
                    name="contact-channel"
                    value="max"
                  >
                    MAX
                  </RadioButton>
                </div>
                <FormDescription className="mt-3">
                  Выберите один предпочтительный способ.
                </FormDescription>
              </fieldset>
            </Subsection>

            <Subsection title="States">
              <ExamplePanel>
                <RadioButton id="radio-button-default" name="radio-button-state-default">
                  Default
                </RadioButton>
                <RadioButton
                  defaultChecked
                  id="radio-button-checked"
                  name="radio-button-state-checked"
                >
                  Checked
                </RadioButton>
                <RadioButton
                  disabled
                  id="radio-button-disabled"
                  name="radio-button-state-disabled"
                >
                  Disabled
                </RadioButton>
              </ExamplePanel>
            </Subsection>

            <Subsection title="Accessibility">
              <ul className="type-text-sm list-disc space-y-2 pl-5 text-secondary">
                <li>Внутри остаётся нативный radio, а не button с имитацией состояния.</li>
                <li>Текст является доступным именем; декоративная иконка скрыта через aria-hidden.</li>
                <li>Одинаковый name обеспечивает выбор только одного канала.</li>
                <li>Checked, disabled и focus-visible заметны визуально и доступны программно.</li>
              </ul>
            </Subsection>

            <Subsection title="Usage">
              <CodeBlock>{`import { RadioButton } from "@drkav/ui";

<RadioButton
  id="contact-telegram"
  name="contact-channel"
  value="telegram"
  icon={<TelegramIcon />}
>
  Telegram
</RadioButton>`}</CodeBlock>
            </Subsection>
          </Section>
        </main>
      </div>
    </div>
  );
}
