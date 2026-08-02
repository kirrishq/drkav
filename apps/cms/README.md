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

## Архитектурные границы

- UI и страницы не импортируют Strapi SDK или Strapi-модели.
- Страницы получают CMS-контент только через `ContentRepository` из `@drkav/content-contracts`.
- Strapi-типы изолированы в адаптере `apps/web/src/content/strapi-content-repository.ts`.
- Подключение страниц выполняется постепенно, по одной безопасной вертикали. Массового переключения страниц на CMS ещё не было.
- Через Strapi подключена только операция `/operaczii/plastika-grudi/uvelichenie-grudi`. Для остальных операций frontend page registry остаётся миграционным источником.
- Public role не имеет permissions на `operation` и `operation-category`. Зарегистрированный REST API доступен server-to-server через read-only API token.
- `build:web` не требует запущенной CMS: CMS-операция рендерится динамически. Для runtime доступ к Strapi обязателен; сетевые ошибки не заменяются frontend fallback.
- Открытие Public permissions, а также production, hosting, DNS, amoCRM, аналитика и другие реальные интеграции требуют отдельного подтверждения владельца проекта.

Локальные `.env`, SQLite в `.tmp`, uploads и generated-типы Strapi исключены из Git. Не добавляйте в репозиторий секреты или локальные runtime-данные.

## Read-only token для frontend

В Strapi откройте **Settings → API Tokens**, создайте token типа **Read-only** и один раз скопируйте его в `apps/web/.env.local` как `STRAPI_API_TOKEN`. Там же задайте `STRAPI_API_URL=http://localhost:1337`. Не используйте префикс `NEXT_PUBLIC_` и не добавляйте `.env.local` в Git.

## Проверка редакторского сценария

1. Откройте в Strapi запись «Увеличение груди».
2. Измените поле `heading`, не меняя медицинский смысл.
3. Нажмите **Publish**.
4. Откройте `/operaczii/plastika-grudi/uvelichenie-grudi` в Next.js.
5. Убедитесь, что новый заголовок появился без изменения frontend-кода. Сохранённый draft без Publish на обычной странице не отображается.
6. Верните `heading` к «Увеличение груди: аугментационная маммопластика» и снова нажмите **Publish**.
