const express = require("express");
const rateLimit = require("express-rate-limit");
const db = require("../db/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Ограничение, чтобы не заспамили таблицу заказов ботами
const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: { error: "Çox sorğu. Bir az sonra yenidən cəhd edin." }
});

// Фронт создаёт запись заказа для истории/статистики ДО того как открыть WhatsApp.
// Это необязательный шаг для пользователя — просто чтобы у владельца была история в админке.
router.post("/", orderLimiter, (req, res) => {
  const { customer_name, customer_phone, items, note } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Səbət boşdur" });
  }

  const total = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1),
    0
  );

  const info = db
    .prepare(
      `INSERT INTO orders (customer_name, customer_phone, items_json, total, note)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(
      customer_name || "",
      customer_phone || "",
      JSON.stringify(items),
      total,
      note || ""
    );

  res.json({ id: info.lastInsertRowid });
});

router.get("/", requireAuth, (req, res) => {
  const orders = db
    .prepare("SELECT * FROM orders ORDER BY created_at DESC")
    .all()
    .map((o) => ({ ...o, items: JSON.parse(o.items_json) }));
  res.json(orders);
});

// CSV-экспорт заказов — открывается прямо в Excel/Google Sheets
router.get("/export/csv", requireAuth, (req, res) => {
  const orders = db
    .prepare("SELECT * FROM orders ORDER BY created_at DESC")
    .all();

  const escapeCsv = (val) => {
    const str = String(val ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const header = ["ID", "Tarix", "Müştəri", "Telefon", "Məhsullar", "Cəmi", "Status", "Qeyd"];
  const rows = orders.map((o) => {
    const items = JSON.parse(o.items_json)
      .map((i) => `${i.name} x${i.qty || 1}`)
      .join("; ");
    return [
      o.id, o.created_at, o.customer_name, o.customer_phone,
      items, o.total, o.status, o.note
    ].map(escapeCsv).join(",");
  });

  const csv = "\uFEFF" + [header.join(","), ...rows].join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="sifarisler.csv"`);
  res.send(csv);
});

router.put("/:id/status", requireAuth, (req, res) => {
  const { status } = req.body;
  const allowed = ["new", "processing", "done", "cancelled"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Yanlış status" });
  }
  db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(
    status,
    req.params.id
  );
  res.json({ success: true });
});

router.delete("/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM orders WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
