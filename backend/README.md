# Sosuslar — Backend

## Локально
1. `npm install`
2. Скопируй `.env.example` → `.env`, заполни своими данными (особенно `SESSION_SECRET`, `ADMIN_PASSWORD`, Cloudinary-ключи)
3. `npm start` — сервер поднимется на порту 5000, БД `sosuslar.db` создастся автоматически с дефолтными настройками и админом

## На Render
1. New Web Service → подключи репозиторий, Root Directory = `backend`
2. Build Command: `npm install`
3. Start Command: `npm start`
4. В Environment добавь все переменные из `.env.example`
5. `FRONTEND_URL` — укажи финальный домен фронтенда (для CORS)
6. Node version — через `engines` в package.json уже стоит 20.x, но проверь Environment Variable `NODE_VERSION=20` если Render не подхватит сам

## Важно про БД
Бесплатный диск Render эфемерный — при каждом деплое SQLite-файл может обнулиться.
Для реального проекта подключи **Render Disk** (Persistent Disk, недорогой) и укажи путь
через `DB_PATH=/data/sosuslar.db` в Environment — так данные переживут редеплой.

## API
- `GET /api/settings` — публичные настройки сайта
- `PUT /api/settings` — обновление настроек (только админ)
- `GET /api/categories`, `POST/PUT/DELETE /api/categories/:id`
- `GET /api/products`, `GET /api/products/:id`, `POST/PUT/DELETE /api/products/:id`
- `POST /api/products/upload-image` — загрузка фото в Cloudinary (base64 dataURL)
- `POST /api/orders` — создание заказа (публично, для истории)
- `GET /api/orders`, `PUT /api/orders/:id/status`, `DELETE /api/orders/:id` — только админ
- `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`

Дефолтный логин админа берётся из `.env` (`ADMIN_USERNAME` / `ADMIN_PASSWORD`)
при первом запуске, когда таблица `admin` пустая.
