# Рабочие правила для drkav

- Проект — frontend-first редизайн сайта drkav.ru на Next.js App Router и TypeScript.
- Работайте в отдельных ветках; не изменяйте `main` напрямую.
- Не выполняйте `git commit`, `git push`, merge, а также изменения production, DNS или реальных интеграций без явного подтверждения владельца проекта.
- Сохраняйте существующие SEO-URL максимально. Удаляйте суффикс `.html` только после проверки прямого 301-редиректа для каждого URL.
- Strapi 5.51.1 выбран как локальная headless CMS. Приложение `apps/cms` и локальная SQLite являются частью текущей архитектуры разработки.
- UI-компоненты не должны зависеть от Strapi, другой CMS или реализации загрузки данных. Страницы получают CMS-контент только через интерфейс `ContentRepository` из `@drkav/content-contracts`; прямые импорты Strapi SDK и Strapi-моделей в UI и страницы запрещены.
- Подключайте CMS-контент постепенно, по одной безопасной вертикали. Не переключайте страницы на CMS массово.
- Не используйте реальные персональные или медицинские данные пациентов в коде, тестовых данных, документации и примерах.
- Не открывайте Public API Strapi и не подключайте production, hosting, DNS, amoCRM, аналитику, другие базы данных или реальные интеграции без отдельного подтверждения владельца проекта.
- Не добавляйте в Git локальные секреты, SQLite, uploads и generated-файлы Strapi.
- Не добавляйте GPL/AGPL-зависимости. Перед добавлением зависимости оценивайте её необходимость и лицензию.
- UI components live in `packages/ui`.
- UI must not depend on a CMS or data-fetching implementation.
- Application pages must reuse `packages/ui` components.
- Do not copy reusable Tailwind class lists into pages.
- Use shared design tokens instead of arbitrary visual values.
- Use typed variants for supported component variants and sizes.
- Reusable component documentation lives on the internal `/design-system` page.
- Storybook is not configured in the current phase.
- Components are added one at a time in controlled tasks.
- Do not create speculative components.
- Server Components are the default.
- Use Client Components only for isolated interactive behavior.
- English is used for component names, variants, states, props, API and code.
- Russian is used for usage descriptions, explanations and team rules.

## Styling rules

- Do not use CSS Modules in project-owned code.
- Do not create `*.module.css`, `*.module.scss`, `*.module.sass`, or `*.module.less` files.
- Use shared design tokens, reusable UI components, and typed variants.
- Use a uniquely prefixed class only for a page-specific element or behavior (for example, `about-page__portrait` or `patent-modal`). Keep its CSS rules in the dedicated non-module stylesheet.
- Before adding a class, check whether the element is a reusable container, heading, grid, card, list, or action. Reuse the corresponding shared class or modifier from `packages/ui` instead of creating names such as `contribution-patent-title`.
- Shared classes describe the visual role (`content-card`, `content-card__heading`, `record-card`); page-prefixed classes only describe the unique context or behavior. Do not restyle a shared visual role under a page-specific name.
- Global CSS may contain semantic component and page classes; do not use it for generic utility-class replacements.
- Do not copy visual declarations between pages; extract a shared component or a named component class instead.
- Repeated visual patterns belong in `packages/ui` or a typed variant.
- Если карточка повторяет паттерн `RecordCard` со страницы «Обо мне», используйте иконку размера `--space-8`; меньший размер допустим только при явно согласованном отличии в макете.
- Для самостоятельных блоков без фоновой подложки используйте верхний отступ не меньше `--space-12`, чтобы визуально отделить их от предыдущего блока.
- Avoid arbitrary values when a shared token exists.
- Do not use `@apply` as the primary component styling strategy.
- Inline styles are allowed only for genuinely dynamic values that cannot be represented through tokens or utilities.
- Any exception must include a short code comment explaining why Tailwind or a reusable component is unsuitable.
