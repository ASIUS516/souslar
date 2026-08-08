const express = require("express");
const db = require("../db/db");
const cloudinary = require("../cloudinary");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Публичный список товаров (с названием категории для удобства фронта)
router.get("/", (req, res) => {
  const products = db
    .prepare(
      `SELECT p.*, c.name_az AS category_name_az, c.name_ru AS category_name_ru, c.name_en AS category_name_en
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.sort_order ASC, p.id DESC`
    )
    .all();
  res.json(products);
});

router.get("/:id", (req, res) => {
  const product = db
    .prepare(
      `SELECT p.*, c.name_az AS category_name_az, c.name_ru AS category_name_ru, c.name_en AS category_name_en
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`
    )
    .get(req.params.id);
  if (!product) return res.status(404).json({ error: "Tapılmadı" });
  res.json(product);
});

// Загрузка фото товара в Cloudinary — принимает base64 dataURL в поле image
router.post("/upload-image", requireAuth, async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "Şəkil tapılmadı" });

    const result = await cloudinary.uploader.upload(image, {
      folder: "sosuslar/products",
      transformation: [{ width: 1200, height: 1200, crop: "limit" }]
    });

    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ error: "Şəkil yüklənərkən xəta baş verdi" });
  }
});

router.post("/", requireAuth, (req, res) => {
  const {
    category_id, name_az, name_ru, name_en,
    description_az, description_ru, description_en,
    price, volume, image_url, image_public_id, in_stock, sort_order
  } = req.body;

  if (!name_az || !name_ru || !name_en) {
    return res.status(400).json({ error: "Bütün dillərdə ad tələb olunur" });
  }

  const info = db
    .prepare(
      `INSERT INTO products
       (category_id, name_az, name_ru, name_en, description_az, description_ru, description_en,
        price, volume, image_url, image_public_id, in_stock, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      category_id || null, name_az, name_ru, name_en,
      description_az || "", description_ru || "", description_en || "",
      price || 0, volume || "", image_url || "", image_public_id || "",
      in_stock === undefined ? 1 : in_stock ? 1 : 0,
      sort_order || 0
    );

  res.json({ id: info.lastInsertRowid });
});

router.put("/:id", requireAuth, (req, res) => {
  const {
    category_id, name_az, name_ru, name_en,
    description_az, description_ru, description_en,
    price, volume, image_url, image_public_id, in_stock, sort_order
  } = req.body;

  db.prepare(
    `UPDATE products SET
       category_id = ?, name_az = ?, name_ru = ?, name_en = ?,
       description_az = ?, description_ru = ?, description_en = ?,
       price = ?, volume = ?, image_url = ?, image_public_id = ?,
       in_stock = ?, sort_order = ?
     WHERE id = ?`
  ).run(
    category_id || null, name_az, name_ru, name_en,
    description_az || "", description_ru || "", description_en || "",
    price || 0, volume || "", image_url || "", image_public_id || "",
    in_stock ? 1 : 0, sort_order || 0,
    req.params.id
  );

  res.json({ success: true });
});

router.delete("/:id", requireAuth, async (req, res) => {
  const product = db
    .prepare("SELECT image_public_id FROM products WHERE id = ?")
    .get(req.params.id);

  if (product && product.image_public_id) {
    try {
      await cloudinary.uploader.destroy(product.image_public_id);
    } catch (err) {
      console.error("Cloudinary delete error:", err);
    }
  }

  db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
