# Аудит структуры сайта drkav

Дата аудита: 2 августа 2026 года.

Источники:

- `drkav [структура] (1).xlsx`, лист `структура сайта seo`;
- `operaczii.xlsx`, правая часть новой структуры;
- фактические файлы App Router в `apps/web/src/app` до изменений.

Исходные Excel-файлы не изменялись. Значения нормализовались по пробелам, регистру, завершающему `/` и суффиксу `.html`. Пустые значения, `-` и `#NAME?` считались отсутствующими. Результаты формул `AI(...)`, отображавшиеся как `#NAME?`, не использовались как готовые URL или SEO.

## 1. Результат аудита

| Показатель | Значение |
| --- | ---: |
| Существовавшие `page.tsx` до изменений | 33 |
| Публичные маршруты до изменений | 32 |
| Внутренние маршруты до изменений | 1 (`/design-system`) |
| Строки данных в `структура сайта seo` | 61 |
| Целевые строки правой части `operaczii.xlsx` | 40 |
| Уникальные целевые URL операций | 37 |
| Точные совпадения существующего URL с плановым URL первой таблицы | 11 |
| Дополнительные совпадения после нормализации `.html` | 3 |
| Семантические совпадения после сопоставления названия/старого URL | 13 |
| Существовавшие страницы без строки-аналога | 6 |
| Записи итогового типизированного реестра | 76 |
| Динамические CMS-шаблоны | 8 |
| Прямые legacy redirects | 87 |

Шесть страниц без прямого аналога: `/design-system`, `/obo-mne`, `/obo-mne/diplomy-i-licenzii`, `/operacii`, `/operacii/zhivot-i-taliya`, `/pacientam`. Они не удалены.

## 2. Сохранённые существующие страницы

| Название | Старый маршрут | Канонический маршрут | Готовность | Что сохранено |
| --- | --- | --- | --- | --- |
| Главная | `/` | `/` | partial | Hero, CTA, заголовок и структура |
| Обо мне | `/obo-mne` | `/obo-mne` | existing | Полная составная страница, изображения, данные, секции и CTA |
| Дипломы и лицензии | `/obo-mne/diplomy-i-licenzii` | без изменения | partial | Первый экран и связанные карточки |
| Научная деятельность | `/obo-mne/publikacii` | без изменения | existing | Патент, публикации, навигация по страницам «Обо мне» |
| Выступления | `/obo-mne/vystupleniya` | без изменения | existing | Видео и связанная навигация |
| Книга | `/obo-mne/book` | без изменения | existing | Изображения, ссылки, книжный блок и связанная навигация |
| Не Школа | `/obo-mne/obuchenie` | `/obo-mne/neshkola` | existing | Весь JSX, изображения, форматы обучения и внешние ссылки |
| СМИ и проекты | `/obo-mne/smi-i-proekty` | `/obo-mne/smi` | existing | Видео, изображения и связанная навигация |
| Акции | `/akcii` | без изменения | partial | Первый экран |
| Цены | `/ceny` | без изменения | partial | Первый экран |
| Операции | `/operacii` | `/operaczii` | partial | Первый экран и общая структура |
| Грудь | `/operacii/grud` | `/operaczii/plastika-grudi` | partial | Паттерн первого экрана; название синхронизировано с таблицей |
| Живот и талия | `/operacii/zhivot-i-taliya` | `/operaczii/zhivot-i-taliya` | partial | Первый экран; оставлен как существующий листинг без подтверждённой строки таблицы |
| Коррекция фигуры | `/operacii/korrekciya-figury` | `/operaczii/liposkulptura` | partial | Паттерн первого экрана; привязан к целевому URL новой таблицы |
| После родов | `/operacii/posle-rodov` | `/operaczii/plasticheskaya-hirurgiya-posle-rodov` | partial | Первый экран |
| После похудения | `/operacii/posle-pohudeniya` | `/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya` | partial | Первый экран |
| Мужчинам | `/operacii/muzhchinam` | `/operaczii/muzhskaya-plastika` | partial | Первый экран |
| Интимная пластика | `/operacii/intimnaya-plastika` | `/operaczii/intimnaya-plastika` | partial | Первый экран |
| RF-лифтинг | `/operacii/bez-operacii/rf-lifting` | `/operaczii/rf-lifting` | partial | Первый экран |
| Диастаз | `/operacii/diastaz-myshc-zhivota` | `/operaczii/diastaz-myshc-zhivota` | partial | Реализованный JSX первого экрана и внутренние ссылки |
| Пациентам | `/pacientam` | без изменения | partial | Первый экран |
| Блог | `/pacientam/blog` | без изменения | partial | Листинг-заготовка |
| Отзывы | `/pacientam/otzyvy` | без изменения | partial | Первый экран |
| Как всё будет | `/pacientam/kak-vse-budet` | без изменения | partial | Первый экран; старое `kak-vsyo-budet.html` перенаправляется напрямую |
| Список анализов | `/pacientam/spisok-analizov` | без изменения | partial | Первый экран |
| Личный ассистент | `/pacientam/lichnyy-assistent` | без изменения | partial | Первый экран |
| Безопасность | `/pacientam/bezopasnost` | без изменения | partial | Первый экран |
| Вопрос-ответ | `/pacientam/vopros-otvet` | без изменения | partial | Первый экран |
| Про болезни | `/pacientam/pro-bolezni` | без изменения | partial | Листинг-заготовка |
| Портфолио | `/portfolio` | `/pacientam/portfolio` | partial | Заголовок и существующее подробное вступление |
| До/после | `/do-posle` | `/pacientam/do-i-posle` | partial | Заголовок и существующее вступление |
| Контакты | `/kontakty` | без изменения | partial | Первый экран |
| Design System | `/design-system` | без изменения | existing | Внутренняя документация; не включена в публичный реестр |

