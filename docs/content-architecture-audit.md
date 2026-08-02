# Аудит контентной архитектуры и базовые модели Strapi

Дата проверки: 2 августа 2026 года.

## 1. Источники и границы задачи

Проверены:

- `drkav [структура] (1).xlsx`, лист `структура сайта seo`, диапазон `A1:F62`: 61 строка данных;
- `operaczii.xlsx`, лист `Sheet1`, диапазон `A1:K41`: 40 строк структуры операций;
- текущий App Router, готовые страницы, первые экраны и UI-компоненты;
- `apps/web/src/content/page-registry.ts`, `seo.ts`, `site-redirects.ts`;
- локальный Strapi 5.51.1 и существующая SQLite.

Исходные Excel-файлы не изменялись. В таблице SEO присутствуют `#NAME?`, пустые поля, слишком короткие и слишком длинные значения. В таблице операций присутствуют продуктовые комментарии, которые нельзя считать утверждёнными URL или названиями.

Архитектурная граница после этой задачи:

```text
domain content model
→ ContentRepository
→ Strapi adapter (подготовлен, но не подключён к страницам)
→ UI components
```

App Router остаётся единственным runtime-маршрутизатором. Strapi не хранит React-компоненты, Tailwind-классы, произвольный HTML или универсальные секции.

## 2. Ревизия frontend-реестра

Реестр содержит 76 записей: 17 `static`, 14 `listing`, 37 `operation`, 8 `dynamic-template`. Он не создаёт маршруты сам, но сейчас дублирует часть дерева App Router, участвует в `generateStaticParams`, metadata, scaffold-контенте и redirects. Поэтому это временный миграционный каталог с риском стать параллельным источником правды.

| Поле | Классификация | Целевое место | Вывод |
| --- | --- | --- | --- |
| `key` | техническое | код | Сохранить как стабильный `pageKey` для фиксированных страниц и привязки к React-шаблону. |
| `route` | техническое | код | Сохранить canonical route фиксированной страницы рядом с App Router binding. Для операции canonical path хранится и контролируется в модели операции. |
| `kind` | техническое | код | Сохранить как тип маршрута/шаблона, позднее заменить более узкой типизированной картой bindings. |
| `legacyRoutes` | смешанное техническое и миграционное | код redirects + audit | Подтверждённые URL оставить в коде redirects; неподтверждённые не должны работать в runtime. Полю не хватает provenance. |
| `name` | контент | Strapi `internalName`/`heading` | Сейчас используется как H1 scaffold-страницы и является параллельным контентом. |
| `section` | контентная таксономия | Strapi или навигационная конфигурация после решения | Не должен определять route. Сейчас временно помогает аудиту. |
| `group` | контентная таксономия | Strapi relation `categories` | Временный источник подгруппы операции. |
| `groups` | контентная таксономия | Strapi many-to-many `categories` | Правильно выражает многогрупповость, но должна стать relation, а не массивом строк. |
| `seo` | контент | Strapi `shared.seo` | Убрать из реестра по мере миграции вертикалей. |
| `seo.canonicalPath` | временно избыточное | Strapi SEO override | В реестре обычно повторяет `route`; в CMS допустим как контентный canonical override. |
| `contentStatus` | контент и миграционный статус | Strapi `empty/partial/ready` | Текущие `existing/scaffold/cms-template` описывают frontend, поэтому требуют явного mapping. |

### Текущие зависимости

- `RegistryScaffoldPage` напрямую читает `name` и SEO description из реестра. Это временный долг: SEO description используется как hero-текст и смешивает две разные роли.
- `StaticPage` и `PageIntro` уже CMS-neutral; их переписывать при смене источника не потребуется.
- Динамические шаблоны не создают фиктивных записей и возвращают `notFound()`. Для будущего источника подготовлен `ContentRepository`.
- Статические App Router-файлы остаются реальным route-to-template binding. Реестр не заменяет файловую маршрутизацию.

### План сокращения реестра

