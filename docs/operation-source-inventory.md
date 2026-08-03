# Инвентаризация источников страниц операций

Статус исходного среза: инвентаризация для ручного утверждения. Итог миграции добавлен в разделе E; исходные Excel не изменялись.

## Источники и методика

- `/Users/Kerio/Downloads/drkav [структура] (1).xlsx`, лист `структура сайта seo`, диапазон `A1:F62`. Для операций использованы строки 16–51; готовые SEO title/description сохранены отдельно ниже.
- `/Users/Kerio/Downloads/operaczii.xlsx`, лист `Sheet1`, диапазон `A1:K41`. Левая часть `A:D` использована как дополнительный источник старых URL, правая часть `F:K` — как новая структура операций.
- Значения обрезаны по краям, пути нормализованы без завершающего `/`, сравнение названий выполнено без учёта регистра и различия `е/ё`.
- `-`, пустые ячейки и `#NAME?` не считались URL. Формулы `__xludf.DUMMYFUNCTION/AI`, у которых Excel показывает `#NAME?`, отмечены как требующие ручной проверки и не использованы как подтверждение URL.
- Кодовые источники: `page-registry.ts`, `cms-migrated-operations.ts`, App Router `apps/web/src/app/operaczii/**`, `site-redirects.ts`, `next.config.ts`.
- Live-проверка была точечной: контрольный URL и 18 адресов из девяти конфликтных пар. Формы не отправлялись, авторизация не обходилась, массовый crawler не запускался.

## Сводка

- Строк новой структуры: **40**.
- Уникальных canonical paths: **37**.
- Повторяющихся canonical в разных строках/разделах: **3**.
- Однозначно подтверждённых старых URL: **27**.
- Конфликтов старых URL: **9**. Во всех девяти live-проверка нашла один HTTP 200 и один HTTP 404, но выбор источника оставлен владельцу.
- Отсутствующих старых URL: **1**.
- Canonical, присутствующих во frontend registry: **37 из 37**.
- CMS-migrated routes: **1**.
- Настроенных legacy redirect mappings для этих registry routes: **51**; из Excel-кандидатов активными mappings являются **43**.
- `inferred` URL не создавались: все строки относятся к `confirmed`, `conflict` или `missing`.

## Основная таблица

