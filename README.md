# drkav

Frontend-first редизайн сайта drkav.ru. Репозиторий организован как лёгкий pnpm-монорепозиторий с приложением Next.js, общей дизайн-системой и контрактами контента.

## Структура

```text
apps/web                    Next.js-приложение (App Router)
packages/ui                 UI-компоненты и design tokens
packages/content-contracts  доменные типы и контракты получения контента
docs/                       контекст и план проекта
```

## Локальный запуск

Требуются Node.js 20.19+ и pnpm 11.

```bash
pnpm install
pnpm dev
```

После запуска откройте http://localhost:3000.

Внутренняя документация дизайн-системы доступна по адресу http://localhost:3000/design-system и не включается в публичную навигацию.

## Проверки

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Подробнее об ограничениях проекта — в [docs/project-context.md](docs/project-context.md), о правилах внесения изменений — в [CONTRIBUTING.md](CONTRIBUTING.md).
