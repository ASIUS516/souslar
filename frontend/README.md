# Sosuslar — Frontend (клиентская часть сайта)

## Локально
1. `npm install`
2. Скопируй `.env.example` → `.env`, укажи адрес бэкенда в `VITE_API_URL`
3. `npm run dev`

## На Render (Static Site)
1. New Static Site → Root Directory = `frontend`
2. Build Command: `npm install && npm run build`
3. Publish Directory: `dist`
4. Environment: `VITE_API_URL` = адрес бэкенда + `/api` (например `https://sosuslar-api.onrender.com/api`)
5. На бэкенде не забудь выставить `FRONTEND_URL` = финальный домен этого сайта (для CORS)

## Структура
- `Splash` — экран приветствия, свайп/скролл/тап закрывает
- `Header` — бургер-меню, переключение языка (AZ/RU/EN), плавный скролл к секциям
- `About` — печатающийся текст, запускается при попадании в viewport (IntersectionObserver)
- `Catalog` — поиск + фильтр по категориям + сетка карточек товаров
- `ProductModal` — карточка товара, кнопка "Sifariş et" открывает WhatsApp с готовым текстом
- `Contact` — телефон, WhatsApp, адрес (со ссылкой на карту), соцсети

## Дизайн
Тема "сочный/яркий", но привязанная к продукту: фото товаров вписаны в
асимметричную форму капли (`--radius-drop`), сплэш — градиент, имитирующий
разлитый сироп (plum → cherry → amber). Шрифты: Fraunces (заголовки) + Manrope (текст).

## Админ-панель
Доступна по адресу `/admin` того же сайта (например `sosuslar.az/admin`).
Логин/пароль — те, что указаны в `.env` бэкенда при первом запуске.
Вкладки: Tənzimləmələr (все тексты/контакты/соцсети), Kateqoriyalar, Məhsullar
(с загрузкой фото прямо в Cloudinary), Sifarişlər (статусы + экспорт в CSV).

Файл `public/_redirects` обязателен на Render Static Site — без него прямой
переход на `/admin` (не через клик с сайта) даст 404, потому что это SPA.

## Перед запуском в бой
- Замени `/public/og-image.jpg` на реальное фото продукции (для соцсетей/превью в мессенджерах)
- В `index.html` поменяй `<title>` и мета-описание если название компании изменится
- Проверь `hero_subtitle`, `about` тексты через админку — сейчас там заглушки
