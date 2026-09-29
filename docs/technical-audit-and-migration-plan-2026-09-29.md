# Технический аудит и план переезда drkav.ru

Дата: 29 сентября 2026 года.

## Короткий вывод

Новый проект уже имеет хорошую основу: Next.js App Router, типизированный UI, отдельный ContentRepository, Strapi-модели, seed-скрипты, локальный Mailpit и базовую защиту CMS-контента от некорректного ответа.

Но к production он пока не готов. Главные причины:

1. Формы в production по умолчанию отключены: сейчас доставка работает только в Mailpit.
2. Интеграции старого сайта с amoCRM, почтой, Comagic, аналитикой, YourGood и Salebot не перенесены.
3. Последний полный `pnpm audit --prod` до overrides сообщал 39 уязвимостей: 0 critical, 17 high, 21 moderate и 1 low. Повторный audit после overrides нужно завершить при стабильном доступе к npm registry.
4. Next.js обновлён с 15.5.22 до 15.5.26; Strapi обновлён с 5.51.1 до 5.55.1.
5. Часть фото и видео по-прежнему загружается с `drkav.ru` и Webflow CDN. После остановки старого сайта часть нового проекта перестанет показывать медиа.
6. В коде расходятся юридические реквизиты и адрес ИП: это нужно исправить до запуска форм и оплаты.
7. `sitemap.ts`, `robots.ts` и базовые security headers/CSP добавлены; ещё нет полноценного e2e/security smoke-теста.
8. CMS настроена на локальный SQLite и локальные uploads. Для production нужны PostgreSQL, внешнее S3-хранилище и резервное копирование.

## 1. Что проверено

Проверены:

- `apps/web` и `packages/ui`;
- `apps/cms`, Strapi config, schemas, seed scripts;
- формы consultation/feedback и API route handlers;
- `.env.example`, Docker Compose и production checklist;
- все найденные внешние URL/скрипты в исходниках;
- HTML и подключаемые скрипты текущего оригинального сайта;
- `pnpm typecheck`, `pnpm lint`, `pnpm build:cms`, `pnpm build:web`;
- `pnpm audit --prod`.

Локальные проверки:

- `pnpm typecheck` — успешно;
- `pnpm lint` — успешно;
- `pnpm build:cms` — успешно;
- `pnpm build:web` — завершился успешно, но во время сбора страниц вывел много `fetch failed` из-за недоступности CMS в sandbox. Это нужно отдельно проверить в CI: production build не должен молча выпускать неполное содержимое при недоступной CMS.
- `pnpm audit --prod` — последний полный отчёт до overrides: 39 advisory; повторный запрос после overrides прерывался сетевой ошибкой npm registry.
- `pnpm typecheck` — успешно после добавления sitemap/robots и retry доставки форм.
- Локальный `curl` подтвердил `Content-Security-Policy`, `Permissions-Policy`, `Referrer-Policy`, `X-Content-Type-Options` и `X-Frame-Options`.

## 2. Критические недоработки

### P0 — заявки и интеграции

#### Формы не работают в production

`apps/web/src/lib/form-submission.ts` отправляет письма только в Mailpit. Логика:

```text
development → Mailpit
production   → FORM_DELIVERY_MODE, иначе disabled
```

То есть без отдельной реализации production delivery API возвращает `503 «Локальная доставка форм не включена»`. Форма визуально может показывать успех только после успешной локальной доставки; реальные заявки в production сейчас некуда отправлять.

Нужно сделать единый серверный шлюз заявок:

```text
форма → Next API route → валидация/антиспам
                     ├→ amoCRM
                     ├→ корпоративная почта
                     └→ журнал delivery status / fallback
```

Нельзя отправлять amoCRM-токены, SMTP-секреты или Strapi token в Client Component.

#### Текущая защита форм недостаточна для production

Уже есть полезные меры: JSON-only, лимит тела 16 КБ, honeypot `website`, минимальное время заполнения, обязательные согласия, проверка Origin, базовый rate limit.

Слабые места:

