# Handoff: полная CMS-вертикаль «Увеличение груди»

Дата фиксации: 2 августа 2026 года.

Ветка: `codex/strapi-local-cms`.

Этот документ сохраняет контекст реализации, чтобы работу можно было безопасно продолжить в другой сессии или на другом компьютере. Секретов и локальных runtime-данных здесь нет.

## Результат

Операция `/operaczii/plastika-grudi/uvelichenie-grudi` переведена на полное управление через Strapi: первый экран и SEO, содержательные секции, якорная навигация и цены. Остальные операции продолжают использовать frontend registry. Страница `/ceny` не мигрирована.

Основной источник контента: <https://drkav.ru/ceny/plastika-grudi/uvelichenie-grudi.html>.

Перенесено 16 operation-specific секций и 8 строк основной таблицы цен. Общесайтовые акции, консультации, отзывы, контакты, социальные и footer-блоки в `operation` не переносились.

Редакторские риски и все технические нормализации перечислены в `docs/content-review/breast-augmentation.md`.

## Архитектурные решения

- В существующий `operation` добавлена ограниченная Dynamic Zone `contentSections` только с компонентами `operation.rich-text-section`, `operation.list-section`, `operation.steps-section`, `operation.checklist-section` и `operation.price-section`.
- Создан переиспользуемый Collection Type `price-item` с Draft & Publish и двунаправленной many-to-many связью с `operation`.
- Junction-модель не создавалась: порядок прямой relation проверен в Document Service, SQLite и REST, после seed и перепубликации он сохраняется.
- Денежные значения основной таблицы находятся в `price-item`; `operation.price-section` хранит только положение, заголовок, вводный текст и disclaimer.
- Неоднозначная строка редукции `450/550/650 тысяч` сохранена как `on-request` с исходными значениями в `note`; диапазон не выдумывался.
- UI получает только CMS-neutral модели из `@drkav/content-contracts`. Raw Strapi types и `__component` не доходят до страницы или renderer.
- Strapi adapter использует явный `populate`, runtime validation, `server-only`, timeout и `cache: "no-store"`. Неизвестная секция или неконсистентная цена считаются integration error.
- Blocks выводятся минимальным типизированным renderer без `dangerouslySetInnerHTML`.
- `SITE_URL` используется серверным SEO mapper с обратной совместимостью для `NEXT_PUBLIC_SITE_URL`.

## Seed и защита редакторских данных

Команда:

```bash
pnpm --filter @drkav/cms run seed:breast-augmentation
```

Seed находит существующую operation по `canonicalPath` и не создаёт её при отсутствии. Цены ищутся по стабильному `key`. Seed-owned секции сопоставляются по `sectionKey`, неизвестные редакторские секции и их порядок сохраняются. Редакторские draft-изменения не публикуются автоматически.

Финальный повторный запуск завершился без изменений: operation, категория и все 8 цен были переиспользованы как опубликованные записи. Контрольное состояние: 1 operation document, 1 category document, 8 price documents, 16 секций, 50 text items, 4 steps и 8 price relations на версию; дублей нет.

## Выполненные проверки

- `pnpm lint` — passed.
- `pnpm typecheck` — passed.
- `pnpm build:cms` — passed.
- `pnpm build:web` — passed без доступного Strapi; тестовая operation исключена из `generateStaticParams`.
- `git diff --check` — passed.
- Public API operations и price-items — `403`.
- Авторизованный REST — 1 опубликованная operation, 16 секций и 8 активных опубликованных цен в исходном порядке.
- Draft & Publish текста, суммы и `isActive` проверены обратимыми изменениями; исходные значения восстановлены.
- Переиспользование одного `price-item` второй временной operation проверено; временные данные удалены.
- Целевая страница, registry-операция, 404 неизвестной операции, legacy redirect, metadata и canonical проверены.
- Мобильная ширина 390 px, якоря, keyboard focus, отсутствие горизонтального overflow и отсутствие token в client bundle проверены.
- `/ceny` не изменена.
- `.env`, SQLite, uploads и generated-файлы Strapi в Git не добавлены.

Локальные пользовательские dev-процессы на портах 3000 и 1337 во время финальных проверок не останавливались.

## Важные файлы

- `apps/cms/seed/v1/breast-augmentation.mjs` — исходные секции и цены.
- `apps/cms/scripts/seed-breast-augmentation.js` — идемпотентный seed.
- `apps/cms/src/api/operation/content-types/operation/schema.json` — Dynamic Zone и relation цен.
- `apps/cms/src/api/price-item/` — новый Collection Type.
- `apps/cms/src/components/operation/` — компоненты секций.
- `packages/content-contracts/src/index.ts` — CMS-neutral union, Blocks и `PriceItem`.
- `apps/web/src/content/strapi-content-repository.ts` — REST adapter, validation и mapper.
- `apps/web/src/components/operation-content/` — Blocks и operation renderer.
- `apps/web/src/styles/operation-content.css` — стили секций и якорной навигации.
- `docs/content-review/breast-augmentation.md` — редакторский отчёт.

## Открытые редакторские вопросы

Кодовая вертикаль завершена. Перед production-публикацией остаются решения владельца контента:

1. Медицински проверить утверждения и сроки, отмеченные в редакторском отчёте.
2. Уточнить смысл трёх сумм для редукции груди.
3. При будущей миграции `/ceny` решить, нужно ли выделить наркоз, стационар и размещение в самостоятельные `price-item` и как их группировать.

## Ограничения для продолжения

- Не мигрировать остальные операции массово.
- Не открывать Public API и не подключать production/реальные интеграции без отдельного подтверждения.
- Не добавлять CMS-зависимости в UI и страницы; сохранять границу `ContentRepository`.
- Не коммитить локальные секреты, SQLite, uploads или generated-файлы Strapi.
- Следующую CMS-вертикаль подключать отдельной контролируемой задачей.