1. В отдельной задаче подключить одну безопасную вертикаль через `ContentRepository`.
2. Для неё оставить в коде только `pageKey`, route, тип React-шаблона и подтверждённые redirects.
3. Перенести H1, hero description, изображения, actions, SEO и категории в Strapi.
4. Удалить контентные поля из записи реестра только после проверки fallback и публикационного процесса.
5. Повторять по вертикалям; не включать сетевые запросы массово.
6. После исчезновения потребителей заменить реестр узкой картой route bindings и отдельным реестром redirects с provenance.

## 3. Аудит 87 redirect-кандидатов

Runtime теперь содержит 74 прямых редиректа: 60 подтверждены точной парой из Excel, 14 подтверждены существовавшими в `HEAD` frontend-маршрутами. Цепочек нет. Ещё 13 кандидатов сохранены в коде как `excludedRedirectCandidates`, но исключены из Next.js runtime.

### 3.1 Подтверждены Excel: 60

| Source | Destination |
| --- | --- |
| `/obo-mne/specializaciya.html` | `/obo-mne/specializaciya` |
| `/obo-mne/obrazovanie.html` | `/obo-mne/obrazovanie` |
| `/obo-mne/publikacii.html` | `/obo-mne/publikacii` |
| `/smi/smi.html` | `/obo-mne/smi` |
| `/obo-mne/vystupleniya.html` | `/obo-mne/vystupleniya` |
| `/obo-mne/neschool.html` | `/obo-mne/neshkola` |
| `/obo-mne/book.html` | `/obo-mne/book` |
| `/konsultacii/ochnaya-konsultaciya-v-klinike.html` | `/konsultacii/ochnaya-konsultaciya-v-klinike` |
| `/konsultacii/onlayn-konsultaciya.html` | `/konsultacii/onlayn-konsultaciya` |
| `/konsultacii/konsultaciya-po-ankete.html` | `/konsultacii/konsultaciya-po-ankete` |
| `/akcii.html` | `/akcii` |
| `/akcii/intimnaya-plastika-ili-lipofiling-ruk-v-podarok.html` | `/akcii/intimnaya-plastika-ili-lipofiling-ruk-v-podarok` |
| `/ceny.html` | `/ceny` |
| `/ceny/plasticheskaya-hirurgiya-posle-rodov.html` | `/operaczii/plasticheskaya-hirurgiya-posle-rodov` |
| `/ceny/plasticheskaya-hirurgiya-posle-pohudeniya.html` | `/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya` |
| `/ceny/plastika-grudi.html` | `/operaczii/plastika-grudi` |
| `/ceny/plastika-grudi/uvelichenie-grudi.html` | `/operaczii/plastika-grudi/uvelichenie-grudi` |
| `/ceny/podtyazhka-grudi-bez-implantov.html` | `/operaczii/plastika-grudi/podtyazhka-grudi-bez-implantov` |
| `/ceny/plastika-grudi/podtyazhka-grudi-bez-implantov.html` | `/operaczii/plastika-grudi/podtyazhka-grudi-bez-implantov` |
| `/ceny/plastika-grudi/umenshenie-grudi.html` | `/operaczii/plastika-grudi/umenshenie-grudi` |
| `/ceny/plastika-grudi/asimmetriya-grudi.html` | `/operaczii/plastika-grudi/asimmetriya-grudi` |
| `/ceny/plastika-grudi/udalenie-implantov-grudi.html` | `/operaczii/plastika-grudi/udalenie-implantov-grudi` |
| `/ceny/plastika-grudi/rekonstrukciya-grudi.html` | `/operaczii/plastika-grudi/rekonstrukciya-grudi` |
| `/ceny/lipofiling/lipofiling-grudi.html` | `/operaczii/lipofiling/lipofiling-grudi` |
| `/ceny/abdominoplastika.html` | `/operaczii/abdominoplastika` |
| `/ceny/diastaz-myshc-zhivota.html` | `/operaczii/diastaz-myshc-zhivota` |
| `/muzhskaya-plastika/abdominoplastika-dlya-muzhchin.html` | `/operaczii/muzhskaya-plastika/abdominoplastika-dlya-muzhchin` |
| `/ceny/muzhskaya-plastika/abdominoplastika-dlya-muzhchin.html` | `/operaczii/muzhskaya-plastika/abdominoplastika-dlya-muzhchin` |
| `/ceny/liposkulptura.html` | `/operaczii/liposkulptura` |
| `/ceny/liposkulptura/podtyazhka-yagodic.html` | `/operaczii/liposkulptura/podtyazhka-yagodic` |
| `/ceny/liposkulptura/podtyazhka-beder.html` | `/operaczii/liposkulptura/podtyazhka-beder` |
| `/ceny/liposkulptura/podtyazhka-ruk.html` | `/operaczii/liposkulptura/podtyazhka-ruk` |
| `/ceny/liposkulptura/ultrazvukovaya-liposakciya.html` | `/operaczii/liposkulptura/ultrazvukovaya-liposakciya` |
| `/ceny/lipofiling.html` | `/operaczii/lipofiling` |
| `/ceny/lipofiling/lipofiling-yagodic.html` | `/operaczii/lipofiling/lipofiling-yagodic` |
| `/ceny/liposakcziya/liposakcziya-ruk.html` | `/operaczii/liposakcziya/liposakcziya-ruk` |
| `/ceny/liposakcziya/liposakcziya-spiny.html` | `/operaczii/liposakcziya/liposakcziya-spiny` |
| `/ceny/liposakcziya/liposakcziya-vdovego-gorbika.html` | `/operaczii/liposakcziya/liposakcziya-vdovego-gorbika` |
| `/ceny/intimnaya-plastika.html` | `/operaczii/intimnaya-plastika` |
| `/ceny/rf-lifting.html` | `/operaczii/rf-lifting` |
| `/ceny/rf-lifting/rf-lifting-tela.html` | `/operaczii/rf-lifting/rf-lifting-tela` |
| `/ceny/rf-lifting/rf-lifting-zhivota.html` | `/operaczii/rf-lifting/rf-lifting-zhivota` |
| `/ceny/rf-lifting/rf-lifting-shei-i-dekolte.html` | `/operaczii/rf-lifting/rf-lifting-shei-i-dekolte` |
| `/ceny/rf-lifting/rf-lifting-morpheus-8.html` | `/operaczii/rf-lifting/rf-lifting-morpheus-8` |
| `/muzhskaya-plastika.html` | `/operaczii/muzhskaya-plastika` |
| `/ceny/muzhskaya-plastika.html` | `/operaczii/muzhskaya-plastika` |
| `/muzhskaya-plastika/ginekomastiya.html` | `/operaczii/muzhskaya-plastika/ginekomastiya` |
| `/ceny/muzhskaya-plastika/ginekomastiya.html` | `/operaczii/muzhskaya-plastika/ginekomastiya` |
| `/muzhskaya-plastika/prorisovka-pressa.html` | `/operaczii/muzhskaya-plastika/prorisovka-pressa` |
| `/ceny/muzhskaya-plastika/prorisovka-pressa.html` | `/operaczii/muzhskaya-plastika/prorisovka-pressa` |
| `/muzhskaya-plastika/atletizaciya-plech-i-ruk.html` | `/operaczii/muzhskaya-plastika/atletizaciya-plech-i-ruk` |
| `/ceny/muzhskaya-plastika/atletizaciya-plech-i-ruk.html` | `/operaczii/muzhskaya-plastika/atletizaciya-plech-i-ruk` |
| `/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder.html` | `/operaczii/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder` |
| `/ceny/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder.html` | `/operaczii/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder` |
| `/muzhskaya-plastika/bodilifting-dlya-muzhchin.html` | `/operaczii/muzhskaya-plastika/bodilifting-dlya-muzhchin` |
| `/ceny/muzhskaya-plastika/bodilifting-dlya-muzhchin.html` | `/operaczii/muzhskaya-plastika/bodilifting-dlya-muzhchin` |
| `/pacientam/bezopasnost.html` | `/pacientam/bezopasnost` |
| `/pacientam/pro-bolezni.html` | `/pacientam/pro-bolezni` |
| `/pacientam/do-i-posle.html` | `/pacientam/do-i-posle` |
| `/kontakty.html` | `/kontakty` |