- rate limit хранится в обычном `Map` процесса и сбрасывается после рестарта;
- при нескольких Node/container instances каждый instance имеет свой лимит;
- distributed rate limit ещё не подключён; текущий `Map` подходит только для локального режима или одного временного instance;
- нет WAF/edge rate limiting;
- повторная доставка для сетевых ошибок, 408/429 и 5xx добавлена с максимумом трёх попыток и задержками 250/750 мс; persistent очереди для ручного повторения всё ещё нет;
- contact feedback принимает строку «телефон или email», но сервер не различает и не нормализует форматы;
- delivery failure нельзя безопасно повторить оператором без новой заявки;
- медицинские/персональные данные не должны попадать в обычные логи, analytics events или exception traces.

Рекомендуемый слой антиспама: honeypot + минимальное время + edge rate limit + distributed rate limit + невидимая Yandex SmartCaptcha с обязательной проверкой токена на сервере. SmartCaptcha поддерживает серверную проверку одноразового токена и невидимый режим; документация описывает POST на `smartcaptcha.cloud.yandex.ru/validate` и срок жизни токена 5 минут.

#### Старые интеграции, найденные на оригинальном сайте

| Интеграция | Что обнаружено | Статус в новом проекте | Что перенести |
| --- | --- | --- | --- |
| amoCRM | `/amo/saveLeadWithUTM.js`, `/amo/amo.js`, endpoint `/amo/amo.php`; передаются имя, телефон, UTM/referrer, pipeline/status IDs. | Не перенесена. | Новый server-side adapter, mapping полей, UTM/referrer, idempotency, retry, тестовая воронка. |
| Почтовая отправка | `/mail.js` перехватывает формы и отправляет их через `/mail.php`; старые формы используют `GET` в HTML, JS меняет поведение на `POST`. | Заменена только локальным Mailpit. | Production SMTP/API delivery, From/Reply-To, SPF/DKIM/DMARC, retry, уведомление об ошибке. |
| Comagic | Скрипт `https://app.comagic.ru/static/cs.min.js`, account `EoghxPDmaUFVmhEgqgIzueYgC_gVGG2k`. | Не найден в новом проекте. | Подтвердить, используется ли коллтрекинг; подключать после решения по privacy/cookie consent. |
| Google Analytics | GA4 `G-2RH98T9GQG`, на старом сайте `anonymize_ip: false`. | Не найден. | Перенести только после решения о consent; IP anonymization включить. |
| Яндекс.Метрика | Counter `87650551`, включён `clickmap`, `trackLinks`, `accurateTrackBounce`, `webvisor`. | Не найден. | Перенести после проверки уведомления и legal basis; webvisor для медицинского сайта согласовать отдельно. |
| Meta Pixel | Pixel `445162583516329`. | Не найден. | Не переносить автоматически; отдельно решить legal/marketing consent и доступность сервиса. |
| YourGood | Widget ID `82865de7-5ff4-4ce8-8cc7-20f7621b97b2`. | Не найден. | Понять назначение виджета и наличие аккаунта/данных; затем подключать через controlled third-party script. |
| Salebot | Две ссылки на анкеты для женщин/мужчин. | Не найден. | Проверить, нужны ли они вместо новой формы консультации или как отдельный путь. |
| ПроДокторов | Ссылка, логотип и рейтинг; seed reviews использует URL профиля. | Частично есть: ссылка/баннер и данные отзывов. | Зафиксировать источник, не подменять внешние отзывы собственными; проверить права на изображения/тексты. |
| Видео | В новом коде есть ссылки на `https://drkav.ru/videos/...`. | Зависит от старого хостинга. | Скопировать и проверить видео в S3/CDN; заменить все URL. |
| Webflow CDN | Часть отзывов и social thumbnails берётся с `cdn.prod.website-files.com`. | Зависимость осталась. | Скачать только разрешённые assets, проверить лицензии, загрузить в собственное media storage. |
| Книга/НеШкола/Recovery | `book.drkav.ru`, `neschool.drkav.ru`, `recovery.drkav.ru`. | Внешние поддомены. | Решить, остаются ли они; проверить DNS, TLS, ownership и формы на каждом поддомене. |
| Платежи/Zoom | Упоминаются в тексте оферты: Robokassa, Podeli, Zoom, Telegram. | Это текстовые упоминания, не подтверждённые runtime-интеграции. | Не считать интеграциями без проверки реального процесса оплаты/консультации. |