| № | Операция | Раздел | Категория | Старый URL | Новый canonical | Источник старого URL | Frontend status | Strapi status | Redirect status | Price notes | Уверенность | Проблема |
|---:|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Маммопластика | Грудь | Грудь главная | <https://drkav.ru/ceny/plastika-grudi.html> | `/operaczii/plastika-grudi` | Excel: структура сайта seo; Excel: operaczii | registry | not migrated | present: /ceny/plastika-grudi.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | canonical короче `/operaczii/<category>/<operation>` |
| 2 | Увеличение груди | Грудь | Грудь | <https://drkav.ru/ceny/plastika-grudi/uvelichenie-grudi.html> (live 200) | `/operaczii/plastika-grudi/uvelichenie-grudi` | Excel: структура сайта seo; Excel: operaczii | CMS-migrated | published | present: /ceny/plastika-grudi/uvelichenie-grudi.html | Контрольная полноценная operation page; связана с 8 reusable price items в текущей CMS-вертикали | high | — |
| 3 | Подтяжка груди без имплантов | Грудь | Грудь | <https://drkav.ru/ceny/plastika-grudi/podtyazhka-grudi-bez-implantov.html> (live 200)<br><https://drkav.ru/ceny/podtyazhka-grudi-bez-implantov.html> (live 404) | `/operaczii/plastika-grudi/podtyazhka-grudi-bez-implantov` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | present: /ceny/plastika-grudi/podtyazhka-grudi-bez-implantov.html; present: /ceny/podtyazhka-grudi-bez-implantov.html | Live: полноценная operation/section page; кратность и повторное использование цен не проверялись | medium | conflict: два старых URL; live-кандидат не отменяет ручное утверждение |
| 4 | Уменьшение груди | Грудь | Грудь | <https://drkav.ru/ceny/umenshenie-grudi.html> (live 404)<br><https://drkav.ru/ceny/plastika-grudi/umenshenie-grudi.html> (live 200) | `/operaczii/plastika-grudi/umenshenie-grudi` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | missing/excluded: /ceny/umenshenie-grudi.html; present: /ceny/plastika-grudi/umenshenie-grudi.html | Live: полноценная operation page; содержит перечень нескольких процедур/цен, не одну цену | medium | conflict: два старых URL; live-кандидат не отменяет ручное утверждение |
| 5 | Коррекция асимметрии груди | Грудь | Грудь | <https://drkav.ru/ceny/plastika-grudi/asimmetriya-grudi.html> | `/operaczii/plastika-grudi/asimmetriya-grudi` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | present: /ceny/plastika-grudi/asimmetriya-grudi.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | старое название: Асимметрия груди и ее хирургическое исправление / Асимметрия груди |
| 6 | Удаление имплантов | Грудь | Грудь | <https://drkav.ru/ceny/plastika-grudi/udalenie-implantov-grudi.html> | `/operaczii/plastika-grudi/udalenie-implantov-grudi` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | present: /ceny/plastika-grudi/udalenie-implantov-grudi.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | — |
| 7 | Реконструкция груди | Грудь | Грудь | <https://drkav.ru/ceny/plastika-grudi/rekonstrukciya-grudi.html> | `/operaczii/plastika-grudi/rekonstrukciya-grudi` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | present: /ceny/plastika-grudi/rekonstrukciya-grudi.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | — |
| 8 | Липофилинг груди | Грудь | Липофилинг | <https://drkav.ru/ceny/lipofiling/lipofiling-grudi.html> | `/operaczii/lipofiling/lipofiling-grudi` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | present: /ceny/lipofiling/lipofiling-grudi.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | — |
| 9 | Абдоминопластика | Живот и талия | - | <https://drkav.ru/ceny/abdominoplastika.html> | `/operaczii/abdominoplastika` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | present: /ceny/abdominoplastika.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | canonical короче `/operaczii/<category>/<operation>` |
| 10 | Диастаза без шрамов | Живот и талия | - | <https://drkav.ru/ceny/diastaz-myshc-zhivota.html> | `/operaczii/diastaz-myshc-zhivota` | Excel: структура сайта seo; Excel: operaczii | registry | not migrated | present: /ceny/diastaz-myshc-zhivota.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | canonical короче `/operaczii/<category>/<operation>` |
| 11 | Живот после родов | Живот и талия / После родов | - | <https://drkav.ru/ceny/plasticheskaya-hirurgiya-posle-rodov.html> | `/operaczii/plasticheskaya-hirurgiya-posle-rodov` | Excel: структура сайта seo; Excel: operaczii | registry | not migrated | present: /ceny/plasticheskaya-hirurgiya-posle-rodov.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | дубль canonical в 2 разделах; canonical короче `/operaczii/<category>/<operation>`; старое название: Восстановление после беременности и родов |
| 12 | Живот после похудения | Живот и талия / После похудения | - | <https://drkav.ru/ceny/plasticheskaya-hirurgiya-posle-pohudeniya.html> | `/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya` | Excel: структура сайта seo; Excel: operaczii | registry | not migrated | present: /ceny/plasticheskaya-hirurgiya-posle-pohudeniya.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | дубль canonical в 2 разделах; canonical короче `/operaczii/<category>/<operation>`; старое название: Пластика после бариатрических операций и массивного похудения |
| 13 | Пластика живота для мужчин | Живот и талия / Мужчинам | Мужская атлетизация | <https://drkav.ru/ceny/muzhskaya-plastika/abdominoplastika-dlya-muzhchin.html> (live 404)<br><https://drkav.ru/muzhskaya-plastika/abdominoplastika-dlya-muzhchin.html> (live 200) | `/operaczii/muzhskaya-plastika/abdominoplastika-dlya-muzhchin` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | present: /ceny/muzhskaya-plastika/abdominoplastika-dlya-muzhchin.html; present: /muzhskaya-plastika/abdominoplastika-dlya-muzhchin.html | Live: полноценная operation/section page; кратность и повторное использование цен не проверялись | medium | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; дубль canonical в 2 разделах; старое название: Абдоминопластика для мужчин |
| 14 | Коррекция фигуры | Коррекция фигуры | Липоскульптура (главная) | <https://drkav.ru/ceny/liposkulptura.html> | `/operaczii/liposkulptura` | Excel: структура сайта seo; Excel: operaczii | registry | not migrated | present: /ceny/liposkulptura.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | canonical короче `/operaczii/<category>/<operation>`; старое название: Липоскульптура |
| 15 | Подтяжка ягодиц | Коррекция фигуры | Липоскульптура | <https://drkav.ru/ceny/liposkulptura/podtyazhka-yagodic.html> | `/operaczii/liposkulptura/podtyazhka-yagodic` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | present: /ceny/liposkulptura/podtyazhka-yagodic.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | — |
| 16 | Подтяжка бедер | Коррекция фигуры | Липоскульптура | <https://drkav.ru/ceny/liposkulptura/podtyazhka-beder.html> | `/operaczii/liposkulptura/podtyazhka-beder` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | present: /ceny/liposkulptura/podtyazhka-beder.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | — |
| 17 | Подтяжка рук | Коррекция фигуры | Липоскульптура | <https://drkav.ru/ceny/liposkulptura/podtyazhka-ruk.html> | `/operaczii/liposkulptura/podtyazhka-ruk` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | present: /ceny/liposkulptura/podtyazhka-ruk.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | — |
| 18 | Ультразвуковая липосакция | Коррекция фигуры | Липоскульптура | <https://drkav.ru/ceny/liposkulptura/ultrazvukovaya-liposakciya.html> | `/operaczii/liposkulptura/ultrazvukovaya-liposakciya` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | present: /ceny/liposkulptura/ultrazvukovaya-liposakciya.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | — |
| 19 | Липофилинг | Коррекция фигуры | Липофилинг, главная | <https://drkav.ru/ceny/lipofiling.html> | `/operaczii/lipofiling` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | present: /ceny/lipofiling.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | canonical короче `/operaczii/<category>/<operation>` |
| 20 | Липофилинг ягодиц | Коррекция фигуры | Липофилинг | <https://drkav.ru/ceny/lipofiling/lipofiling-yagodic.html> | `/operaczii/lipofiling/lipofiling-yagodic` | Excel: operaczii | route scaffold | not migrated | present: /ceny/lipofiling/lipofiling-yagodic.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | — |
| 21 | Липосакция рук | Коррекция фигуры | Липосакция (НЕТ ГЛАВНОЙ) | <https://drkav.ru/ceny/liposakcziya/liposakcziya-ruk.html> | `/operaczii/liposakcziya/liposakcziya-ruk` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | present: /ceny/liposakcziya/liposakcziya-ruk.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | — |
| 22 | Липосакция спины | Коррекция фигуры | Липосакция (НЕТ ГЛАВНОЙ) | <https://drkav.ru/ceny/liposakcziya/liposakcziya-spiny.html> | `/operaczii/liposakcziya/liposakcziya-spiny` | Excel: operaczii | route scaffold | not migrated | present: /ceny/liposakcziya/liposakcziya-spiny.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | — |
| 23 | Липосакция вдовьего горбика | Коррекция фигуры | Липосакция (НЕТ ГЛАВНОЙ) | <https://drkav.ru/ceny/liposakcziya/liposakcziya-vdovego-gorbika.html> | `/operaczii/liposakcziya/liposakcziya-vdovego-gorbika` | Excel: operaczii | route scaffold | not migrated | present: /ceny/liposakcziya/liposakcziya-vdovego-gorbika.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | — |
| 24 | Интимная пластика | Интимная пластика | - | <https://drkav.ru/ceny/intimnaya-plastika.html> | `/operaczii/intimnaya-plastika` | Excel: operaczii | registry | not migrated | present: /ceny/intimnaya-plastika.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | canonical короче `/operaczii/<category>/<operation>` |
| 25 | Без операции (РФ-лифтинг) | Без операции (РФ-лифтинг) | RF-лифтинг, главная | <https://drkav.ru/ceny/rf-lifting.html> | `/operaczii/rf-lifting` | Excel: структура сайта seo; Excel: operaczii | registry | not migrated | present: /ceny/rf-lifting.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | canonical короче `/operaczii/<category>/<operation>`; старое название: RF-лифтинг |
| 26 | RF-лифтинг тела | Без операции (РФ-лифтинг) | RF-лифтинг | <https://drkav.ru/ceny/rf-lifting/rf-lifting-tela.html> | `/operaczii/rf-lifting/rf-lifting-tela` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | present: /ceny/rf-lifting/rf-lifting-tela.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | — |
| 27 | RF-лифтинг живота | Без операции (РФ-лифтинг) | RF-лифтинг | <https://drkav.ru/ceny/rf-lifting/rf-lifting-zhivota.html> | `/operaczii/rf-lifting/rf-lifting-zhivota` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | present: /ceny/rf-lifting/rf-lifting-zhivota.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | — |
| 28 | RF-лифтинг шеи и декольте | Без операции (РФ-лифтинг) | RF-лифтинг | <https://drkav.ru/ceny/rf-lifting/rf-lifting-shei-i-dekolte.html> | `/operaczii/rf-lifting/rf-lifting-shei-i-dekolte` | Excel: operaczii | route scaffold | not migrated | present: /ceny/rf-lifting/rf-lifting-shei-i-dekolte.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | — |
| 29 | RF-лифтинг Morpheus 8 | Без операции (РФ-лифтинг) | RF-лифтинг | <https://drkav.ru/ceny/rf-lifting/rf-lifting-morpheus-8.html> | `/operaczii/rf-lifting/rf-lifting-morpheus-8` | Excel: operaczii | route scaffold | not migrated | present: /ceny/rf-lifting/rf-lifting-morpheus-8.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | — |
| 30 | Мужская пластика | Мужчинам | Мужская атлетизация, Главная | <https://drkav.ru/ceny/muzhskaya-plastika.html> (live 200)<br><https://drkav.ru/muzhskaya-plastika.html> (live 404) | `/operaczii/muzhskaya-plastika` | Excel: структура сайта seo; Excel: operaczii | registry | not migrated | present: /ceny/muzhskaya-plastika.html; present: /muzhskaya-plastika.html | Live: полноценная operation/section page; кратность и повторное использование цен не проверялись | medium | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; canonical короче `/operaczii/<category>/<operation>` |
| 31 | Уменьшение мужской груди | Мужчинам | Мужская атлетизация | <https://drkav.ru/ceny/muzhskaya-plastika/ginekomastiya.html> (live 404)<br><https://drkav.ru/muzhskaya-plastika/ginekomastiya.html> (live 200) | `/operaczii/muzhskaya-plastika/ginekomastiya` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | present: /ceny/muzhskaya-plastika/ginekomastiya.html; present: /muzhskaya-plastika/ginekomastiya.html | Live: полноценная operation/section page; кратность и повторное использование цен не проверялись | medium | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; старое название: Гинекомастия |
| 32 | Лечение гинекомастии | Мужчинам | Мужская атлетизация | <https://drkav.ru/ceny/lechenie-ginekompastii.html> | `/operaczii/muzhskaya-plastika/lechenie-ginekompastii` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | missing/excluded: /ceny/lechenie-ginekompastii.html | Есть `/ceny`-источник; тип страницы и кратность цен требуют отдельного аудита | high | старый URL есть в excluded redirect candidates; destination требует утверждения |
| 33 | Прорисовка пресса | Мужчинам | Мужская атлетизация | <https://drkav.ru/ceny/muzhskaya-plastika/prorisovka-pressa.html> (live 404)<br><https://drkav.ru/muzhskaya-plastika/prorisovka-pressa.html> (live 200) | `/operaczii/muzhskaya-plastika/prorisovka-pressa` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | present: /ceny/muzhskaya-plastika/prorisovka-pressa.html; present: /muzhskaya-plastika/prorisovka-pressa.html | Live: полноценная operation/section page; кратность и повторное использование цен не проверялись | medium | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; Excel note: Не должно называться прорисовкой; Excel note: Объединить и назвать "Увеличение объема мышц" |
| 34 | Атлетизация плеч и рук | Мужчинам | Мужская атлетизация | <https://drkav.ru/ceny/muzhskaya-plastika/atletizaciya-plech-i-ruk.html> (live 404)<br><https://drkav.ru/muzhskaya-plastika/atletizaciya-plech-i-ruk.html> (live 200) | `/operaczii/muzhskaya-plastika/atletizaciya-plech-i-ruk` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | present: /ceny/muzhskaya-plastika/atletizaciya-plech-i-ruk.html; present: /muzhskaya-plastika/atletizaciya-plech-i-ruk.html | Live: полноценная operation/section page; кратность и повторное использование цен не проверялись | medium | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; Excel note: Добавить увеличение ягодиц (липофилинг ягодиц эскпертного уровня под контролем УЗи) |
| 35 | Мужская подтяжка ягодиц или бедер | Мужчинам | Мужская атлетизация | <https://drkav.ru/ceny/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder.html> (live 404)<br><https://drkav.ru/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder.html> (live 200) | `/operaczii/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | present: /ceny/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder.html; present: /muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder.html | Live: полноценная operation/section page; кратность и повторное использование цен не проверялись | medium | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; Excel note: разделить на 2 стр |
| 36 | Бодилифтинг для мужчин | Мужчинам | Мужская атлетизация | <https://drkav.ru/ceny/muzhskaya-plastika/bodilifting-dlya-muzhchin.html> (live 404)<br><https://drkav.ru/muzhskaya-plastika/bodilifting-dlya-muzhchin.html> (live 200) | `/operaczii/muzhskaya-plastika/bodilifting-dlya-muzhchin` | Excel: структура сайта seo; Excel: operaczii | route scaffold | not migrated | present: /ceny/muzhskaya-plastika/bodilifting-dlya-muzhchin.html; present: /muzhskaya-plastika/bodilifting-dlya-muzhchin.html | Live: полноценная operation/section page; кратность и повторное использование цен не проверялись | medium | conflict: два старых URL; live-кандидат не отменяет ручное утверждение |
| 37 | Прорисовка грудных мышц | Мужчинам | Мужская атлетизация | missing | `/operaczii/muzhskaya-plastika/prorisovka-grudnykh-myshcz` | not found | route scaffold | not migrated | missing | Нет старого источника; цены не проверялись | low | старый URL и SEO не найдены |

