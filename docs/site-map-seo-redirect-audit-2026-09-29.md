# Карта сайта, SEO и redirects: drkav.ru → текущий проект

Дата проверки: 29 сентября 2026 года.

## Как проводилась проверка

Сверены:

- live sitemap оригинального сайта: [drkav.ru/sitemap.xml](https://drkav.ru/sitemap.xml);
- live robots оригинального сайта: [drkav.ru/robots.txt](https://drkav.ru/robots.txt);
- текущие файлы App Router в `apps/web/src/app`;
- `apps/web/src/content/page-registry.ts`;
- `apps/web/src/content/site-redirects.ts`;
- общий metadata-конвертер `apps/web/src/content/seo.ts`;
- существующие аудиты и реестр операций в `docs/`.

В sitemap оригинала найден 131 URL. Из них 6 — технические файлы, которые не должны быть контентными страницами: `class-phpmailer.php`, `class-smtp.php`, `generate_sitemap.php`, `includes/header.html`, `mail.php`, `yandex_6b7d5a84bf2291d8.html`. Остальные URL относятся к реальным разделам, страницам и материалам.

В текущем проекте найдено 45 файлов `page.tsx`, включая динамические шаблоны. Это не означает 45 конечных страниц: записи блога, материалов «Про болезни», портфолио, «До/после» и публикаций должны появляться из CMS через `ContentRepository`.

## Итог в одном экране

| Зона | Состояние | Приоритет |
| --- | --- | --- |
| Главная | Крупный набор блоков собран: hero, преимущества, видео, доктор, операции, отзывы, CTA и SEO-блоки. | P1: проверить полноту и порядок относительно старой главной, затем performance. |
| «Обо мне» | Основная страница и большинство новых подстраниц имеют отдельные компоненты. | P1: добавить/проверить SEO и redirects для старых `obrazovanie`, `specializaciya`, `sertifikaty`, `video`, `otzyvy`. |
| Консультация | `/konsultaciya` сейчас `RegistryScaffoldPage`; три старые страницы консультаций не представлены полноценным содержимым. | P0 |
| Акции | Листинг и одна деталка есть, но `/akcii/modeli.html` из старого sitemap не сопоставлена. | P1 |
| Цены и операции | Каталоги и почти все URL созданы, но значительная часть детальных страниц — scaffold. Полный контент есть только у ограниченного числа страниц, CMS-пилот — увеличение груди. | P0 для коммерческих страниц |
| Пациентам | Основные информационные страницы и новые шаблоны есть, но большинство статусов `partial`; часть старых страниц отсутствует. | P1 |
| Блог / «Про болезни» | Динамические шаблоны есть, у материалов «Про болезни» предусмотрен перенос SEO и внутренних ссылок. | P0: проверить наличие всех 51 записи в CMS и HTTP/SEO каждой записи. |
| Sitemap / robots текущего проекта | `app/sitemap.ts` и `app/robots.ts` не найдены. | P0 до production |
| Canonical | Общий конвертер умеет выставлять canonical, но production URL берётся из `SITE_URL`/`NEXT_PUBLIC_SITE_URL`, а fallback — localhost. | P0: задать `https://drkav.ru` в production и проверить HTML. |
| Redirects | Есть 74 mapping-а из реестра и отдельный `/oferta.html`; 13 кандидатов сознательно исключены. | P0: закрыть исключения и проверить весь старый sitemap без цепочек. |

## 1. Карта страниц и блоков

Статусы ниже означают:

- **existing** — страница и основные блоки уже собраны;
- **partial** — структура есть, но контент/данные или часть старых блоков не подтверждены;
- **scaffold** — маршрут и базовый шаблон есть, полноценная страница ещё не готова;
- **cms-template** — есть динамический шаблон, конечная готовность зависит от записей CMS.

### 1.1 Главная

| URL | Блоки оригинала / ожидаемый состав | Что есть в проекте | Проверка |
| --- | --- | --- | --- |
| `/` | Hero с доктором и CTA; преимущества; видео/соцсети; блок о докторе; операции; результаты до/после; отзывы; консультация; администратор/контакты; editorial/SEO-блоки; footer. | `HomeOperatingRoomBackground`, hero, `BenefitsStrip`, `VideoHighlights`, `DoctorProfile`, `FinalResultsSlider`, `OperationsCards`, `ReviewsSlider`, `ConsultationSection`, `AdministratorCta`, `HomeSocialShowcase`, `HomeEditorialHighlights`, `HomeSeoBlocks`. | Основные зоны не потеряны. Нужно отдельно сверить визуальный порядок, тексты, ссылки и lazy/eager-загрузку hero. |

### 1.2 «Обо мне»

| URL | Назначение и блоки | Текущее состояние | Что проверить/добавить |
| --- | --- | --- | --- |
| `/obo-mne` | Вводный блок о докторе; навигация по разделу; образование/квалификация; дипломы и сертификаты; награды; ассоциации; патенты; научные статьи; диссертация; рейтинг/отзывы; CTA. | **existing**: `DoctorProfile`, `QualificationSection`, `CertificateSection`, `AwardSection`, `AssociationSection`, `PatentSection`, `JournalArticleSection`, `ThesisSection`, `RatingSection`. | Сверить со старой главной «Обо мне», проверить canonical и полный title/description. В registry явного SEO нет, хотя файл страницы задаёт metadata. |
| `/obo-mne/diplomy-i-licenzii` | Дипломы, лицензии, документы, просмотр материалов, связанная навигация. | **partial**, `CertificateSection` + `AboutSubpageLayout`. | Добавить в registry SEO и проверить полноту документов; старые `/obo-mne/sertifikaty.html` и `/obo-mne/obrazovanie.html` должны вести на подтверждённые страницы. |
| `/obo-mne/publikacii` | Патент/научный вклад; список научных публикаций; ссылки на деталки; related pages. | **existing**, `ContributionPatent` + `ContributionArticles`. | Проверить старые `/obo-mne/publikacii.html`; dynamic `[slug]` готов только как шаблон. |
| `/obo-mne/publikacii/[slug]` | Полная публикация: метаданные, заголовок, текст, источник, изображения/ссылки, related pages. | **cms-template**. | Для каждой CMS-записи нужны title, description, canonical, Open Graph и проверенные внешние/внутренние ссылки. |
| `/obo-mne/smi` | СМИ, интервью, специальные проекты, видео/карточки. | **existing**, `MediaVideoProjects`. | Сопоставить 6 старых URL `/smi/*`; сейчас прямой mapping для отдельных материалов не описан. |
| `/obo-mne/smi/[slug]` | Детальная публикация/материал СМИ. | **cms-template**. | Нужны записи CMS и redirects со старых `/smi/book.html`, `/smi/rbg.html`, `/smi/hirurg-nomer-odin.html` и др. |
| `/obo-mne/vystupleniya` | Выступления, конференции, образовательные видео/события. | **existing**, `SpeakingVideos`. | Description в registry сейчас ошибочно равен «Специализация»; исправить SEO-текст. |
| `/obo-mne/vystupleniya/[slug]` | Детальное выступление. | **cms-template**. | Нужны CMS-записи и metadata; файл шаблона сам metadata не объявляет, metadata должна приходить из записи. |
| `/obo-mne/neshkola` | Проект «Не Школа»: описание, форматы, мастер-классы/менторство, ссылки. | **existing**, `EducationProject` + `EducationFormats`. | Redirect `/obo-mne/neschool.html` есть; проверить старую `/smi/neschool.html`, если это тот же материал или отдельная публикация. |
| `/obo-mne/book` | Книга, описание, обложка, форматы/ссылки, CTA. | **existing**, `BookPageContent`. | Redirect есть; проверить, что старый `/smi/book.html` не теряет отдельный материал СМИ. |

### 1.3 Консультация

| URL | Оригинальный смысл | Текущее состояние | Решение |
| --- | --- | --- | --- |
| `/konsultaciya` | Общий вход в консультацию: варианты записи, очная/онлайн/по анкете, стоимость/условия, что подготовить, CTA и форма. | **scaffold**, только `RegistryScaffoldPage`. | Сверстать полноценную страницу с тремя вариантами и связать все CTA сайта с ней. |
| `/konsultacii/ochnaya-konsultaciya-v-klinike.html` | Очная консультация в клинике. | Отдельной текущей страницы нет. | Либо сохранить три отдельные страницы с контентом, либо явно сделать 301 на `/konsultaciya` после подтверждения, что различия больше не нужны. |
| `/konsultacii/onlayn-konsultaciya.html` | Онлайн-консультация. | Отдельной текущей страницы нет. | То же решение; не оставлять URL без SEO/контента. |
| `/konsultacii/konsultaciya-po-ankete.html` | Консультация по анкете. | Отдельной текущей страницы нет. | То же решение; старое SEO было неполным, нужно написать новое, а не переносить пустые поля. |

### 1.4 Акции

| URL | Блоки | Состояние |
| --- | --- | --- |
| `/akcii` | Hero/вводный текст, список актуальных акций, условия, CTA/консультация. | **partial**, `PromotionsCatalog`. |
| `/akcii/[slug]` | Мета, заголовок, вступление, условия акции, ограничения, CTA. | **cms-template**, но в коде фактически разрешена одна запись. |
| `/akcii/intimnaya-plastika-ili-lipofiling-ruk-v-podarok` | Детальные условия конкретной акции. | Есть scaffold/статическая деталка. Нужно проверить актуальность сезонного текста. |
| `/akcii/modeli.html` | Отдельный URL из старого sitemap. | Текущий эквивалент не найден. На оригинале live title дублирует другую акцию. | Найти исходный смысл/материал; затем либо создать страницу, либо сделать осознанный 301/410. Не направлять вслепую на первую акцию. |

### 1.5 Цены и операции

| URL/семейство | Блоки | Текущее состояние | Риск |
| --- | --- | --- | --- |
| `/ceny` | Общий прайс, пояснение о расчёте стоимости, категории, ссылки на операции. | **partial**, `PriceCatalog`. | Сохранить отдельный canonical `/ceny`; не смешивать его с `/operaczii`, если это разные пользовательские задачи. |
| `/operaczii` | Каталог направлений, категории, карточки операций, фильтрация/переходы, CTA. | **partial**, `OperationsCatalog`. | Проверить, что каждая карточка ведёт на существующий canonical URL и имеет изображение. |
| `/operaczii/plastika-grudi` | Посадочная категории груди, список процедур, вводный контент. | **partial**. | Детализировать блоки категории; не ограничиваться каталогом. |
| `/operaczii/zhivot-i-taliya` | Посадочная живота/талии и связанные операции. | **partial**, сейчас в основном intro. | Это должна быть полноценная категория, а не пустой листинг. |
| `/operaczii/diastaz-myshc-zhivota` | Специализированная операция/авторская методика, показания, ход, восстановление, CTA. | **partial/CMS operation**. | Проверить контент и medical review. |
| `/operaczii/[segment]` | Категории: грудь, липоскульптура, липофилинг, липосакция, RF, мужская пластика, интимная пластика и др. | Маршрут есть; большинство записей **partial**. | Для каждого segment нужны H1, intro, список дочерних услуг, related content, SEO. |
| `/operaczii/[segment]/[operation]` | Полная коммерческая страница: hero, показания/противопоказания, подготовка, ход операции, восстановление, риски, стоимость/CTA, FAQ, related results/articles. | Маршрут есть; большинство 37 operation entries — **scaffold**. CMS-пилот — только увеличение груди. | P0: не индексировать пустые scaffold-страницы или наполнить до публикации. |

#### Полный перечень текущих операций

В реестре присутствуют: увеличение груди; подтяжка груди без имплантов; уменьшение груди; коррекция асимметрии; удаление имплантов; реконструкция груди; липофилинг груди; абдоминопластика; диастаз; пластика живота для мужчин; коррекция фигуры; подтяжка ягодиц; подтяжка бёдер; подтяжка рук; ультразвуковая липосакция; липофилинг; липофилинг ягодиц; липосакция рук; липосакция спины; липосакция вдовьего горбика; интимная пластика; RF-лифтинг и четыре его подстраницы; мужская пластика; уменьшение мужской груди; лечение гинекомастии; прорисовка пресса; атлетизация плеч и рук; мужская подтяжка ягодиц/бёдер; бодилифтинг для мужчин; прорисовка грудных мышц.

Отдельно требуют редакторского решения: два URL про гинекомастию, мужская подтяжка ягодиц/бёдер, «прорисовка пресса», «прорисовка грудных мышц», отсутствие отдельной главной липосакции и отсутствующие страницы «увеличение объёма мышц»/«увеличение ягодиц для мужчин».

### 1.6 Раздел «Пациентам»

| URL | Блоки | Состояние |
| --- | --- | --- |
| `/pacientam` | Вводный блок и карточки разделов: портфолио, до/после, блог, отзывы, путь пациента, анализы, ассистент, безопасность, FAQ, болезни. | **partial**, карточки через `RecordCard`. | Сверить состав с навигацией оригинала и добавить ссылки на консультацию/контакты. |
| `/pacientam/blog` | Категории, карточки статей, даты/время чтения, pagination/filter при необходимости. | **partial**, `BlogIndex`. | Нужны реальные CMS-записи, изображения, title/description листинга. |
| `/pacientam/blog/[slug]` | Полная статья, вступительная карта, содержание, статья, связанные операции, «Читайте ещё», блоки о докторе/операциях/отзывах. | **cms-template**. | Проверить все записи, canonical, ссылки и отсутствие localhost в контенте. |
| `/pacientam/pro-bolezni` | Каталог 51 материала «Про болезни». | **partial**, динамический `BlogIndex`. | Проверить количество и порядок записей, карточки и SEO листинга. |
| `/pacientam/pro-bolezni/[slug]` | Полная статья из старого сайта, SEO из исходного материала, внутренние ссылки на новые маршруты, related blocks. | **cms-template**; `.html` нормализуется с permanent redirect. | P0: проверить все 51 URL и каждую внутреннюю ссылку после seed. |
| `/pacientam/portfolio` | Принципы публикации кейсов, видео-кейсы, карточки кейсов. | **partial**, `PortfolioIndex` + `MediaVideoProjects`. | Нужны реальные CMS-записи, согласия/ограничения публикации и SEO. |
| `/pacientam/portfolio/[slug]` | Детальный кейс: задача, операция, срок результата, фото, пояснение плана. | **cms-template**. | Проверить alt, права на изображения и `noindex` для черновиков. |
| `/pacientam/do-i-posle` | Галерея результатов, фильтры/категории, CTA. | **partial**, `BeforeAfterGallery`. | Нужны записи, метаданные и canonical для деталок. |
| `/pacientam/do-i-posle/[slug]` | Детальная работа до/после. | **cms-template**. | В metadata-скане файл не содержит собственной декларации, но должен получать SEO из CMS. Проверить фактический HTML. |
| `/pacientam/otzyvy` | Вводный блок, отзывы/фильтры, возможно результаты/видео, CTA. | **partial**, `ReviewsSlider`. | Проверить, что все отзывы не являются демонстрационными данными и имеют реальные источники/согласия. |
| `/pacientam/kak-vse-budet` | Путь пациента: консультация, организация, день операции, наблюдение, восстановление. | **partial**, подробные `PatientSection`/checklists. | Проверить соответствие фактическим процессам клиники. |
| `/pacientam/spisok-analizov` | Перечень анализов и сроки актуальности, медицинское предупреждение. | **partial**, таблица обследований. | Нужен обязательный medical review; данные могут меняться. |
| `/pacientam/lichnyy-assistent` | Что делает ассистент до операции, в день операции и после. | **partial**, checklist. | Metadata есть в файле, но нет registry SEO/canonical. Добавить единый источник. |
| `/pacientam/bezopasnost` | Система безопасности, до/во время/после операции, анестезиология, наблюдение. | **partial**, checklist. | Medical review и подтверждение заявлений о клинике/дежурстве. |
| `/pacientam/vopros-otvet` | FAQ по консультации, подготовке, операции, восстановлению. | **partial**, группы FAQ. | Добавить FAQ schema только после проверки отображаемых ответов и SEO. |

### 1.7 Контакты и юридические страницы

| URL | Блоки | Состояние |
| --- | --- | --- |
| `/kontakty` | Новый адрес, ASBeauty, способы связи, карта, Yandex/2GIS, форма, согласия, CTA. | **partial**, `ContactsPageContent`. | После смены адреса проверить все текстовые вхождения, `Organization/LocalBusiness` schema, карту и внешние ссылки. |
| `/oferta` | Оферта. | Static legal page. | `/oferta.html` отдельно добавлен в `next.config`; проверить canonical и код ответа. |
| `/policy` | Политика конфиденциальности. | Static legal page. | Нужны актуальные реквизиты и ссылки из всех форм. |
| `/consent`, `/consent-marketing`, `/cookies` | Тексты согласий и cookie. | Static legal pages. | Не включать в sitemap; проверить ссылки форм и checkbox-состояния. |
| `/poisk` | Поиск. | Static/search page. | `noindex`, query-параметры не должны создавать индексируемые дубли. |
| `/design-system`, `/design-system/page-builder`, `/design-system/page-builder/editor` | Внутренняя документация/редактор. | Есть. | Оставить `noindex`, исключить из sitemap и публичной навигации. |

## 2. Все старые content URL

### Разделы и листинги

| Старый URL | Текущий кандидат | Статус |
| --- | --- | --- |
| `/index.html` | `/` | Нужно добавить явный redirect и проверить, что это не дублирующий ответ 200. |
| `/akcii.html` | `/akcii` | Mapping есть. |
| `/akcii/intimnaya-plastika-ili-lipofiling-ruk-v-podarok.html` | extensionless promotion URL | Mapping есть. |
| `/akcii/modeli.html` | не определён | P1: найти материал, затем 301/410. |
| `/ceny.html` | `/ceny` | Mapping есть. |
| `/ceny/index.html` | `/ceny` | Нужен отдельный explicit mapping. |
| `/kontakty.html` | `/kontakty` | Mapping есть. |
| `/obo-mne/book.html` | `/obo-mne/book` | Mapping есть. |
| `/obo-mne/neschool.html` | `/obo-mne/neshkola` | Mapping есть. |
| `/obo-mne/publikacii.html` | `/obo-mne/publikacii` | Mapping есть. |
| `/obo-mne/vystupleniya.html` | `/obo-mne/vystupleniya` | Mapping есть. |
| `/smi/smi.html` | `/obo-mne/smi` | Mapping есть. |
| `/obo-mne/obrazovanie.html` | `/obo-mne/diplomy-i-licenzii` или отдельная education page | Нужна явная фиксация назначения. |
| `/obo-mne/sertifikaty.html` | `/obo-mne/diplomy-i-licenzii` | Нужен explicit mapping. |
| `/obo-mne/specializaciya.html` | `/obo-mne` или отдельная specialization page | Нужна явная фиксация назначения. |
| `/obo-mne/video.html` | `/obo-mne/vystupleniya` или `/obo-mne/smi` | Не выбирать автоматически: старый материал может быть отдельным. |
| `/obo-mne/otzyvy.html` | `/pacientam/otzyvy` | Сейчас сознательно исключён из runtime; подтвердить destination и включить. |

### Консультации

Старые три URL перечислены в разделе 1.3. Пока нет безопасного активного правила, которое гарантированно покрывает каждую из них. Если общий `/konsultaciya` будет единственной страницей, нужны прямые permanent redirects без промежуточных адресов.

### Операции и цены

Старые `/ceny/*.html`, `/muzhskaya-plastika/*.html` и `/ceny/muzhskaya-plastika/*.html` в основном сопоставлены с новыми `/operaczii/...`. Перед production нужно проверить полный список из sitemap, потому что есть конфликтующие пары:

- `/ceny/umenshenie-grudi.html` — выбранный destination с вложенным сегментом исключён как неподтверждённый;
- `/ceny/lechenie-ginekompastii.html` — destination исключён из-за спорного разделения двух страниц гинекомастии;
- `/ceny/abdominoplastika-dlya-muzhchin.html` и `/muzhskaya-plastika/abdominoplastika-dlya-muzhchin.html` имеют разные старые источники, но должны вести на один canonical;
- родитель `/operaczii/liposakcziya` в новой структуре отсутствует, хотя дочерние страницы есть.

### Материалы «Про болезни»

В старом sitemap 51 статья. Все они должны иметь пару:

```text
/pacientam/pro-bolezni/<slug>.html
→ /pacientam/pro-bolezni/<slug>
```

В проекте это обрабатывается в динамическом маршруте через `normalizeSlug()` и `permanentRedirect()`. Это хорошая защита от дублей, но release-проверка должна пройти по каждому из 51 URL: старый URL → один redirect → 200 canonical; canonical страницы не должен снова redirect-иться.

### СМИ

Старый sitemap содержит 6 URL в `/smi/`: `book.html`, `hirurg-nomer-odin.html`, длинная статья об экстренной хирургии, `neschool.html`, `rbg.html`, `smi.html`. Сейчас есть общий `/obo-mne/smi` и dynamic `[slug]`, но детальные legacy mappings не зафиксированы. Это риск потери ссылочного веса и 404 на старые материалы.

## 3. SEO-таблица

### 3.1 Техническая схема SEO

| Элемент | Текущее состояние | Что требуется |
| --- | --- | --- |
| `title` | Есть общий `toMetadata`; часть страниц получает его из registry, часть задаёт metadata прямо в page-файле, dynamic pages — из CMS. | Оставить один источник для каждой вертикали; исключить fallback `drkav.ru — редизайн` из production-страниц. |
| `description` | Есть для большинства страниц, но встречаются очень короткие/общие значения и старые ошибки/опечатки. | Редакторская ревизия: смысл страницы, 120–160 символов как рабочий ориентир, без переспама. |
| `canonical` | `toMetadata` строит абсолютный URL из `SITE_URL`/`NEXT_PUBLIC_SITE_URL`. | В production обязательно `https://drkav.ru`; проверить исходный HTML всех canonical. |
| Open Graph | Формируется из тех же SEO-данных; share image опциональна. | Добавить единый default image и индивидуальные изображения для ключевых страниц. |
| `robots` | `noIndex` умеет работать, internal pages имеют noindex в metadata. | Добавить `app/robots.ts`; явно закрыть internal, search query и API, но не закрывать полезные CSS/JS/images. |
| Sitemap | `apps/web/src/app` не содержит `sitemap.ts`. | Добавить `app/sitemap.ts`, включать только canonical 200 indexable URLs с CMS-записями. |
| Structured data | В рамках этого аудита единая схема не найдена. | Отдельно добавить и проверить `MedicalClinic/Physician`, BreadcrumbList, Article/FAQPage только там, где данные видимы пользователю. |

### 3.2 Статические страницы: обязательная SEO-матрица

| Канонический URL | Title сейчас | Description сейчас | Оценка | Действие |
| --- | --- | --- | --- | --- |
| `/` | «Артём Коробов — пластический хирург DrKAV» | Официальный сайт: операции, цены, до/после, отзывы, запись | ОК | Проверить production canonical и OG. |
| `/obo-mne` | Задаётся прямо в page-файле | Задаётся прямо в page-файле | Единый registry отсутствует | Перенести в registry/CMS и проверить текст. |
| `/obo-mne/diplomy-i-licenzii` | «Дипломы и лицензии — доктор Коробов» | Документы об образовании, квалификации и практике | ОК по длине | Добавить canonical/registry consistency. |
| `/obo-mne/publikacii` | «Научная деятельность» | Очень короткое «Научная деятельность доктора Коробова» | Слабое | Расширить description и добавить поисковый контекст. |
| `/obo-mne/smi` | «DrKAV в СМИ — статьи и интервью» | Содержательное описание | ОК | Проверить записи и деталки. |
| `/obo-mne/vystupleniya` | «Выступления» | Сейчас ошибочно «Специализация» в registry | Ошибка | Исправить description. |
| `/obo-mne/neshkola` | Уникальный title | Уникальное описание | ОК | Проверить старые ссылки. |
| `/obo-mne/book` | Уникальный title | Уникальное описание | ОК | Проверить разделение с `/smi/book.html`. |
| `/konsultaciya` | Нет registry SEO; scaffold | Нет утверждённого набора | P0 | Написать после решения: один общий лендинг или три страницы. |
| `/akcii` | «Акции и подарки от Артема Коробова» | Условия специальных предложений | ОК после проверки актуальности | Убрать сезонные/временные обещания, если акция закончилась. |
| `/ceny` | «Стоимость операций» | «Стоимость операций» | Слишком общее | Добавить пояснение про ориентировочную стоимость и консультацию. |
| `/operaczii` | Fallback из файла страницы | Есть fallback description | Проверить | Задать явный registry SEO. |
| `/operaczii/zhivot-i-taliya` | Fallback из файла страницы | Есть fallback description | Проверить | Задать явный registry SEO. |
| `/pacientam` | Нет registry SEO | Нет registry SEO | P1 | Добавить metadata для общего раздела. |
| `/pacientam/blog` | «Блог доктора Коробова» | «Статьи и профессиональные комментарии…» | ОК | Добавить canonical через общий конвертер. |
| `/pacientam/pro-bolezni` | «Про болезни» | «Статьи про болезни и способы их лечения» | Слабое | Расширить, не обещать медицинское лечение без контекста. |
| `/pacientam/portfolio` | Fallback из page-файла | Fallback из page-файла | Проверить | Добавить registry SEO. |
| `/pacientam/do-i-posle` | «До и после — результаты работ DrKAV» | Фото результатов и примеры работ | ОК | Проверить согласия и alt. |
| `/pacientam/otzyvy` | «Отзывы — доктор Коробов» | Уникальное описание | ОК | Включить старые review redirects после подтверждения. |
| `/pacientam/kak-vse-budet` | Уникальный title | Уникальное описание | ОК | Проверить фактический процесс. |
| `/pacientam/spisok-analizov` | Уникальный title | Уникальное описание | ОК | Medical review. |
| `/pacientam/lichnyy-assistent` | Задаётся прямо в page-файле | Задаётся прямо в page-файле | Registry отсутствует | Унифицировать. |
| `/pacientam/bezopasnost` | Уникальный title | Уникальное описание | ОК после medical review | Проверить доказуемость заявлений. |
| `/pacientam/vopros-otvet` | Задаётся прямо в page-файле | Задаётся прямо в page-файле | Registry отсутствует | Унифицировать и решить FAQ schema. |
| `/kontakty` | «Контакты и запись — DrKAV» | Адрес, способы связи, запись | ОК | Обновить clinic/address schema вместе с новым адресом. |

### 3.3 Операции: SEO-контроль

У 36 из 37 записей операций есть title + description в registry; у `/operaczii/muzhskaya-plastika/prorisovka-grudnykh-myshcz` SEO отсутствует. Кроме наличия полей, нужна редактура:

- titles длиннее рабочего диапазона встречаются у RF-лифтинга и ряда старых коммерческих формулировок;
- есть опечатки: «сдлеать», «руди», «Пластичекая», «Восстановлении»;
- у некоторых страниц название интерфейса и SEO не совпадают: «Коррекция фигуры» vs «Липоскульптура», «Уменьшение мужской груди» vs «Лечение гинекомастии»;
- не публиковать scaffold-страницы с уникальным title, но без полноценного коммерческого содержания: это создаёт тонкие индексируемые страницы.

### 3.4 Live-проверка SEO оригинала

Старый сайт отдаёт несколько проблем, которые не нужно переносить в новый проект:

- `/akcii/modeli.html` live отдаёт title другой акции — это дубль/ошибка источника;
- `/ceny/abdominoplastika-dlya-muzhchin.html` live имеет нерелевантный title про пластику после родов;
- `/pacientam/podgotovka-v-operacii.html` имеет title без description;
- у ряда старых технических PHP/HTML-файлов title и description отсутствуют;
- в live SEO есть слишком короткие descriptions вроде «Специализация», «Стоимость операций» и «Статьи про болезни и способы их лечения», а также очень длинные descriptions у отдельных статей.

Эти значения нужно использовать как материал для миграции, но не как безусловно правильный SEO-эталон.

## 4. Redirect matrix

### 4.1 Правила

1. Один старый URL должен вести сразу на один canonical URL.
2. Destination не должен сам быть source другого redirect-а.
3. Query string (`utm`, `source` и т. п.) должен сохраняться.
4. `.html` у статей «Про болезни» должен давать один permanent redirect на extensionless URL.
5. Технические файлы из старого sitemap не нужно направлять на главную: лучше удалить их из sitemap и отдавать 404/410, если они не имеют пользовательской ценности.
6. В Next.js `permanent: true` обычно означает permanent redirect с кодом 308. Это допустимо для миграции, но перед публикацией нужно проверить, не требуется ли именно 301 на уровне hosting/CDN.

### 4.2 Уже есть в проекте

Из `page-registry.ts` строится 74 direct mappings; в `next.config.ts` отдельно добавлен `/oferta.html → /oferta`. Покрыты основные пары:

- `/akcii.html → /akcii`;
- `/ceny.html → /ceny`;
- `/kontakty.html → /kontakty`;
- `/obo-mne/book.html → /obo-mne/book`;
- `/obo-mne/neschool.html → /obo-mne/neshkola`;
- `/obo-mne/publikacii.html → /obo-mne/publikacii`;
- `/obo-mne/vystupleniya.html → /obo-mne/vystupleniya`;
- `/smi/smi.html → /obo-mne/smi`;
- старые `/operacii/...` и большинство `/ceny/...` → новые `/operaczii/...`;
- `/portfolio → /pacientam/portfolio`;
- `/do-posle → /pacientam/do-i-posle`;
- `/pacientam/pro-bolezni.html → /pacientam/pro-bolezni`.

### 4.3 Обязательно закрыть до production

| Source | Предлагаемое назначение | Почему нельзя оставить как есть |
| --- | --- | --- |
| `/index.html` | `/` | Старый sitemap содержит URL; без правила возможен duplicate/404. |
| `/ceny/index.html` | `/ceny` | Дубликат прайс-листа. |
| `/obo-mne/obrazovanie.html` | `/obo-mne/diplomy-i-licenzii` или отдельная education page | Сейчас нет однозначного активного mapping. |
| `/obo-mne/sertifikaty.html` | `/obo-mne/diplomy-i-licenzii` | Теряется старая страница документов. |
| `/obo-mne/specializaciya.html` | `/obo-mne` или отдельная page | Не направлять на нерелевантную страницу без решения. |
| `/obo-mne/video.html` | `/obo-mne/vystupleniya` или `/obo-mne/smi` | Нужна проверка содержания. |
| `/obo-mne/otzyvy.html` | `/pacientam/otzyvy` | Сейчас находится в excluded candidates. |
| `/pacientam/otzyvy.html` | `/pacientam/otzyvy` | Сейчас excluded как normalization-only. |
| `/pacientam/kak-vsyo-budet.html` | `/pacientam/kak-vse-budet` | Сейчас excluded, хотя source есть в sitemap. |
| `/pacientam/spisok-analizov.html` | `/pacientam/spisok-analizov` | Сейчас excluded. |
| `/pacientam/lichnyy-assistent.html` | `/pacientam/lichnyy-assistent` | Сейчас excluded. |
| `/pacientam/metodika.html` | Найти текущую страницу или 410 | В текущем проекте точного эквивалента нет. |
| `/pacientam/podgotovka-v-operacii.html` | `/pacientam/kak-vse-budet` или отдельная preparation page | Не терять материал без проверки содержания. |
| `/pacientam/poluchenie-nalogovogo-vycheta-za-lechenie-pri-plasticheskoy-operacii.html` | Отдельная tax deduction page или 410 | Тема отсутствует в текущем дереве. |
| `/konsultacii/*.html` | `/konsultaciya` или три новые страницы | Все три старых URL должны получить ответ. |
| `/akcii/modeli.html` | Найти материал; затем 301 или 410 | Текущий эквивалент не найден, live SEO оригинала некорректен. |
| `/smi/book.html`, `/smi/rbg.html`, `/smi/hirurg-nomer-odin.html`, `/smi/neschool.html`, длинная статья | соответствующий `/obo-mne/smi/[slug]` | Сейчас есть общий раздел, но нет полного детального mapping. |
| `/ceny/umenshenie-grudi.html` | Подтвердить `/operaczii/plastika-grudi/umenshenie-grudi` | Mapping намеренно исключён как неподтверждённый. |
| `/ceny/lechenie-ginekompastii.html` | Подтвердить одну из страниц гинекомастии | Сейчас есть семантический конфликт. |

### 4.4 Статьи «Про болезни»: обязательный тест-кейс

Для всех 51 старой статьи выполнить автоматическую проверку:

```text
GET old .html URL       → 308/301
Location                 = extensionless canonical
GET canonical URL        → 200
canonical in HTML        = canonical URL
title/description        = CMS SEO of the same article
all internal hrefs        = current local routes, no localhost, no old .html
```

Отдельно проверить 404 для несуществующего slug, чтобы динамический маршрут не создавал пустую индексируемую страницу.

## 5. Приоритетный план работ

### P0 — до публикации

1. Наполнить или закрыть от индекса scaffold-страницы консультации и операций.
2. Установить `SITE_URL=https://drkav.ru` и проверить canonical в production build.
3. Реализовать `app/sitemap.ts` и `app/robots.ts`; sitemap должен включать только 200/indexable canonical URLs.
4. Активировать и протестировать excluded redirects, после подтверждения destinations.
5. Пройти все 51 статью «Про болезни» и старые внутренние ссылки.
6. Разрешить конфликт `/ceny` vs `/operaczii`, двух страниц гинекомастии и старых консультаций.

### P1 — перед активным SEO-продвижением

1. Перенести SEO в единый источник: registry для фиксированных страниц, CMS для материалов.
2. Заполнить title/description для `/obo-mne`, `/pacientam`, `/operaczii`, `/operaczii/zhivot-i-taliya`, `/konsultaciya` и всех dynamic records.
3. Переписать слишком короткие и слишком длинные SEO-поля, исправить опечатки.
4. Сопоставить все 6 старых `/smi/*` страниц.
5. Проверить Open Graph images, BreadcrumbList, Physician/MedicalClinic и Article/FAQ schema.

### P2 — после запуска

1. Сравнить индексацию и coverage в Яндекс Вебмастере и Google Search Console.
2. Проверить 404/redirect logs по старым URL.
3. Обновлять sitemap только опубликованными CMS-записями и датами `lastModified`.

## 6. Критерии готовности аудита к реализации

- Для каждого URL из старого sitemap есть решение: `200 same`, `301/308 → canonical`, `410`, либо новая страница.
- Для каждого canonical URL есть `title`, `description`, `canonical`, index/noindex решение и владелец контента.
- В sitemap нет technical/junk URL, scaffold, draft или дублей.
- Ни один redirect не образует цепочку.
- Ни одна внутренняя ссылка не ведёт на `localhost`, старый `.html` URL или отсутствующий маршрут.
- Все коммерческие страницы, которые должны индексироваться, содержат не только SEO-поля, но и полноценный полезный контент.
