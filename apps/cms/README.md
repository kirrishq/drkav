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

Точечный идемпотентный seed первой CMS-операции:

```bash
pnpm --filter @drkav/cms seed:breast-augmentation
```

Он ищет операцию по `canonicalPath`, slug и существующим названиям, не перезаписывает непустые редакторские значения и не публикует автоматически найденный пользовательский draft. Новая валидная запись создаётся и публикуется; повторный запуск переиспользует тот же `documentId`.

Идемпотентный импорт полного проверенного набора операций из versioned snapshots:

```bash
pnpm --filter @drkav/cms seed:operations
```

Команда использует только `src/seed-data/operations`, не обращается к live-сайту, переиспользует category/price keys и публикует только 36 записей с подтверждёнными источником, SEO, контентом и ценами. Неполная «Прорисовка грудных мышц» остаётся draft. Read-only проверка результата:

```bash
pnpm --filter @drkav/cms verify:operations
```

## Архитектурные границы

- UI и страницы не импортируют Strapi SDK или Strapi-модели.
- Страницы получают CMS-контент только через `ContentRepository` из `@drkav/content-contracts`.
- Strapi-типы изолированы в адаптере `apps/web/src/content/strapi-content-repository.ts`.
- Через Strapi и CMS-neutral `ContentRepository` подключены 36 подтверждённых operation pages. Список зафиксирован в `apps/web/src/content/cms-migrated-operations.ts`.
- Неполная `/operaczii/muzhskaya-plastika/prorisovka-grudnykh-myshcz` не входит в CMS allowlist и остаётся registry scaffold, пока не утверждены медицинский текст и SEO.
- Public role не имеет permissions на `operation` и `operation-category`. Зарегистрированный REST API доступен server-to-server через read-only API token.
- Production `build:web` предварительно генерирует явно перечисленные CMS-операции. Для сборки обязательны доступная Strapi, server-side read-only token и опубликованная запись; при ошибке integration или отсутствии записи deployment должен остановиться на failed build.
- В development CMS-запросы используют `no-store`, чтобы опубликованные редакторские изменения появлялись сразу. В production Next.js Data/Full Route Cache использует `CMS_REVALIDATE_SECONDS` (default 3600, минимум 60) и tag `operation:<canonical-path>`.
- Неудачная production-ревалидация не заменяет last-known-good документ. Route-level boundary подготовлен для ошибок, достигающих segment tree, и не показывает registry-контент или технические детали. Для раннего static/ISR 500, который Next.js 15.5.22 не передаёт segment boundary, добавлен статический branded 500-экран с `noindex`; такой экран не кэшируется как CMS-контент (см. production checklist).
- Открытие Public permissions, а также production, hosting, DNS, amoCRM, аналитика и другие реальные интеграции требуют отдельного подтверждения владельца проекта.

Локальные `.env`, SQLite в `.tmp`, uploads и generated-типы Strapi исключены из Git. Не добавляйте в репозиторий секреты или локальные runtime-данные.

## Read-only token для frontend

В Strapi откройте **Settings → API Tokens**, создайте token типа **Read-only** и один раз скопируйте его в `apps/web/.env.local` как `STRAPI_API_TOKEN`. Там же задайте `STRAPI_API_URL=http://localhost:1337`. Не используйте префикс `NEXT_PUBLIC_` и не добавляйте `.env.local` в Git. Token следует ротировать по эксплуатационному регламенту или сразу после подозрения на компрометацию: создать новый read-only token, обновить server-side secret, проверить CMS-страницу и только затем отозвать старый token. Не выводите оба значения в логах.

Полный production checklist, включая cache, media, multi-instance hosting, безопасные логи и будущую revalidation, находится в `docs/production-cms-checklist.md`.

## Проверка редакторского сценария

1. Откройте в Strapi запись «Увеличение груди».
2. Измените поле `heading`, не меняя медицинский смысл.
3. Нажмите **Publish**.
4. Откройте `/operaczii/plastika-grudi/uvelichenie-grudi` в Next.js.
5. Убедитесь, что новый заголовок появился без изменения frontend-кода. Сохранённый draft без Publish на обычной странице не отображается.
6. Верните `heading` к «Увеличение груди» и снова нажмите **Publish**.