## Проверка frontend routes и canonical

- Все 37 уникальных canonical присутствуют в `page-registry.ts`; один имеет `contentStatus: cms`, остальные — registry/partial/scaffold.
- В App Router используются динамические `operaczii/[segment]/page.tsx` и `operaczii/[segment]/[operation]/page.tsx`. Дополнительно существуют физические страницы `/operaczii`, `/operaczii/zhivot-i-taliya` и `/operaczii/diastaz-myshc-zhivota`.
- `.html` в новых canonical нет; различий только завершающим `/` после нормализации нет.
- Три canonical повторены в новой Excel-структуре как размещение одной страницы в двух разделах, а не как разные URL:
  - `/operaczii/plasticheskaya-hirurgiya-posle-rodov`;
  - `/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya`;
  - `/operaczii/muzhskaya-plastika/abdominoplastika-dlya-muzhchin`.
- Десять canonical короче формата `/operaczii/<category>/<operation>` и требуют утверждения как осознанные landing/one-level exceptions: `/operaczii/plastika-grudi`, `/operaczii/abdominoplastika`, `/operaczii/diastaz-myshc-zhivota`, `/operaczii/plasticheskaya-hirurgiya-posle-rodov`, `/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya`, `/operaczii/liposkulptura`, `/operaczii/lipofiling`, `/operaczii/intimnaya-plastika`, `/operaczii/rf-lifting`, `/operaczii/muzhskaya-plastika`.
- Runtime redirect chain/duplicate guards уже есть в `site-redirects.ts`; код не изменялся. Два Excel-кандидата намеренно исключены из runtime redirects: `/ceny/umenshenie-grudi.html` и `/ceny/lechenie-ginekompastii.html`.

## Точечная live-проверка конфликтов

| Canonical | Кандидат 1 | Результат | Кандидат 2 | Результат |
|---|---|---|---|---|
| `/operaczii/plastika-grudi/podtyazhka-grudi-bez-implantov` | <https://drkav.ru/ceny/plastika-grudi/podtyazhka-grudi-bez-implantov.html> | 200; H1: Подтяжка груди без имплантов | <https://drkav.ru/ceny/podtyazhka-grudi-bez-implantov.html> | 404; без содержательного H1 |
| `/operaczii/plastika-grudi/umenshenie-grudi` | <https://drkav.ru/ceny/umenshenie-grudi.html> | 404; без содержательного H1 | <https://drkav.ru/ceny/plastika-grudi/umenshenie-grudi.html> | 200; H1: Уменьшение груди или редукционная маммопластика |
| `/operaczii/muzhskaya-plastika/abdominoplastika-dlya-muzhchin` | <https://drkav.ru/ceny/muzhskaya-plastika/abdominoplastika-dlya-muzhchin.html> | 404; без содержательного H1 | <https://drkav.ru/muzhskaya-plastika/abdominoplastika-dlya-muzhchin.html> | 200; H1: Абдоминопластика для мужчин у хирурга Коробова |
| `/operaczii/muzhskaya-plastika` | <https://drkav.ru/ceny/muzhskaya-plastika.html> | 200; H1: Мужская пластика | <https://drkav.ru/muzhskaya-plastika.html> | 404; без содержательного H1 |
| `/operaczii/muzhskaya-plastika/ginekomastiya` | <https://drkav.ru/ceny/muzhskaya-plastika/ginekomastiya.html> | 404; без содержательного H1 | <https://drkav.ru/muzhskaya-plastika/ginekomastiya.html> | 200; H1: Хирургическое лечение гинекомастии у доктора Коробова |
| `/operaczii/muzhskaya-plastika/prorisovka-pressa` | <https://drkav.ru/ceny/muzhskaya-plastika/prorisovka-pressa.html> | 404; без содержательного H1 | <https://drkav.ru/muzhskaya-plastika/prorisovka-pressa.html> | 200; H1: Прорисовка пресса мужчинам |
| `/operaczii/muzhskaya-plastika/atletizaciya-plech-i-ruk` | <https://drkav.ru/ceny/muzhskaya-plastika/atletizaciya-plech-i-ruk.html> | 404; без содержательного H1 | <https://drkav.ru/muzhskaya-plastika/atletizaciya-plech-i-ruk.html> | 200; H1: Мужская атлетизация плеч и рук |
| `/operaczii/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder` | <https://drkav.ru/ceny/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder.html> | 404; без содержательного H1 | <https://drkav.ru/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder.html> | 200; H1: Хирургическая мужская подтяжка ягодиц или бедер |
| `/operaczii/muzhskaya-plastika/bodilifting-dlya-muzhchin` | <https://drkav.ru/ceny/muzhskaya-plastika/bodilifting-dlya-muzhchin.html> | 404; без содержательного H1 | <https://drkav.ru/muzhskaya-plastika/bodilifting-dlya-muzhchin.html> | 200; H1: Бодилифтинг (торсопластика) для мужчин у хирурга Коробова |