## 3. Перемещённые или переименованные страницы

| Название | Было | Стало | Причина | Redirect | Ссылки |
| --- | --- | --- | --- | --- | --- |
| Раздел операций | `/operacii` | `/operaczii` | Приоритет новой таблицы | прямой 308 | навигация и breadcrumbs обновлены |
| Маммопластика | `/operacii/grud` | `/operaczii/plastika-grudi` | Целевой URL новой таблицы | прямой 308 | header обновлён |
| Коррекция фигуры | `/operacii/korrekciya-figury` | `/operaczii/liposkulptura` | Новая группировка | прямой 308 | header обновлён |
| После родов | `/operacii/posle-rodov` | `/operaczii/plasticheskaya-hirurgiya-posle-rodov` | Целевой URL | прямой 308 | header обновлён |
| После похудения | `/operacii/posle-pohudeniya` | `/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya` | Целевой URL | прямой 308 | header обновлён |
| Мужская пластика | `/operacii/muzhchinam` | `/operaczii/muzhskaya-plastika` | Целевой URL | прямой 308 | header обновлён |
| Интимная пластика | `/operacii/intimnaya-plastika` | `/operaczii/intimnaya-plastika` | Каноническое написание раздела | прямой 308 | header обновлён |
| RF-лифтинг | `/operacii/bez-operacii/rf-lifting` | `/operaczii/rf-lifting` | Целевой URL без искусственной группы | прямой 308 | header обновлён |
| Диастаз | `/operacii/diastaz-myshc-zhivota` | `/operaczii/diastaz-myshc-zhivota` | Каноническое написание раздела | прямой 308 | патент, вклад в медицину и design-system обновлены |
| Не Школа | `/obo-mne/obuchenie` | `/obo-mne/neshkola` | Плановый URL первой таблицы | прямой 308 | header и связанные карточки обновлены |
| СМИ | `/obo-mne/smi-i-proekty` | `/obo-mne/smi` | Плановый URL первой таблицы | прямой 308 | header и связанные карточки обновлены |
| Портфолио | `/portfolio` | `/pacientam/portfolio` | Плановый URL первой таблицы | прямой 308 | header обновлён |
| До/после | `/do-posle` | `/pacientam/do-i-posle` | Плановый URL первой таблицы | прямой 308 | header обновлён |

