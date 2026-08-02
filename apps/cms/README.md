# Локальная CMS drkav

`apps/cms` — локальное приложение Strapi 5.51.1 с SQLite для постепенной миграции контента drkav. Оно является частью среды разработки, но не описывает production-развёртывание.

## Запуск

Из корня монорепозитория:

```bash
pnpm dev:cms
```

Админ-панель доступна по адресу http://localhost:1337/admin. Frontend запускается отдельно командой `pnpm dev:web`.

Для сборки админ-панели:

```bash
pnpm build:cms
```

## Seed

Seed запускается только вручную:

```bash
pnpm --filter @drkav/cms seed
```

Команда не входит в `develop`, `start`, bootstrap или другие lifecycle-сценарии. Не запускайте её без явной необходимости в рамках конкретной задачи.

## Архитектурные границы

- UI и страницы не импортируют Strapi SDK или Strapi-модели.
- Страницы получают CMS-контент только через `ContentRepository` из `@drkav/content-contracts`.
- Strapi-типы изолированы в адаптере `apps/web/src/content/strapi-content-repository.ts`.
- Подключение страниц выполняется постепенно, по одной безопасной вертикали. Массового переключения страниц на CMS ещё не было.
- Frontend page registry пока остаётся миграционным источником.
- Public API закрыты. Их открытие, а также production, hosting, DNS, amoCRM, аналитика и другие реальные интеграции требуют отдельного подтверждения владельца проекта.

Локальные `.env`, SQLite в `.tmp`, uploads и generated-типы Strapi исключены из Git. Не добавляйте в репозиторий секреты или локальные runtime-данные.
