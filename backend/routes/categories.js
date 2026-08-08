const express = require("express");
const db = require("../db/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", (req, res) => {
  const categories = db
    .prepare("SELECT * FROM categories ORDER BY sort_order ASC, id ASC")
    .all();
  res.json(categories);
});

router.post("/", requireAuth, (req, res) => {
  const { name_az, name_ru, name_en, sort_order } = req.body;
  if (!name_az || !name_ru || !name_en) {
    return res.status(400).json({ error: "Bütün dillərdə ad tələb olunur" });
  }
  const info = db
    .prepare(
      "INSERT INTO categories (name_az, name_ru, name_en, sort_order) VALUES (?, ?, ?, ?)"
    )
    .run(name_az, name_ru, name_en, sort_order || 0);
  res.json({ id: info.lastInsertRowid });
});

router.put("/:id", requireAuth, (req, res) => {
  const { name_az, name_ru, name_en, sort_order } = req.body;
  db.prepare(
    "UPDATE categories SET name_az = ?, name_ru = ?, name_en = ?, sort_order = ? WHERE id = ?"
  ).run(name_az, name_ru, name_en, sort_order || 0, req.params.id);
  res.json({ success: true });
});

router.delete("/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM categories WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
