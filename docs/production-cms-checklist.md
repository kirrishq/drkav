# Production checklist для CMS-страниц

Этот документ описывает эксплуатационные требования первой CMS-вертикали `/operaczii/plastika-grudi/uvelichenie-grudi`. Он не разрешает production-развёртывание или подключение новых сервисов.

## Переменные и секреты

- Задать server-side `STRAPI_API_URL` и `STRAPI_API_TOKEN` в secret storage выбранной платформы. Локально они находятся только в `apps/web/.env.local`, который исключён из Git.
- Использовать read-only API token. Не применять префикс `NEXT_PUBLIC_`, не передавать token в props Client Components и не выводить URL, token, Authorization header, response body или `.env` в логи.
- Задать `CMS_REVALIDATE_SECONDS`. Default — 3600 секунд; production minimum — 60 секунд. Пустое значение использует default, а нецелое, нулевое, отрицательное или слишком малое production-значение завершает запрос или build понятной `CmsConfigurationError`.
- При ротации сначала создать новый read-only token, обновить server-side secret и проверить CMS-страницу, затем отозвать старый token. При подозрении на компрометацию выполнить ротацию немедленно.

## Development и production build

- В development Strapi fetch использует `cache: "no-store"`: после Publish редакторские изменения видны сразу. Draft operation и draft price не должны попадать на публичную страницу.
- Production fetch использует стандартный Next.js 15 server-side `fetch` с `next.revalidate` и tag `operation:<canonical-path>`. React `cache()` только дедуплицирует page и `generateMetadata` в рамках server render.
- `generateStaticParams` объединяет registry operations и только явно перечисленные `cmsMigratedOperationPaths`. Автоматически получать все Strapi operations запрещено.
- `build:web` требует доступную Strapi, валидный server-side token и опубликованный CMS-документ для каждого migrated path. Ошибка CMS или отсутствие published-записи должны завершить build; registry fallback не используется. Сохранение предыдущего deployment обеспечивает hosting-платформа.

## Last-known-good и fallback

- До истечения TTL пользователь получает cached page. После TTL Next.js выполняет ревалидацию; успешный результат заменяет cache, а исключение оставляет last-known-good page доступной.
- Network error, timeout, 5xx, 401/403, invalid JSON, invalid schema, неизвестный component и неконсистентная цена всегда остаются исключениями и не записываются как CMS-документ.
- `null` означает только успешный ответ Strapi без опубликованной операции и приводит к 404. Outage не преобразуется в `null`.
- Если integration error достигает segment tree, route-level `error.tsx` показывает generic fallback и использует предоставленный `reset()`. Он не содержит medical registry content и не записывается в CMS Data Cache.
- Проверка Next.js 15.5.22 показала ограничение: если одновременно удалить build-time pre-render (`.html/.rsc/.meta`) и Data Cache, on-demand ISR пропускает App Router segment/global boundary. Поэтому статический `pages/500.tsx` служит совместимым аварийным экраном для этой ранней ошибки: он сохраняет HTTP 500, добавляет `noindex, nofollow` и повторяет запрос через reload. Catch с успешным ответом внутри CMS-page не используется, чтобы fallback не попал в Full Route Cache.
- Корректный production artifact всё равно должен содержать предварительно сгенерированную страницу, а build при недоступной CMS или отсутствии published-записи падает. Аварийный 500 защищает пользователя при потере cache/artifact, но не делает неполный deployment допустимым.
- `generateMetadata` при холодной CMS-ошибке возвращает только generic title, canonical из route path и `noindex, nofollow`. При прогретом cache сохраняются последние успешные title, description, canonical, robots и Open Graph поля.
- Обычный segment fallback может получить 200 после начала streaming и использует generic metadata. Проверенный cold-cache путь без pre-render возвращает branded HTTP 500 из `pages/500.tsx` с `noindex, nofollow`; два повторных запроса не создали CMS Data Cache или route HTML/RSC. После восстановления CMS кнопка повторной попытки загрузила полную страницу и заполнила оба cache.

## Hosting и cache storage

### Managed Next.js hosting

- Подтвердить поддержку ISR/Data Cache, сохранение cache между deployments и семантику tag revalidation.

### Один Node.js instance

- Cache принадлежит одному instance. Перезапуск или новый deployment может потребовать повторного прогрева; production build всё равно создаёт исходную страницу.

### Один Docker instance

- Cache внутри контейнера может исчезнуть при пересоздании. Предварительно сгенерированная build-страница остаётся исходной защитой, если она включена в immutable artifact.

### Несколько Node/Docker instances

- Per-instance cache недостаточен. После выбора hosting нужен общий persistent cache handler и согласованная tag invalidation. Redis или custom cache handler в текущей задаче не устанавливаются.

## Media

- Текущая Strapi использует default local upload provider; CMS media обслуживаются процессом Strapi из `apps/cms/public/uploads` и недоступны при его остановке. Uploads не добавляются в Git.
- До production перенести CMS media во внешнее object storage/CDN. Provider и credentials выбираются отдельным решением владельца.
- Не копировать CMS images во frontend как аварийный fallback. Необязательное отсутствующее изображение не должно ломать layout.

## Будущая revalidation и monitoring

- Будущий безопасный flow: Publish в Strapi → защищённый webhook → revalidate operation tag/path → успешная генерация заменяет last-known-good. Нельзя сначала безвозвратно удалять last-known-good, а затем пытаться получить новую версию.
- Webhook endpoint, webhook secret и cache handler сейчас не реализуются.
- Логи содержат только безопасный event code и route path: request timeout, unavailable, unauthorized, invalid response, metadata fallback, cold request failure и fetch/revalidation failure. Token, Authorization header, raw response, персональные данные и `.env` запрещены.
- После выбора hosting подключить внешний monitoring отдельной задачей и различать warm-cache success, failed revalidation и cold fallback.

## Перед deployment

- Проверить `pnpm lint`, `pnpm typecheck`, `pnpm build:cms`, `pnpm build:web` и `git diff --check`.
- Выполнить production-like сценарии cold/warm/expired cache, cold fallback и recovery через segment `reset()` либо reload совместимого static 500.
- Проверить CMS operation, registry operation, 404, legacy redirect с query, `/ceny`, drafts, один `h1`, anchors, keyboard, 390 px и horizontal overflow.
- Подтвердить закрытые Public permissions, отсутствие token в client bundle и отсутствие `.env.local`, SQLite, uploads или runtime-файлов в Git.
