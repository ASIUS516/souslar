const express = require("express");
const db = require("../db/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Публичный эндпоинт — фронтенд забирает все настройки одним запросом
router.get("/", (req, res) => {
  const rows = db.prepare("SELECT key, value FROM settings").all();
  const settings = {};
  rows.forEach((r) => (settings[r.key] = r.value));
  res.json(settings);
});

// Обновление настроек — только админ, принимает объект { key: value, ... }
router.put("/", requireAuth, (req, res) => {
  const updates = req.body;
  if (!updates || typeof updates !== "object") {
    return res.status(400).json({ error: "Yanlış format" });
  }

  const allowedKeys = [
    "site_name",
    "hero_title_az", "hero_title_ru", "hero_title_en",
    "hero_subtitle_az", "hero_subtitle_ru", "hero_subtitle_en",
    "about_az", "about_ru", "about_en",
    "phone", "whatsapp",
    "instagram", "tiktok", "youtube", "facebook",
    "location_az", "location_ru", "location_en", "location_map_url",
    "default_language"
  ];

  const upsert = db.prepare(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  );

  const tx = db.transaction((entries) => {
    for (const [key, value] of entries) {
      if (allowedKeys.includes(key)) {
        upsert.run(key, String(value ?? ""));
      }
    }
  });

  tx(Object.entries(updates));

  const rows = db.prepare("SELECT key, value FROM settings").all();
  const settings = {};
  rows.forEach((r) => (settings[r.key] = r.value));
  res.json(settings);
});

module.exports = router;