Redirects строятся из `legacyRoutes` типизированного реестра, не образуют цепочек и штатно сохраняют query parameters. Браузером проверены семь представителей, включая `?utm=` и `?source=`.

## 4. Созданные страницы

### Общая структура

| Название | Маршрут | Источник | Тип | Шаблон | Не хватает |
| --- | --- | --- | --- | --- | --- |
| Специализация | `/obo-mne/specializaciya` | первая таблица | static | `RegistryScaffoldPage` | основного контента |
| Образование | `/obo-mne/obrazovanie` | первая таблица | static | `RegistryScaffoldPage` | основного контента |
| Консультация | `/konsultaciya` | комментарий первой таблицы и существующие CTA | listing | `RegistryScaffoldPage` | решения о составе вариантов и контента |
| Очная консультация | `/konsultacii/ochnaya-konsultaciya-v-klinike` | первая таблица | static | `RegistryScaffoldPage` | основного контента |
| Онлайн-консультация | `/konsultacii/onlayn-konsultaciya` | первая таблица | static | `RegistryScaffoldPage` | SEO и основного контента |
| Консультация по анкете | `/konsultacii/konsultaciya-po-ankete` | первая таблица | static | `RegistryScaffoldPage` | SEO и основного контента |
| Акция из реестра | `/akcii/intimnaya-plastika-ili-lipofiling-ruk-v-podarok` | первая таблица | static через `[slug]` | `RegistryScaffoldPage` | текста акции и условий |

### Операции

Все операции используют `RegistryScaffoldPage` через два ограниченных маршрута: `/operaczii/[segment]` и `/operaczii/[segment]/[operation]`. Источник — правая часть `operaczii.xlsx`; SEO взято из первой таблицы по названию и legacy URL.

