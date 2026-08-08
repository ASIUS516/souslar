const Database = require("better-sqlite3");
const path = require("path");
const bcrypt = require("bcryptjs");

// На Render бесплатный диск эфемерный при обычном деплое — если нужна
// персистентность БД между деплоями, подключи Render Disk и укажи путь туда
// через переменную окружения DB_PATH (например /data/sosuslar.db).
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "sosuslar.db");
const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_az TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  name_en TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER,
  name_az TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_az TEXT,
  description_ru TEXT,
  description_en TEXT,
  price REAL,
  volume TEXT,
  image_url TEXT,
  image_public_id TEXT,
  in_stock INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT,
  customer_phone TEXT,
  items_json TEXT NOT NULL,
  total REAL,
  status TEXT DEFAULT 'new',
  note TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS admin (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);
`);

// Значения по умолчанию для настроек сайта — всё это редактируется из админки
const defaultSettings = {
  site_name: "Sosuslar",
  hero_title_az: "Sosuslar",
  hero_title_ru: "Sosuslar",
  hero_title_en: "Sosuslar",
  hero_subtitle_az: "Təbii dad, hər damlada keyfiyyət",
  hero_subtitle_ru: "Натуральный вкус в каждой капле",
  hero_subtitle_en: "Natural taste in every drop",
  about_az: "Biz təbii tərkib hissələrdən hazırlanan souslar və siroplar istehsal edirik. Hər məhsul qayğı və keyfiyyətlə hazırlanır.",
  about_ru: "Мы производим соусы и сиропы из натуральных ингредиентов. Каждый продукт создаётся с заботой и вниманием к качеству.",
  about_en: "We craft sauces and syrups from natural ingredients. Every product is made with care and quality in mind.",
  phone: "+994 XX XXX XX XX",
  whatsapp: "994XXXXXXXXX",
  instagram: "",
  tiktok: "",
  youtube: "",
  facebook: "",
  location_az: "Bakı, Azərbaycan",
  location_ru: "Баку, Азербайджан",
  location_en: "Baku, Azerbaijan",
  location_map_url: "",
  default_language: "az"
};

const insertSetting = db.prepare(
  "INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)"
);
const settingsTx = db.transaction((entries) => {
  for (const [key, value] of entries) {
    insertSetting.run(key, value);
  }
});
settingsTx(Object.entries(defaultSettings));

// Создаём админа по умолчанию из переменных окружения, если его ещё нет
const adminCount = db.prepare("SELECT COUNT(*) AS c FROM admin").get().c;
if (adminCount === 0) {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "changeme123";
  const hash = bcrypt.hashSync(password, 10);
  db.prepare("INSERT INTO admin (username, password_hash) VALUES (?, ?)").run(
    username,
    hash
  );
  console.log(`Создан админ по умолчанию: ${username} (пароль из .env)`);
}

module.exports = db;
