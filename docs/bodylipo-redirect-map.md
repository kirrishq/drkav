# Карта редиректов bodylipo.ru

Предварительная карта для перенаправления `bodylipo.ru` на `drkav.ru`.
Редиректы должны быть постоянными (`301` на уровне reverse proxy/VPS). Query-параметры, включая `ysclid`, сохраняются.

## Точные URL

| Старый путь | Новый путь | Статус |
| --- | --- | --- |
| `/` | `/` | подтверждено |
| `/obuchenie/stazhirovka/` | `/obo-mne/neshkola` | подтверждено владельцем |
| `/obo-mne/reviews/` | `/pacientam/otzyvy` | определено по разделу |
| `/pacientam/spisok-analizov/` | `/pacientam/spisok-analizov` | совпадает по смыслу |
| `/price/liposuction/liposkatsiya_spiny/` | `/operaczii/liposakcziya/liposakcziya-spiny` | определено по названию |
| `/price/liposuction/liposaktsiya_vtorogo_podborodka/` | `/operaczii/liposakcziya/liposakcziya-vdovego-gorbika` | требует ручной проверки |
| `/price/liposuction/izolirovannaya_liposaktsiya_vnutrenney_poverkhnosti_beder/` | `/operaczii/liposkulptura/podtyazhka-beder` | требует ручной проверки |
| `/price/plastic_surgery/tolko_podtyazhka/` | `/operaczii/plastika-grudi/podtyazhka-grudi-bez-implantov` | требует ручной проверки |
| `/price/plastic_surgery/podtyazhka_postavit_implanty/` | `/operaczii/plastika-grudi/uvelichenie-grudi` | требует ручной проверки |
| `/price/plastic_surgery/podtyazhka_ubrat_implanty_i_postavit_novye/` | `/operaczii/plastika-grudi/uvelichenie-grudi` | требует ручной проверки |
| `/price/mikroigolchatyy_rf_lifting/kisti_ruk/` | `/operaczii/rf-lifting/rf-lifting-tela` | требует ручной проверки |
| `/price/mikroigolchatyy_rf_lifting/litso/` | `/operaczii/rf-lifting` | требует ручной проверки |

## Страницы «До и после»

Пока индивидуальные кейсы не перенесены в CMS, все найденные индексируемые страницы ведём на общий раздел:

```text
/do-i-posle/* → /pacientam/do-i-posle
```

В эту группу входят найденные URL с материалами о бодилифте, липосакции, липофилинге, абдоминопластике и мастопексии, в том числе:

```text
/do-i-posle/40-kg-minus-i-novaya-zhizn-nizhniy-bodilift-liposaktsiyu-zhivota-poyasnichno-bokovykh-oblastey-beder/
/do-i-posle/muzhskaya-liposaktsiya-zhivota-i-poyasnichno-bokovykh-zon-ranniy-posleoperatsionnyy-period/
/do-i-posle/liposaktsiya-lipofiling-rf-lifting-kompleksnoe-preobrazhenie-figury-rezultat-srazu-posle-operatsii/
/do-i-posle/1-god-posle-l-mastopeksii-/
/do-i-posle/abdominoplastika-krugovaya-liposaktsiya-rezultat-cherez-4-mesyatsa-/
/do-i-posle/mastopeksiya-po-oreole-8-mesyatsev-posle-operatsii/
/do-i-posle/stroynaya-sportivnaya-no-s-vyrazhennym-diastazom-posle-beremennosti/
/do-i-posle/novomu-zhivotiku-1-mesyats/
/do-i-posle/l-obraznaya-mastopeksiya-bez-implantov-podnyali-grud-pereraspredelili-sobstvennye-tkani-i-vosstanovi/
/do-i-posle/l-obraznaya-mastopeksiya-s-sokhraneniem-obema-lipofiling-grudi-/
/do-i-posle/operatsiya-v-2-etapa-abdominoplastika-liposaktsiya-mastopeksiya-s-kruglymi-implantami/
```

## Общие правила разделов

Правила применяются после точных исключений и сохраняют остаток пути, только если это безопасно. Для текущего набора URL используются такие назначения:

| Старый префикс | Новый путь |
| --- | --- |
| `/price/` | `/ceny` |
| `/do-i-posle/` | `/pacientam/do-i-posle` |
| `/obuchenie/` | `/obo-mne/neshkola` |
| `/obo-mne/reviews/` | `/pacientam/otzyvy` |
| `/pacientam/spisok-analizov/` | `/pacientam/spisok-analizov` |

Общие правила нельзя размещать выше точных правил в конфигурации, если они могут перехватывать более релевантное назначение.

## Что пока не включать

- неизвестные URL на главную страницу;
- произвольные страницы чата, трекинга и старых query-параметров;
- индивидуальные URL кейсов как отдельные страницы, пока их контент не перенесён;
- неподтверждённые ценовые сопоставления без последующей проверки старого контента.