| Название | Маршрут | Группа | Статус контента |
| --- | --- | --- | --- |
| Маммопластика | `/operaczii/plastika-grudi` | Грудь | partial |
| Увеличение груди | `/operaczii/plastika-grudi/uvelichenie-grudi` | Грудь | scaffold |
| Подтяжка груди без имплантов | `/operaczii/plastika-grudi/podtyazhka-grudi-bez-implantov` | Грудь | scaffold |
| Уменьшение груди | `/operaczii/plastika-grudi/umenshenie-grudi` | Грудь | scaffold |
| Коррекция асимметрии груди | `/operaczii/plastika-grudi/asimmetriya-grudi` | Грудь | scaffold |
| Удаление имплантов | `/operaczii/plastika-grudi/udalenie-implantov-grudi` | Грудь | scaffold |
| Реконструкция груди | `/operaczii/plastika-grudi/rekonstrukciya-grudi` | Грудь | scaffold |
| Липофилинг груди | `/operaczii/lipofiling/lipofiling-grudi` | Грудь / липофилинг | scaffold |
| Абдоминопластика | `/operaczii/abdominoplastika` | Живот и талия | scaffold |
| Диастаза без шрамов | `/operaczii/diastaz-myshc-zhivota` | Живот и талия | partial |
| После родов | `/operaczii/plasticheskaya-hirurgiya-posle-rodov` | Живот и талия / после родов | partial |
| После похудения | `/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya` | Живот и талия / после похудения | partial |
| Пластика живота для мужчин | `/operaczii/muzhskaya-plastika/abdominoplastika-dlya-muzhchin` | Живот и талия / мужчинам | scaffold |
| Коррекция фигуры | `/operaczii/liposkulptura` | Коррекция фигуры | partial |
| Подтяжка ягодиц | `/operaczii/liposkulptura/podtyazhka-yagodic` | Липоскульптура | scaffold |
| Подтяжка бедер | `/operaczii/liposkulptura/podtyazhka-beder` | Липоскульптура | scaffold |
| Подтяжка рук | `/operaczii/liposkulptura/podtyazhka-ruk` | Липоскульптура | scaffold |
| Ультразвуковая липосакция | `/operaczii/liposkulptura/ultrazvukovaya-liposakciya` | Липоскульптура | scaffold |
| Липофилинг | `/operaczii/lipofiling` | Липофилинг | scaffold |
| Липофилинг ягодиц | `/operaczii/lipofiling/lipofiling-yagodic` | Липофилинг | scaffold |
| Липосакция рук | `/operaczii/liposakcziya/liposakcziya-ruk` | Липосакция | scaffold |
| Липосакция спины | `/operaczii/liposakcziya/liposakcziya-spiny` | Липосакция | scaffold |
| Липосакция вдовьего горбика | `/operaczii/liposakcziya/liposakcziya-vdovego-gorbika` | Липосакция | scaffold |
| Интимная пластика | `/operaczii/intimnaya-plastika` | Интимная пластика | partial |
| Без операции (RF-лифтинг) | `/operaczii/rf-lifting` | RF-лифтинг | partial |
| RF-лифтинг тела | `/operaczii/rf-lifting/rf-lifting-tela` | RF-лифтинг | scaffold |
| RF-лифтинг живота | `/operaczii/rf-lifting/rf-lifting-zhivota` | RF-лифтинг | scaffold |
| RF-лифтинг шеи и декольте | `/operaczii/rf-lifting/rf-lifting-shei-i-dekolte` | RF-лифтинг | scaffold |
| RF-лифтинг Morpheus 8 | `/operaczii/rf-lifting/rf-lifting-morpheus-8` | RF-лифтинг | scaffold |
| Мужская пластика | `/operaczii/muzhskaya-plastika` | Мужчинам | partial |
| Уменьшение мужской груди | `/operaczii/muzhskaya-plastika/ginekomastiya` | Мужская атлетизация | scaffold |
| Лечение гинекомастии | `/operaczii/muzhskaya-plastika/lechenie-ginekompastii` | Мужская атлетизация | scaffold |
| Прорисовка пресса | `/operaczii/muzhskaya-plastika/prorisovka-pressa` | Мужская атлетизация | scaffold, название спорное |
| Атлетизация плеч и рук | `/operaczii/muzhskaya-plastika/atletizaciya-plech-i-ruk` | Мужская атлетизация | scaffold |
| Мужская подтяжка ягодиц или бедер | `/operaczii/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder` | Мужская атлетизация | scaffold, разделение спорное |
| Бодилифтинг для мужчин | `/operaczii/muzhskaya-plastika/bodilifting-dlya-muzhchin` | Мужская атлетизация | scaffold |
| Прорисовка грудных мышц | `/operaczii/muzhskaya-plastika/prorisovka-grudnykh-myshcz` | Мужская атлетизация | scaffold, нет SEO |

## 5. Страницы из таблиц, которые не удалось создать

- «Увеличение объёма мышц»: в комментарии есть желаемое объединение/переименование, но нет однозначного URL и решения о составе страницы.
- Увеличение ягодиц для мужчин: есть комментарий, но отдельный целевой URL отсутствует. Существующий женский/общий URL липофилинга ягодиц не переиспользован молча.
- Вторая страница после разделения «Мужская подтяжка ягодиц или бедер»: отсутствуют название и slug второй страницы.
- Главная страница липосакции `/operaczii/liposakcziya`: таблица прямо сообщает, что главной нет; маршрут не создан.
- Поштучные статьи, материалы «Про болезни», кейсы, работы «До/после», публикации СМИ, выступления и будущие акции: вместо файлов для записей созданы динамические шаблоны; записей CMS нет.
- Плановые URL со значением `#NAME?` не использовались. Если правая часть `operaczii.xlsx` давала валидный URL, использовался он; иначе сохранён существующий маршрут.