### 3.2 Подтверждены существовавшим frontend-маршрутом: 14

| Source | Destination |
| --- | --- |
| `/obo-mne/smi-i-proekty` | `/obo-mne/smi` |
| `/obo-mne/obuchenie` | `/obo-mne/neshkola` |
| `/operacii` | `/operaczii` |
| `/operacii/zhivot-i-taliya` | `/operaczii/zhivot-i-taliya` |
| `/operacii/posle-rodov` | `/operaczii/plasticheskaya-hirurgiya-posle-rodov` |
| `/operacii/posle-pohudeniya` | `/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya` |
| `/operacii/grud` | `/operaczii/plastika-grudi` |
| `/operacii/diastaz-myshc-zhivota` | `/operaczii/diastaz-myshc-zhivota` |
| `/operacii/korrekciya-figury` | `/operaczii/liposkulptura` |
| `/operacii/intimnaya-plastika` | `/operaczii/intimnaya-plastika` |
| `/operacii/bez-operacii/rf-lifting` | `/operaczii/rf-lifting` |
| `/operacii/muzhchinam` | `/operaczii/muzhskaya-plastika` |
| `/portfolio` | `/pacientam/portfolio` |
| `/do-posle` | `/pacientam/do-i-posle` |

### 3.3 Исключены как чистые предположения/нормализация: 7