Контрольный URL `/ceny/plastika-grudi/uvelichenie-grudi.html` также вернул HTTP 200, HTML и содержательный H1. Redirect на live-сайте не использовался как доказательство сопоставления: все проверенные адреса завершались на исходном URL.

## SEO values

`#NAME?` и нерассчитанные AI-формулы не использованы. Готовые title/description найдены для 36 из 37 canonical; для `Прорисовка грудных мышц` значений нет.

| Canonical | SEO title | SEO description | Статус источника |
|---|---|---|---|
| `/operaczii/plastika-grudi` | Пластика груди: цены — DrKAV | Пластика груди у DrKAV: стоимость, что входит в цену, варианты операций и что обсудить на консультации перед вмешательством. | готовые значения: Excel `структура сайта seo` |
| `/operaczii/plastika-grudi/uvelichenie-grudi` | Увеличить грудь по низкой цене, увеличение груди в Москве \| Артем Коробов | Увеличить грудь по выгодной цене в Москве. Увеличение груди профессиональным пластическим хирургом Артемом Коробовым. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/plastika-grudi/podtyazhka-grudi-bez-implantov` | Подтяжка груди без имплантов по низкой цене в Москве \| Артем Коробов | Подтяжка груди без имплантов по выгодной цене в Москве. Операция по подтяжке груди без использования имплантов. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/plastika-grudi/umenshenie-grudi` | Уменьшение груди по низкой цене в Москве у Артема Коробова | Уменьшение груди хирургом Артемом Коробовым. Выгодная цена на операцию по уменьшению руди в Москве. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/plastika-grudi/asimmetriya-grudi` | Асимметрия груди - операция по исправлению асимметрии груди в Москве, низкая цена \| Артем Коробов | Операция по исправлению асимметрии груди пластическим хирургом Артемом Коробовым. Выгодная цена на коррекцию груди в Москве. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/plastika-grudi/udalenie-implantov-grudi` | Удаление имплантов груди по выгодной цене в Москве у Артема Коробова | Операция по удалению грудных имплантов пластическим хирургом Артемом Коробовым. Выгодная цена на удаление имплантов груди в Москве. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/plastika-grudi/rekonstrukciya-grudi` | Реконструкция груди после мастэктомии по низкой цене, восстановлении груди в Москве \| Артем Коробов | Реконструкция груди по выгодной цене в Москве. Восстановлении груди после мастэктомии профессиональным пластическим хирургом Артемом Коробовым. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/lipofiling/lipofiling-grudi` | Липофилинг груди по низкой цене - записаться на процедуру липофилинга груди в Москве \| Артем Коробов | Липофилинг груди по выгодной цене в Москве. Операция липофилинга груди проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/abdominoplastika` | Абдоминопластика в Москве - сделать пластику живота по низкой цене \| Артем Коробов | Как проходит абдоминопластика: показания и противопоказания, виды операции, этапы подготовки и восстановления. Узнайте, кому подходит процедура и как добиться лучших результатов. | готовые значения: Excel `структура сайта seo` |
| `/operaczii/diastaz-myshc-zhivota` | Ушивание диастаза без шрамов - операция лапароскопического ушивания диастаза в Москве \| Артем Коробов | Лапароскопическое ушивание диастаза по выгодной цене в Москве. Операция по ушиванию диастаза без шрамов. Авторская методика! Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/plasticheskaya-hirurgiya-posle-rodov` | Пластика после родов по низкой цене в Москве \| Артем Коробов | Пластика после родов по выгодной цене в Москве. Операция проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya` | Пластика после похудения - операция по удалению кожи после похудения в Москве \| Артем Коробов | Операция по удалению кожи после похудения по выгодной цене в Москве. Профессиональная пластика после похудения от пластического хирурга Артема Коробова. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/muzhskaya-plastika/abdominoplastika-dlya-muzhchin` | Абдоминопластика живота для мужчин по низкой цене в Москве \| Артем Коробов | Пластика живота для мужчин по выгодной цене в Москве. Мужская абдоминопластика профессиональным пластическим хирургом Артемом Коробовым. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/liposkulptura` | Липоскульптура по низкой цене - записаться на процедуру липомоделирования в Москве \| Артем Коробов | Липомоделирование по выгодной цене в Москве. Процедура липоскульптуры проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/liposkulptura/podtyazhka-yagodic` | Подтяжка ягодиц в Москве - сдлеать глютеопластика по низкой цене \| Артем Коробов | Подтяжка ягодиц в Москве пластическим хирургом Артемом Коробовым. Многолетний опыт, довольные пациенты, выгодные цены! Запись на консультацию. | готовые значения: Excel `структура сайта seo` |
| `/operaczii/liposkulptura/podtyazhka-beder` | Подтяжка бедер в Москве - сдлеать феморопластику по низкой цене \| Артем Коробов | Подтяжка бедер в Москве пластическим хирургом Артемом Коробовым. Многолетний опыт, довольные пациенты, выгодные цены! Запись на консультацию. | готовые значения: Excel `структура сайта seo` |
| `/operaczii/liposkulptura/podtyazhka-ruk` | Подтяжка рук в Москве - сдлеать брахиопластику по низкой цене \| Артем Коробов | Подтяжка рук в Москве пластическим хирургом Артемом Коробовым. Многолетний опыт, довольные пациенты, выгодные цены! Запись на консультацию. | готовые значения: Excel `структура сайта seo` |
| `/operaczii/liposkulptura/ultrazvukovaya-liposakciya` | Ультразвуковая липосакция в Москве - сдлеать ультразвуковую липосакцию по низкой цене \| Артем Коробов | Ультразвуковая липосакция в Москве пластическим хирургом Артемом Коробовым. Многолетний опыт, довольные пациенты, выгодные цены! Запись на консультацию. | готовые значения: Excel `структура сайта seo` |
| `/operaczii/lipofiling` | Липофилинг по низкой цене - записаться на процедуру липофилинга в Москве \| Артем Коробов | Липофилинг по выгодной цене в Москве. Операция проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/lipofiling/lipofiling-yagodic` | Липофилинг ягодиц по низкой цене - записаться на процедуру липофилинга ягодиц в Москве \| Артем Коробов | Липофилинг ягодиц по выгодной цене в Москве. Операция липофилинга ягодиц проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/liposakcziya/liposakcziya-ruk` | Липосакция рук в Москве - удаление жира с рук и коррекция контура | Липосакция рук в Москве: удаление жировых отложений в области плеча и предплечья. Классическая и лазерная методика, быстрая реабилитация, консультация хирурга. | готовые значения: Excel `структура сайта seo` |
| `/operaczii/liposakcziya/liposakcziya-spiny` | Липосакция спины в Москве - удаление жира со спины и боков, методы и цена | Липосакция спины в Москве: удаление жировых отложений на спине и боках. Современные методы, аккуратная коррекция контура, консультация пластического хирурга. | готовые значения: Excel `структура сайта seo` |
| `/operaczii/liposakcziya/liposakcziya-vdovego-gorbika` | Липосакция вдовьего горбика в Москве - убрать холку на шее | Липосакция вдовьего горбика в Москве: удаление жирового валика в области шеи и загривка. Минимальные проколы, аккуратная коррекция контура, консультация хирурга. | готовые значения: Excel `структура сайта seo` |
| `/operaczii/intimnaya-plastika` | Интимная пластика в Москве, сделать лабиопластику (пластику интимной зоны) по выгодной цене \| Артем Коробов | Пластика интимной зоны: лабиопластика, коррекция формы и объема, восстановление после родов и возрастных изменений. Запись на консультацию перед интимной пластикой в Москве. | готовые значения: Excel `структура сайта seo` |
| `/operaczii/rf-lifting` | RF лифтинг по низкой цене - записаться на процедуру микроигольчатого РФ лифтинга в Москве \| Артем Коробов | Микроигольчатый RF лифтинг по выгодной цене в Москве. Процедура РФ лифтинга проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/rf-lifting/rf-lifting-tela` | RF лифтинг тела по низкой цене - записаться на процедуру микроигольчатого РФ лифтинга тела в Москве \| Артем Коробов | Микроигольчатый RF лифтинг тела по выгодной цене в Москве. Процедура РФ лифтинга тела проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/rf-lifting/rf-lifting-zhivota` | RF лифтинг живота по низкой цене - записаться на процедуру микроигольчатого РФ лифтинга живота в Москве \| Артем Коробов | Микроигольчатый RF лифтинг живота по выгодной цене в Москве. Процедура РФ лифтинга живота проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/rf-lifting/rf-lifting-shei-i-dekolte` | RF лифтинг шеи и декольте по низкой цене - записаться на процедуру микроигольчатого РФ лифтинга шеи и декольте в Москве \| Артем Коробов | Микроигольчатый RF лифтинг шеи и декольте по выгодной цене в Москве. Процедура РФ лифтинга шеи и декольте проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/rf-lifting/rf-lifting-morpheus-8` | RF лифтинг Morpheus 8 по низкой цене - записаться на процедуру микроигольчатого РФ лифтинга Морфеус 8 в Москве \| Артем Коробов | Микроигольчатый RF лифтинг Морфеус 8 по выгодной цене в Москве. Процедура РФ лифтинга Morpheus 8 проводится профессиональным пластическим хирургом Артемом Коробовым. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/muzhskaya-plastika` | Мужская пластика: цены — DrKAV | Мужская пластическая хирургия у DrKAV: направления, ориентиры по стоимости, подготовка и восстановление. Запись на консультацию. | готовые значения: Excel `структура сайта seo` |
| `/operaczii/muzhskaya-plastika/ginekomastiya` | Лечение гинекомастии в Москве у Артема Коробова - низкая цена | Операция по удалению гинекомастии пластическим хирургом Артемом Коробовым. Выгодная цена на лечение гинекомастии в Москве. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/muzhskaya-plastika/lechenie-ginekompastii` | Лечение гинекомастии: цены — DrKAV | Лечение гинекомастии у DrKAV: варианты тактики, стоимость, подготовка, особенности восстановления и запись на консультацию. | готовые значения: Excel `структура сайта seo` |
| `/operaczii/muzhskaya-plastika/prorisovka-pressa` | Прорисовка пресса мужчинам - низкая цена в Москве \| Артем Коробов | Операция по прорисовке пресса мужчинам пластическим хирургом Артемом Коробовым. Выгодная цена на прорисовку пресса в Москве. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/muzhskaya-plastika/atletizaciya-plech-i-ruk` | Атлетизация плеч и рук для мужчин по низкой цене в Москве \| Артем Коробов | Атлетизация плеч и рук для мужчин по выгодной цене в Москве. Мужская атлетизация рук и плеч профессиональным пластическим хирургом Артемом Коробовым. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder` | Подтяжка ягодиц или бедер мужчинам у Артема Коробова - низкая цена в Москве | Пластичекая подтяжка ягодиц и бедер хирургом Артемом Коробовым. Выгодная цена на операцию по подтяжке бедер и ягодиц в Москве. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/muzhskaya-plastika/bodilifting-dlya-muzhchin` | Бодилифтинг (торсопластика) для мужчин у Артема Коробова в Москве, низкая цена | Торсопластика для мужчин по выгодной цене в Москве. Мужской бодилифтинг профессиональным пластическим хирургом Артемом Коробовым. Звоните! | готовые значения: Excel `структура сайта seo` |
| `/operaczii/muzhskaya-plastika/prorisovka-grudnykh-myshcz` | — | — | missing / manual review |

## Price notes и граница будущего аудита

- У 36 из 37 canonical найден хотя бы один старый `/ceny/...`-кандидат; это не доказывает, что страница является только прайсом.
- Live spot-check страницы уменьшения груди подтвердил полноценный медицинский текст операции и перечень нескольких процедур/цен на одной странице.
- В текущей Strapi schema `operation.prices` — many-to-many relation, а `price-item` описан как reusable structured price shared by operations and future price surfaces. Это является признаком связи «показывать на странице», но не окончательным доказательством владения ценой.
- До отдельного аудита нельзя утверждать для остальных страниц: одну или несколько цен они содержат, какие price items повторяются и является ли `/ceny`-страница самостоятельным источником текста либо агрегатом.

## A. Подтверждённые пары

Ниже только 27 однозначных пар с `high` confidence. Девять конфликтных пар, даже с live 200/404, сюда не включены.

<https://drkav.ru/ceny/plastika-grudi.html>
→ `/operaczii/plastika-grudi`

<https://drkav.ru/ceny/plastika-grudi/uvelichenie-grudi.html>
→ `/operaczii/plastika-grudi/uvelichenie-grudi`

<https://drkav.ru/ceny/plastika-grudi/asimmetriya-grudi.html>
→ `/operaczii/plastika-grudi/asimmetriya-grudi`

<https://drkav.ru/ceny/plastika-grudi/udalenie-implantov-grudi.html>
→ `/operaczii/plastika-grudi/udalenie-implantov-grudi`

<https://drkav.ru/ceny/plastika-grudi/rekonstrukciya-grudi.html>
→ `/operaczii/plastika-grudi/rekonstrukciya-grudi`

<https://drkav.ru/ceny/lipofiling/lipofiling-grudi.html>
→ `/operaczii/lipofiling/lipofiling-grudi`

<https://drkav.ru/ceny/abdominoplastika.html>
→ `/operaczii/abdominoplastika`

<https://drkav.ru/ceny/diastaz-myshc-zhivota.html>
→ `/operaczii/diastaz-myshc-zhivota`

<https://drkav.ru/ceny/plasticheskaya-hirurgiya-posle-rodov.html>
→ `/operaczii/plasticheskaya-hirurgiya-posle-rodov`

<https://drkav.ru/ceny/plasticheskaya-hirurgiya-posle-pohudeniya.html>
→ `/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya`

<https://drkav.ru/ceny/liposkulptura.html>
→ `/operaczii/liposkulptura`

<https://drkav.ru/ceny/liposkulptura/podtyazhka-yagodic.html>
→ `/operaczii/liposkulptura/podtyazhka-yagodic`

<https://drkav.ru/ceny/liposkulptura/podtyazhka-beder.html>
→ `/operaczii/liposkulptura/podtyazhka-beder`

<https://drkav.ru/ceny/liposkulptura/podtyazhka-ruk.html>
→ `/operaczii/liposkulptura/podtyazhka-ruk`

<https://drkav.ru/ceny/liposkulptura/ultrazvukovaya-liposakciya.html>
→ `/operaczii/liposkulptura/ultrazvukovaya-liposakciya`

<https://drkav.ru/ceny/lipofiling.html>
→ `/operaczii/lipofiling`

<https://drkav.ru/ceny/lipofiling/lipofiling-yagodic.html>
→ `/operaczii/lipofiling/lipofiling-yagodic`

<https://drkav.ru/ceny/liposakcziya/liposakcziya-ruk.html>
→ `/operaczii/liposakcziya/liposakcziya-ruk`

<https://drkav.ru/ceny/liposakcziya/liposakcziya-spiny.html>
→ `/operaczii/liposakcziya/liposakcziya-spiny`

<https://drkav.ru/ceny/liposakcziya/liposakcziya-vdovego-gorbika.html>
→ `/operaczii/liposakcziya/liposakcziya-vdovego-gorbika`

<https://drkav.ru/ceny/intimnaya-plastika.html>
→ `/operaczii/intimnaya-plastika`

<https://drkav.ru/ceny/rf-lifting.html>
→ `/operaczii/rf-lifting`

<https://drkav.ru/ceny/rf-lifting/rf-lifting-tela.html>
→ `/operaczii/rf-lifting/rf-lifting-tela`

<https://drkav.ru/ceny/rf-lifting/rf-lifting-zhivota.html>
→ `/operaczii/rf-lifting/rf-lifting-zhivota`

<https://drkav.ru/ceny/rf-lifting/rf-lifting-shei-i-dekolte.html>
→ `/operaczii/rf-lifting/rf-lifting-shei-i-dekolte`

<https://drkav.ru/ceny/rf-lifting/rf-lifting-morpheus-8.html>
→ `/operaczii/rf-lifting/rf-lifting-morpheus-8`

<https://drkav.ru/ceny/lechenie-ginekompastii.html>
→ `/operaczii/muzhskaya-plastika/lechenie-ginekompastii`

## B. Требуют ручного утверждения

### Конфликты старых URL

- `/operaczii/plastika-grudi/podtyazhka-grudi-bez-implantov`: Excel даёт `/ceny/plastika-grudi/podtyazhka-grudi-bez-implantov.html` и `/ceny/podtyazhka-grudi-bez-implantov.html`; live 200 у `/ceny/plastika-grudi/podtyazhka-grudi-bez-implantov.html`, live 404 у `/ceny/podtyazhka-grudi-bez-implantov.html`. Утвердить источник текста и redirect scope.
- `/operaczii/plastika-grudi/umenshenie-grudi`: Excel даёт `/ceny/umenshenie-grudi.html` и `/ceny/plastika-grudi/umenshenie-grudi.html`; live 200 у `/ceny/plastika-grudi/umenshenie-grudi.html`, live 404 у `/ceny/umenshenie-grudi.html`. Утвердить источник текста и redirect scope.
- `/operaczii/muzhskaya-plastika/abdominoplastika-dlya-muzhchin`: Excel даёт `/ceny/muzhskaya-plastika/abdominoplastika-dlya-muzhchin.html` и `/muzhskaya-plastika/abdominoplastika-dlya-muzhchin.html`; live 200 у `/muzhskaya-plastika/abdominoplastika-dlya-muzhchin.html`, live 404 у `/ceny/muzhskaya-plastika/abdominoplastika-dlya-muzhchin.html`. Утвердить источник текста и redirect scope.
- `/operaczii/muzhskaya-plastika`: Excel даёт `/ceny/muzhskaya-plastika.html` и `/muzhskaya-plastika.html`; live 200 у `/ceny/muzhskaya-plastika.html`, live 404 у `/muzhskaya-plastika.html`. Утвердить источник текста и redirect scope.
- `/operaczii/muzhskaya-plastika/ginekomastiya`: Excel даёт `/ceny/muzhskaya-plastika/ginekomastiya.html` и `/muzhskaya-plastika/ginekomastiya.html`; live 200 у `/muzhskaya-plastika/ginekomastiya.html`, live 404 у `/ceny/muzhskaya-plastika/ginekomastiya.html`. Утвердить источник текста и redirect scope.
- `/operaczii/muzhskaya-plastika/prorisovka-pressa`: Excel даёт `/ceny/muzhskaya-plastika/prorisovka-pressa.html` и `/muzhskaya-plastika/prorisovka-pressa.html`; live 200 у `/muzhskaya-plastika/prorisovka-pressa.html`, live 404 у `/ceny/muzhskaya-plastika/prorisovka-pressa.html`. Утвердить источник текста и redirect scope.
- `/operaczii/muzhskaya-plastika/atletizaciya-plech-i-ruk`: Excel даёт `/ceny/muzhskaya-plastika/atletizaciya-plech-i-ruk.html` и `/muzhskaya-plastika/atletizaciya-plech-i-ruk.html`; live 200 у `/muzhskaya-plastika/atletizaciya-plech-i-ruk.html`, live 404 у `/ceny/muzhskaya-plastika/atletizaciya-plech-i-ruk.html`. Утвердить источник текста и redirect scope.
- `/operaczii/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder`: Excel даёт `/ceny/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder.html` и `/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder.html`; live 200 у `/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder.html`, live 404 у `/ceny/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder.html`. Утвердить источник текста и redirect scope.
- `/operaczii/muzhskaya-plastika/bodilifting-dlya-muzhchin`: Excel даёт `/ceny/muzhskaya-plastika/bodilifting-dlya-muzhchin.html` и `/muzhskaya-plastika/bodilifting-dlya-muzhchin.html`; live 200 у `/muzhskaya-plastika/bodilifting-dlya-muzhchin.html`, live 404 у `/ceny/muzhskaya-plastika/bodilifting-dlya-muzhchin.html`. Утвердить источник текста и redirect scope.

### Отсутствия, названия, категории и дубли

- `Прорисовка грудных мышц`: новый canonical и route scaffold есть, но старый URL, старое название, SEO и исходная страница не найдены.
- `Коррекция асимметрии груди`: старые названия — `Асимметрия груди` и `Асимметрия груди и ее хирургическое исправление`.
- `Живот после родов` и `Живот после похудения`: новые короткие названия раздела отличаются от названий старых operation pages; canonical продублированы в двух разделах.
- `Коррекция фигуры` использует старую страницу `Липоскульптура`; подтвердить, является ли это переименованием landing page.
- `Без операции (РФ-лифтинг)` использует старое название `RF-лифтинг`; подтвердить landing semantics.
- `Уменьшение мужской груди` и `Лечение гинекомастии` существуют как два canonical. Нужно утвердить, действительно ли это две страницы, а не дубль/переименование.
- `Прорисовка пресса`: Excel требует не называть страницу «прорисовкой» и предлагает объединение в «Увеличение объема мышц».
- `Мужская подтяжка ягодиц или бедер`: Excel требует разделить на две страницы, но новых раздельных canonical нет.
- `Атлетизация плеч и рук`: Excel содержит дополнительную идею об увеличении ягодиц под контролем УЗИ; отдельного canonical и старого источника для неё нет.
- В новой структуре отсутствует явный раздел/операция по лицу. Нельзя уверенно выбрать facial pilot без решения владельца.
- Десять one-level canonical не соответствуют строгому шаблону `/operaczii/<category>/<operation>`; подтвердить их как допустимые исключения.
- `Липосакция (НЕТ ГЛАВНОЙ)`: три дочерние страницы есть, но category landing canonical отсутствует.
- Для строк, где первая книга показывает `#NAME?`, fallback из формулы не считался подтверждённым значением; прямой URL использован только если он отдельно присутствует в `operaczii.xlsx` или registry.
- Для всех страниц, кроме spot-check, требуется отдельная проверка полноты медицинского текста и структуры цен.