## 6. Существующие страницы, которых нет в таблицах

| Маршрут | Назначение | Готовность | Предложение |
| --- | --- | --- | --- |
| `/design-system` | Внутренняя документация компонентов | existing | сохранить, `noindex` уже включён |
| `/obo-mne` | Составная посадочная «Обо мне» | existing | сохранить как листинг/обзор; решить, какие секции позднее сокращать после заполнения отдельных страниц |
| `/obo-mne/diplomy-i-licenzii` | Документы и квалификация | partial | добавить в SEO-реестр после подтверждения владельца |
| `/operaczii` | Общий листинг операций | partial | сохранить как навигационную посадочную |
| `/operaczii/zhivot-i-taliya` | Посадочная пользовательской группы | partial | сохранить; в новой таблице группа есть, но URL группы не указан |
| `/pacientam` | Общая посадочная для пациентов | partial | сохранить как листинг |

## 7. SEO

### Успешно сопоставлено и подключено

В типизированном реестре подключено 55 полных наборов `title + description`, включая главную, разделы «Обо мне», акции, цены, 36 из 37 операций, отзывы, путь пациента, анализы, безопасность, «Про болезни», «До/после» и контакты. Для них используется общий `toMetadata(SeoData)` с canonical.

### Страница существует, но Title отсутствует в таблице

- `/konsultaciya`;
- `/konsultacii/onlayn-konsultaciya` — ячейка содержит служебное решение об объединении, а не SEO title;
- `/konsultacii/konsultaciya-po-ankete`;
- `/operaczii/muzhskaya-plastika/prorisovka-grudnykh-myshcz`;
- `/pacientam/blog`, `/pacientam/lichnyy-assistent`, `/pacientam/vopros-otvet`, `/pacientam/portfolio` — `#NAME?` или `-`;
- существующие страницы без строк таблицы: `/obo-mne`, `/obo-mne/diplomy-i-licenzii`, `/operaczii`, `/operaczii/zhivot-i-taliya`, `/pacientam`.

Для уже существовавших страниц с невалидными табличными значениями старые metadata не удалялись.

### Страница существует, но Description отсутствует в таблице

Совпадает со списком отсутствующих Title, кроме очной консультации. У онлайн-консультации description пустой. У консультации по анкете оба поля пустые.

### SEO есть в таблице, но маршрут не найден

После применения приоритета `operaczii.xlsx` таких строк не осталось. SEO строк с невалидным плановым URL было привязано по названию и legacy URL только там, где в новой таблице существовал однозначный целевой URL.

### SEO не соответствует новому названию

- `/obo-mne/vystupleniya`: Description равен «Специализация».
- `/operaczii/liposkulptura`: новое название страницы «Коррекция фигуры», SEO осталось про липоскульптуру.
- `/operaczii/muzhskaya-plastika/ginekomastiya`: новое название «Уменьшение мужской груди», SEO осталось про лечение гинекомастии.
- `/operaczii/rf-lifting`: новое название «Без операции (РФ-лифтинг)», SEO использует «RF-лифтинг».
- Страница конкретной акции имеет общий Title, а Description оформлен как title. Значения перенесены без переписывания.
- `/operaczii/muzhskaya-plastika/prorisovka-pressa`: и название, и SEO помечены самой таблицей как требующие пересмотра.

### Дубли SEO

- Дубли Title отсутствуют.
- Description «Специализация» используется у `/obo-mne/specializaciya` и `/obo-mne/vystupleniya`.

### Подозрительно короткие или длинные значения

- Title короче 20 символов: `/obo-mne/specializaciya`, `/obo-mne/vystupleniya`, `/akcii`, `/ceny`, `/pacientam/pro-bolezni`.
- Description короче 50 символов: `/obo-mne/specializaciya`, `/obo-mne/publikacii`, `/obo-mne/vystupleniya`, `/ceny`, `/pacientam/pro-bolezni`.
- Title длиннее 70 символов: 26 страниц, преимущественно legacy SEO операций; максимум 135 символов у `/operaczii/rf-lifting/rf-lifting-shei-i-dekolte`.
- Description длиннее 160 символов: 8 страниц — после похудения, абдоминопластика, липосакция вдовьего горбика, интимная пластика и четыре страницы RF-лифтинга.

