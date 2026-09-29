# Реестр медиа для переезда

Дата проверки: 29 сентября 2026 года.

## Требуют переноса и проверки прав

Эти файлы загружаются с текущего домена или старого Webflow CDN. До отключения старого сайта их нужно скачать в разрешённом качестве, проверить права и заменить на локальные/S3 URL.

### Видео и превью с `drkav.ru`

- `videos/homepage/video-1.mp4`
- `videos/homepage/video-2.mp4`
- `videos/smi/sobchak.mp4`
- `videos/smi/interview.mp4`
- `videos/conferences/spb.mp4`
- `videos/conferences/innovation.mp4`
- `videos/ceny/plastika-grudi.mp4`
- `videos/ceny/diastaz-myshc-zhivota.mp4`
- `videos/ceny/plasticheskaya-hirurgiya-posle-rodov.mp4`
- `videos/ceny/plasticheskaya-hirurgiya-posle-pohudeniya.mp4`
- `videos/ceny/liposkulptura.mp4`
- `videos/ceny/lipofiling.mp4`
- `videos/ceny/rf-lifting.mp4`
- `videos/ceny/muzhskaya-plastika.mp4`
- `videos/ceny/lechenie-ginekompastii.mp4`
- `videos/reviews/1.mp4` … `videos/reviews/8.mp4` — номера 1–6 и 8 используются в коде

Превью операций:

- `images/preview/plastika-grudi.jpg`
- `images/preview/diastaz-myshc-zhivota.jpg`
- `images/preview/plasticheskaya-hirurgiya-posle-rodov.jpg`
- `images/preview/plasticheskaya-hirurgiya-posle-pohudeniya.jpg`
- `images/preview/liposkulptura.jpg`
- `images/preview/lipofiling.jpg`
- `images/preview/rf-lifting.jpg`
- `images/preview/muzhskaya-plastika.jpg`
- `images/preview/lechenie-ginekomastii.jpg`

### Изображения отзывов с Webflow CDN

В `home-social-showcase.tsx` используются 7 превью YouTube, а в `home-reviews.ts` — набор изображений отзывов с тем же CDN. Для каждого файла нужно сохранить исходный URL, локальное имя, alt, размер, источник прав и статус проверки.

## Уже есть локальные замены/аналоги

- `apps/web/public/images/media-videos/interview.jpg`
- `apps/web/public/images/media-videos/sobchak.jpg`
- `apps/web/public/images/speaking-videos/congress.jpg`
- `apps/web/public/images/speaking-videos/innovation.jpg`
- `apps/web/public/images/speaking-videos/spb.jpg`
- `apps/web/public/videos/doctor-award.*`
- `apps/web/public/videos/milanov-congress.*`

Это не означает, что ими можно автоматически заменить старые материалы: нужно сопоставить содержание и poster/video пару.

## Не являются media-зависимостями для миграции

- ссылки на Яндекс.Карты и 2ГИС;
- ссылки на Telegram, YouTube, VK, Instagram и WhatsApp;
- ссылка/логотип ПроДокторов — проверить актуальность и разрешение на внешний виджет отдельно;
- `book.drkav.ru`, `neschool.drkav.ru`, `recovery.drkav.ru` — внешние проекты, а не файлы сайта.

## Проверка в CI

```bash
pnpm check:media
pnpm check:media:strict
```

Обычная команда показывает остаток legacy media и не блокирует разработку. `--strict` должен стать обязательным перед cutover, когда все разрешённые медиа будут перенесены или заменены.