| Source | Предполагавшийся destination | Причина исключения |
| --- | --- | --- |
| `/operaczii/umenshenie-grudi` | `/operaczii/plastika-grudi/umenshenie-grudi` | В таблице это плановый URL, а не подтверждённый старый URL. |
| `/operaczii/podtyazhka-yagodic` | `/operaczii/liposkulptura/podtyazhka-yagodic` | Внутренняя перегруппировка без подтверждения прежней публикации. |
| `/operaczii/podtyazhka-beder` | `/operaczii/liposkulptura/podtyazhka-beder` | Внутренняя перегруппировка без подтверждения прежней публикации. |
| `/operaczii/podtyazhka-ruk` | `/operaczii/liposkulptura/podtyazhka-ruk` | Внутренняя перегруппировка без подтверждения прежней публикации. |
| `/operaczii/ultrazvukovaya-liposakciya` | `/operaczii/liposkulptura/ultrazvukovaya-liposakciya` | Внутренняя перегруппировка без подтверждения прежней публикации. |
| `/operaczii/lechenie-ginekompastii` | `/operaczii/muzhskaya-plastika/lechenie-ginekompastii` | Плановый URL и спорная отдельная сущность. |
| `/pacientam/otzyvy.html` | `/pacientam/otzyvy` | Нормализация не присутствует среди старых URL и не была frontend-маршрутом. |

### 3.4 Спорные пары: source известен, exact destination не подтверждён: 6

| Source | Предполагавшийся destination | Конфликт |
| --- | --- | --- |
| `/ceny/umenshenie-grudi.html` | `/operaczii/plastika-grudi/umenshenie-grudi` | Первая таблица задаёт destination без сегмента `plastika-grudi`; новая структура использует вложенный путь. |
| `/ceny/lechenie-ginekompastii.html` | `/operaczii/muzhskaya-plastika/lechenie-ginekompastii` | Первая таблица задаёт destination без сегмента `muzhskaya-plastika`; сама сущность спорная. |
| `/obo-mne/otzyvy.html` | `/pacientam/otzyvy` | Старый URL есть, но плановый URL в таблице невалиден. |
| `/pacientam/kak-vsyo-budet.html` | `/pacientam/kak-vse-budet` | Старый URL есть, но плановый URL в таблице невалиден и меняется транслитерация. |
| `/pacientam/spisok-analizov.html` | `/pacientam/spisok-analizov` | Старый URL есть, но плановый URL в таблице невалиден. |
| `/pacientam/lichnyy-assistent.html` | `/pacientam/lichnyy-assistent` | Старый URL есть, но плановый URL в таблице невалиден. |

## 4. Созданные Strapi Components

### `shared.seo`

- `metaTitle`: required string, 10–70;
- `metaDescription`: required text, 50–200;
- `shareImage`: optional single image;
- `canonicalPath`: optional string;
- `noIndex`: required boolean, default `false`.

Нет `keywords`, `canonicalUrl`, JSON или framework-specific полей.

### `shared.action`