Старые endpoint-ы сейчас отвечают HTML: `/mail.php` и `/amo/amo.php` — HTTP 200 при GET, `/amo/upload.php` — HTTP 404. Это не доказывает, что POST-сценарий жив. Перед отключением старого сайта нужен безопасный тестовый лид в отдельной CRM-сделке и тестовое письмо.

### P0 — безопасность зависимостей

Последний полный `pnpm audit --prod` до overrides:

| Severity | Количество |
| --- | ---: |
| Critical | 0 |
| High | 17 |
| Moderate | 21 |
| Low | 1 |

Самые важные узлы:

- `next@15.5.26`: обновлён до security-fixed версии;
- `sharp@0.35.3`: зафиксирован через workspace override вместо уязвимой версии `0.34.5`;
- `vite@5.4.21`: high advisory, приходит через Strapi и не форсируется на несовместимую major-версию;
- `postcss@8.5.24`: зафиксирован через workspace override вместо вложенной версии `8.4.31`;
- `nodemailer@9.0.1`: moderate advisories через Strapi email provider;
- большое дерево Strapi/admin-dev dependencies с `brace-expansion`, `ip-address`, `hono`, `undici` и другими advisory.

План:

1. Обновить Next.js как минимум до security-fixed версии, затем проверить React/React DOM и lockfile.
2. Обновить Strapi patch/minor версию в пределах совместимой ветки; текущая локальная версия — 5.55.1.
3. После каждого обновления выполнить `pnpm install --frozen-lockfile`, `pnpm audit --prod`, typecheck, lint, обе сборки и smoke-test CMS.
4. Не делать слепой `pnpm update --latest` на всём workspace: Strapi и Next обновлять контролируемыми шагами.

### P0 — юридические данные и персональные данные

На момент аудита в проекте были расхождения, которые теперь подтверждены владельцем и исправлены:

- `ИНН 583201220045` — единый ИНН ИП;
- `admin@drkav.ru` — единый юридический email;
- `123298 Москва, ул. 3-я Хорошёвская, 27/3-158` — адрес регистрации ИП, не адрес клиники;
- `г. Москва, Рублёво-Успенское шоссе, 123Б, этаж 2, кабинет 1` — адрес клиники ASBeauty.

В юридических документах адрес регистрации ИП должен оставаться отдельно от адреса клиники. Следующий технический шаг — вынести эти реквизиты и контакты в единый site settings source, чтобы новые расхождения не появлялись при ручном редактировании.

## 3. Архитектурные и контентные слабые места

### CMS пока не является единым источником контента

В проекте одновременно живут:

- `page-registry.ts` с названиями, SEO, legacy routes и статусами;
- статические TS-компоненты с текстом, ценами, ссылками и изображениями;
- Strapi models/seed data;
- remote content с `drkav.ru` и Webflow CDN.

Это удобно для миграции, но опасно перед запуском: изменение адреса, цены, телефона или SEO может потребовать правок в нескольких местах.

Приоритетные кандидаты для переноса в CMS:

1. contacts/site settings/legal contacts;
2. operations, categories, price items;
3. articles/conditions/blog;
4. reviews and before/after;
5. promotions;
6. media/video references;
7. SEO and redirects.

UI-компоненты при этом должны остаться CMS-neutral, как сейчас задумано.

### Большинство коммерческих страниц нельзя публиковать как полноценные

В registry много страниц со статусом `scaffold`. Наличие title и URL не заменяет контент: для операции нужны показания, ограничения, подготовка, ход, восстановление, риски, стоимость/условия, CTA, FAQ и связанные материалы.

До открытия индексации нужно выбрать одно из двух:

- наполнить страницу и выпустить;
- оставить `noindex`/draft и не включать в sitemap.

### Remote media — скрытая точка отказа

В исходниках обнаружены прямые ссылки на:

- `https://drkav.ru/videos/...`;
- `https://cdn.prod.website-files.com/...`;
- `https://drkav.ru/images/...`.

Переезд HTML/Next-кода без миграции этих файлов не является полным переездом. Нужно составить media manifest: URL, тип, размер, владелец прав, назначение, новый S3 key, alt/poster, статус проверки.