## C. Уже мигрированные операции

| Canonical | Strapi status | Старый источник | Redirect |
|---|---|---|---|
| `/operaczii/plastika-grudi/uvelichenie-grudi` | published | `структура сайта seo!A21:F21`, `operaczii.xlsx!A7:D7`, live HTTP 200 | present: `/ceny/plastika-grudi/uvelichenie-grudi.html` |

Других путей в `cmsMigratedOperationPaths` не обнаружено.

## D. Предлагаемая пилотная выборка

1. **Уменьшение груди** — максимально близко к уже мигрированному увеличению груди: та же категория, полноценный operation content и multi-price list. Перед аудитом утвердить активный nested old URL как источник.
2. **RF-лифтинг Morpheus 8** — временный кандидат для face/non-operative vertical. В Excel нет явной категории «Лицо», поэтому владелец должен подтвердить, относится ли эта страница к нужному facial use case; иначе выбрать другую операцию вне текущей таблицы.
3. **Абдоминопластика** — репрезентативная операция по телу с однозначным старым URL и готовыми SEO, но one-level canonical требует подтверждения как исключение.
4. **Прорисовка грудных мышц** — наиболее нестандартный и полезный negative-case: новый route есть, а старого URL, SEO и источника текста нет. Позволит проверить процесс для new-only страницы, не начиная миграцию сейчас.

