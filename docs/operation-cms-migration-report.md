# Отчёт о миграции страниц операций в Strapi

Дата фиксации: 3 августа 2026 года. Ветка: `codex/strapi-local-cms`. Исходная ревизия: `809aa4f`.

## Результат

- Обработано **37** уникальных canonical operations из утверждённой инвентаризации.
- Для **36** страниц подтверждён live-источник с HTTP 200; они опубликованы в Strapi и включены в frontend CMS allowlist.
- **1** страница оставлена draft: `/operaczii/muzhskaya-plastika/prorisovka-grudnykh-myshcz`. Для неё нет подтверждённого live-источника и SEO.
- В Strapi итогово: **37 operations**, **36 published**, **1 draft-only**, **13 categories**, **42 уникальных price items**.
- В source snapshots сохранено **363 content blocks**. В текущей SQLite — **367 blocks**, потому что для ранее мигрированного «Увеличения груди» сохранены 16 редакторских блоков вместо перезаписи 12 извлечёнными блоками.
- Создано **287** упорядоченных связей operation → price. Из 42 цен **8** существующих ключей переиспользованы, **34** созданы для общего live-прайса.

## Источники и правила переноса

- Медицинский текст и структура взяты из live HTML страниц drkav.ru, перечисленных ниже; меню, footer, формы, отзывы и техническая разметка Webflow исключены.
- Единственный источник значений цен — <https://drkav.ru/ceny.html>. Тексты operation pages использовались только для сопоставления позиций и выявления расхождений.
- SEO взят из утверждённой Excel-инвентаризации без редакторской правки. Ограничение `seo.metaTitle` расширено до 160 символов, потому что 16 утверждённых title превышают прежний лимит 80 символов.
- Девять пар конфликтующих operation URL разрешены детерминированно: выбран кандидат HTTP 200, кандидат HTTP 404 отброшен. Operation redirects не изменялись.
- Снимки источников находятся в `apps/cms/src/seed-data/operations`; importer не обращается к live-сайту и воспроизводим из Git-снимков.

## Полная таблица операций