Видео не следует хранить в Git и в локальном Strapi uploads. Для него нужны object storage + CDN + poster/thumbnail + лимиты доступа.

### Cache/revalidation и deployment не завершены

Есть хорошие cache tags и last-known-good логика, но отсутствуют:

- защищённый Publish webhook из Strapi в Next;
- единый shared cache при нескольких instances;
- production monitoring;
- гарантированный механизм rollback CMS/content;
- проверка, что build падает при недоступной CMS, а не собирает частичный результат.

В текущем локальном build были многочисленные `fetch failed`, но команда завершилась с кодом 0. Это надо считать release-risk до выяснения причины.

### Нет автоматических browser/e2e тестов

Есть typecheck/lint/build и ручные smoke-checks в документации, но в workspace не найден полноценный Playwright/Cypress suite. Не покрыты автоматически:

- мобильный header и dropdown;
- формы и double submit;
- redirects;
- canonical/robots/sitemap;
- отсутствие horizontal overflow;
- broken images/video;
- CMS unavailable/expired cache;
- клавиатура, focus, modal escape;
- 404/500.

## 4. Security baseline для нового production

### Сеть и сервисы

Рекомендуемая схема:

```text
Internet
   ↓
DNS / TLS / WAF / rate limit / reverse proxy
   ├── drkav.ru → Next.js (public)
   └── admin.drkav.ru → Strapi Admin (allowlist/VPN/strong auth)

Next.js private network
   ├── Strapi Content API (не public)
   ├── Managed PostgreSQL (не public)
   ├── Redis/rate-limit/cache (не public)
   └── S3 media + CDN
```

Правила:

- наружу открыты только 80/443 у reverse proxy;
- Strapi Content API и admin не выставлять на общий public URL без отдельной защиты;
- PostgreSQL, Redis и Mailpit не имеют public ports;
- Strapi Admin — отдельный hostname, MFA/strong password, allowlist или VPN;
- SSH — только key auth, без password login, отдельный non-root user, firewall;
- регулярные OS/container security updates;
- резервные копии базы и media проверяются восстановлением, а не только наличием файла.

### HTTP headers

В `next.config.ts` пока нет `headers()`. Перед запуском добавить и проверить:

- `Strict-Transport-Security` — только после полного перехода на HTTPS и проверки поддоменов;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `Permissions-Policy` с отключёнными ненужными camera/microphone/geolocation;
- `frame-ancestors`/`X-Frame-Options`;
- CSP с явным allowlist всех нужных third-party scripts, карт, аналитики, S3/CDN и SmartCaptcha.

CSP нельзя включать вслепую: сначала составить список разрешённых доменов, иначе сломаются карты, видео, формы и аналитика.

### CMS и uploads

- Перейти с SQLite на PostgreSQL.
- Перейти с local upload provider на S3-compatible provider.
- Не хранить uploads, `.tmp`, database и secrets в Git.
- Оставить Public role без Content API permissions.
- Frontend использует только read-only server-side token.
- Отдельный admin token, rotation procedure и emergency revoke.
- Проверять MIME и расширение, ограничивать размер, генерировать безопасные имена файлов.
- Не разрешать executable/script uploads; текущий allowlist хороший старт, но его нужно проверить после выбора S3 provider.
- Запретить или ограничить SVG, если нет необходимости: SVG может содержать активное содержимое.

### Content security

CMS rich-text mapper уже ограничивает типы inline nodes и URL-схемы. Сохранить эти ограничения и добавить:

- allowlist внутренних canonical paths для внутренних ссылок;
- запрет `javascript:`, data URLs и нестандартных протоколов во всех content fields;
- строгую проверку внешних ссылок в редакторском workflow;
- sanitation/render tests для rich text, images, lists, headings и links;
- audit trail для изменения medical/SEO/legal content.

## 5. Где размещать проект

### Рекомендуемая модель

Для этого проекта оптимален не статический хостинг, а небольшой self-hosted Docker production в российском облаке:

- Next.js — отдельный container;
- Strapi — отдельный container;
- Managed PostgreSQL;
- S3-compatible media storage;
- reverse proxy + TLS;
- Redis только если нужен distributed rate limit/shared cache;
- backup/monitoring.