## Вопросы владельцу до продолжения

1. Утвердить перечень: 40 строк новой структуры считать 37 уникальными страницами или три повторных размещения должны стать отдельными страницами?
2. Утвердить по каждой из девяти конфликтных пар старый источник текста, несмотря на однозначные live 200/404.
3. Подтвердить, что `Прорисовка грудных мышц` — new-only page, либо предоставить старый URL/источник текста/SEO.
4. Утвердить десять one-level canonical как исключения из `/operaczii/<category>/<operation>` либо определить категории.
5. Подтвердить переименования: асимметрия груди, после родов/похудения, липоскульптура → коррекция фигуры, RF-лифтинг → без операции.
6. Решить, являются ли `Уменьшение мужской груди` и `Лечение гинекомастии` двумя разными страницами.
7. Утвердить новое название/объединение для `Прорисовка пресса`.
8. Решить, делить ли мужскую подтяжку ягодиц/бедер на две страницы и какие canonical использовать.
9. Решить, нужна ли отдельная страница увеличения ягодиц из примечания к атлетизации плеч и рук.
10. Назвать подтверждённую операцию по лицу для пилотной выборки либо утвердить Morpheus 8 как временный facial candidate.
11. Утвердить source-of-truth для старого медицинского текста: активная live operation page, `/ceny` landing или иной документ.
12. Утвердить redirect для `/ceny/lechenie-ginekompastii.html` и окончательное назначение `/ceny/umenshenie-grudi.html`; оба сейчас исключены из runtime mappings.
13. Подтвердить, что category `Липосакция` может существовать без главной страницы, либо определить landing canonical.
14. Утвердить семантику `operation.prices`: display association или ownership, и определить правила повторного использования price items.
15. Утвердить предложенную пилотную четвёрку до любого аудита модели или миграции.