| № | Операция | Canonical | Source URL | Source status | Blocks | Prices | Categories | Strapi status | Frontend status | Warnings |
|---:|---|---|---|---:|---:|---:|---:|---|---|---|
| 1 | Маммопластика | `/operaczii/plastika-grudi` | <https://drkav.ru/ceny/plastika-grudi.html> | 200 | 12 | 8 | 1 | published | CMS | canonical короче `/operaczii/<category>/<operation>` |
| 2 | Увеличение груди | `/operaczii/plastika-grudi/uvelichenie-grudi` | <https://drkav.ru/ceny/plastika-grudi/uvelichenie-grudi.html> | 200 | 12 | 8 | 1 | published | CMS | — |
| 3 | Подтяжка груди без имплантов | `/operaczii/plastika-grudi/podtyazhka-grudi-bez-implantov` | <https://drkav.ru/ceny/plastika-grudi/podtyazhka-grudi-bez-implantov.html> | 200 | 9 | 1 | 1 | published | CMS | conflict: два старых URL; live-кандидат не отменяет ручное утверждение |
| 4 | Уменьшение груди | `/operaczii/plastika-grudi/umenshenie-grudi` | <https://drkav.ru/ceny/plastika-grudi/umenshenie-grudi.html> | 200 | 11 | 8 | 1 | published | CMS | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; requires medical review: source section about reduction contains wording about choosing breast augmentation |
| 5 | Коррекция асимметрии груди | `/operaczii/plastika-grudi/asimmetriya-grudi` | <https://drkav.ru/ceny/plastika-grudi/asimmetriya-grudi.html> | 200 | 12 | 8 | 1 | published | CMS | старое название: Асимметрия груди и ее хирургическое исправление / Асимметрия груди |
| 6 | Удаление имплантов | `/operaczii/plastika-grudi/udalenie-implantov-grudi` | <https://drkav.ru/ceny/plastika-grudi/udalenie-implantov-grudi.html> | 200 | 10 | 8 | 1 | published | CMS | — |
| 7 | Реконструкция груди | `/operaczii/plastika-grudi/rekonstrukciya-grudi` | <https://drkav.ru/ceny/plastika-grudi/rekonstrukciya-grudi.html> | 200 | 12 | 8 | 1 | published | CMS | — |
| 8 | Липофилинг груди | `/operaczii/lipofiling/lipofiling-grudi` | <https://drkav.ru/ceny/lipofiling/lipofiling-grudi.html> | 200 | 9 | 17 | 2 | published | CMS | — |
| 9 | Абдоминопластика | `/operaczii/abdominoplastika` | <https://drkav.ru/ceny/abdominoplastika.html> | 200 | 9 | 1 | 1 | published | CMS | canonical короче `/operaczii/<category>/<operation>`; price associated from the general price by exact/strong name match; source page had no parsed price block |
| 10 | Диастаза без шрамов | `/operaczii/diastaz-myshc-zhivota` | <https://drkav.ru/ceny/diastaz-myshc-zhivota.html> | 200 | 10 | 1 | 1 | published | CMS | canonical короче `/operaczii/<category>/<operation>` |
| 11 | Живот после родов | `/operaczii/plasticheskaya-hirurgiya-posle-rodov` | <https://drkav.ru/ceny/plasticheskaya-hirurgiya-posle-rodov.html> | 200 | 9 | 16 | 2 | published | CMS | дубль canonical в 2 разделах; canonical короче `/operaczii/<category>/<operation>`; старое название: Восстановление после беременности и родов |
| 12 | Живот после похудения | `/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya` | <https://drkav.ru/ceny/plasticheskaya-hirurgiya-posle-pohudeniya.html> | 200 | 12 | 15 | 2 | published | CMS | дубль canonical в 2 разделах; canonical короче `/operaczii/<category>/<operation>`; старое название: Пластика после бариатрических операций и массивного похудения |
| 13 | Пластика живота для мужчин | `/operaczii/muzhskaya-plastika/abdominoplastika-dlya-muzhchin` | <https://drkav.ru/muzhskaya-plastika/abdominoplastika-dlya-muzhchin.html> | 200 | 15 | 11 | 3 | published | CMS | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; дубль canonical в 2 разделах; старое название: Абдоминопластика для мужчин; unmatched page price: Абдоминопластика с перемещение пупка и ушиванием диастаза и пупочной грыжи ВТОРИЧНАЯ; unmatched page price: Бодилифтинг с подтяжкой ягодиц |
| 14 | Коррекция фигуры | `/operaczii/liposkulptura` | <https://drkav.ru/ceny/liposkulptura.html> | 200 | 13 | 5 | 2 | published | CMS | canonical короче `/operaczii/<category>/<operation>`; старое название: Липоскульптура |
| 15 | Подтяжка ягодиц | `/operaczii/liposkulptura/podtyazhka-yagodic` | <https://drkav.ru/ceny/liposkulptura/podtyazhka-yagodic.html> | 200 | 9 | 5 | 2 | published | CMS | — |
| 16 | Подтяжка бедер | `/operaczii/liposkulptura/podtyazhka-beder` | <https://drkav.ru/ceny/liposkulptura/podtyazhka-beder.html> | 200 | 9 | 5 | 2 | published | CMS | — |
| 17 | Подтяжка рук | `/operaczii/liposkulptura/podtyazhka-ruk` | <https://drkav.ru/ceny/liposkulptura/podtyazhka-ruk.html> | 200 | 10 | 5 | 2 | published | CMS | — |
| 18 | Ультразвуковая липосакция | `/operaczii/liposkulptura/ultrazvukovaya-liposakciya` | <https://drkav.ru/ceny/liposkulptura/ultrazvukovaya-liposakciya.html> | 200 | 10 | 1 | 2 | published | CMS | price associated from the general price by exact/strong name match; source page had no parsed price block |
| 19 | Липофилинг | `/operaczii/lipofiling` | <https://drkav.ru/ceny/lipofiling.html> | 200 | 10 | 3 | 2 | published | CMS | canonical короче `/operaczii/<category>/<operation>` |
| 20 | Липофилинг ягодиц | `/operaczii/lipofiling/lipofiling-yagodic` | <https://drkav.ru/ceny/lipofiling/lipofiling-yagodic.html> | 200 | 10 | 17 | 2 | published | CMS | — |
| 21 | Липосакция рук | `/operaczii/liposakcziya/liposakcziya-ruk` | <https://drkav.ru/ceny/liposakcziya/liposakcziya-ruk.html> | 200 | 8 | 0 | 2 | published | CMS | — |
| 22 | Липосакция спины | `/operaczii/liposakcziya/liposakcziya-spiny` | <https://drkav.ru/ceny/liposakcziya/liposakcziya-spiny.html> | 200 | 9 | 0 | 2 | published | CMS | — |
| 23 | Липосакция вдовьего горбика | `/operaczii/liposakcziya/liposakcziya-vdovego-gorbika` | <https://drkav.ru/ceny/liposakcziya/liposakcziya-vdovego-gorbika.html> | 200 | 6 | 0 | 2 | published | CMS | — |
| 24 | Интимная пластика | `/operaczii/intimnaya-plastika` | <https://drkav.ru/ceny/intimnaya-plastika.html> | 200 | 8 | 0 | 1 | published | CMS | canonical короче `/operaczii/<category>/<operation>` |
| 25 | Без операции (РФ-лифтинг) | `/operaczii/rf-lifting` | <https://drkav.ru/ceny/rf-lifting.html> | 200 | 8 | 17 | 2 | published | CMS | canonical короче `/operaczii/<category>/<operation>`; старое название: RF-лифтинг |
| 26 | RF-лифтинг тела | `/operaczii/rf-lifting/rf-lifting-tela` | <https://drkav.ru/ceny/rf-lifting/rf-lifting-tela.html> | 200 | 7 | 0 | 2 | published | CMS | — |
| 27 | RF-лифтинг живота | `/operaczii/rf-lifting/rf-lifting-zhivota` | <https://drkav.ru/ceny/rf-lifting/rf-lifting-zhivota.html> | 200 | 7 | 17 | 2 | published | CMS | — |
| 28 | RF-лифтинг шеи и декольте | `/operaczii/rf-lifting/rf-lifting-shei-i-dekolte` | <https://drkav.ru/ceny/rf-lifting/rf-lifting-shei-i-dekolte.html> | 200 | 7 | 17 | 2 | published | CMS | — |
| 29 | RF-лифтинг Morpheus 8 | `/operaczii/rf-lifting/rf-lifting-morpheus-8` | <https://drkav.ru/ceny/rf-lifting/rf-lifting-morpheus-8.html> | 200 | 11 | 17 | 2 | published | CMS | — |
| 30 | Мужская пластика | `/operaczii/muzhskaya-plastika` | <https://drkav.ru/ceny/muzhskaya-plastika.html> | 200 | 10 | 11 | 2 | published | CMS | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; canonical короче `/operaczii/<category>/<operation>`; unmatched page price: Абдоминопластика с перемещение пупка и ушиванием диастаза и пупочной грыжи ВТОРИЧНАЯ; unmatched page price: Бодилифтинг с подтяжкой ягодиц |
| 31 | Уменьшение мужской груди | `/operaczii/muzhskaya-plastika/ginekomastiya` | <https://drkav.ru/muzhskaya-plastika/ginekomastiya.html> | 200 | 11 | 11 | 2 | published | CMS | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; старое название: Гинекомастия; unmatched page price: Абдоминопластика с перемещение пупка и ушиванием диастаза и пупочной грыжи ВТОРИЧНАЯ; unmatched page price: Бодилифтинг с подтяжкой ягодиц |
| 32 | Лечение гинекомастии | `/operaczii/muzhskaya-plastika/lechenie-ginekompastii` | <https://drkav.ru/ceny/lechenie-ginekompastii.html> | 200 | 10 | 1 | 2 | published | CMS | старый URL есть в excluded redirect candidates; destination требует утверждения |
| 33 | Прорисовка пресса | `/operaczii/muzhskaya-plastika/prorisovka-pressa` | <https://drkav.ru/muzhskaya-plastika/prorisovka-pressa.html> | 200 | 13 | 11 | 2 | published | CMS | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; Excel note: Не должно называться прорисовкой; Excel note: Объединить и назвать "Увеличение объема мышц"; unmatched page price: Абдоминопластика с перемещение пупка и ушиванием диастаза и пупочной грыжи ВТОРИЧНАЯ; unmatched page price: Бодилифтинг с подтяжкой ягодиц |
| 34 | Атлетизация плеч и рук | `/operaczii/muzhskaya-plastika/atletizaciya-plech-i-ruk` | <https://drkav.ru/muzhskaya-plastika/atletizaciya-plech-i-ruk.html> | 200 | 11 | 11 | 2 | published | CMS | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; Excel note: Добавить увеличение ягодиц (липофилинг ягодиц эскпертного уровня под контролем УЗи); unmatched page price: Абдоминопластика с перемещение пупка и ушиванием диастаза и пупочной грыжи ВТОРИЧНАЯ; unmatched page price: Бодилифтинг с подтяжкой ягодиц |
| 35 | Мужская подтяжка ягодиц или бедер | `/operaczii/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder` | <https://drkav.ru/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder.html> | 200 | 11 | 11 | 2 | published | CMS | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; Excel note: разделить на 2 стр; unmatched page price: Абдоминопластика с перемещение пупка и ушиванием диастаза и пупочной грыжи ВТОРИЧНАЯ; unmatched page price: Бодилифтинг с подтяжкой ягодиц |
| 36 | Бодилифтинг для мужчин | `/operaczii/muzhskaya-plastika/bodilifting-dlya-muzhchin` | <https://drkav.ru/muzhskaya-plastika/bodilifting-dlya-muzhchin.html> | 200 | 11 | 11 | 2 | published | CMS | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; unmatched page price: Абдоминопластика с перемещение пупка и ушиванием диастаза и пупочной грыжи ВТОРИЧНАЯ; unmatched page price: Бодилифтинг с подтяжкой ягодиц |
| 37 | Прорисовка грудных мышц | `/operaczii/muzhskaya-plastika/prorisovka-grudnykh-myshcz` | — | missing | 2 | 1 | 2 | draft | registry scaffold | старый URL и SEO не найдены; missing confirmed live source; draft only; price associated from the general price by exact/strong name match; source page had no parsed price block |