Next.js использует server routes, ISR/cache и запросы к Strapi, поэтому переносить его как набор HTML-файлов нельзя.

### Shortlist

| Вариант | Подходит | Плюсы | Минусы |
| --- | --- | --- | --- |
| Selectel | Основной кандидат | Есть cloud servers, Managed PostgreSQL, S3 и backup-oriented инфраструктура; удобно держать web/CMS/DB/media в одной российской экосистеме. | Нужно самостоятельно организовать Docker/reverse proxy и проверить итоговую стоимость. |
| Timeweb Cloud | Кандидат для более простого старта | Есть VDS/облачные серверы, DBaaS PostgreSQL, S3, CDN, firewall и monitoring. | Нужно внимательно проверить особенности cache, backup и private network под выбранный тариф. |
| Vercel для web + отдельный российский CMS/media | Только preview или после отдельной проверки | Быстрый деплой Next.js. | Нужно отдельно подтвердить доступность/оплату, хранение данных, региональные ограничения и связность с CMS; не выбирать автоматически для production. |
| REG.RU текущий HTML-хостинг | Не подходит как основная платформа | Домен/DNS уже рядом. | Не решает Next server runtime, Strapi, PostgreSQL, jobs, S3, rate limiting и private network. Домен можно оставить в REG.RU, а hosting вынести. |

Selectel документирует S3-compatible object storage и Managed PostgreSQL; Timeweb Cloud документирует облачные серверы, DBaaS, S3, CDN, VPC, firewall и monitoring. Окончательный выбор делать после сравнения тарифов, оплаты из РФ, SLA, резервного копирования и поддержки, а не только по цене VPS.

### Минимальная production-конфигурация

Для первого запуска:

- 1 web instance: 2–4 vCPU, 4–8 GB RAM;
- 1 CMS instance: 2 vCPU, 4 GB RAM;
- Managed PostgreSQL: 2 vCPU/4 GB или минимальный HA-ready тариф;
- S3: оригиналы/публичные derivatives/video;
- reverse proxy: Nginx/Caddy;
- WAF/rate limiting на edge;
- ежедневные encrypted backups DB;
- S3 versioning/lifecycle;
- uptime + error monitoring;
- staging environment отдельно от production.

Это стартовая оценка, не окончательная спецификация. Масштабирование нужно решать по фактическому трафику и объёму видео.

## 6. План аккуратного переезда

### Этап 0. Freeze и реестр текущего сайта

1. Не отключать REG.RU и старый сайт.
2. Сохранить полный backup HTML, PHP, JS, CSS, images, videos, uploads, DNS и текущих env/config.
3. Составить integration register: CRM, mail, call tracking, analytics, pixels, chat, payment, forms.
4. Получить доступы и владельцев для каждой интеграции.
5. Зафиксировать подтверждённые реквизиты ИП, адрес, телефоны, email, клинику ASBeauty.
6. Утвердить, какие сервисы продолжаем использовать, а какие удаляем.

### Этап 1. Сначала закрыть release blockers в коде

1. Обновить уязвимые dependencies и зафиксировать lockfile.
2. Реализовать production form delivery через server-side adapters.
3. Добавить SmartCaptcha, distributed rate limit, WAF-friendly IP handling и idempotency key.
4. Добавить security headers/CSP — базовый набор уже добавлен; после подключения всех production-интеграций нужно повторно проверить CSP и по возможности убрать `unsafe-inline`.
5. Убрать прямые ссылки на старый image/video host из production content.
6. Создать единый `site-settings` источник контактов/legal data.
7. Добавить `app/robots.ts`, `app/sitemap.ts`, health endpoint и structured logs — robots/sitemap уже добавлены.
8. Сделать Playwright smoke suite.

### Этап 2. Поднять staging infrastructure

1. Создать отдельный staging project/account.
2. Поднять Docker Next + Strapi.
3. Подключить PostgreSQL.
4. Подключить S3 provider для Strapi upload.
5. Закрыть CMS API/admin от общего интернета.
6. Настроить secrets storage, TLS, backups, monitoring.
7. Настроить staging domain, например `stage.drkav.ru`, без индексации.