Значения не сокращались: это отдельная SEO-редакторская задача.

## 8. Динамические CMS-шаблоны

| Сущность | Родитель | URL | Листинг | Шаблон | Будущий Strapi Collection Type |
| --- | --- | --- | --- | --- | --- |
| Статья блога | Блог | `/pacientam/blog/[slug]` | есть | создан | `blog-article` |
| Материал «Про болезни» | Про болезни | `/pacientam/pro-bolezni/[slug]` | есть | создан | `condition-article` |
| Кейс | Портфолио | `/pacientam/portfolio/[slug]` | есть | создан | `case-study` |
| Работа «До/после» | До/после | `/pacientam/do-i-posle/[slug]` | есть | создан | `before-after-work` |
| Акция | Акции | `/akcii/[slug]` | есть | создан | `promotion` |
| Научная публикация | Научная деятельность | `/obo-mne/publikacii/[slug]` | есть | создан | `scientific-publication` |
| Публикация в СМИ | СМИ | `/obo-mne/smi/[slug]` | есть | создан | `media-publication` |
| Выступление | Выступления | `/obo-mne/vystupleniya/[slug]` | есть | создан | `speaking-event` |

Шаблоны без записи вызывают `notFound()`. Это намеренно: демонстрационные записи и Strapi content types не создавались. Позднее шаблоны должны получать данные через `ContentRepository`, а Strapi-адаптер должен оставаться за этой границей.

## 9. Конфликты, требующие решения владельца

1. **Консультации.** Сейчас безопасно сохранены `/konsultaciya` и три конкретных URL. Вариант A: общая страница с тремя форматами и redirects конкретных URL. Вариант B: общая посадочная плюс три самостоятельные страницы. До решения ничего не объединено.
2. **Гинекомастия.** Новая таблица одновременно задаёт `/operaczii/muzhskaya-plastika/ginekomastiya` («Уменьшение мужской груди») и `/operaczii/muzhskaya-plastika/lechenie-ginekompastii` («Лечение гинекомастии»). Оба URL сохранены как разные заготовки. Нужно подтвердить, различаются ли услуги или нужен один canonical.
3. **«Прорисовка пресса».** URL создан, но название не переименовано: комментарий запрещает считать его окончательным.
4. **«Увеличение объёма мышц».** Неясно, объединяет ли оно пресс, плечи/руки и новую страницу грудных мышц. Нет подтверждённого URL.
5. **Подтяжка ягодиц и бёдер у мужчин.** Существующая общая страница сохранена. Второй URL не придуман.
6. **Увеличение ягодиц для мужчин.** Отдельный URL отсутствует. Можно либо использовать общую страницу липофилинга ягодиц в подборке «Мужчинам», либо создать отдельную страницу после утверждения slug.
7. **Главная липосакции.** `/operaczii/liposakcziya` отсутствует по явной пометке таблицы. Вложенные страницы работают, родительский breadcrumb не ссылается на несуществующую страницу.
8. **Структура «Обо мне».** Составная `/obo-mne` дублирует части новых страниц «Специализация» и «Образование». Контент не вырезался; позднее нужно определить роль обзорной страницы.
9. **Транслитерация «Как всё будет».** Плановый URL невалиден (`#NAME?`), старый использует `kak-vsyo`, код — `kak-vse`. Сохранён существующий canonical и добавлен прямой redirect со старого `.html`.
10. **SEO «Выступления».** Description «Специализация» выглядит ошибочным и требует редакторского решения.
11. **Написание `operaczii`.** Выбрано по прямому приоритету новой таблицы, несмотря на лингвистически привычное `operacii`; старые frontend URL перенаправляются напрямую.