## Расхождения цен

Во всех **15** случаях применено значение общего прайса `/ceny.html`, а значение operation page сохранено только в отчёте:

| № | Canonical | Позиция | Operation page | Общий прайс | Применено |
|---:|---|---|---|---|---|
| 1 | `/operaczii/plasticheskaya-hirurgiya-posle-rodov` | Абдоминопластика с перемещением пупка, устранением грыжи и ушиванием диастаза | ₽ 489.000 | ₽ 440.000 | ₽ 440.000 |
| 2 | `/operaczii/plasticheskaya-hirurgiya-posle-rodov` | Редукция груди | ₽ 450.000-₽ 650.000 | ₽ 450.000-550.000 ₽ 650.000 | ₽ 450.000-550.000 ₽ 650.000 |
| 3 | `/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya` | Абдоминопластика с перемещением пупка, устранением грыжи и ушиванием диастаза | ₽ 489.000 | ₽ 440.000 | ₽ 440.000 |
| 4 | `/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya` | Редукция груди | ₽ 450.000-₽ 650.000 | ₽ 450.000-550.000 ₽ 650.000 | ₽ 450.000-550.000 ₽ 650.000 |
| 5 | `/operaczii/lipofiling` | Корректирующий липофилинг | ₽ 60.000 | от ₽ 60.000 | от ₽ 60.000 |
| 6 | `/operaczii/rf-lifting/rf-lifting-zhivota` | Лицо+шея+веки | ₽ 95.000 | ₽ 90.000 | ₽ 90.000 |
| 7 | `/operaczii/rf-lifting/rf-lifting-zhivota` | Лицо (без век)+шея+декольте | ₽120.000 | ₽90.000 | ₽90.000 |
| 8 | `/operaczii/rf-lifting/rf-lifting-zhivota` | Руки внутр. от плеча до локтя | ₽ 60.000 | ₽ 50.000 | ₽ 50.000 |
| 9 | `/operaczii/rf-lifting/rf-lifting-zhivota` | Живот | ₽ 85.000 | ₽ 55.000 | ₽ 55.000 |
| 10 | `/operaczii/rf-lifting/rf-lifting-zhivota` | Задняя внутренняя поверхность плеч | ₽ 60.000 | ₽ 50.000 | ₽ 50.000 |
| 11 | `/operaczii/rf-lifting/rf-lifting-morpheus-8` | Лицо+шея+веки | ₽ 95.000 | ₽ 90.000 | ₽ 90.000 |
| 12 | `/operaczii/rf-lifting/rf-lifting-morpheus-8` | Лицо (без век)+шея+декольте | ₽120.000 | ₽90.000 | ₽90.000 |
| 13 | `/operaczii/rf-lifting/rf-lifting-morpheus-8` | Руки внутр. от плеча до локтя | ₽ 60.000 | ₽ 50.000 | ₽ 50.000 |
| 14 | `/operaczii/rf-lifting/rf-lifting-morpheus-8` | Живот | ₽ 85.000 | ₽ 55.000 | ₽ 55.000 |
| 15 | `/operaczii/rf-lifting/rf-lifting-morpheus-8` | Задняя внутренняя поверхность плеч | ₽ 60.000 | ₽ 50.000 | ₽ 50.000 |