- `label`: required string;
- `href`: required string;
- `variant`: `primary | secondary | outline | ghost | link`;
- `openInNewTab`: required boolean, default `false`.

Enum проверен по реальному `packages/ui/src/button.tsx`.

### `shared.hero`

- `heading`, `description`, `image`, `primaryAction`, `secondaryAction`.

Минимальный набор совместим с `PageIntro` и домашним hero. Breadcrumbs, badges и уникальные детали главной намеренно не включены. В `static-page` и `operation` поля первого экрана оставлены явными по ТЗ; универсальный hero или Dynamic Zone не навязаны.

## 5. Single Type

### `site-setting`

- `siteName`;
- `siteUrl`;
- required `defaultSeo`.

Контакты, header и footer не добавлены: в текущем frontend нет подтверждённой единой контактной структуры. Seed берёт `SITE_URL` из окружения, fallback только локальный `http://localhost:3000`; production-домен не заявлен.

## 6. Collection Types

### `static-page` — Draft & Publish

- required `internalName`;
- required unique string `pageKey`;
- required `shared.seo`;
- optional `heading`, `heroDescription`, `heroImage`;
- optional `primaryAction`, `secondaryAction`;
- required `contentStatus`: `empty | partial | ready`.

Отдельного editable route нет. Фиксированная страница связывается с App Router через стабильный `pageKey` в коде.

### `operation-category` — Draft & Publish

- required `name`;
- required unique string `key`;
- optional `description`;
- required `hasLandingPage`, default `false`;
- optional `landingPageKey`;
- bidirectional many-to-many `operations`.

URL категории не обязателен. Только «Живот и талия» в seed имеет подтверждённый landing binding через `operations-abdomen-waist`.

### `operation` — Draft & Publish

- required `internalName`;
- required unique UID `slug`;
- required unique string `canonicalPath`;
- required `heading`;
- optional `heroDescription`, `heroImage`;
- optional `primaryAction`, `secondaryAction`;
- required `shared.seo`;
- many-to-many `categories`;
- required `contentStatus`: `empty | partial | ready`.

Одна операция создаётся один раз и связывается с несколькими категориями. Например, восстановление после родов связано с `abdomen-and-waist` и `postpartum`; липосакция рук — с `body-contouring` и `liposuction`. Dynamic Zone, FAQ, цены, отзывы, cases, schema и медицинские универсальные блоки не добавлены.

## 7. Версионированный seed v1

Команда запускается только явно:

```bash
pnpm --filter @drkav/cms seed
```

Она не вызывается из `start`, `develop`, bootstrap или lifecycle. Алгоритм:

- `site-setting`: upsert единственного документа;
- `static-page`: upsert по `pageKey`;
- `operation-category`: upsert по `key`;
- `operation`: upsert по `canonicalPath`;
- relations задаются детерминированным `set` по Strapi `documentId` категорий;
- все collection records остаются draft.

Seed переносит:

- 12 фиксированных страниц с SEO, который удовлетворяет ограничениям схемы;
- 8 операций с валидным и непротиворечивым на этом этапе SEO;
- 13 нормализованных категорий из структуры операций;
- локальные `site-setting` и default SEO главной.

Seed намеренно не переносит:

- 19 фиксированных страниц без SEO или с SEO вне границ 10–70/50–200;
- 26 операций без SEO или с SEO вне границ схемы;
- две конкурирующие записи гинекомастии и «Прорисовку пресса», хотя их SEO формально проходит длины: требуется решение владельца;
- все 8 dynamic templates и записи статей, болезней, кейсов, до/после, публикаций, выступлений и будущих акций;
- `heroDescription`, actions и изображения: в источниках нет однозначного подтверждения этих полей;
- выдуманный медицинский текст, реальные данные пациентов и `#NAME?`.

Выбран безопасный вариант: при неполном или невалидном required SEO запись не создаётся. Required-ограничения схемы не ослаблялись ради черновиков.

Seed запущен дважды после финального состава. В SQLite осталось ровно 12 unique `pageKey`, 8 unique `canonicalPath`, 13 unique category `key` и 12 relation rows; повторный запуск дублей не создал.

## 8. Repository boundary

В `@drkav/content-contracts` добавлены CMS-neutral модели:

- `SeoData`;
- `StaticPageContent`;
- `OperationContent`;
- `ContentAction`, `ImageAsset`, `OperationCategorySummary`, `ContentStatus`.

Интерфейс:

```ts
interface ContentRepository {
  getStaticPage(pageKey: string): Promise<StaticPageContent | null>;
  getOperationByPath(path: string): Promise<OperationContent | null>;
}
```

`StrapiContentRepository` изолирует приватные Strapi response types и маппит `metaTitle/metaDescription` в доменные `title/description`. Ни `packages/ui`, ни страницы не импортируют Strapi types. Adapter не инстанцирован, API token не создавался, Public API permissions не открывались, массовых запросов из Next.js нет.

## 9. Созданные и изменённые файлы этой задачи

### Созданы

- `apps/cms/src/components/shared/seo.json`;
- `apps/cms/src/components/shared/action.json`;
- `apps/cms/src/components/shared/hero.json`;
- `apps/cms/src/api/site-setting/content-types/site-setting/schema.json`;
- `apps/cms/src/api/static-page/content-types/static-page/schema.json`;
- `apps/cms/src/api/operation-category/content-types/operation-category/schema.json`;
- `apps/cms/src/api/operation/content-types/operation/schema.json`;
- `apps/cms/seed/v1/data.mjs`;
- `apps/cms/scripts/seed.js`;
- `apps/web/src/content/strapi-content-repository.ts`;
- `docs/content-architecture-audit.md`.

### Изменены

- `apps/cms/package.json` — отдельная команда `seed`;
- `packages/content-contracts/src/index.ts` — доменные модели и repository interface;
- `apps/web/src/content/seo.ts` — временная registry-форма совместима с доменным SEO;
- `apps/web/src/content/page-registry.ts` — нормализация `noIndex` в создаваемых operation SEO;
- `apps/web/src/content/site-redirects.ts` — 13 явных excluded candidates и проверка отсутствия цепочек.

Другие изменения frontend в рабочем дереве относятся к предыдущей задаче и сохранены.

## 10. Проверки

| Проверка | Результат |
| --- | --- |
| Программное чтение обоих Excel | Успешно; исходники не изменены. |
| JSON schema parse | 7/7 файлов валидны. |
| `pnpm build:cms` | Успешно; admin panel собрана. Было нефатальное предупреждение о недоступном пользовательском preferences-файле Strapi. |
| `pnpm build:web` | Успешно; 71 static/SSG pages, прежние 3 `no-img-element` warnings. |
| `pnpm typecheck` | Успешно. |
| `pnpm lint` | Style-check успешен; общий lint остаётся красным из-за прежних 4 ошибок Strapi CommonJS/generated types и 6 прежних warnings. Новых lint-ошибок задачи нет. |
| Strapi `develop` на временном порту 1340 | Успешный старт, `/admin` — HTTP 200; сервер остановлен после проверки. |
| Content Manager registry | `operation`, `operation-category`, `site-setting`, `static-page` возвращены `findDisplayedContentTypes()`. |
| Public API | Новые `/api/static-pages`, `/api/operations`, `/api/operation-categories` — HTTP 404; в public role нет permissions новых API. |
| Seed повторно | 12 static pages, 8 operations, 13 categories без дублей. |
| Operation ↔ category | Одна relation table, двунаправленная связь подтверждена; максимум 2 категории у одной seeded operation. |
| `canonicalPath` | Schema unique + 8/8 уникальных значений в SQLite. |
| Redirects | 74 runtime, 13 excluded, duplicate sources и цепочки отсутствуют. |
| Strapi response types в `apps/web` | Только внутри adapter; UI и страницы от них не зависят. |

## 11. Подтверждения

- Дизайн, CSS и готовые первые экраны не изменялись.
- Сохранённые frontend-страницы не удалялись этой задачей.
- Массовое подключение страниц к Strapi не выполнялось.
- Frontend-реестр не удалён.
- Dynamic Zone, universal `Page`, GraphQL, API token, Public API permissions, CMS articles/cases/conditions и реальные интеграции не создавались.
- Зависимости, Next.js, React и Strapi не обновлялись.
- Коммит и push не выполнялись.
