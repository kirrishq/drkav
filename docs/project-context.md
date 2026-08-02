# Контекст проекта

## Назначение

Этот репозиторий содержит frontend-first редизайн сайта [drkav.ru](https://drkav.ru). Базовый стек: Next.js App Router и TypeScript. Интерфейс проектируется mobile-first.

## Архитектурные границы

- Strapi 5.51.1 выбран и разрешён как локальная headless CMS. Приложение `apps/cms` и локальная SQLite являются частью текущей архитектуры разработки.
- UI-пакет не зависит от Strapi, её SDK, моделей данных или реализации загрузки контента.
- Страницы получают CMS-контент только через контракт `ContentRepository` из пакета `@drkav/content-contracts`. Прямые импорты Strapi SDK и Strapi-моделей в UI и страницы запрещены.
- Контент подключается постепенно, по одной безопасной вертикали. Через `ContentRepository` подключена только операция `/operaczii/plastika-grudi/uvelichenie-grudi`; остальные операции продолжают использовать frontend page registry.
- CMS-операции перечисляются явно в `cmsMigratedOperationPaths`, предварительно генерируются production build и используют server-side Next.js cache. React `cache()` применяется только для request-level дедупликации page/metadata и не считается долговременным cache.
- Production fetch использует TTL `CMS_REVALIDATE_SECONDS` и tag `operation:<canonical-path>`. Ошибка ревалидации сохраняет last-known-good страницу; segment fallback использует generic metadata без registry medical content. Ранний static/ISR error в Next.js 15.5.22 обслуживается совместимым branded `pages/500.tsx` с HTTP 500 и `noindex, nofollow`, не записывая fallback в CMS cache.
- Storybook отложен до стабилизации финального набора компонентов. Текущая документация дизайн-системы находится на внутренней странице `/design-system`.
- Public role Strapi не имеет доступа к Content API; server-to-server чтение использует read-only token. Production, hosting, DNS, amoCRM, аналитика, другие базы данных, Docker и реальные интеграции требуют отдельного подтверждения владельца проекта.

## SEO и безопасность данных

- Существующие SEO-URL сохраняются максимально.
- Суффикс `.html` удаляется только после проверки прямых 301-редиректов для каждого затронутого URL.
- Реальные персональные и медицинские данные пациентов не используются — ни в коде, ни в тестовых данных, ни в документации.
- Локальные секреты, SQLite, uploads и generated-файлы Strapi не добавляются в Git.

## Эксплуатационные ограничения

Production, DNS и реальные интеграции нельзя изменять без явного подтверждения владельца проекта.

До production необходимо выбрать hosting-модель, подтвердить долговечность Next.js Data/Full Route Cache, решить shared cache для нескольких instances и перенести локальные Strapi uploads во внешнее object storage/CDN. Детали зафиксированы в [production-cms-checklist.md](production-cms-checklist.md).