Кроме того, на семи мужских страницах повторяются две позиции, отсутствующие в общем прайсе: «Абдоминопластика … ВТОРИЧНАЯ» и «Бодилифтинг с подтяжкой ягодиц». Они отмечены 14 предупреждениями и не созданы как price items.

## Draft и неполные данные

`/operaczii/muzhskaya-plastika/prorisovka-grudnykh-myshcz` имеет подтверждённые название, canonical, две категории, описание общей цены и цену 40 000 ₽. Нет старого URL, live HTML, утверждённого SEO и полного медицинского текста. Документ создан/обновлён как draft, в `cmsMigratedOperationPaths` не включён; frontend продолжает показывать registry scaffold. Для публикации нужны утверждённые медицинский текст и SEO.

## Требует медицинской или редакторской проверки

- «Уменьшение груди»: в исходном разделе о редукции есть фраза о решении сделать увеличение груди; смысл следует проверить у медицинского редактора.
- «Подтяжка рук»: в исходном тексте обнаружено описание внутренней поверхности бёдер; проверить принадлежность абзаца странице.
- SEO «Уменьшение груди»: исходное «уменьшению руди» сохранено без исправления.
- SEO для подтяжки ягодиц, бёдер, рук и ультразвуковой липосакции содержит исходное «сдлеать»; SEO мужской подтяжки — «Пластичекая».
- В исходном общем прайсе встречаются «Не является публичной афертой», «Ультрозвуковая» и «точености»; перенос не превращает эти исправления в медицинское решение.
- «Прорисовка пресса»: Excel требует отказаться от слова «прорисовка» и объединить материал под названием «Увеличение объёма мышц».
- «Мужская подтяжка ягодиц или бёдер»: Excel требует разделить страницу на две, но отдельные canonical не утверждены.
- «Атлетизация плеч и рук»: Excel предлагает добавить увеличение ягодиц под УЗИ; отдельный canonical и источник не утверждены.
- «Уменьшение мужской груди» и «Лечение гинекомастии» остаются двумя canonical; владельцу нужно подтвердить, что это не дубль.
- 14 несовпавших мужских цен и все 15 расхождений общего/страничного прайса требуют редакторского подтверждения перед production.