### Этап 3. Перенести контент и media

1. Выполнить media manifest и перенести оригиналы/derivatives/videos.
2. Проверить checksum/размер/формат и наличие poster для каждого видео.
3. Перенести 51 статью «Про болезни» и проверить все внутренние ссылки.
4. Перенести blog, reviews, before-after, portfolio, operations, prices, promotions.
5. Заполнить SEO, alt, canonical, publication status и legal consent fields.
6. Не публиковать неполные операции: draft/noindex до редакторской и medical проверки.

### Этап 4. Подключить integrations

1. amoCRM: отдельный server-side adapter, test pipeline, UTM/referrer, retry/idempotency.
2. Почта: SMTP/API provider, SPF/DKIM/DMARC, From/Reply-To, bounce handling.
3. Comagic: только после подтверждения необходимости и consent logic.
4. Метрика/GA: события `form_view`, `form_start`, `form_success`, `form_error`; без ФИО, телефона и текста сообщения.
5. YourGood/Salebot: отдельные решения, не добавлять скрипты без owner/контракта.
6. ПроДокторов/social links/video: проверить актуальность и права.

### Этап 5. Pre-cutover QA

Проверить на staging:

- каждый URL из старого sitemap;
- каждый redirect без цепочки;
- `http → https`, `www → non-www` или выбранный canonical host;
- 404/410 для технических URL;
- forms success/error/rate limit/captcha/duplicate submit;
- CRM lead и email с тестовыми данными;
- mobile 390 px, desktop, keyboard and screen reader basics;
- no horizontal overflow;
- all images/videos load from new storage;
- no `localhost`, old `.html`, old address, old clinic name or stale legal details;
- no secrets in client bundle/logs;
- sitemap/robots/canonical/noindex;
- cold/warm CMS cache and CMS outage behavior;
- backups and restore.

### Этап 6. Cutover

1. За 24–48 часов снизить DNS TTL.
2. Заморозить публикацию в старом CMS/site files.
3. Сделать финальный content/media backup.
4. Проверить staging build из production commit.
5. Переключить DNS/hosting.
6. Сразу проверить homepage, contacts, consultation, one operation, one article, redirects, forms, CRM and mail.
7. Оставить старый hosting доступным для rollback и media fallback на ограниченное время.
8. Не удалять старые файлы, пока access logs и Search Console/Yandex Webmaster не покажут стабильный переход.

### Этап 7. После запуска

1. Мониторить 5xx, 404, redirect loops, forms, CRM delivery и email bounces.
2. Ежедневно первые две недели проверять заявки вручную.
3. Проверить индексацию и lost URLs.
4. После подтверждения миграции отключить старые endpoints, а не оставлять старый PHP mail/CRM proxy открытым.
5. Провести повторный dependency audit и restore drill.

## 7. Definition of Done для запуска

Запуск разрешён только когда одновременно выполнены условия:

- production form leads попадают в CRM и в резервный email;
- есть антиспам и server-side captcha validation;
- нет critical/high unresolved dependency blockers без документированного исключения;
- CMS не доступна через public Content API без авторизации;
- PostgreSQL и S3 backups проверены восстановлением;
- все media обслуживаются новым storage/CDN;
- реквизиты, адрес и legal text согласованы и одинаковы;
- старый sitemap покрыт решениями 200/redirect/410;
- `robots`, `sitemap`, canonical и noindex проверены;
- staging smoke/e2e tests зелёные;
- rollback реально проверен;
- есть список владельцев доступа и процедура emergency rotation.

## 8. Рекомендуемый порядок ближайших задач

1. Зафиксировать реквизиты и список интеграций.
2. Обновить dependencies, начиная с Next.js и Strapi security chain.
3. Спроектировать и реализовать production form gateway.
4. Выбрать Selectel или Timeweb Cloud после сравнения тарифа/оплаты/backup/SLA.
5. Поднять staging Next + Strapi + PostgreSQL + S3.
6. Перенести media и проверить все remote URLs.
7. Перенести и проверить контент.
8. Подключить amoCRM/mail/analytics по одному, с тестовыми данными.
9. Провести полный redirect/content/forms/security QA.
10. Только после этого переключать DNS.