## 10. Изменения кода

### Созданные файлы

- `apps/web/src/content/seo.ts`;
- `apps/web/src/content/page-registry.ts`;
- `apps/web/src/content/site-redirects.ts`;
- `apps/web/src/components/content-page/registry-scaffold-page.tsx`;
- `apps/web/src/components/content-page/cms-entry-template.tsx`;
- страницы `/obo-mne/specializaciya`, `/obo-mne/obrazovanie`, `/konsultaciya` и трёх вариантов консультации;
- каноническое дерево `apps/web/src/app/operaczii`;
- восемь динамических CMS-шаблонов;
- `docs/site-structure-audit.md`.

### Перемещённые файлы

- `obo-mne/obuchenie` → `obo-mne/neshkola`;
- `obo-mne/smi-i-proekty` → `obo-mne/smi`;
- `portfolio` → `pacientam/portfolio`;
- `do-posle` → `pacientam/do-i-posle`;
- существующие страницы `operacii` адаптированы в `operaczii`, а повторяющиеся заготовки операций представлены данными реестра.

### Удалённые файлы

Удалены только старые `page.tsx` после переноса их реализации или представления в реестре. Публичные старые URL не удалены без redirect.

### Изменённые файлы

- `apps/web/next.config.ts` — централизованные redirects;
- header config — канонические ссылки и новые страницы «Обо мне»;
- страницы с однозначным SEO — подключение `getPageMetadata`;
- карточки и ссылки на диастаз — новый canonical;
- навигация соседних страниц «Обо мне» — новые URL.

### Реестр и metadata

- 76 уникальных canonical routes;
- 37 операций без дублей;
- повторное появление страницы в группах представлено через `groups`, а не отдельной записью;
- 55 SEO-наборов подключены через общий тип `SeoData`;
- `#NAME?` и `-` в пользовательские metadata не попали.

## 11. Проверки

| Команда/проверка | Результат | Ошибки | Предупреждения |
| --- | --- | --- | --- |
| Программное чтение двух `.xlsx` | успешно | нет | системное сообщение macOS о недоступном font registry, на данные не повлияло |
| `pnpm build:web` | успешно, 71 статическая/SSG-страница | нет | 3 существующих `next/no-img-element` |
| `pnpm typecheck` | успешно | нет | нет |
| `pnpm lint` | неуспешно из-за существующего состояния monorepo | 4 ошибки в `apps/cms`: CommonJS imports и generated Strapi types | 6 существующих `no-img-element`/example warnings |
| Next dev | успешно после исправления имени динамического сегмента | первый запуск выявил и помог исправить конфликт `[group]` / `[operation]` | Fast Refresh full reload |
| 37 canonical операций в браузере | успешно, HTTP 200 | нет | нет |
| 11 новых/перенесённых статических страниц в браузере | успешно, HTTP 200 | нет | нет |
| 7 representative redirects | успешно, прямой переход | нет | query parameters сохранены |
| Неизвестная CMS-запись `/akcii/ne-sushchestvuet` | ожидаемый HTTP 404 | нет | подтверждает отсутствие фиктивных записей |
| Git diff | успешно проверен | нет | `apps/cms` не содержит изменений этой задачи |

## 12. Подтверждения

- Существующий дизайн и CSS не изменялись.
- Готовые первые блоки и содержательные JSX-секции сохранены.
- Медицинский текст не придумывался; в новых scaffolds используется только название и валидное SEO из таблиц.
- Спорные страницы не удалялись и не объединялись необратимо.
- Внутренние CMS-записи не создавались поштучно; созданы только шаблоны и одна заготовка акции, явно присутствующая в реестре.
- Strapi content types, тестовые CMS-записи, GraphQL и интеграция с Next.js не создавались.
- Зависимости, Next.js, React, Strapi и pnpm не обновлялись.
- Коммит и push не выполнялись.