## Стоп-условие первоначального аудита

Инвентаризация завершена. До ручного утверждения владельца не выполнять перенос контента, изменение Strapi, seed, добавление routes/redirects, изменение модели цен или расширение `cmsMigratedOperationPaths`.

## E. Статус миграции на 3 августа 2026 года

Предыдущие разделы фиксируют состояние первоначальной инвентаризации до переноса. После утверждения полного переноса результат отражён ниже; подробности, расхождения цен и проверки находятся в [operation-cms-migration-report.md](operation-cms-migration-report.md).

| № | Операция | Canonical | Подтверждённый source URL | Migration status | Strapi status | Frontend status | Warnings |
|---:|---|---|---|---|---|---|---|
| 1 | Маммопластика | `/operaczii/plastika-grudi` | <https://drkav.ru/ceny/plastika-grudi.html> | migrated | published | CMS | canonical короче `/operaczii/<category>/<operation>` |
| 2 | Увеличение груди | `/operaczii/plastika-grudi/uvelichenie-grudi` | <https://drkav.ru/ceny/plastika-grudi/uvelichenie-grudi.html> | migrated | published | CMS | — |
| 3 | Подтяжка груди без имплантов | `/operaczii/plastika-grudi/podtyazhka-grudi-bez-implantov` | <https://drkav.ru/ceny/plastika-grudi/podtyazhka-grudi-bez-implantov.html> | migrated | published | CMS | conflict: два старых URL; live-кандидат не отменяет ручное утверждение |
| 4 | Уменьшение груди | `/operaczii/plastika-grudi/umenshenie-grudi` | <https://drkav.ru/ceny/plastika-grudi/umenshenie-grudi.html> | migrated | published | CMS | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; requires medical review: source section about reduction contains wording about choosing breast augmentation |
| 5 | Коррекция асимметрии груди | `/operaczii/plastika-grudi/asimmetriya-grudi` | <https://drkav.ru/ceny/plastika-grudi/asimmetriya-grudi.html> | migrated | published | CMS | старое название: Асимметрия груди и ее хирургическое исправление / Асимметрия груди |
| 6 | Удаление имплантов | `/operaczii/plastika-grudi/udalenie-implantov-grudi` | <https://drkav.ru/ceny/plastika-grudi/udalenie-implantov-grudi.html> | migrated | published | CMS | — |
| 7 | Реконструкция груди | `/operaczii/plastika-grudi/rekonstrukciya-grudi` | <https://drkav.ru/ceny/plastika-grudi/rekonstrukciya-grudi.html> | migrated | published | CMS | — |
| 8 | Липофилинг груди | `/operaczii/lipofiling/lipofiling-grudi` | <https://drkav.ru/ceny/lipofiling/lipofiling-grudi.html> | migrated | published | CMS | — |
| 9 | Абдоминопластика | `/operaczii/abdominoplastika` | <https://drkav.ru/ceny/abdominoplastika.html> | migrated | published | CMS | canonical короче `/operaczii/<category>/<operation>`; price associated from the general price by exact/strong name match; source page had no parsed price block |
| 10 | Диастаза без шрамов | `/operaczii/diastaz-myshc-zhivota` | <https://drkav.ru/ceny/diastaz-myshc-zhivota.html> | migrated | published | CMS | canonical короче `/operaczii/<category>/<operation>` |
| 11 | Живот после родов | `/operaczii/plasticheskaya-hirurgiya-posle-rodov` | <https://drkav.ru/ceny/plasticheskaya-hirurgiya-posle-rodov.html> | migrated | published | CMS | дубль canonical в 2 разделах; canonical короче `/operaczii/<category>/<operation>`; старое название: Восстановление после беременности и родов |
| 12 | Живот после похудения | `/operaczii/plasticheskaya-hirurgiya-posle-pohudeniya` | <https://drkav.ru/ceny/plasticheskaya-hirurgiya-posle-pohudeniya.html> | migrated | published | CMS | дубль canonical в 2 разделах; canonical короче `/operaczii/<category>/<operation>`; старое название: Пластика после бариатрических операций и массивного похудения |
| 13 | Пластика живота для мужчин | `/operaczii/muzhskaya-plastika/abdominoplastika-dlya-muzhchin` | <https://drkav.ru/muzhskaya-plastika/abdominoplastika-dlya-muzhchin.html> | migrated | published | CMS | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; дубль canonical в 2 разделах; старое название: Абдоминопластика для мужчин; unmatched page price: Абдоминопластика с перемещение пупка и ушиванием диастаза и пупочной грыжи ВТОРИЧНАЯ; unmatched page price: Бодилифтинг с подтяжкой ягодиц |
| 14 | Коррекция фигуры | `/operaczii/liposkulptura` | <https://drkav.ru/ceny/liposkulptura.html> | migrated | published | CMS | canonical короче `/operaczii/<category>/<operation>`; старое название: Липоскульптура |
| 15 | Подтяжка ягодиц | `/operaczii/liposkulptura/podtyazhka-yagodic` | <https://drkav.ru/ceny/liposkulptura/podtyazhka-yagodic.html> | migrated | published | CMS | — |
| 16 | Подтяжка бедер | `/operaczii/liposkulptura/podtyazhka-beder` | <https://drkav.ru/ceny/liposkulptura/podtyazhka-beder.html> | migrated | published | CMS | — |
| 17 | Подтяжка рук | `/operaczii/liposkulptura/podtyazhka-ruk` | <https://drkav.ru/ceny/liposkulptura/podtyazhka-ruk.html> | migrated | published | CMS | — |
| 18 | Ультразвуковая липосакция | `/operaczii/liposkulptura/ultrazvukovaya-liposakciya` | <https://drkav.ru/ceny/liposkulptura/ultrazvukovaya-liposakciya.html> | migrated | published | CMS | price associated from the general price by exact/strong name match; source page had no parsed price block |
| 19 | Липофилинг | `/operaczii/lipofiling` | <https://drkav.ru/ceny/lipofiling.html> | migrated | published | CMS | canonical короче `/operaczii/<category>/<operation>` |
| 20 | Липофилинг ягодиц | `/operaczii/lipofiling/lipofiling-yagodic` | <https://drkav.ru/ceny/lipofiling/lipofiling-yagodic.html> | migrated | published | CMS | — |
| 21 | Липосакция рук | `/operaczii/liposakcziya/liposakcziya-ruk` | <https://drkav.ru/ceny/liposakcziya/liposakcziya-ruk.html> | migrated | published | CMS | — |
| 22 | Липосакция спины | `/operaczii/liposakcziya/liposakcziya-spiny` | <https://drkav.ru/ceny/liposakcziya/liposakcziya-spiny.html> | migrated | published | CMS | — |
| 23 | Липосакция вдовьего горбика | `/operaczii/liposakcziya/liposakcziya-vdovego-gorbika` | <https://drkav.ru/ceny/liposakcziya/liposakcziya-vdovego-gorbika.html> | migrated | published | CMS | — |
| 24 | Интимная пластика | `/operaczii/intimnaya-plastika` | <https://drkav.ru/ceny/intimnaya-plastika.html> | migrated | published | CMS | canonical короче `/operaczii/<category>/<operation>` |
| 25 | Без операции (РФ-лифтинг) | `/operaczii/rf-lifting` | <https://drkav.ru/ceny/rf-lifting.html> | migrated | published | CMS | canonical короче `/operaczii/<category>/<operation>`; старое название: RF-лифтинг |
| 26 | RF-лифтинг тела | `/operaczii/rf-lifting/rf-lifting-tela` | <https://drkav.ru/ceny/rf-lifting/rf-lifting-tela.html> | migrated | published | CMS | — |
| 27 | RF-лифтинг живота | `/operaczii/rf-lifting/rf-lifting-zhivota` | <https://drkav.ru/ceny/rf-lifting/rf-lifting-zhivota.html> | migrated | published | CMS | — |
| 28 | RF-лифтинг шеи и декольте | `/operaczii/rf-lifting/rf-lifting-shei-i-dekolte` | <https://drkav.ru/ceny/rf-lifting/rf-lifting-shei-i-dekolte.html> | migrated | published | CMS | — |
| 29 | RF-лифтинг Morpheus 8 | `/operaczii/rf-lifting/rf-lifting-morpheus-8` | <https://drkav.ru/ceny/rf-lifting/rf-lifting-morpheus-8.html> | migrated | published | CMS | — |
| 30 | Мужская пластика | `/operaczii/muzhskaya-plastika` | <https://drkav.ru/ceny/muzhskaya-plastika.html> | migrated | published | CMS | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; canonical короче `/operaczii/<category>/<operation>`; unmatched page price: Абдоминопластика с перемещение пупка и ушиванием диастаза и пупочной грыжи ВТОРИЧНАЯ; unmatched page price: Бодилифтинг с подтяжкой ягодиц |
| 31 | Уменьшение мужской груди | `/operaczii/muzhskaya-plastika/ginekomastiya` | <https://drkav.ru/muzhskaya-plastika/ginekomastiya.html> | migrated | published | CMS | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; старое название: Гинекомастия; unmatched page price: Абдоминопластика с перемещение пупка и ушиванием диастаза и пупочной грыжи ВТОРИЧНАЯ; unmatched page price: Бодилифтинг с подтяжкой ягодиц |
| 32 | Лечение гинекомастии | `/operaczii/muzhskaya-plastika/lechenie-ginekompastii` | <https://drkav.ru/ceny/lechenie-ginekompastii.html> | migrated | published | CMS | старый URL есть в excluded redirect candidates; destination требует утверждения |
| 33 | Прорисовка пресса | `/operaczii/muzhskaya-plastika/prorisovka-pressa` | <https://drkav.ru/muzhskaya-plastika/prorisovka-pressa.html> | migrated | published | CMS | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; Excel note: Не должно называться прорисовкой; Excel note: Объединить и назвать "Увеличение объема мышц"; unmatched page price: Абдоминопластика с перемещение пупка и ушиванием диастаза и пупочной грыжи ВТОРИЧНАЯ; unmatched page price: Бодилифтинг с подтяжкой ягодиц |
| 34 | Атлетизация плеч и рук | `/operaczii/muzhskaya-plastika/atletizaciya-plech-i-ruk` | <https://drkav.ru/muzhskaya-plastika/atletizaciya-plech-i-ruk.html> | migrated | published | CMS | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; Excel note: Добавить увеличение ягодиц (липофилинг ягодиц эскпертного уровня под контролем УЗи); unmatched page price: Абдоминопластика с перемещение пупка и ушиванием диастаза и пупочной грыжи ВТОРИЧНАЯ; unmatched page price: Бодилифтинг с подтяжкой ягодиц |
| 35 | Мужская подтяжка ягодиц или бедер | `/operaczii/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder` | <https://drkav.ru/muzhskaya-plastika/muzhskaya-podtyazhka-yagodic-ili-beder.html> | migrated | published | CMS | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; Excel note: разделить на 2 стр; unmatched page price: Абдоминопластика с перемещение пупка и ушиванием диастаза и пупочной грыжи ВТОРИЧНАЯ; unmatched page price: Бодилифтинг с подтяжкой ягодиц |
| 36 | Бодилифтинг для мужчин | `/operaczii/muzhskaya-plastika/bodilifting-dlya-muzhchin` | <https://drkav.ru/muzhskaya-plastika/bodilifting-dlya-muzhchin.html> | migrated | published | CMS | conflict: два старых URL; live-кандидат не отменяет ручное утверждение; unmatched page price: Абдоминопластика с перемещение пупка и ушиванием диастаза и пупочной грыжи ВТОРИЧНАЯ; unmatched page price: Бодилифтинг с подтяжкой ягодиц |
| 37 | Прорисовка грудных мышц | `/operaczii/muzhskaya-plastika/prorisovka-grudnykh-myshcz` | — | incomplete | draft | registry scaffold | старый URL и SEO не найдены; missing confirmed live source; draft only; price associated from the general price by exact/strong name match; source page had no parsed price block |