## Идемпотентность и проверки

- Финальный importer запущен дважды подряд. Оба запуска: categories created 0 / reused 13; prices created 0 / reused 42; operations created 0 / updated 37; published 36; draft 1; failed 0.
- Read-only verifier: 37 operations, 36 published, 1 draft-only, 13 categories, 42 prices, 367 blocks, 287 price relations, 36 migrated paths, 1 документ «Увеличение груди».
- Frontend runtime: 36/36 опубликованных routes вернули HTTP 200, один H1, корректный canonical и ожидаемое число price items; draft показал registry fallback; неизвестный route — 404; `/ceny` — 200; четыре legacy redirects сохранили query string.
- Browser smoke-check выполнен на representative desktop/mobile страницах: horizontal overflow и duplicate anchors не обнаружены, console errors отсутствуют.
- `pnpm lint` и `pnpm build:cms` прошли. Обычный typecheck после удаления двух routes сначала увидел stale types активного dev-сервера; эквивалентные три `tsc --noEmit` в изолированной копии прошли. Финальный `next build` там же пересоздал route types, выполнил встроенную проверку TypeScript и успешно сгенерировал 69 страниц. Удаляемых routes в build manifest нет.
- Public Content API остался закрыт (HTTP 403 без server token). Server token не читался и не выводился; client bundle не содержит `STRAPI_API_TOKEN`, Bearer header или Strapi operation UID.

## Эксплуатационные замечания

- Перед импортом создан ignored backup SQLite: `apps/cms/.tmp/backups/data-2026-08-02T21-13-44-200Z.db`.
- Importer запускается вручную и не подключён к lifecycle. Ошибки обрабатываются по операциям и приводят к ненулевому exit code.
- Production, DNS, hosting, Public API, реальные интеграции, версии зависимостей, operation URLs и operation redirects не изменялись.
- По отдельному финальному указанию удалены scaffold-страницы `/obo-mne/specializaciya` и `/obo-mne/obrazovanie`: App Router routes, registry entries, пункты меню и seed-запись образования. Их legacy `.html` mappings также исчезли вместе с registry entries; содержательные разделы внутри `/obo-mne` сохранены.
