# drkav

Frontend-first редизайн сайта drkav.ru. Репозиторий организован как pnpm-монорепозиторий с приложением Next.js, локальной headless CMS Strapi 5.51.1, общей дизайн-системой и CMS-neutral контрактами контента.

## Структура

```text
apps/web                    Next.js-приложение (App Router)
apps/cms                    локальная Strapi 5.51.1 и SQLite
packages/ui                 UI-компоненты и design tokens
packages/content-contracts  доменные типы и контракты получения контента
docs/                       контекст и план проекта
```

## Локальный запуск

Требуются Node.js 20.19+ и pnpm 11.

```bash
pnpm install
pnpm dev:web
```

После запуска frontend откройте http://localhost:3000. Команда `pnpm dev` остаётся коротким алиасом `pnpm dev:web`.

Strapi запускается отдельно:

```bash
pnpm dev:cms
```

Локальная CMS использует SQLite и доступна по адресу http://localhost:1337/admin. Локальные секреты, база SQLite, uploads и generated-файлы Strapi исключены из Git. Public role не имеет доступа к Content API; server-to-server запросы используют read-only API token.

Seed выполняется только вручную и не входит в обычный запуск:

```bash
pnpm --filter @drkav/cms seed
```

Для идемпотентного seed только первой CMS-вертикали «Увеличение груди» используйте:

```bash
pnpm --filter @drkav/cms seed:breast-augmentation
```

UI не зависит от Strapi. Страницы получают CMS-контент только через `ContentRepository` из `@drkav/content-contracts`; прямые импорты Strapi SDK или Strapi-моделей в UI и страницы запрещены. Сейчас через CMS подключена только операция `/operaczii/plastika-grudi/uvelichenie-grudi`; остальные операции продолжают использовать frontend registry.

Внутренняя документация дизайн-системы доступна по адресу http://localhost:3000/design-system и не включается в публичную навигацию.

## Проверки

```bash
pnpm lint
pnpm typecheck
pnpm build:web
pnpm build:cms
```

`pnpm build` остаётся алиасом сборки frontend. Production, hosting, DNS, Public API и реальные интеграции требуют отдельного подтверждения владельца проекта.

Production-сборка `build:web` предварительно генерирует явно перечисленные CMS-операции и поэтому требует доступную Strapi, server-side read-only token и опубликованные записи. В development CMS-запросы не кэшируются; в production используется Next.js Data/Full Route Cache с TTL `CMS_REVALIDATE_SECONDS` (по умолчанию 3600 секунд) и сохранением last-known-good страницы при неудачной ревалидации. Для локальной настройки используйте `apps/web/.env.local`; пример без секретов находится в `apps/web/.env.example`.

Production-требования, ограничения cold cache, media и multi-instance cache описаны в [docs/production-cms-checklist.md](docs/production-cms-checklist.md).

Подробнее об ограничениях проекта — в [docs/project-context.md](docs/project-context.md), о правилах внесения изменений — в [CONTRIBUTING.md](CONTRIBUTING.md).
