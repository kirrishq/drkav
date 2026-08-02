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

Локальная CMS использует SQLite и доступна по адресу http://localhost:1337/admin. Локальные секреты, база SQLite, uploads и generated-файлы Strapi исключены из Git. Public API закрыты; страницы не подключены к CMS массово.

Seed выполняется только вручную и не входит в обычный запуск:

```bash
pnpm --filter @drkav/cms seed
```

UI не зависит от Strapi. Страницы получают CMS-контент только через `ContentRepository` из `@drkav/content-contracts`; прямые импорты Strapi SDK или Strapi-моделей в UI и страницы запрещены. Миграция выполняется постепенно, по одной безопасной вертикали.

Внутренняя документация дизайн-системы доступна по адресу http://localhost:3000/design-system и не включается в публичную навигацию.

## Проверки

```bash
pnpm lint
pnpm typecheck
pnpm build:web
pnpm build:cms
```

`pnpm build` остаётся алиасом сборки frontend. Production, hosting, DNS, Public API и реальные интеграции требуют отдельного подтверждения владельца проекта.

Подробнее об ограничениях проекта — в [docs/project-context.md](docs/project-context.md), о правилах внесения изменений — в [CONTRIBUTING.md](CONTRIBUTING.md).
