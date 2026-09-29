# Deployment drkav в Beget

Этот документ описывает подготовленный production-контур для одного Beget VPS,
облачного PostgreSQL и S3. Реальные секреты, ключи и production-домены сюда не
добавляются.

## Архитектура

```text
Internet
  |
  +-- Caddy :80/:443
        |
        +-- drkav.ru       -> web:3000
        +-- cms.drkav.ru   -> cms:1337 (Basic Auth)

web:3000 -- Docker network --> cms:1337
cms:1337 -- private network --> Beget PostgreSQL
cms:1337 ---------------------> Beget S3
```

PostgreSQL не публикуется на VPS и не получает публичный IP. Публичный доступ
включается только временно, если нужно подключение с рабочего компьютера или
миграция из внешнего источника.

## Файлы окружения на сервере

Из корня проекта на сервере:

```bash
mkdir -p deploy/env deploy/secrets
cp deploy/env/compose.env.example deploy/env/compose.env
cp deploy/env/cms.env.example deploy/env/cms.env
cp deploy/env/web.env.example deploy/env/web.env
cp deploy/env/caddy.env.example deploy/env/caddy.env
chmod 600 deploy/env/*.env
```

Файлы в `deploy/env/*.env` и `deploy/secrets/` игнорируются Git.

Получить CA-сертификат Beget:

```bash
curl -fsSL https://beget.com/cloud-ca.crt -o deploy/secrets/beget-cloud-ca.crt
chmod 600 deploy/secrets/beget-cloud-ca.crt
```

Токен Strapi для build secret сохраняется отдельно:

```bash
printf '%s' 'READ_ONLY_STRAPI_TOKEN' > deploy/secrets/strapi_api_token
chmod 600 deploy/secrets/strapi_api_token
```

Значение `READ_ONLY_STRAPI_TOKEN` заменяется реальным токеном только на сервере.

## Первый запуск

Сначала заполнить `cms.env`: PostgreSQL, секреты Strapi и путь к CA уже заданы
в шаблоне. Затем запустить только CMS:

```bash
docker compose --env-file deploy/env/compose.env -f docker-compose.production.yml up -d cms
docker compose --env-file deploy/env/compose.env -f docker-compose.production.yml ps
```

После проверки подключения к PostgreSQL создать администратора Strapi и
read-only API token в админке. До первого запуска Next.js токен нужно сохранить
в `deploy/secrets/strapi_api_token` и в `deploy/env/web.env`.

Сборка web выполняется после того, как CMS уже запущена: проект генерирует
часть CMS-страниц во время `next build`.

```bash
docker compose --env-file deploy/env/compose.env -f docker-compose.production.yml build web
docker compose --env-file deploy/env/compose.env -f docker-compose.production.yml up -d web caddy
```

## Проверка

```bash
docker compose --env-file deploy/env/compose.env -f docker-compose.production.yml ps
curl -I https://staging.drkav.ru
curl -I https://staging.drkav.ru/robots.txt
curl -I https://staging.drkav.ru/sitemap.xml
```

Публичный API Strapi должен быть закрыт. Проверять endpoint нужно без токена:
ожидается `401` или `403`, а не список записей.

Перед production необходимо отдельно подключить S3 provider Strapi и проверить
миграцию `apps/cms/public/uploads`. Простое копирование файлов в бакет не
переписывает URL медиа в CMS.
